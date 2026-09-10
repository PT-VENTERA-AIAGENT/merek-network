import { headers } from "next/headers";
import { Metadata } from "next";
import { getBrandById } from "@/lib/brands";
import SubPageLayout from "@/components/SubPageLayout";

export const metadata: Metadata = {
  title: "Blog Hakio — Panduan Merek Dagang Indonesia",
  description: "Artikel dan panduan seputar pendaftaran merek dagang, kelas produk/jasa, biaya DJKI, dan tips melindungi brand di Indonesia.",
  alternates: { canonical: "/blog" },
};

export default async function Page() {
  const hdrs = await headers();
  const brand = getBrandById(hdrs.get("x-brand-id") ?? "cekhaki");
  return (
    <SubPageLayout
      brand={brand}
      activeNav="/blog"
      eyebrow="Blog Hakio"
      title="Panduan Merek Dagang Indonesia — Segera Hadir"
      intro="Kami sedang menyusun artikel-artikel panduan seputar pendaftaran, perlindungan, dan strategi merek dagang di Indonesia. Sementara menunggu, silakan gunakan chat AI Hakio untuk pertanyaan spesifik atau hubungi tim kami via WhatsApp."
    >
      <h2>Topik yang akan datang</h2>
      <ul>
        <li>Cara memilih nama merek yang aman didaftarkan</li>
        <li>Panduan 45 kelas produk/jasa untuk berbagai jenis bisnis</li>
        <li>Beda hak merek, hak cipta, dan paten — kapan pakai yang mana</li>
        <li>Cara membuat Surat Keterangan UMKM untuk daftar merek</li>
        <li>Merek internasional (Madrid Protocol) — kapan perlu?</li>
        <li>Menghadapi oposisi merek dari pihak ketiga</li>
        <li>Studi kasus: merek terkenal Indonesia yang pernah kalah sengketa</li>
      </ul>
    </SubPageLayout>
  );
}
