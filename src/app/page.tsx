import { headers } from "next/headers";
import { Metadata } from "next";
import { getBrandById } from "@/lib/brands";
import { VARIANT_BY_BRAND } from "@/lib/variants";
import ChatPage from "@/components/ChatPage";
import HakioMockupPage from "@/components/HakioMockupPage";
import HakiMerekPage from "@/components/HakiMerekPage";
import HKIMerekPage from "@/components/HKIMerekPage";
import MerekinPage from "@/components/MerekinPage";
import DaftarMerekmuPage from "@/components/DaftarMerekmuPage";

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

  // 4 brand utama pakai layout distinct per Codex mockup:
  //   cekhaki   → HakioMockupPage (blue-check-merek, unchanged)
  //   hakimerek → HakiMerekPage    (green, process-row + centerpiece chat)
  //   hkimerek  → HKIMerekPage     (purple, dashboard + analytics widgets)
  //   merekin   → MerekinPage      (orange, story+benefits + right-side chat)
  //   daftarmerekmu → ChatPage lama (belum ada mockup burgundy)
  if (brand.id === "cekhaki") {
    const v = VARIANT_BY_BRAND[brand.id];
    if (v) return <HakioMockupPage brand={brand} variant={v} />;
  }
  if (brand.id === "hakimerek") return <HakiMerekPage brand={brand} />;
  if (brand.id === "hkimerek") return <HKIMerekPage brand={brand} />;
  if (brand.id === "merekin") return <MerekinPage brand={brand} />;
  if (brand.id === "daftarmerekmu") return <DaftarMerekmuPage brand={brand} />;
  return <ChatPage brand={brand} />;
}
