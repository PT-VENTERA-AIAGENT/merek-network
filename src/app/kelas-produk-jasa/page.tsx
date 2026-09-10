import { headers } from "next/headers";
import { Metadata } from "next";
import { getBrandById } from "@/lib/brands";
import SubPageLayout from "@/components/SubPageLayout";

export const metadata: Metadata = {
  title: "Kelas Produk/Jasa Merek Dagang — 45 Kelas NICE ",
  description: "Panduan memilih kelas produk/jasa yang tepat untuk pendaftaran merek dagang di Indonesia. Salah kelas = merek tidak terlindungi di bisnis Anda.",
  alternates: { canonical: "/kelas-produk-jasa" },
};

export default async function Page() {
  const hdrs = await headers();
  const brand = getBrandById(hdrs.get("x-brand-id") ?? "cekhaki");
  return (
    <SubPageLayout
      brand={brand}
      activeNav="/kelas-produk-jasa"
      eyebrow="Klasifikasi Merek"
      title="Kelas Produk/Jasa — Tentukan Cakupan Perlindungan Merek Anda"
      intro="Merek dagang di Indonesia dilindungi berdasarkan kelas produk atau jasanya, bukan sekadar nama. Salah pilih kelas berarti merek Anda bebas dipakai kompetitor di bidang lain. Halaman ini bantu Anda mengerti dasarnya."
    >
      <h2>Apa itu kelas produk/jasa?</h2>
      <p>Sistem klasifikasi ini dikenal internasional sebagai <strong>NICE Classification</strong>, dibuat oleh WIPO dan diadopsi Indonesia. Ada 45 kelas total: <strong>kelas 1–34 untuk barang</strong> dan <strong>kelas 35–45 untuk jasa</strong>. Merek Anda hanya terlindungi di kelas yang Anda daftarkan — bukan otomatis untuk semua bidang.</p>

      <h2>Kelompok besar barang (kelas 1–34)</h2>
      <div className="sp-card-grid">
        <div className="sp-card"><div className="sp-card-title">Kelas 1–5</div><div className="sp-card-desc">Kimia, cat, kosmetik, pelumas, obat & farmasi.</div></div>
        <div className="sp-card"><div className="sp-card-title">Kelas 6–11</div><div className="sp-card-desc">Logam, mesin, peralatan, elektronik, penerangan.</div></div>
        <div className="sp-card"><div className="sp-card-title">Kelas 12–21</div><div className="sp-card-desc">Kendaraan, senjata, kertas, karet, bangunan, furnitur, peralatan rumah tangga.</div></div>
        <div className="sp-card"><div className="sp-card-title">Kelas 22–28</div><div className="sp-card-desc">Tali & tekstil, pakaian, alas kaki, karpet, mainan & alat olahraga.</div></div>
        <div className="sp-card"><div className="sp-card-title">Kelas 29–32</div><div className="sp-card-desc">Makanan olahan, makanan pokok, hasil pertanian & makanan hewan, minuman.</div></div>
        <div className="sp-card"><div className="sp-card-title">Kelas 33–34</div><div className="sp-card-desc">Minuman beralkohol dan produk tembakau.</div></div>
      </div>

      <h2>Kelompok besar jasa (kelas 35–45)</h2>
      <div className="sp-card-grid">
        <div className="sp-card"><div className="sp-card-title">Kelas 35–36</div><div className="sp-card-desc">Iklan, manajemen usaha, ritel, asuransi & keuangan.</div></div>
        <div className="sp-card"><div className="sp-card-title">Kelas 37–39</div><div className="sp-card-desc">Konstruksi & reparasi, telekomunikasi, transportasi & logistik.</div></div>
        <div className="sp-card"><div className="sp-card-title">Kelas 40–41</div><div className="sp-card-desc">Pengolahan bahan, pendidikan & hiburan.</div></div>
        <div className="sp-card"><div className="sp-card-title">Kelas 42–43</div><div className="sp-card-desc">IT & teknologi, restoran & akomodasi.</div></div>
        <div className="sp-card"><div className="sp-card-title">Kelas 44–45</div><div className="sp-card-desc">Medis, kecantikan, veteriner, hukum & keamanan.</div></div>
      </div>

      <h2>Bagaimana kalau bisnis saya mencakup banyak kategori?</h2>
      <p>Anda bisa daftar merek yang sama di beberapa kelas sekaligus — misalnya restoran yang juga jual kaos merchandise: kelas 43 (restoran) + kelas 25 (pakaian). Biaya dihitung <em>per kelas</em>. Tim kami akan bantu identifikasi kelas mana saja yang layak diambil supaya perlindungan maksimal tanpa buang biaya di kelas yang tidak relevan.</p>

      <h2>Contoh cepat</h2>
      <ul>
        <li><strong>Warung kopi</strong>: kelas 43 (jasa restoran) + opsional kelas 30 (biji kopi kemasan).</li>
        <li><strong>Fashion lokal</strong>: kelas 25 (pakaian) + opsional kelas 35 (ritel/marketplace).</li>
        <li><strong>Perlengkapan hewan peliharaan</strong>: kelas 18 (aksesoris kulit) + 21 (tempat makan) + 28 (mainan hewan) + 31 (makanan hewan).</li>
        <li><strong>Aplikasi mobile</strong>: kelas 42 (jasa software) + opsional kelas 9 (perangkat lunak sebagai barang).</li>
      </ul>

      <p><em>Tidak yakin bisnis Anda masuk kelas apa? Chat AI kami di halaman utama — sebutkan produk/jasanya, dapat rekomendasi kelas lengkap dalam hitungan detik.</em></p>
    </SubPageLayout>
  );
}
