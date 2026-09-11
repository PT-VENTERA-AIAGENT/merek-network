/**
 * Preview route untuk template Hakio AI (navy+gold, mascot 3D robot).
 * Bisa dilihat lewat url apa saja + /preview/hakioai sebelum domain
 * hakioai.com beneran dibeli & pointing ke Vercel.
 *
 * Setelah domain beli, cukup update DNS ke Vercel — brand.id routing
 * di src/app/page.tsx sudah handle otomatis via getBrandByHost.
 */
import { Metadata } from "next";
import { getBrandById } from "@/lib/brands";
import CekHakiHeroPage from "@/components/CekHakiHeroPage";

export const metadata: Metadata = {
  title: "Hakio AI — Preview (Chat AI Merek Dagang Premium)",
  description: "Preview template Hakio AI premium — navy + gold, mascot 3D robot. Chat AI cek merek, analisa kemiripan, rekomendasi kelas.",
  robots: { index: false, follow: false },
};

export default function HakioAIPreview() {
  const brand = getBrandById("hakioai");
  return <CekHakiHeroPage brand={brand} />;
}
