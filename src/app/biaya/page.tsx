import { headers } from "next/headers";
import { Metadata } from "next";
import { getBrandById } from "@/lib/brands";
import SubPageLayout from "@/components/SubPageLayout";

export const metadata: Metadata = {
  title: "Biaya Pendaftaran Merek Dagang 2026 — Transparan | Hakio",
  description: "Rincian biaya daftar merek dagang di Indonesia: UMKM Rp 1.299.000/kelas, Perusahaan Rp 2.490.000/kelas. Sudah termasuk PNBP resmi DJKI + jasa pengurusan. Garansi termurah.",
  alternates: { canonical: "/biaya" },
};

export default async function Page() {
  const hdrs = await headers();
  const brand = getBrandById(hdrs.get("x-brand-id") ?? "cekhaki");
  return (
    <SubPageLayout
      brand={brand}
      activeNav="/biaya"
      eyebrow="Harga Transparan"
      title="Biaya Pendaftaran Merek Dagang Tanpa Biaya Tersembunyi"
      intro="Semua harga di bawah sudah mencakup Penerimaan Negara Bukan Pajak (PNBP) resmi ke DJKI plus jasa pengurusan tim Hakio dari awal sampai sertifikat elektronik terbit."
    >
      <h2>Paket per kelas</h2>
      <div className="sp-card-grid">
        <div className="sp-card">
          <div className="sp-card-title">UMKM / Perorangan</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0f2455", marginBottom: 6 }}>Rp 1.299.000<span style={{ fontSize: 13, color: "#8794AE", fontWeight: 600 }}>/kelas</span></div>
          <div className="sp-card-desc">Untuk pemilik UMKM yang punya NIB atau Surat Keterangan UMKM. Termasuk PNBP DJKI Rp 500.000/kelas.</div>
        </div>
        <div className="sp-card">
          <div className="sp-card-title">Perusahaan / PT / CV</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0f2455", marginBottom: 6 }}>Rp 2.490.000<span style={{ fontSize: 13, color: "#8794AE", fontWeight: 600 }}>/kelas</span></div>
          <div className="sp-card-desc">Untuk badan hukum PT, CV, atau perusahaan non-UMKM. Termasuk PNBP DJKI Rp 1.800.000/kelas.</div>
        </div>
      </div>

      <h2>Yang termasuk dalam harga</h2>
      <ul>
        <li>Analisa awal nama merek + rekomendasi kelas produk/jasa</li>
        <li>Biaya resmi PNBP DJKI (sesuai tarif berdasarkan jenis pemohon)</li>
        <li>Pengisian formulir permohonan + upload dokumen ke DJKI Online</li>
        <li>Monitoring status permohonan sampai sertifikat terbit</li>
        <li>Konsultasi WhatsApp selama proses berlangsung</li>
      </ul>

      <h2>Kapan ada biaya tambahan?</h2>
      <p>Kalau merek Anda mencakup lebih dari 10 jenis barang/jasa dalam satu kelas, DJKI mengenakan biaya tambahan Rp 10.000 per jenis ekstra. Tim Hakio akan menginformasikan sebelum diproses, tidak ada kejutan di tengah jalan.</p>

      <h2>🏆 Garansi Termurah se-Indonesia</h2>
      <p>Kalau Anda menemukan jasa pendaftaran merek dagang yang lebih murah dari harga kami dengan <strong>cakupan layanan setara</strong> (biaya DJKI sudah masuk, pendampingan sampai sertifikat), <strong>selisih harganya kami ganti</strong>. Kirim bukti penawaran lawan via WhatsApp untuk klaim.</p>

      <h2>Perbandingan cepat</h2>
      <div className="sp-card-grid">
        <div className="sp-card">
          <div className="sp-card-title">Daftar sendiri di DJKI</div>
          <div className="sp-card-desc">Bayar PNBP saja, tapi harus paham istilah hukum, isi form, urus dokumen, dan monitor sendiri. Risiko salah kelas atau salah dokumen tinggi.</div>
        </div>
        <div className="sp-card">
          <div className="sp-card-title">Via Hakio</div>
          <div className="sp-card-desc">Selisih ~Rp 800rb (UMKM) atau ~Rp 700rb (PT) untuk jasa pendampingan penuh + garansi termurah. Cocok untuk pemilik bisnis yang mau fokus jualan.</div>
        </div>
      </div>
    </SubPageLayout>
  );
}
