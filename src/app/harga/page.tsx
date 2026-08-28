import { headers } from "next/headers";
import { Metadata } from "next";
import { getBrandById } from "@/lib/brands";
import type { Brand } from "@/lib/brands";
import { BRANDS } from "@/lib/brands";

export async function generateMetadata(): Promise<Metadata> {
  const hdrs = await headers();
  const brandId = hdrs.get("x-brand-id") ?? "hakimerek";
  const brand = getBrandById(brandId);
  return {
    title: `Harga Pendaftaran Merek Dagang — ${brand.name}`,
    description: `Detail biaya pendaftaran merek dagang di ${brand.name}. UMKM Rp 1.299.000 / Perusahaan Rp 2.490.000 per kelas NICE. Termasuk biaya DJKI resmi.`,
    robots: { index: true, follow: true },
  };
}

const WHATSAPP = "6285148416800";

const waText = (brand: Brand) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Halo, saya ingin konsultasi pendaftaran merek dagang via ${brand.name}.`
  )}`;

const WaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default async function HargaPage() {
  const hdrs = await headers();
  const brandId = hdrs.get("x-brand-id") ?? "hakimerek";
  const brand = getBrandById(brandId);
  const waLink = waText(brand);

  const accent = brand.accent;
  const accentLight = brand.accentLight;
  const accentRgb = brand.accentRgb;

  return (
    <>
      <style>{`
        :root { --accent: ${accent}; --accent-light: ${accentLight}; --accent-rgb: ${accentRgb}; }
        .accent-text { color: var(--accent-light); }
        .accent-gradient { background: linear-gradient(135deg, var(--accent), var(--accent-light)); }
        .section-card { background: #111; border: 1px solid rgba(255,255,255,0.06); }
        .featured-border { border-color: var(--accent) !important; }
        .featured-badge { background: var(--accent); }
        .wa-hover:hover { opacity: .88; }
        .check-icon { color: var(--accent-light); }
      `}</style>

      <div className="min-h-screen bg-[#0a0a0a] text-[#ececec]">
        {/* Nav */}
        <nav className="fixed top-0 inset-x-0 z-50 h-13 flex items-center justify-between px-5 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/8">
          <a href="/" className="text-[1.05rem] font-bold tracking-tight text-[#ececec] no-underline">
            <b className="accent-text">{brand.name.slice(0, 4)}</b>
            {brand.name.slice(4)}
          </a>
          <div className="flex items-center gap-2">
            <a href="/" className="text-[.8rem] text-[#a0a0a0] no-underline px-3 py-1.5 rounded-lg hover:bg-[#1e1e1e] hover:text-[#ececec] transition-colors">
              Beranda
            </a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-[.8rem] text-[#a0a0a0] no-underline px-3.5 py-1.5 rounded-lg hover:bg-[#1e1e1e] hover:text-[#ececec] transition-colors">
              Konsultasi
            </a>
          </div>
        </nav>

        <main className="pt-13 pb-20">
          {/* Hero */}
          <section className="px-5 pt-14 pb-10 text-center max-w-2xl mx-auto">
            <div
              className="absolute inset-x-0 top-13 h-48 pointer-events-none"
              style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(${accentRgb},.1) 0%, transparent 70%)` }}
            />
            <h1 className="text-[clamp(1.8rem,4.5vw,2.6rem)] font-extrabold tracking-[-0.04em] text-[#ececec] mb-3 leading-tight relative">
              Harga Pendaftaran Merek Dagang
            </h1>
            <p className="text-[#888] text-[.9375rem] leading-[1.7] relative">
              Transparan, tanpa biaya tersembunyi. Semua paket sudah termasuk biaya resmi DJKI dan pendampingan hingga sertifikat terbit.
            </p>
          </section>

          {/* Pricing cards */}
          <section className="px-5 max-w-3xl mx-auto mb-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* UMKM */}
              <div className="section-card featured-border rounded-2xl p-7 relative overflow-hidden flex flex-col" style={{ borderColor: accent }}>
                <div className="featured-badge absolute top-0 right-0 text-[.65rem] font-bold text-white px-3 py-1 rounded-bl-xl tracking-wide uppercase">
                  Paling Laris
                </div>
                <div className="text-[.75rem] font-semibold uppercase tracking-widest mb-2 accent-text">
                  UMKM / Perorangan
                </div>
                <div className="text-[2.5rem] font-extrabold text-[#ececec] leading-none mb-1">
                  Rp 1.299.000
                </div>
                <div className="text-[.8rem] text-[#555] mb-6">per kelas NICE · semua biaya termasuk</div>
                <ul className="flex flex-col gap-3 mb-7 flex-1">
                  {[
                    { item: "Biaya PNBP DJKI resmi", detail: "Sudah termasuk" },
                    { item: "Pemeriksaan kemiripan nama merek", detail: "Sebelum pendaftaran" },
                    { item: "Konsultasi kelas NICE", detail: "Rekomendasi AI" },
                    { item: "Pengajuan e-Filing ke DJKI", detail: "Oleh tim kami" },
                    { item: "Nomor permohonan resmi", detail: "Dikirim via email" },
                    { item: "Pendampingan proses DJKI", detail: "Hingga sertifikat terbit" },
                    { item: "Notifikasi setiap tahap", detail: "Status update" },
                  ].map(({ item, detail }) => (
                    <li key={item} className="flex items-start gap-2.5 text-[.875rem]">
                      <span className="check-icon mt-0.5 flex-shrink-0 font-semibold">✓</span>
                      <span>
                        <span className="text-[#ddd]">{item}</span>
                        <span className="text-[#555] ml-1.5 text-[.8rem]">— {detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="block text-center py-3.5 rounded-full text-white text-[.9rem] font-semibold no-underline wa-hover transition-opacity accent-gradient">
                  Daftar Sekarang
                </a>
                <p className="text-center text-[.75rem] text-[#444] mt-3">
                  Dokumen: KTP / NIB UMKM + logo merek
                </p>
              </div>

              {/* PT */}
              <div className="section-card rounded-2xl p-7 flex flex-col">
                <div className="text-[.75rem] font-semibold uppercase tracking-widest text-[#555] mb-2">
                  Perusahaan / PT / CV
                </div>
                <div className="text-[2.5rem] font-extrabold text-[#ececec] leading-none mb-1">
                  Rp 2.490.000
                </div>
                <div className="text-[.8rem] text-[#555] mb-6">per kelas NICE · semua biaya termasuk</div>
                <ul className="flex flex-col gap-3 mb-7 flex-1">
                  {[
                    { item: "Biaya PNBP DJKI resmi", detail: "Sudah termasuk" },
                    { item: "Pemeriksaan kemiripan nama merek", detail: "Sebelum pendaftaran" },
                    { item: "Konsultasi kelas NICE", detail: "Rekomendasi AI" },
                    { item: "Pengajuan e-Filing ke DJKI", detail: "Atas nama badan hukum" },
                    { item: "Nomor permohonan resmi", detail: "Dikirim via email" },
                    { item: "Pendampingan proses DJKI", detail: "Hingga sertifikat terbit" },
                    { item: "Notifikasi setiap tahap", detail: "Status update" },
                  ].map(({ item, detail }) => (
                    <li key={item} className="flex items-start gap-2.5 text-[.875rem]">
                      <span className="text-[#555] mt-0.5 flex-shrink-0 font-semibold">✓</span>
                      <span>
                        <span className="text-[#ddd]">{item}</span>
                        <span className="text-[#555] ml-1.5 text-[.8rem]">— {detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="block text-center py-3.5 rounded-full border border-white/10 text-[#ececec] text-[.9rem] font-semibold no-underline transition-colors hover:bg-white/5">
                  Konsultasi Dulu
                </a>
                <p className="text-center text-[.75rem] text-[#444] mt-3">
                  Dokumen: Akta perusahaan + KTP direktur + logo
                </p>
              </div>
            </div>

            <div className="section-card rounded-xl p-5 mt-4 flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="text-[.875rem] font-semibold text-[#ececec] mb-0.5">Butuh lebih dari 1 kelas?</div>
                <p className="text-[.8125rem] text-[#666]">
                  Banyak bisnis perlu 2–3 kelas NICE sekaligus (misal: produk + layanan + nama perusahaan). Hubungi kami untuk penawaran bundling yang lebih hemat.
                </p>
              </div>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-[.8125rem] font-semibold no-underline wa-hover transition-opacity whitespace-nowrap">
                <WaIcon />
                Tanya Harga Bundling
              </a>
            </div>
          </section>

          {/* Breakdown */}
          <section className="px-5 max-w-3xl mx-auto mb-14">
            <h2 className="text-[1.25rem] font-bold text-[#ececec] mb-6">Rincian Biaya Resmi DJKI</h2>
            <div className="section-card rounded-2xl overflow-hidden">
              <table className="w-full text-[.875rem]">
                <thead>
                  <tr className="border-b border-white/6">
                    <th className="text-left px-5 py-3.5 text-[#555] font-medium">Komponen Biaya</th>
                    <th className="text-right px-5 py-3.5 text-[#555] font-medium">UMKM</th>
                    <th className="text-right px-5 py-3.5 text-[#555] font-medium">PT/CV</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Biaya PNBP (resmi DJKI)", umkm: "Rp 500.000", pt: "Rp 1.900.000" },
                    { label: "Jasa konsultasi & analisis", umkm: "Rp 400.000", pt: "Rp 400.000" },
                    { label: "Pengajuan e-Filing & dokumen", umkm: "Rp 250.000", pt: "Rp 150.000" },
                    { label: "Pendampingan hingga sertifikat", umkm: "Rp 149.000", pt: "Rp 40.000" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-white/4 last:border-b-0">
                      <td className="px-5 py-3.5 text-[#aaa]">{row.label}</td>
                      <td className="px-5 py-3.5 text-right text-[#aaa]">{row.umkm}</td>
                      <td className="px-5 py-3.5 text-right text-[#aaa]">{row.pt}</td>
                    </tr>
                  ))}
                  <tr className="bg-white/[0.02]">
                    <td className="px-5 py-4 font-semibold text-[#ececec]">Total</td>
                    <td className="px-5 py-4 text-right font-bold accent-text">Rp 1.299.000</td>
                    <td className="px-5 py-4 text-right font-bold text-[#ececec]">Rp 2.490.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[.75rem] text-[#444] mt-3">
              * Biaya PNBP (Penerimaan Negara Bukan Pajak) adalah biaya resmi pemerintah yang berlaku sejak PMK No.46/2021. Sudah termasuk dalam harga yang kami tawarkan.
            </p>
          </section>

          {/* Payment methods */}
          <section className="px-5 max-w-3xl mx-auto mb-14">
            <h2 className="text-[1.25rem] font-bold text-[#ececec] mb-6">Metode Pembayaran</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: "Transfer Bank",
                  methods: ["BCA", "Mandiri", "BNI", "BRI"],
                  note: "Konfirmasi otomatis",
                },
                {
                  title: "E-Wallet & QRIS",
                  methods: ["GoPay", "OVO", "Dana", "QRIS"],
                  note: "Instan & real-time",
                },
                {
                  title: "Virtual Account",
                  methods: ["BCA VA", "Mandiri VA", "BNI VA"],
                  note: "Kode unik per transaksi",
                },
              ].map((pm) => (
                <div key={pm.title} className="section-card rounded-xl p-5">
                  <div className="text-[.875rem] font-semibold text-[#ececec] mb-3">{pm.title}</div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {pm.methods.map((m) => (
                      <span key={m} className="text-[.75rem] px-2.5 py-1 rounded-full bg-white/6 text-[#888]">
                        {m}
                      </span>
                    ))}
                  </div>
                  <p className="text-[.75rem] text-[#555]">{pm.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ about pricing */}
          <section className="px-5 max-w-2xl mx-auto mb-14">
            <h2 className="text-[1.25rem] font-bold text-[#ececec] mb-6">Pertanyaan Seputar Harga</h2>
            <div className="flex flex-col gap-3">
              {[
                {
                  q: "Apakah ada biaya tambahan di luar harga yang tertera?",
                  a: "Tidak. Harga yang kami tampilkan sudah final termasuk biaya PNBP DJKI, jasa konsultasi, pengajuan, dan pendampingan. Tidak ada biaya tersembunyi.",
                },
                {
                  q: "Bagaimana jika permohonan saya ditolak DJKI?",
                  a: "Kami akan menganalisis alasan penolakan dan memberikan rekomendasi langkah selanjutnya. Jika penolakan karena kesalahan dari pihak kami, kami akan proses ulang tanpa biaya tambahan.",
                },
                {
                  q: "Apakah bisa bayar cicilan atau dicicil?",
                  a: "Pembayaran dilakukan di muka sebelum pengajuan dimulai. Namun untuk multiple kelas (3+ kelas), kami bisa diskusikan skema pembayaran bertahap. Hubungi kami via WhatsApp untuk negosiasi.",
                },
                {
                  q: "Apakah ada diskon untuk UMKM atau startup?",
                  a: "Harga UMKM sudah merupakan harga khusus yang lebih rendah dari tarif perusahaan. Untuk pembelian bundling 3+ kelas sekaligus, hubungi kami untuk penawaran khusus.",
                },
              ].map((item, i) => (
                <div key={i} className="section-card rounded-xl p-5">
                  <div className="text-[.9rem] font-medium text-[#ececec] mb-2">{item.q}</div>
                  <p className="text-[.85rem] text-[#777] leading-[1.65]">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="px-5 max-w-xl mx-auto text-center">
            <div className="section-card rounded-2xl p-8">
              <h2 className="text-[1.25rem] font-bold text-[#ececec] mb-2">Siap Lindungi Merekmu?</h2>
              <p className="text-[#666] text-[.875rem] mb-6 leading-[1.6]">
                Konsultasikan dulu via WhatsApp atau coba tanya AI konsultan kami secara gratis.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-[.9rem] font-semibold no-underline wa-hover transition-opacity">
                  <WaIcon />
                  Konsultasi via WhatsApp
                </a>
                <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-[#ececec] text-[.9rem] font-semibold no-underline transition-colors hover:bg-white/5">
                  Tanya AI Gratis
                </a>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-14 border-t border-white/6 px-5 py-8 text-center">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-4">
              {Object.values(BRANDS).map((b) => (
                <a key={b.id} href={`https://${b.id}.com`} target="_blank" rel="noopener noreferrer" className="text-[.8rem] text-[#444] no-underline hover:text-[#666]">
                  {b.name}
                </a>
              ))}
              <a href="https://hakio.id" target="_blank" rel="noopener noreferrer" className="text-[.8rem] text-[#444] no-underline hover:text-[#666]">
                Hakio.id
              </a>
            </div>
            <p className="text-[.75rem] text-[#333]">
              &copy; {new Date().getFullYear()} {brand.name} · Layanan pendaftaran merek dagang di Indonesia
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
