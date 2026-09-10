import type { BrandId } from "./brands";

export interface HakioVariant {
  variantSlug: "blue-check-merek" | "green-daftar-merek" | "purple-analisa-merek" | "orange-umkm-merek";
  accent: string;
  accentDeep: string;
  tag: string;
  h1Line1: string;
  h1Line2Accent: string;
  subtitle: string;
  checks: string[];
  ctaLabel: string;
  ctaSubLabel: string;
  noteMain: string;
  noteAccent: string;
  noteEnd: string;
  miniBoxTitle: string;
  miniBoxDesc: string;
  tabs: string[];
  chips: string[];
  searchPlaceholder: string;
  searchHint: string;
  stats: { n: string; d: string }[];
  section2Title: string;
  section2Lead: string;
  featureEyebrow: string;
  featureTitle: string;
  featureDesc: string;
  featurePoints: string[];
  pricingHeading: string;
  pricingDesc: string;
}

/** Per-domain variant registry — maps brand.id → mockup variant */
export const VARIANT_BY_BRAND: Partial<Record<BrandId, HakioVariant>> = {
  cekhaki: {
    variantSlug: "blue-check-merek",
    accent: "#2f9cff",
    accentDeep: "#1a6fc0",
    tag: "✦ Cek Merek Gratis & Instan",
    h1Line1: "Cek Nama Merek Anda",
    h1Line2Accent: "dalam Hitungan Detik",
    subtitle: "Gunakan AI Hakio untuk mengecek ketersediaan merek, analisa kemiripan, dan dapatkan rekomendasi kelas produk/jasa — gratis, cepat, dan akurat.",
    checks: ["Data resmi DJKI", "Analisa cepat dengan AI", "Konsultasi via WhatsApp"],
    ctaLabel: "Cek Merek Sekarang",
    ctaSubLabel: "Gratis • Cepat • Akurat",
    noteMain: "Hakio membantu",
    noteAccent: "merek Anda",
    noteEnd: "melangkah lebih jauh.",
    miniBoxTitle: "Lebih Aman untuk Bisnis Anda",
    miniBoxDesc: "Cek sekarang, hindari risiko penolakan, dan lindungi bisnis Anda sejak awal.",
    tabs: ["Cek Nama Merek", "Rekomendasi Kelas", "Analisa Kemiripan", "Estimasi Biaya"],
    chips: ["Kopi", "Kuliner", "Fashion", "Skincare", "Teknologi", "Properti"],
    searchPlaceholder: "Tulis nama merek Anda di sini...",
    searchHint: "Contoh: Kopi Senja, Rumah Sehat, Luminara, DapurKita, dll.",
    stats: [
      { n: "10.000+", d: "Pengusaha telah terbantu oleh konsultasi dan pendaftaran merek bersama Hakio." },
      { n: "99%", d: "Data resmi DJKI, insight lebih akurat, dan alur kerja lebih rapi untuk pengguna." },
      { n: "4.9/5", d: "Kepuasan klien dari UMKM hingga perusahaan yang memakai layanan Hakio." },
      { n: "24/7", d: "Siap bantu cek nama, analisa kemiripan, konsultasi kelas, dan estimasi biaya." },
    ],
    section2Title: "Masih ragu dengan nama merek Anda?",
    section2Lead: "Konsultasikan gratis via WhatsApp dengan tim ahli Hakio. Dapatkan saran terbaik untuk bisnis Anda.",
    featureEyebrow: "Konsultasi langsung dengan Hakio",
    featureTitle: "Butuh arahan untuk merek Anda?",
    featureDesc: "Dapatkan bantuan untuk cek merek, analisa kemiripan, rekomendasi kelas, sampai proses pendaftaran. Tim Hakio siap dampingi dari nol.",
    featurePoints: ["Respon cepat", "Konsultasi gratis", "Saran dari ahli merek"],
    pricingHeading: "Pendaftaran Merek",
    pricingDesc: "Lindungi bisnis Anda secara resmi dengan proses yang mudah.",
  },
  hakimerek: {
    variantSlug: "green-daftar-merek",
    accent: "#0e9b72",
    accentDeep: "#087557",
    tag: "✦ Solusi Lengkap Hak Merek di Indonesia",
    h1Line1: "Daftarkan Merek Anda",
    h1Line2Accent: "dengan Pendampingan Hakio",
    subtitle: "Cek ketersediaan nama merek, analisa risiko, dapatkan rekomendasi kelas produk/jasa, hingga pendaftaran — semua dengan bantuan AI dan didampingi konsultan berpengalaman.",
    checks: ["Konsultan berpengalaman", "Dokumen dibantu", "Update status DJKI"],
    ctaLabel: "Mulai Pendaftaran",
    ctaSubLabel: "Didampingi tim ahli",
    noteMain: "Hakio membantu",
    noteAccent: "brand Anda",
    noteEnd: "terlindungi resmi.",
    miniBoxTitle: "Pendampingan Penuh",
    miniBoxDesc: "Dari cek nama sampai sertifikat DJKI terbit — semua diurus oleh tim Hakio.",
    tabs: ["Daftar Merek", "Cek Nama", "Rekomendasi Kelas", "Estimasi Biaya"],
    chips: ["Kuliner", "Fashion", "Skincare", "Teknologi", "Jasa", "Properti"],
    searchPlaceholder: "Tulis nama merek Anda di sini...",
    searchHint: "Contoh: Warung Bahagia, Kopi Rembulan, Kanaya, Elora, dll.",
    stats: [
      { n: "10.000+", d: "Merek dagang telah dibantu didaftarkan bersama tim Hakio ke DJKI." },
      { n: "18 bln", d: "Estimasi rata-rata sampai sertifikat elektronik DJKI terbit." },
      { n: "10 thn", d: "Masa perlindungan setiap sertifikat merek, dapat diperpanjang tanpa batas." },
      { n: "24/7", d: "Konsultasi cepat via WhatsApp — kapan pun butuh, tim standby." },
    ],
    section2Title: "Tidak yakin merek Anda layak didaftarkan?",
    section2Lead: "Konsultasikan gratis dengan tim ahli Hakio. Kami bantu identifikasi risiko dan strategi pendaftaran yang paling efektif.",
    featureEyebrow: "Pendampingan langsung dari Hakio",
    featureTitle: "Butuh pendampingan pendaftaran?",
    featureDesc: "Mulai dari analisa nama, penyusunan dokumen, sampai monitoring sertifikat — semua dikerjakan tim Hakio. Anda cukup fokus jualan.",
    featurePoints: ["Tim konsultan", "Dokumen dibantu", "Monitoring status"],
    pricingHeading: "Pendaftaran Merek",
    pricingDesc: "Paket lengkap termasuk PNBP DJKI + jasa pengurusan.",
  },
  hkimerek: {
    variantSlug: "purple-analisa-merek",
    accent: "#7a63ff",
    accentDeep: "#5a44d6",
    tag: "✦ AI untuk Perlindungan Merek Anda",
    h1Line1: "Analisa Merek Anda",
    h1Line2Accent: "dengan Hakio AI",
    subtitle: "Cek nama merek, analisa kemiripan, rekomendasi kelas produk/jasa, dan dapatkan insight berbasis data resmi DJKI. Semua dalam satu platform, lebih cepat, lebih akurat.",
    checks: ["Data resmi DJKI", "Insight AI mendalam", "Laporan tertulis"],
    ctaLabel: "Mulai Analisa",
    ctaSubLabel: "Analisa mendalam berbasis AI",
    noteMain: "Hakio membantu",
    noteAccent: "keputusan HKI",
    noteEnd: "berbasis data.",
    miniBoxTitle: "Analisa Mendalam",
    miniBoxDesc: "Bukan sekadar cek nama. Dapatkan analisa kemiripan visual, fonetik, dan strategi kelas terbaik.",
    tabs: ["Analisa Merek", "Cek Nama", "Rekomendasi Kelas", "Estimasi Biaya"],
    chips: ["Teknologi", "Startup", "Aplikasi", "Fintech", "Edukasi", "Kreatif"],
    searchPlaceholder: "Tulis nama merek yang mau dianalisa...",
    searchHint: "Contoh: Nusaphere, Luminara, Rekai, Aventis, dll.",
    stats: [
      { n: "45 kelas", d: "NICE Classification yang dianalisa AI untuk menemukan cakupan optimal." },
      { n: "99%", d: "Akurasi berdasarkan data terbaru dari database resmi PDKI/DJKI." },
      { n: "1 detik", d: "Waktu rata-rata AI untuk memberikan indikasi awal ketersediaan nama." },
      { n: "24/7", d: "Konsultasi kelas produk/jasa dan strategi HKI kapan pun dibutuhkan." },
    ],
    section2Title: "Perlu insight sebelum daftar?",
    section2Lead: "AI Hakio memberikan analisa kemiripan berdasarkan data resmi DJKI. Kurangi risiko penolakan sebelum mengeluarkan biaya.",
    featureEyebrow: "Analisa merek berbasis AI Hakio",
    featureTitle: "Data untuk keputusan HKI yang tepat.",
    featureDesc: "Analisa nama merek, kemiripan visual/fonetik, plus rekomendasi kelas — semua dalam satu laporan yang mudah dipahami.",
    featurePoints: ["Data resmi DJKI", "Analisa AI", "Laporan tertulis"],
    pricingHeading: "Layanan Analisa",
    pricingDesc: "Insight mendalam untuk keputusan merek yang lebih aman.",
  },
  merekin: {
    variantSlug: "orange-umkm-merek",
    accent: "#ff6b2c",
    accentDeep: "#d1521b",
    tag: "✦ Solusi Merek untuk UMKM Indonesia",
    h1Line1: "Mulai Lindungi",
    h1Line2Accent: "Merek Anda Hari Ini",
    subtitle: "Cek nama merek, dapatkan analisa, rekomendasi kelas, hingga panduan pendaftaran — semua dengan bantuan AI, cepat, mudah, dan terjangkau.",
    checks: ["Harga UMKM terjangkau", "Panduan step-by-step", "Chat AI 24/7"],
    ctaLabel: "Mulai Cek Merek",
    ctaSubLabel: "Gratis untuk UMKM",
    noteMain: "Hakio membantu",
    noteAccent: "UMKM Indonesia",
    noteEnd: "punya brand resmi.",
    miniBoxTitle: "Ramah UMKM",
    miniBoxDesc: "Harga khusus mulai Rp 1.299.000/kelas. Panduan Bahasa Indonesia yang mudah dipahami.",
    tabs: ["Cek Merek", "Rekomendasi Kelas", "Panduan Daftar", "Estimasi Biaya"],
    chips: ["Kuliner", "Fashion", "Kerajinan", "Skincare", "Snack", "Minuman"],
    searchPlaceholder: "Ketik nama brand UMKM Anda...",
    searchHint: "Contoh: Dapur Ibu, Snack Nusantara, GlowByFira, dll.",
    stats: [
      { n: "Rp 1,3jt", d: "Paket khusus UMKM per kelas — sudah termasuk PNBP DJKI dan jasa pengurusan." },
      { n: "10.000+", d: "Pelaku UMKM telah didampingi Hakio untuk mendaftarkan brand mereka." },
      { n: "3–5 hr", d: "Rata-rata waktu penyiapan dokumen sampai permohonan masuk ke DJKI." },
      { n: "24/7", d: "Chat AI Hakio siap bantu jawab pertanyaan kapan saja tanpa antre." },
    ],
    section2Title: "Bingung mulai dari mana?",
    section2Lead: "Chat AI Hakio memandu langkah demi langkah — cocok untuk UMKM yang baru pertama kali daftar merek.",
    featureEyebrow: "Dampingan khusus UMKM oleh Hakio",
    featureTitle: "Panduan dari nol sampai sertifikat.",
    featureDesc: "Tidak perlu paham istilah hukum. Tim Hakio dan AI kami memandu Anda step by step sampai brand terlindungi resmi.",
    featurePoints: ["Bahasa mudah", "Harga UMKM", "Panduan step-by-step"],
    pricingHeading: "Paket UMKM",
    pricingDesc: "Harga khusus pelaku usaha mikro, kecil, dan menengah.",
  },
};
