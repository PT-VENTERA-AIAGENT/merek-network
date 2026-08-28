import { headers } from "next/headers";
import { Metadata } from "next";
import { getBrandById } from "@/lib/brands";
import ChatPage from "@/components/ChatPage";

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

  return <ChatPage brand={brand} />;
}
