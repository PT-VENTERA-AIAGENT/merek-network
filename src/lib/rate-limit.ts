import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash } from "crypto";

/**
 * Persistent rate limiter untuk /api/chat.
 *
 * Kenapa Upstash bukan in-memory Map:
 * Vercel Fluid Compute me-recycle instance function tiap ~5 menit atau scale ke
 * banyak instance paralel. Map di module scope reset setiap cold start, jadi
 * penyerang bisa terus request unlimited kalau tahu triknya. Upstash Redis
 * kasih durable counter yang persist antar instance dan antar restart.
 *
 * Fallback: kalau UPSTASH_REDIS_REST_URL/TOKEN belum diset (mis. dev lokal),
 * pakai in-memory Map. Loud console.warn supaya production accident ketahuan.
 */

const IP_LIMIT_MAX = 20;
const IP_LIMIT_WINDOW = "1 h" as const;

const FP_LIMIT_MAX = 30; // fingerprint lebih longgar sedikit dibanding IP-only
const FP_LIMIT_WINDOW = "1 h" as const;

const GLOBAL_DAILY_CAP = 5000; // total request per hari (protect OpenAI budget)
const GLOBAL_ALERT_THRESHOLD = 0.8; // warn di 80%

let redis: Redis | null = null;
let ipLimiter: Ratelimit | null = null;
let fpLimiter: Ratelimit | null = null;

const upstashConfigured = !!(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

if (upstashConfigured) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  ipLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(IP_LIMIT_MAX, IP_LIMIT_WINDOW),
    analytics: true,
    prefix: "rl:ip",
  });
  fpLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(FP_LIMIT_MAX, FP_LIMIT_WINDOW),
    analytics: true,
    prefix: "rl:fp",
  });
} else if (process.env.NODE_ENV === "production") {
  // eslint-disable-next-line no-console
  console.warn(
    "[rate-limit] Upstash tidak diset di production — fallback ke in-memory Map. " +
      "Ini TIDAK persistent antar cold start. Set UPSTASH_REDIS_REST_URL + " +
      "UPSTASH_REDIS_REST_TOKEN di Vercel env untuk perlindungan penuh."
  );
}

// Fallback in-memory (only used ketika Upstash tidak diset)
const memHits = new Map<string, number[]>();
function memCheck(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const start = now - windowMs;
  const hits = (memHits.get(key) ?? []).filter((t) => t > start);
  hits.push(now);
  memHits.set(key, hits);
  return { success: hits.length <= max, remaining: Math.max(0, max - hits.length) };
}

export interface LimitDecision {
  allowed: boolean;
  remaining: number;
  reason?: "ip" | "fingerprint" | "global-daily";
}

/**
 * Fingerprint: sha256(ip + user-agent + accept-language).
 * Bukan foolproof (attacker bisa spoof UA/Accept-Language), tapi cukup untuk
 * membedakan browser sungguhan dari script yang cuma rotate IP.
 */
export function fingerprint(req: {
  headers: Headers | { get(name: string): string | null };
}): string {
  const get = (name: string) => req.headers.get(name) ?? "";
  const ip = get("x-forwarded-for").split(",")[0].trim() || get("x-real-ip") || "unknown";
  const ua = get("user-agent");
  const lang = get("accept-language");
  return createHash("sha256").update(`${ip}|${ua}|${lang}`).digest("hex").slice(0, 24);
}

export function clientIp(req: {
  headers: Headers | { get(name: string): string | null };
}): string {
  const get = (name: string) => req.headers.get(name) ?? "";
  return get("x-forwarded-for").split(",")[0].trim() || get("x-real-ip") || "unknown";
}

async function incrementGlobalDaily(): Promise<{ count: number; capped: boolean }> {
  const dayKey = `global:${new Date().toISOString().slice(0, 10)}`; // YYYY-MM-DD
  if (redis) {
    const count = await redis.incr(dayKey);
    if (count === 1) {
      // First increment of the day: set 26h TTL supaya auto-cleanup
      await redis.expire(dayKey, 26 * 60 * 60);
    }
    return { count, capped: count > GLOBAL_DAILY_CAP };
  }
  // In-memory fallback: piggyback pada memHits with special key
  const day = new Date().toISOString().slice(0, 10);
  const key = `__global:${day}`;
  const arr = memHits.get(key) ?? [];
  arr.push(Date.now());
  memHits.set(key, arr);
  return { count: arr.length, capped: arr.length > GLOBAL_DAILY_CAP };
}

/**
 * Cek semua layer: global daily cap → IP → fingerprint.
 * Return decision + reason kalau block.
 */
export async function checkLimits(req: {
  headers: Headers | { get(name: string): string | null };
}): Promise<LimitDecision> {
  const ip = clientIp(req);
  const fp = fingerprint(req);

  // Layer 1: Global daily cap (protect OpenAI budget)
  const globalRes = await incrementGlobalDaily();
  if (globalRes.capped) {
    // eslint-disable-next-line no-console
    console.error(
      `[rate-limit] GLOBAL DAILY CAP HIT (${globalRes.count} req) — blocking new requests. ` +
        `Naikan GLOBAL_DAILY_CAP atau audit trafik.`
    );
    await maybeAlert(
      `🚨 Global daily cap ${GLOBAL_DAILY_CAP} tercapai (${globalRes.count} req hari ini). Sistem menolak request baru.`
    );
    return { allowed: false, remaining: 0, reason: "global-daily" };
  }
  if (globalRes.count === Math.floor(GLOBAL_DAILY_CAP * GLOBAL_ALERT_THRESHOLD)) {
    // eslint-disable-next-line no-console
    console.warn(
      `[rate-limit] Global daily count di ${globalRes.count}/${GLOBAL_DAILY_CAP} (${Math.round(
        GLOBAL_ALERT_THRESHOLD * 100
      )}% cap)`
    );
    await maybeAlert(
      `⚠️ Global daily usage ${globalRes.count}/${GLOBAL_DAILY_CAP} (${Math.round(
        GLOBAL_ALERT_THRESHOLD * 100
      )}% cap tercapai). Monitor trafik.`
    );
  }

  // Layer 2: Per-IP limit
  if (ipLimiter) {
    const r = await ipLimiter.limit(ip);
    if (!r.success) return { allowed: false, remaining: r.remaining, reason: "ip" };
  } else {
    const r = memCheck(`ip:${ip}`, IP_LIMIT_MAX, 60 * 60 * 1000);
    if (!r.success) return { allowed: false, remaining: r.remaining, reason: "ip" };
  }

  // Layer 3: Per-fingerprint limit
  if (fpLimiter) {
    const r = await fpLimiter.limit(fp);
    if (!r.success) return { allowed: false, remaining: r.remaining, reason: "fingerprint" };
    return { allowed: true, remaining: r.remaining };
  } else {
    const r = memCheck(`fp:${fp}`, FP_LIMIT_MAX, 60 * 60 * 1000);
    return { allowed: r.success, remaining: r.remaining, reason: r.success ? undefined : "fingerprint" };
  }
}

/**
 * Optional webhook alert (Slack/Discord/generic). Pakai ALERT_WEBHOOK env.
 * Fire-and-forget — kalau webhook gagal, tidak block request user.
 */
async function maybeAlert(message: string): Promise<void> {
  const webhook = process.env.ALERT_WEBHOOK;
  if (!webhook) return;
  try {
    // Slack/Discord/generic JSON — both accept { text/content }
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message, content: message }),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[rate-limit] alert webhook failed:", e);
  }
}
