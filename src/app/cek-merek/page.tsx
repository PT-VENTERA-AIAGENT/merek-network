import { headers } from "next/headers";
import { Metadata } from "next";
import { getBrandById } from "@/lib/brands";
import SubPageLayout from "@/components/SubPageLayout";

export const metadata: Metadata = {
  title: "Cek Nama Merek Dagang Gratis — Instan via AI | Hakio",
  description: "Periksa ketersediaan nama merek dagang Anda sebelum daftar ke DJKI. AI Hakio bantu cek kemiripan di database PDKI plus rekomendasi kelas produk/jasa — semua gratis.",
  alternates: { canonical: "/cek-merek" },
};

export default async function Page() {
  const hdrs = await headers();
  const brand = getBrandById(hdrs.get("x-brand-id") ?? "cekhaki");
  return (
    <SubPageLayout
      brand={brand}
      activeNav="/cek-merek"
      eyebrow="Cek Merek Gratis"
      title="Pastikan Nama Merek Anda Bebas dari Bentrok Sebelum Daftar"
      intro="Setiap tahun ratusan permohonan ditolak DJKI karena mirip merek terdaftar. Sebelum keluar uang untuk pendaftaran, cek dulu nama Anda di sini — instan, gratis, dan langsung dianalisa AI."
    >
      <h2>Kenapa harus dicek dulu?</h2>
      <p>Merek yang sudah dipakai (baik terdaftar maupun dalam masa pengumuman) berhak menolak permohonan baru yang dianggap serupa. Ini bukan sekadar tulisan yang sama persis — pemeriksa DJKI juga mempertimbangkan cara pengucapan, tampilan visual, dan makna kata. Pengecekan awal menghemat waktu berbulan-bulan dan biaya yang bisa hangus.</p>

      <div className="sp-card-grid">
        <div className="sp-card">
          <div className="sp-card-title">Instan & 100% Gratis</div>
          <div className="sp-card-desc">Chat AI Hakio menelusuri PDKI/DJKI dalam hitungan detik. Tidak perlu buat akun.</div>
        </div>
        <div className="sp-card">
          <div className="sp-card-title">Analisa Kemiripan</div>
          <div className="sp-card-desc">Tidak hanya nama persis — AI juga cek kemiripan pengucapan dan visual.</div>
        </div>
        <div className="sp-card">
          <div className="sp-card-title">Rekomendasi Kelas</div>
          <div className="sp-card-desc">Sekaligus dapat saran kelas produk/jasa yang tepat untuk bisnis Anda.</div>
        </div>
      </div>

      <h2>Cara kerjanya</h2>
      <ol className="sp-content">
        <li><strong>Ketik nama brand</strong> di kolom chat AI Hakio di halaman utama.</li>
        <li><strong>AI cek database</strong> PDKI/DJKI dan menampilkan potensi konflik.</li>
        <li><strong>Dapatkan rekomendasi</strong> kelas produk/jasa yang paling relevan.</li>
        <li><strong>Lanjut ke WhatsApp</strong> kalau ingin diproses langsung oleh tim Hakio.</li>
      </ol>

      <h2>Apa yang tidak dijamin oleh pengecekan awal?</h2>
      <p>Pengecekan cepat ini menampilkan indikasi ketersediaan berdasarkan data publik PDKI. Keputusan akhir tetap berada di Pemeriksa Merek DJKI dan bisa dipengaruhi oleh permohonan yang belum diumumkan. Untuk keyakinan lebih dalam, gunakan layanan Analisa Merek berbayar (Rp 149.000/kelas) atau langsung konsultasi via WhatsApp.</p>
    </SubPageLayout>
  );
}
