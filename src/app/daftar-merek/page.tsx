import { headers } from "next/headers";
import { Metadata } from "next";
import { getBrandById } from "@/lib/brands";
import SubPageLayout from "@/components/SubPageLayout";

export const metadata: Metadata = {
  title: "Daftar Merek Dagang ke DJKI — Dibantu Tim Hakio | Hakio",
  description: "Layanan pendaftaran merek dagang di Indonesia. Dari analisa nama, kelas produk/jasa, sampai keluarnya sertifikat elektronik DJKI — semua dibantu tim Hakio.",
  alternates: { canonical: "/daftar-merek" },
};

export default async function Page() {
  const hdrs = await headers();
  const brand = getBrandById(hdrs.get("x-brand-id") ?? "cekhaki");
  return (
    <SubPageLayout
      brand={brand}
      activeNav="/daftar-merek"
      eyebrow="Pendaftaran Merek"
      title="Daftarkan Merek Dagang Anda Tanpa Ribet"
      intro="Anda cukup siapkan nama merek dan dokumen dasar. Sisanya — mulai dari pengisian formulir DJKI sampai monitoring status — dikerjakan tim Hakio. Cocok untuk UMKM, perorangan, dan perusahaan."
    >
      <h2>Yang Anda dapatkan</h2>
      <ul>
        <li>Analisa awal nama merek dan rekomendasi kelas produk/jasa</li>
        <li>Penyusunan dokumen sesuai format DJKI (permohonan, surat pernyataan, kuasa)</li>
        <li>Pengajuan permohonan resmi lewat sistem DJKI Online</li>
        <li>Update status setiap tahap: penerimaan, pengumuman, pemeriksaan substantif</li>
        <li>Sertifikat elektronik diserahkan begitu terbit</li>
      </ul>

      <h2>Dokumen yang perlu Anda siapkan</h2>
      <div className="sp-card-grid">
        <div className="sp-card">
          <div className="sp-card-title">UMKM / Perorangan</div>
          <div className="sp-card-desc">KTP pemilik + NIB atau Surat Keterangan UMKM dari kelurahan/kecamatan.</div>
        </div>
        <div className="sp-card">
          <div className="sp-card-title">Perusahaan / PT / CV</div>
          <div className="sp-card-desc">Akta pendirian, NPWP perusahaan, dan KTP direktur pemohon.</div>
        </div>
        <div className="sp-card">
          <div className="sp-card-title">Nama & Logo Merek</div>
          <div className="sp-card-desc">Nama dalam teks, atau file logo JPG/PNG minimal 500×500px.</div>
        </div>
        <div className="sp-card">
          <div className="sp-card-title">Deskripsi Produk/Jasa</div>
          <div className="sp-card-desc">Keterangan singkat produk/jasa yang mau dilindungi merek.</div>
        </div>
      </div>

      <h2>Tahapan singkat sampai sertifikat terbit</h2>
      <ol>
        <li><strong>Konsultasi awal</strong> — cek nama, tentukan kelas, siapkan dokumen (1–2 hari).</li>
        <li><strong>Pengajuan ke DJKI</strong> — permohonan resmi masuk dan Anda dapat nomor filing.</li>
        <li><strong>Masa pengumuman</strong> — 2 bulan; pihak ketiga bisa mengajukan oposisi bila ada.</li>
        <li><strong>Pemeriksaan substantif</strong> — pemeriksa DJKI menilai layak/tidaknya (5–9 bulan).</li>
        <li><strong>Sertifikat elektronik</strong> — terbit dan berlaku 10 tahun.</li>
      </ol>

      <h2>Berapa lama total prosesnya?</h2>
      <p>Rata-rata 12–18 bulan sejak permohonan diterima sampai sertifikat elektronik keluar. Namun, perlindungan awal Anda sudah aktif <em>sejak</em> tanggal filing — bukan menunggu sertifikat jadi. Artinya, siapa yang duluan mendaftar, dia yang punya hak.</p>
    </SubPageLayout>
  );
}
