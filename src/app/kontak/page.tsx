import { headers } from "next/headers";
import { Metadata } from "next";
import { getBrandById } from "@/lib/brands";
import SubPageLayout from "@/components/SubPageLayout";

export const metadata: Metadata = {
  title: "Kontak Kami — WhatsApp, Email, Alamat Kantor Jakarta",
  description: "Hubungi tim kami untuk konsultasi pendaftaran merek dagang. WhatsApp 0851-4841-6800, email info@hakio.id, kantor Jakarta Selatan.",
  alternates: { canonical: "/kontak" },
};

export default async function Page() {
  const hdrs = await headers();
  const brand = getBrandById(hdrs.get("x-brand-id") ?? "cekhaki");
  const waLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Halo Admin! Saya ingin konsultasi merek dagang.")}`;
  return (
    <SubPageLayout
      brand={brand}
      activeNav="/kontak"
      eyebrow="Hubungi Kami"
      title="Tim Kami Siap Bantu — Pilih Cara Kontak yang Paling Nyaman"
      intro="Untuk pertanyaan cepat, WhatsApp adalah cara tercepat — admin standby jam kerja Senin–Jumat WIB. Untuk urusan formal atau dokumen resmi, kirim email ke tim kami."
    >
      <div className="sp-card-grid">
        <div className="sp-card">
          <div className="sp-card-title">💬 WhatsApp Admin</div>
          <div className="sp-card-desc" style={{ marginBottom: 12 }}>Respons paling cepat, biasanya dalam 1–2 jam pada jam kerja.</div>
          <a className="sp-cta" href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex" }}>
            <span>♛</span><span>0851-4841-6800</span>
          </a>
        </div>
        <div className="sp-card">
          <div className="sp-card-title">📧 Email</div>
          <div className="sp-card-desc">Kirim ke <a href="mailto:info@hakio.id">info@hakio.id</a> untuk urusan formal, invoice, atau dokumentasi.</div>
        </div>
        <div className="sp-card">
          <div className="sp-card-title">🏢 Alamat Kantor</div>
          <div className="sp-card-desc">Gedung AD Premier Office Park Lt. 9<br />Jl. TB. Simatupang No. 5<br />Jakarta Selatan 12430</div>
        </div>
        <div className="sp-card">
          <div className="sp-card-title">🕘 Jam Operasional</div>
          <div className="sp-card-desc">Senin–Jumat, 09.00–17.00 WIB<br />Sabtu, Minggu, dan hari libur nasional: standby via WhatsApp untuk pesan mendesak.</div>
        </div>
      </div>

      <h2>Pertanyaan yang paling sering diajukan</h2>
      <h3>Apakah bisa meeting tatap muka?</h3>
      <p>Ya. Untuk klien area Jabodetabek dan portfolio merek besar, kami sediakan meeting tatap muka di kantor Jakarta Selatan. Jadwalkan minimal 1 hari sebelumnya via WhatsApp.</p>

      <h3>Bisa bantu klien di luar Jakarta?</h3>
      <p>Bisa. Seluruh proses pendaftaran merek dilakukan digital via sistem DJKI Online, jadi lokasi klien tidak jadi masalah. Kami melayani seluruh Indonesia — komunikasi via WhatsApp, dokumen dikirim digital.</p>

      <h3>Berapa lama respons untuk pertanyaan pertama?</h3>
      <p>Umumnya kurang dari 2 jam pada jam kerja. Untuk pertanyaan di luar jam kerja atau akhir pekan, admin akan follow-up di hari kerja berikutnya.</p>

      <h2>Perusahaan pengelola</h2>
      <p><strong>PT Sellora Optima Teknologi</strong> — perusahaan penyedia layanan kekayaan intelektual dan pendaftaran merek dagang di Indonesia, yang mengelola Layanan kami dan produk terkait.</p>
    </SubPageLayout>
  );
}
