import { headers } from "next/headers";
import { Metadata } from "next";
import { getBrandById } from "@/lib/brands";
import SubPageLayout from "@/components/SubPageLayout";

export const metadata: Metadata = {
  title: "Perpanjangan Merek Dagang 10 Tahun — Cepat & Aman | Hakio",
  description: "Merek dagang berlaku 10 tahun dan perlu diperpanjang sebelum expired. Tim Hakio bantu proses perpanjangan sampai sertifikat baru keluar dari DJKI.",
  alternates: { canonical: "/perpanjang" },
};

export default async function Page() {
  const hdrs = await headers();
  const brand = getBrandById(hdrs.get("x-brand-id") ?? "cekhaki");
  return (
    <SubPageLayout
      brand={brand}
      activeNav="/perpanjang"
      eyebrow="Perpanjangan Merek"
      title="Jangan Sampai Merek Anda Kadaluarsa — Kompetitor Bisa Ambil"
      intro="Sertifikat merek dagang berlaku 10 tahun sejak tanggal permohonan diterima DJKI. Kalau lewat masa grace period tanpa diperpanjang, merek hilang dari daftar — dan siapa saja boleh mendaftar ulang atas namanya."
    >
      <h2>Kapan harus diperpanjang?</h2>
      <p>Berdasarkan UU Merek No. 20 Tahun 2016, permohonan perpanjangan dapat diajukan mulai <strong>6 bulan sebelum tanggal berakhir</strong>. Ada juga masa <em>grace period</em> 6 bulan setelah tanggal expired — tapi dengan denda tambahan. Idealnya urus minimal 3 bulan sebelum jatuh tempo supaya tidak terburu-buru.</p>

      <h2>Yang terjadi kalau lewat grace period</h2>
      <ul>
        <li>Merek Anda otomatis <strong>dihapus dari daftar</strong> DJKI</li>
        <li>Perlindungan hukum atas nama merek tersebut hilang</li>
        <li>Pihak lain bisa mendaftarkan nama yang sama dan menjadi pemilik sah</li>
        <li>Kalau ingin merek kembali, harus daftar ulang dari nol — bisa ditolak kalau sudah ada yang mengambil</li>
      </ul>

      <h2>Proses perpanjangan bareng Hakio</h2>
      <ol>
        <li><strong>Cek tanggal expired</strong> — kirim nomor sertifikat, kami cek ke DJKI.</li>
        <li><strong>Siapkan bukti pemakaian</strong> — foto produk, kemasan, atau website yang menampilkan merek.</li>
        <li><strong>Susun & ajukan permohonan</strong> perpanjangan ke DJKI.</li>
        <li><strong>Monitor sampai sertifikat baru terbit</strong> — perlindungan diperpanjang 10 tahun berikutnya.</li>
      </ol>

      <h2>Biaya perpanjangan</h2>
      <div className="sp-card-grid">
        <div className="sp-card">
          <div className="sp-card-title">Paket Perpanjangan</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0f2455", marginBottom: 6 }}>Rp 3.500.000<span style={{ fontSize: 13, color: "#8794AE", fontWeight: 600 }}>/kelas</span></div>
          <div className="sp-card-desc">Sudah termasuk PNBP DJKI + jasa pengurusan sampai sertifikat perpanjangan terbit.</div>
        </div>
        <div className="sp-card">
          <div className="sp-card-title">Kena Grace Period?</div>
          <div className="sp-card-desc">Ada biaya tambahan sesuai ketentuan DJKI. Tim Hakio bantu hitung total sebelum dijalankan.</div>
        </div>
      </div>

      <h2>Bisa diperpanjang berkali-kali</h2>
      <p>Tidak ada batas maksimum perpanjangan. Selama Anda mengajukan sebelum grace period habis, merek dagang Anda bisa diperpanjang tanpa batas — masing-masing untuk periode 10 tahun berikutnya. Ini yang bikin merek jadi aset bisnis jangka panjang.</p>
    </SubPageLayout>
  );
}
