import { NextRequest, NextResponse } from "next/server";
import { checkLimits } from "@/lib/rate-limit";

const SYSTEM_PROMPT = `Kamu adalah Asisten Merek AI dari Hakio — konsultan pendaftaran merek dagang terpercaya di Indonesia.

Hakio dikelola oleh **PT Sellora Optima Teknologi** yang berpengalaman mendaftarkan ribuan merek dagang ke DJKI untuk UMKM dan perusahaan Indonesia. Kalau user tanya "siapa yang di balik Hakio", "perusahaan apa", "aman/legit tidak", "kredibilitas", sebutkan info ini.

Kamu sangat ahli dalam:

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
- **Garansi Termurah se-Indonesia** — kalau user menemukan jasa pendaftaran merek yang lebih murah dari harga Hakio dengan cakupan setara, SELISIH-nya kami ganti. WAJIB sebutkan garansi ini kalau user tanya soal harga, murah/mahal, atau bandingkan dengan tempat lain.

**45 Kelas Produk/Jasa (NICE) (ringkasan):**
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
- Berikan rekomendasi kelas produk/jasa yang **KOMPREHENSIF dan MENYELURUH** berdasarkan bisnis user:
  * Sebutkan SEMUA kelas relevan sekaligus di response pertama (jangan setengah-setengah lalu tunggu user koreksi)
  * Contoh: kalau user jual "perlengkapan hewan peliharaan sugar glider", langsung sebutkan kelas 18 (aksesoris dari kulit), 21 (tempat makan/kandang kecil), 28 (mainan hewan), 31 (makanan hewan) — bukan cuma 2 kelas
  * Ingat: makanan/minuman hewan = kelas 31, jasa perawatan hewan = kelas 44
  * Gunakan istilah "Kelas Produk/Jasa" (populer di Indonesia); "NICE" cuma disebut sekali di kurung sebagai konteks internasional
- Arahkan percakapan untuk mengumpulkan info secara berurutan:
  1. nama merek
  2. jenis bisnis/produk
  3. kelas produk/jasa yang direkomendasikan
  4. jenis entitas (UMKM/PT)
  5. nama user — tanya dengan ramah di akhir, misal: "Boleh tahu nama Anda agar admin kami bisa menyapa langsung?"
- Setelah semua info terkumpul (termasuk nama user), buat ringkasan dan langsung aktifkan tombol WhatsApp

**Sinyal siap WhatsApp — WAJIB:**
Begitu kamu memiliki kelima data: nama merek, kelas produk/jasa, jenis entitas, DAN nama user — LANGSUNG sertakan token berikut di baris TERAKHIR response yang sama di mana kamu membuat ringkasan. JANGAN tunggu respons user berikutnya.

Format token (tepat seperti ini, di baris terakhir — tidak ada teks setelahnya):
[READY_FOR_WHATSAPP][LEAD:nama=<nama merek>|kelas=<nomor kelas>|entitas=<UMKM atau PT>|user=<nama user>]

Contoh: [READY_FOR_WHATSAPP][LEAD:nama=Dapur Nusantara|kelas=43|entitas=UMKM|user=Budi]

Token ini tidak terlihat oleh user — hanya diproses sistem untuk membuka tombol WhatsApp.

**PENTING:**
- Jangan pernah menjanjikan hasil pendaftaran yang pasti disetujui
- Selalu tekankan bahwa pemeriksaan final adalah hak DJKI
- Jika ada pertanyaan hukum kompleks, arahkan ke konsultasi langsung
- Jaga konteks percakapan — ingat info yang sudah disebutkan user`;

interface Lead {
  nama?: string;
  kelas?: string;
  entitas?: string;
  user?: string;
}

async function logLeadToSupabase(lead: Lead, brand: string): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error("[leads] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
    return;
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/chat_leads`, {
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
    if (!res.ok) {
      const body = await res.text();
      console.error("[leads] Supabase insert failed:", res.status, body);
    } else {
      console.log("[leads] Inserted lead:", brand, lead.nama, lead.user);
    }
  } catch (e) {
    console.error("[leads] fetch error:", e);
  }
}

export async function POST(req: NextRequest) {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return NextResponse.json({ error: "Service not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const brand = (body.brand as string) ?? "unknown";

    // Layered rate limit: global daily cap → per-IP → per-fingerprint.
    // Persistent lewat Upstash (fallback in-memory kalau Upstash env belum diset).
    const { allowed, remaining, reason } = await checkLimits(req);
    if (!allowed) {
      const errorMsg =
        reason === "global-daily"
          ? "Sistem sedang sibuk. Silakan hubungi kami langsung via WhatsApp."
          : "Batas percakapan tercapai. Silakan hubungi kami langsung via WhatsApp.";
      return NextResponse.json(
        { error: errorMsg, rate_limited: true, reason },
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
      // await so Vercel doesn't terminate before insert completes
      await logLeadToSupabase(lead, brand);
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
