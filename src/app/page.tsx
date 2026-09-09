import { headers } from "next/headers";
import { Metadata } from "next";
import { getBrandById } from "@/lib/brands";
import ChatPage from "@/components/ChatPage";
import CekHakiHeroPage from "@/components/CekHakiHeroPage";

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
    other: {
      "theme-color": brand.accent,
    },
  };
}

export default async function Page() {
  const hdrs = await headers();
  const brandId = hdrs.get("x-brand-id") ?? "hakimerek";
  const brand = getBrandById(brandId);

  // CekHaki gets the premium redesign (navy + gold + cream, robot mascot).
  // Other brands stay on the shared ChatPage until their turn.
  if (brand.id === "cekhaki") {
    return <CekHakiHeroPage brand={brand} />;
  }
  return <ChatPage brand={brand} />;
}
