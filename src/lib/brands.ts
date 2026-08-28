export type BrandId = "hakimerek" | "cekhaki" | "merekin" | "hkimerek" | "daftarmerekmu";

export interface Brand {
  id: BrandId;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  accentLight: string;
  accentRgb: string;
  whatsapp: string;
  chips: string[];
  ogImage?: string;
  keywords: string[];
  schema: {
    name: string;
    description: string;
  };
}

const WHATSAPP = "6285148416800";

export const BRANDS: Record<string, Brand> = {
  "hakimerek.com": {
    id: "hakimerek",
    name: "HakiMerek",
    tagline: "Lindungi Merekmu, Lindungi Bisnismu",
    description:
      "Pendaftaran merek dagang HAKI untuk bisnis Indonesia. Harga terjangkau, proses mudah, garansi termurah se-Indonesia.",
    accent: "#1E3A8A",
    accentLight: "#3b5fc0",
    accentRgb: "30,58,138",
    whatsapp: WHATSAPP,
    chips: [
      "Cek nama merekku",
      "Berapa biaya daftar merek?",
      "Butuh berapa lama?",
      "Merek usaha kuliner",
    ],
    keywords: [
      "daftar merek dagang",
      "haki merek",
      "pendaftaran merek",
      "biaya daftar merek",
      "hakimerek",
    ],
    schema: {
      name: "HakiMerek — Pendaftaran Merek Dagang HAKI",
      description:
        "Layanan pendaftaran merek dagang HAKI terpercaya di Indonesia. Harga UMKM Rp 1.299.000 / Perusahaan Rp 2.490.000 per kelas.",
    },
  },
  "cekhaki.com": {
    id: "cekhaki",
    name: "CekHaki",
    tagline: "Cek Nama Merek Dagang Gratis & Instan",
    description:
      "Cek ketersediaan nama merek dagang Anda secara gratis sebelum mendaftar ke DJKI. Konsultasi AI langsung dengan ahli merek.",
    accent: "#059669",
    accentLight: "#10b981",
    accentRgb: "5,150,105",
    whatsapp: WHATSAPP,
    chips: [
      "Cek nama merek saya",
      "Apa itu PDKI?",
      "Nama merek saya aman?",
      "Kelas NICE untuk bisnis saya",
    ],
    keywords: [
      "cek nama merek",
      "cek merek dagang",
      "pdki online",
      "cek haki gratis",
      "cekhaki",
    ],
    schema: {
      name: "CekHaki — Cek Nama Merek Dagang Gratis",
      description:
        "Cek ketersediaan nama merek dagang Anda secara gratis. Analisis AI instan berdasarkan database DJKI.",
    },
  },
  "merekin.com": {
    id: "merekin",
    name: "Merekin",
    tagline: "Daftarkan Merek Dagangmu Online",
    description:
      "Platform pendaftaran merek dagang online termudah di Indonesia. Dari konsultasi hingga sertifikat, semua bisa dari smartphone.",
    accent: "#D97706",
    accentLight: "#F59E0B",
    accentRgb: "217,119,6",
    whatsapp: WHATSAPP,
    chips: [
      "Daftarkan merek saya",
      "Biaya daftar merek",
      "Dokumen yang dibutuhkan",
      "Berapa lama prosesnya?",
    ],
    keywords: [
      "daftar merek online",
      "pendaftaran merek mudah",
      "merek dagang online",
      "merekin",
      "daftar haki online",
    ],
    schema: {
      name: "Merekin — Daftarkan Merek Dagangmu Online",
      description:
        "Pendaftaran merek dagang online termudah. Konsultasi AI, proses digital, sertifikat resmi DJKI.",
    },
  },
  "hkimerek.com": {
    id: "hkimerek",
    name: "HKIMerek",
    tagline: "Pendaftaran HKI Merek Serba Digital & AI-Powered",
    description:
      "Layanan HKI merek berbasis AI pertama di Indonesia. Analisa otomatis, rekomendasi kelas NICE, dan proses DJKI yang transparan.",
    accent: "#7C3AED",
    accentLight: "#8B5CF6",
    accentRgb: "124,58,237",
    whatsapp: WHATSAPP,
    chips: [
      "Apa itu HKI merek?",
      "Daftar HKI online",
      "Beda hak cipta & merek",
      "AI analisa merek saya",
    ],
    keywords: [
      "hki merek",
      "hak kekayaan intelektual merek",
      "daftar hki",
      "hkimerek",
      "kekayaan intelektual ai",
    ],
    schema: {
      name: "HKIMerek — Pendaftaran HKI Merek Digital",
      description:
        "Platform HKI merek berbasis AI. Analisis otomatis nama merek, rekomendasi kelas NICE, proses DJKI transparan.",
    },
  },
  "daftarmerekmu.com": {
    id: "daftarmerekmu",
    name: "DaftarMerekmu",
    tagline: "Cara Paling Mudah Daftar Merek Dagang",
    description:
      "Pendaftaran merek dagang untuk UMKM dan perusahaan. Proses dipandu langkah demi langkah oleh AI konsultan berpengalaman.",
    accent: "#0891B2",
    accentLight: "#06B6D4",
    accentRgb: "8,145,178",
    whatsapp: WHATSAPP,
    chips: [
      "Mulai daftar merek",
      "Syarat daftar merek",
      "Merek UMKM vs PT",
      "Timeline proses DJKI",
    ],
    keywords: [
      "daftar merekmu",
      "cara daftar merek dagang",
      "daftar merek umkm",
      "daftarmerekmu",
      "proses merek djki",
    ],
    schema: {
      name: "DaftarMerekmu — Pendaftaran Merek Dagang Mudah",
      description:
        "Cara paling mudah daftar merek dagang di Indonesia. Panduan AI langkah demi langkah untuk UMKM dan perusahaan.",
    },
  },
};

export const DOMAIN_ALIASES: Record<string, string> = {
  "hakimerek.id": "hakimerek.com",
  "cekhaki.id": "cekhaki.com",
  "merekin.id": "merekin.com",
  "hkimerek.id": "hkimerek.com",
  "daftarmerekmu.id": "daftarmerekmu.com",
};

export const DEFAULT_BRAND_ID = "hakimerek";

export function getBrandByHost(host: string): Brand {
  const cleanHost = host.split(":")[0].toLowerCase();
  const canonical = DOMAIN_ALIASES[cleanHost] ?? cleanHost;
  return BRANDS[canonical] ?? BRANDS["hakimerek.com"];
}

export function getBrandById(id: string): Brand {
  return (
    Object.values(BRANDS).find((b) => b.id === id) ?? BRANDS["hakimerek.com"]
  );
}
