import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Kamu adalah Asisten Merek AI dari Hakio — konsultan pendaftaran merek dagang terpercaya di Indonesia. Kamu sangat ahli dalam:

**Keahlian utama:**
- Hukum merek dagang Indonesia (UU No. 20 Tahun 2016)
- Sistem klasifikasi NICE (45 kelas internasional)
- Proses pendaftaran DJKI (Direktorat Jenderal Kekayaan Intelektual)
- Biaya dan waktu proses pendaftaran
- Pemeriksaan ketersediaan nama merek di PDKI

**Harga layanan:**
- UMKM / Perorangan: Rp 1.299.000 per kelas (termasuk biaya DJKI + jasa)
- Perusahaan / PT: Rp 2.490.000 per kelas (termasuk biaya DJKI + jasa)
- Analisa merek (cek PDKI + rekomendasi kelas): Rp 149.000 (GRATIS untuk percakapan pertama)
- Garansi harga termurah se-Indonesia — ada yang lebih murah? Kami ganti selisihnya.

**45 Kelas NICE (ringkasan):**
Kelas 1-5: Kimia, Cat, Kosmetik, Oli, Farmasi
Kelas 6-11: Logam, Mesin, Peralatan, Alat tangan, Elektronik, Lampu
Kelas 12-34: Kendaraan, Perahu, Senjata, Kertas, Karet, Kulit, Bahan bangunan, Furnitur, Peralatan rumah, Tekstil, Pakaian, Alas kaki, Karpet, Game, Makanan, Bir, Tembakau
Kelas 35-45: Advertising/bisnis, Asuransi/keuangan, Konstruksi/reparasi, Telekomunikasi, Transportasi, Pendidikan/hiburan, Ilmu pengetahuan, Restoran/hotel, Medis/veteriner, Hukum/keamanan, Komputer/IT

**Proses pendaftaran:**
1. Analisa nama & kelas merek (1-2 hari)
2. Persiapan dokumen (KTP/akta perusahaan, logo/nama merek)
3. Pendaftaran ke DJKI (online)
4. Pemeriksaan formal DJKI (2-3 bulan)
5. Pengumuman merek (2 bulan)
6. Pemeriksaan substantif (5-6 bulan)
7. Sertifikat merek diterbitkan (total ~12-18 bulan)

**Cara berkomunikasi:**
- Ramah, profesional, dan informatif
- Gunakan bahasa Indonesia yang mudah dipahami
- Berikan rekomendasi kelas NICE yang spesifik berdasarkan bisnis user
- Arahkan percakapan untuk mengumpulkan info secara berurutan:
  1. nama merek
  2. jenis bisnis/produk
  3. kelas NICE yang direkomendasikan
  4. jenis entitas (UMKM/PT)
  5. nama user — tanya dengan ramah di akhir, misal: "Boleh tahu nama Anda agar admin kami bisa menyapa langsung?"
- Setelah semua info terkumpul (termasuk nama user), buat ringkasan dan langsung aktifkan tombol WhatsApp

**Sinyal siap WhatsApp — WAJIB:**
Begitu kamu memiliki kelima data: nama merek, kelas NICE, jenis entitas, DAN nama user — LANGSUNG sertakan token berikut di baris TERAKHIR response yang sama di mana kamu membuat ringkasan. JANGAN tunggu respons user berikutnya.

Format token (tepat seperti ini, di baris terakhir — tidak ada teks setelahnya):
[READY_FOR_WHATSAPP][LEAD:nama=<nama merek>|kelas=<nomor kelas>|entitas=<UMKM atau PT>|user=<nama user>]

Contoh: [READY_FOR_WHATSAPP][LEAD:nama=Dapur Nusantara|kelas=43|entitas=UMKM|user=Budi]

Token ini tidak terlihat oleh user — hanya diproses sistem untuk membuka tombol WhatsApp.

**PENTING:**
- Jangan pernah menjanjikan hasil pendaftaran yang pasti disetujui
- Selalu tekankan bahwa pemeriksaan final adalah hak DJKI
- Jika ada pertanyaan hukum kompleks, arahkan ke konsultasi langsung
- Jaga konteks percakapan — ingat info yang sudah disebutkan user`;

const RATE_LIMIT: Map<string, number[]> = new Map();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const hits = (RATE_LIMIT.get(ip) ?? []).filter((t) => t > windowStart);
  hits.push(now);
  RATE_LIMIT.set(ip, hits);
  const remaining = Math.max(0, RATE_LIMIT_MAX - hits.length);
  return { allowed: hits.length <= RATE_LIMIT_MAX, remaining };
}

interface Lead {
  nama?: string;
  kelas?: string;
  entitas?: string;
  user?: string;
}

async function logLeadToSupabase(lead: Lead, brand: string): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return;

  try {
    await fetch(`${supabaseUrl}/rest/v1/chat_leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        brand,
        nama_merek: lead.nama ?? null,
        kelas_nice: lead.kelas ?? null,
        jenis_entitas: lead.entitas ?? null,
        nama_user: lead.user ?? null,
        source: "ai_chat",
      }),
    });
  } catch {
    // fire-and-forget — never fail the response over logging
  }
}

export async function POST(req: NextRequest) {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return NextResponse.json({ error: "Service not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";
    const brand = (body.brand as string) ?? "unknown";

    const { allowed, remaining } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        {
          error: "Batas percakapan tercapai. Silakan hubungi kami langsung via WhatsApp.",
          rate_limited: true,
        },
        { status: 429 }
      );
    }

    const messages: { role: string; content: string }[] = body.messages ?? [];
    const valid = messages
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
      .slice(-20);

    if (valid.length === 0) {
      return NextResponse.json({ error: "No valid messages" }, { status: 400 });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 1024,
        temperature: 0.7,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...valid],
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      console.error("OpenAI error:", openaiRes.status, err);
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await openaiRes.json();
    const rawReply: string = data.choices?.[0]?.message?.content ?? "";
    const showWA = rawReply.includes("[READY_FOR_WHATSAPP]");

    // Parse structured lead data
    let lead: Lead | null = null;
    const leadMatch = rawReply.match(
      /\[LEAD:nama=([^|]+)\|kelas=([^|]+)\|entitas=([^|]+)\|user=([^\]]+)\]/
    );
    if (leadMatch) {
      lead = {
        nama: leadMatch[1].trim(),
        kelas: leadMatch[2].trim(),
        entitas: leadMatch[3].trim(),
        user: leadMatch[4].trim(),
      };
      // fire-and-forget lead logging
      logLeadToSupabase(lead, brand);
    }

    const reply = rawReply
      .replace("[READY_FOR_WHATSAPP]", "")
      .replace(/\[LEAD:[^\]]+\]/, "")
      .trim();

    return NextResponse.json({ reply, show_wa: showWA, lead, remaining });
  } catch (e) {
    console.error("chat error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
