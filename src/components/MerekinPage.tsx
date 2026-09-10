"use client";

import { useState } from "react";
import type { Brand } from "@/lib/brands";
import JsonLd from "./JsonLd";
import ChatWidget from "./ChatWidget";
import TopStrip from "./TopStrip";

const ACCENT = "#ff6a2d";
const ACCENT_2 = "#fff0e8";

const NAV = [
  { label: "Beranda", href: "/" },
  { label: "Cek Merek", href: "/cek-merek" },
  { label: "Daftar Merek", href: "/daftar-merek" },
  { label: "Kelas Produk/Jasa", href: "/kelas-produk-jasa" },
  { label: "Harga UMKM", href: "/biaya" },
  { label: "Panduan", href: "/perpanjang" },
  { label: "Blog", href: "/blog" },
];

const BENEFITS = [
  { icon: "💸", title: "Harga UMKM Terjangkau", desc: "Mulai dari Rp 1,3jt per kelas — sudah termasuk biaya DJKI." },
  { icon: "🗺️", title: "Panduan Step-by-Step", desc: "Bahasa Indonesia yang mudah dipahami pelaku UMKM." },
  { icon: "💬", title: "Chat AI 24/7", desc: "Bisa tanya kapan saja tanpa antre atau jadwal janjian." },
];

const QUICK_ACTIONS = [
  { label: "Cek Merek", template: "Saya mau cek nama brand UMKM saya: " },
  { label: "Rekomendasi Kelas", template: "Tolong rekomendasikan kelas produk/jasa untuk UMKM saya, yaitu bisnis: " },
  { label: "Panduan Daftar", template: "Bagaimana langkah-langkah mendaftarkan merek dagang untuk UMKM?" },
  { label: "Estimasi Biaya", template: "Berapa biaya total untuk mendaftarkan merek dagang UMKM saya?" },
];

export default function MerekinPage({ brand }: { brand: Brand }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const waLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Halo Merekin! Saya UMKM dan mau konsultasi pendaftaran merek dagang.")}`;

  return (
    <>
      <JsonLd brand={brand} />
      <style>{`
        :root { --accent:${ACCENT}; --accent-2:${ACCENT_2}; --dark:#221b18; --soft:#fffaf7; --line:#eee5df; }
        html,body{margin:0;padding:0;overflow-x:hidden}
        body {
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background:#f5f7fb; color:var(--dark);
        }
        .mr-site { min-height:100vh; background:linear-gradient(180deg,#fff,var(--soft)); }
        .mr-nav {
          height:78px; display:flex; align-items:center; justify-content:space-between;
          padding:0 42px; border-bottom:1px solid rgba(34,27,24,.08);
          background:rgba(255,255,255,.9); position:sticky; top:0; z-index:20; backdrop-filter:blur(12px);
        }
        .mr-brand { display:flex; align-items:center; gap:12px; text-decoration:none; color:inherit; }
        .mr-logo {
          width:42px; height:42px; border-radius:12px;
          background:linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 75%, #4a2a1a));
          display:grid; place-items:center; color:#fff; font-weight:900; font-size:22px;
          box-shadow:0 8px 20px color-mix(in srgb, var(--accent) 25%, transparent);
        }
        .mr-brand-text strong { display:block; font-size:20px; letter-spacing:-.02em; }
        .mr-brand-text span { display:block; color:#7a6c62; font-size:11px; margin-top:2px; }
        .mr-links { display:flex; gap:22px; color:#524339; font-size:14px; font-weight:600; }
        .mr-links a { text-decoration:none; color:inherit; padding:8px 0; }
        .mr-links a:hover { color:var(--accent); }
        .mr-actions { display:flex; gap:10px; align-items:center; }
        .mr-btn {
          border-radius:12px; padding:11px 16px; border:1px solid #ecdcd0;
          background:#fff; font-weight:700; text-decoration:none; color:inherit;
          font-size:14px; display:inline-flex; align-items:center; gap:8px;
        }
        .mr-btn.primary {
          background:var(--accent); border-color:var(--accent); color:#fff;
          box-shadow:0 10px 20px color-mix(in srgb, var(--accent) 30%, transparent);
        }
        .mr-menu-btn { display:none; width:42px; height:42px; border-radius:10px; border:1px solid #ecdcd0; background:#fff; cursor:pointer; }

        .mr-wrap { max-width:1260px; margin:0 auto; padding:44px 28px 60px; }

        .mr-friendly {
          display:grid; grid-template-columns:1fr 510px; gap:44px;
          align-items:start;
        }

        .mr-story { padding-top:8px; position:relative; }
        .mr-mascot-float {
          position:absolute; right:-40px; top:-40px;
          width:160px; height:160px; z-index:1;
          filter:drop-shadow(0 20px 32px rgba(255,106,45,.28));
          animation:mrFloat 4.5s ease-in-out infinite;
          pointer-events:none;
        }
        @keyframes mrFloat { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-10px) rotate(3deg)} }
        .mr-price-pill {
          display:inline-flex; align-items:center; gap:14px;
          padding:12px 18px; border-radius:14px;
          background:linear-gradient(135deg, var(--accent-2), color-mix(in srgb, var(--accent) 6%, white));
          border:1px solid color-mix(in srgb, var(--accent) 24%, white);
          margin:8px 0 24px;
          font-size:14px; font-weight:700;
        }
        .mr-price-pill .p { display:flex; flex-direction:column; }
        .mr-price-pill .p small { color:#7c6f65; font-size:11px; font-weight:600; }
        .mr-price-pill .p strong { color:var(--accent); font-size:16px; letter-spacing:-.01em; }
        .mr-price-pill .div { width:1px; height:30px; background:color-mix(in srgb, var(--accent) 24%, white); }
        .mr-price-pill .djki { color:#16a34a; font-size:11px; font-weight:800; margin-left:auto; }
        @media (max-width:900px) { .mr-mascot-float { width:110px; right:-10px; top:-10px; } }

        .mr-eyebrow {
          display:inline-flex; padding:8px 14px; border-radius:999px;
          background:var(--accent-2); color:var(--accent);
          font-size:12px; font-weight:800; letter-spacing:.05em;
          margin-bottom:18px;
        }
        .mr-h1 {
          font-size:clamp(40px, 5.4vw, 62px); line-height:.98;
          letter-spacing:-.045em; margin:0 0 20px; font-weight:850;
        }
        .mr-h1 .accent { color:var(--accent); }
        .mr-lead { font-size:18px; line-height:1.6; color:#5f4e46; margin:0 0 30px; max-width:540px; }

        .mr-benefits {
          display:grid; grid-template-columns:repeat(3, 1fr); gap:12px;
          margin-bottom:32px;
        }
        .mr-benefit {
          padding:20px 18px; border-radius:18px; background:#fff;
          border:1px solid #eee5df;
          box-shadow:0 6px 18px rgba(255,106,45,.06);
        }
        .mr-benefit-icon {
          font-size:22px; margin-bottom:8px;
          width:38px; height:38px; border-radius:10px;
          background:var(--accent-2); display:grid; place-items:center;
        }
        .mr-benefit b { display:block; font-size:14px; letter-spacing:-.01em; }
        .mr-benefit span { display:block; color:#7c6f65; font-size:12.5px; margin-top:6px; line-height:1.5; }

        .mr-quote {
          font-size:22px; font-weight:700; color:#3a302b;
          max-width:520px; padding:20px 24px;
          border-left:4px solid var(--accent);
          background:linear-gradient(90deg, var(--accent-2), transparent);
          border-radius:0 12px 12px 0;
          margin-bottom:32px;
        }

        .mr-guarantee {
          display:inline-flex; align-items:center; gap:10px;
          padding:12px 18px; border-radius:14px;
          background:var(--accent-2); color:#8a3f18;
          font-size:13px; font-weight:800;
        }
        .mr-guarantee::before { content:"🏆"; font-size:18px; }

        .mr-chat-col { position:sticky; top:96px; }

        .mr-stats {
          display:grid; grid-template-columns:repeat(4, 1fr); gap:14px;
          margin-top:34px;
        }
        .mr-stat {
          background:#fff; border:1px solid #eee5df; border-radius:18px;
          padding:22px 20px;
        }
        .mr-stat strong { display:block; font-size:28px; color:var(--accent); letter-spacing:-.02em; }
        .mr-stat span { display:block; color:#7c6f65; font-size:13px; margin-top:6px; line-height:1.4; }

        .mr-bottom {
          display:grid; grid-template-columns:1.2fr .8fr; gap:20px;
          margin-top:26px;
        }
        .mr-card {
          background:#fff; border:1px solid #eee5df; border-radius:20px;
          box-shadow:0 10px 30px rgba(255,106,45,.05);
          padding:26px 28px;
        }
        .mr-mini-title { font-weight:800; font-size:18px; margin-bottom:8px; letter-spacing:-.01em; }
        .mr-info-p { font-size:14.5px; color:#5f4e46; line-height:1.6; margin:0; }
        .mr-price {
          display:flex; justify-content:space-between; align-items:baseline;
          padding:14px 0; border-top:1px dashed #eddccf;
        }
        .mr-price:first-of-type { border-top:0; }
        .mr-price strong { font-size:22px; color:var(--dark); letter-spacing:-.01em; }
        .mr-price-djki { font-size:12px; color:#16a34a; font-weight:700; margin-top:12px; }

        .mr-footer {
          padding:28px 42px; border-top:1px solid #eee5df;
          color:#7a6c62; font-size:12px;
          display:flex; justify-content:space-between; flex-wrap:wrap; gap:14px;
        }
        .mr-footer a { color:#5f4e46; text-decoration:none; margin:0 8px; }
        .mr-footer strong { color:#3a302b; }

        @media (max-width: 980px) {
          .mr-friendly { grid-template-columns:1fr; gap:30px; }
          .mr-chat-col { position:static; }
          .mr-benefits { grid-template-columns:1fr; }
          .mr-links, .mr-actions .mr-btn:first-child { display:none; }
          .mr-menu-btn { display:inline-flex; align-items:center; justify-content:center; }
          .mr-nav { padding:0 18px; }
          .mr-wrap { padding:28px 18px 40px; }
          .mr-h1 { font-size:40px; }
          .mr-stats { grid-template-columns:repeat(2,1fr); }
          .mr-bottom { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="mr-site">
        <TopStrip accent={ACCENT} />
        <header className="mr-nav">
          <a className="mr-brand" href="/">
            <div className="mr-logo">M</div>
            <div className="mr-brand-text">
              <strong>Merekin</strong>
              <span>Merek Dagang untuk UMKM</span>
            </div>
          </a>
          <nav className="mr-links">
            {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          </nav>
          <div className="mr-actions">
            <a className="mr-btn primary" href={waLink} target="_blank" rel="noopener noreferrer">♛ Konsultasi Gratis</a>
            <button className="mr-menu-btn" onClick={() => setMobileMenuOpen((v) => !v)} aria-label="Menu">☰</button>
          </div>
        </header>
        {mobileMenuOpen && (
          <nav style={{ padding: "12px 18px", background: "#fff", borderBottom: "1px solid #eee5df", display: "flex", flexDirection: "column", gap: 8 }}>
            {NAV.map((n) => <a key={n.href} href={n.href} style={{ padding: "10px 0", textDecoration: "none", color: "#524339", fontWeight: 600 }}>{n.label}</a>)}
          </nav>
        )}

        <div className="mr-wrap">
          <div className="mr-friendly">
            <section className="mr-story">
              <img className="mr-mascot-float" src="/variants/orange-umkm-merek/robot.webp" alt="" aria-hidden="true" width="160" height="160" />
              <span className="mr-eyebrow">Merek Kuat, UMKM Maju</span>
              <h1 className="mr-h1">Daftar Merek UMKM <span className="accent">Termurah</span><br />Mulai Rp 1,3 Juta</h1>
              <p className="mr-lead">Cek nama, dapatkan analisa, rekomendasi kelas produk/jasa, dan panduan pendaftaran — khusus UMKM Indonesia. Cepat, mudah, murah.</p>
              <div className="mr-price-pill">
                <div className="p">
                  <small>UMKM / Perorangan</small>
                  <strong>Rp 1.299.000<span style={{ fontSize: 11, color: "#7a849c", fontWeight: 600, marginLeft: 4 }}>/kelas</span></strong>
                </div>
                <div className="div"></div>
                <div className="p">
                  <small>Perusahaan / PT</small>
                  <strong>Rp 2.490.000<span style={{ fontSize: 11, color: "#7a849c", fontWeight: 600, marginLeft: 4 }}>/kelas</span></strong>
                </div>
                <span className="djki">✓ Termasuk DJKI</span>
              </div>

              <div className="mr-benefits">
                {BENEFITS.map((b) => (
                  <div key={b.title} className="mr-benefit">
                    <div className="mr-benefit-icon">{b.icon}</div>
                    <b>{b.title}</b>
                    <span>{b.desc}</span>
                  </div>
                ))}
              </div>

              <div className="mr-quote">&ldquo;Merek kecil hari ini, aset besar untuk masa depan bisnis Anda.&rdquo;</div>

              <div className="mr-guarantee">Garansi Termurah se-Indonesia — selisih diganti kalau ada yang lebih murah dengan cakupan setara.</div>
            </section>

            <section className="mr-chat-col">
              <ChatWidget
                brand={brand}
                brandName="Merekin"
                chatTitle="Chat AI Merekin"
                chatSubtitle="Untuk UMKM"
                onlineLabel="Online 24/7"
                initialGreeting={"Halo! 👋 Saya AI Merekin — siap bantu UMKM Indonesia lindungi mereknya.\n\nSaya bisa bantu cek nama, analisa, rekomendasi kelas produk/jasa, sampai panduan pendaftaran ke DJKI."}
                seedBubbles={["Mau mulai dengan apa hari ini?"]}
                quickActions={QUICK_ACTIONS}
                placeholder="Ketik nama brand UMKM Anda..."
                ctaLabel="Mulai Cek"
                bottomHint="✓ Gratis untuk UMKM"
                minHeight={620}
              />
            </section>
          </div>

          <div className="mr-stats">
            <div className="mr-stat"><strong>Rp 1,3jt</strong><span>Paket khusus UMKM per kelas</span></div>
            <div className="mr-stat"><strong>10.000+</strong><span>UMKM telah didampingi</span></div>
            <div className="mr-stat"><strong>3–5 hari</strong><span>Penyiapan dokumen</span></div>
            <div className="mr-stat"><strong>24/7</strong><span>Chat AI siap bantu</span></div>
          </div>

          <div className="mr-bottom">
            <div className="mr-card">
              <div className="mr-mini-title">Bingung mulai dari mana?</div>
              <p className="mr-info-p">AI Merekin memandu dari cek nama, analisa hasil, rekomendasi kelas, hingga panduan pendaftaran — semua dijelaskan langkah demi langkah dengan bahasa yang mudah dipahami pelaku UMKM.</p>
            </div>
            <div className="mr-card">
              <div className="mr-mini-title">Paket UMKM</div>
              <div className="mr-price"><span>UMKM / Perorangan</span><strong>Rp 1.299.000</strong></div>
              <div className="mr-price"><span>Perusahaan / PT</span><strong>Rp 2.490.000</strong></div>
              <div className="mr-price-djki">Sudah termasuk biaya DJKI / PNBP resmi</div>
            </div>
          </div>
        </div>

        <footer className="mr-footer">
          <div>
            <strong>Merekin</strong> dikelola oleh <strong>PT Ventera Intellix Group</strong> · © 2026 · info@hakio.id · 0851-4841-6800
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <a href="/cek-merek">Cek Merek</a>·
            <a href="/daftar-merek">Daftar</a>·
            <a href="/kelas-produk-jasa">Kelas</a>·
            <a href="/biaya">Biaya</a>·
            <a href="/perpanjang">Perpanjang</a>·
            <a href="/kontak">Kontak</a>
          </div>
        </footer>
      </div>
    </>
  );
}
