import { headers } from "next/headers";
import { Metadata } from "next";
import { getBrandById } from "@/lib/brands";
import { VARIANT_BY_BRAND } from "@/lib/variants";
import ChatPage from "@/components/ChatPage";
import HakioMockupPage from "@/components/HakioMockupPage";

export async function generateMetadata(): Promise<Metadata> {
  const hdrs = await headers();
  const brandId = hdrs.get("x-brand-id") ?? "hakimerek";
  const brand = getBrandById(brandId);

  return {
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
    keywords: brand.keywords,
    openGraph: {
      title: `${brand.name} — ${brand.tagline}`,
      description: brand.description,
      type: "website",
      locale: "id_ID",
    },
    robots: { index: true, follow: true },
    other: { "theme-color": brand.accent },
  };
}

export default async function Page() {
  const hdrs = await headers();
  const brandId = hdrs.get("x-brand-id") ?? "hakimerek";
  const brand = getBrandById(brandId);

  // 4 brand utama pakai HakioMockupPage (Codex-generated design per warna):
  //   cekhaki   → blue-check-merek
  //   hakimerek → green-daftar-merek
  //   hkimerek  → purple-analisa-merek
  //   merekin   → orange-umkm-merek
  // daftarmerekmu belum ada mockup burgundy — tetap pakai ChatPage lama.
  const variant = VARIANT_BY_BRAND[brand.id];
  if (variant) {
    return <HakioMockupPage brand={brand} variant={variant} />;
  }
  return <ChatPage brand={brand} />;
}
