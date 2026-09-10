"use client";

import { useState } from "react";
import type { Brand } from "@/lib/brands";
import JsonLd from "./JsonLd";
import ChatWidget from "./ChatWidget";
import { TopStripBubble } from "./TopStrips";
import FloatingWA from "./FloatingWA";

const ACCENT = "#7657ff";
const ACCENT_2 = "#eee8ff";

const NAV = [
  { label: "Beranda", href: "/" },
  { label: "Cek Merek", href: "/cek-merek" },
  { label: "Analisa", href: "/kelas-produk-jasa" },
  { label: "Daftar Merek", href: "/daftar-merek" },
  { label: "Harga", href: "/biaya" },
  { label: "Panduan", href: "/perpanjang" },
  { label: "Blog", href: "/blog" },
];

const QUICK_ACTIONS = [
  { label: "Analisa Merek", template: "Tolong analisa merek saya: " },
  { label: "Cek Nama", template: "Saya mau cek ketersediaan nama merek: " },
  { label: "Rekomendasi Kelas", template: "Tolong rekomendasikan kelas produk/jasa untuk bisnis saya: " },
  { label: "Estimasi Biaya", template: "Berapa estimasi biaya total untuk mendaftarkan merek dagang saya?" },
];

const CLASSES = ["Kelas 35", "Kelas 38", "Kelas 42"];

const BARS = [32, 48, 68, 88];

export default function HKIMerekPage({ brand }: { brand: Brand }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const waLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Halo HKIMerek! Saya ingin konsultasi analisa merek dan HKI.")}`;

  return (
    <>
      <JsonLd brand={brand} />
      <style>{`
        :root { --accent:${ACCENT}; --accent-2:${ACCENT_2}; --dark:#17204a; --soft:#fbf9ff; --line:#e7ebf3; }
        html,body{margin:0;padding:0;overflow-x:hidden}
        body {
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background:#f5f7fb; color:var(--dark);
        }
        .hk-site { min-height:100vh; background:linear-gradient(180deg,#fff,var(--soft)); }
        /* Navbar HKIMerek: PILL — floating with big rounded corners, gap sides */
        .hk-nav {
          margin:14px 22px 0;
          height:72px; display:flex; align-items:center; justify-content:space-between;
          padding:0 26px;
          background:rgba(255,255,255,.92); border-radius:999px;
          box-shadow:0 8px 28px rgba(118,87,255,.14), 0 1px 0 rgba(118,87,255,.08) inset;
          position:sticky; top:14px; z-index:20; backdrop-filter:blur(14px);
        }
        .hk-brand { display:flex; align-items:center; gap:12px; text-decoration:none; color:inherit; }
        .hk-wordmark { height:40px; width:auto; display:block; }
        .hk-btn { border-radius:999px; }
        .hk-btn.primary { border-radius:999px; }
        .hk-links { display:flex; gap:24px; color:#425173; font-size:14px; font-weight:600; }
        .hk-links a { text-decoration:none; color:inherit; padding:8px 0; }
        .hk-links a:hover { color:var(--accent); }
        .hk-actions { display:flex; gap:10px; align-items:center; }
        .hk-btn {
          border-radius:12px; padding:11px 16px; border:1px solid #dfe5ef;
          background:#fff; font-weight:700; text-decoration:none; color:inherit;
          font-size:14px; display:inline-flex; align-items:center; gap:8px;
        }
        .hk-btn.primary {
          background:var(--accent); border-color:var(--accent); color:#fff;
          box-shadow:0 10px 20px color-mix(in srgb, var(--accent) 25%, transparent);
        }
        .hk-menu-btn { display:none; width:42px; height:42px; border-radius:10px; border:1px solid #dfe5ef; background:#fff; cursor:pointer; }

        .hk-wrap { max-width:1260px; margin:0 auto; padding:40px 28px 60px; }

        .hk-dash {
          display:grid; grid-template-columns:1.1fr .9fr; gap:26px;
          align-items:start;
        }

        .hk-left { display:flex; flex-direction:column; position:relative; }
        .hk-mascot-float {
          position:absolute; right:-40px; top:-24px;
          width:140px; height:140px; z-index:2;
          filter:drop-shadow(0 18px 30px rgba(118,87,255,.28));
          animation:hkFloat 4.5s ease-in-out infinite;
          pointer-events:none;
        }
        @keyframes hkFloat { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-8px) rotate(3deg)} }
        .hk-price-pill {
          display:inline-flex; align-items:center; gap:14px;
          padding:12px 18px; border-radius:14px;
          background:linear-gradient(135deg, var(--accent-2), color-mix(in srgb, var(--accent) 6%, white));
          border:1px solid color-mix(in srgb, var(--accent) 24%, white);
          margin:12px 0 24px;
          font-size:14px; font-weight:700;
        }
        .hk-price-pill .p { display:flex; flex-direction:column; }
        .hk-price-pill .p small { color:#5a5480; font-size:11px; font-weight:600; }
        .hk-price-pill .p strong { color:var(--accent); font-size:16px; letter-spacing:-.01em; }
        .hk-price-pill .div { width:1px; height:30px; background:color-mix(in srgb, var(--accent) 22%, white); }
        .hk-price-pill .djki { color:#16a34a; font-size:11px; font-weight:800; margin-left:auto; }
        @media (max-width:900px) { .hk-mascot-float { width:100px; right:-10px; top:-10px; } }

        .hk-eyebrow {
          display:inline-flex; padding:8px 14px; border-radius:999px;
          background:var(--accent-2); color:var(--accent);
          font-size:12px; font-weight:800; letter-spacing:.05em;
          margin-bottom:16px; align-self:flex-start;
        }
        .hk-h1 {
          font-size:clamp(36px, 4.6vw, 56px); line-height:1.02;
          letter-spacing:-.04em; margin:0 0 18px; font-weight:850;
        }
        .hk-h1 .accent { color:var(--accent); }
        .hk-lead { font-size:17px; line-height:1.6; color:#5f6c87; margin:0 0 28px; max-width:640px; }

        .hk-widgets { display:grid; gap:16px; align-self:start; }
        .hk-widget {
          background:#fff; border:1px solid #e7ebf3; border-radius:20px;
          box-shadow:0 10px 30px rgba(18,39,82,.05);
          padding:22px 24px;
        }
        .hk-widget-title {
          font-weight:800; font-size:14px; letter-spacing:-.01em;
          color:#425173; margin-bottom:14px;
          display:flex; align-items:center; gap:8px;
        }
        .hk-widget-title::before {
          content:""; display:inline-block; width:8px; height:8px; border-radius:2px;
          background:var(--accent);
        }

        .hk-gauge { display:grid; place-items:center; gap:14px; }
        .hk-ring {
          width:180px; height:180px; border-radius:50%;
          background:conic-gradient(var(--accent) 0 28%, #e9edf7 28% 100%);
          display:grid; place-items:center; position:relative;
        }
        .hk-ring::after {
          content:""; position:absolute; inset:0; border-radius:50%;
          box-shadow:inset 0 4px 10px rgba(0,0,0,.04);
          pointer-events:none;
        }
        .hk-ring-inner {
          width:130px; height:130px; border-radius:50%; background:#fff;
          display:grid; place-items:center; font-size:34px; font-weight:900;
          color:var(--dark); letter-spacing:-.02em;
          box-shadow:0 4px 14px rgba(0,0,0,.06);
        }
        .hk-gauge-label {
          font-size:13px; font-weight:800; color:#0f5c3c;
          padding:6px 14px; border-radius:999px;
          background:#e3f8ee;
        }

        .hk-class-main {
          padding:22px; border-radius:16px;
          background:linear-gradient(135deg, var(--accent-2), color-mix(in srgb, var(--accent-2) 60%, white));
          color:var(--accent);
          font-size:32px; font-weight:900; letter-spacing:-.02em;
          text-align:center;
        }
        .hk-class-main small { display:block; font-size:12px; font-weight:700; color:#7c72a8; margin-top:6px; }
        .hk-chips { display:flex; flex-wrap:wrap; gap:8px; margin-top:14px; }
        .hk-chips span {
          padding:8px 12px; border-radius:999px;
          background:#f5f6fb; font-size:12px; font-weight:700; color:#425173;
        }

        .hk-bars { height:150px; display:flex; align-items:flex-end; gap:12px; }
        .hk-bar {
          flex:1; border-radius:10px 10px 3px 3px;
          background:linear-gradient(180deg, var(--accent-2), var(--accent));
          position:relative;
        }
        .hk-bars-legend { display:flex; justify-content:space-between; margin-top:8px; font-size:11px; color:#7a849c; font-weight:600; }

        .hk-stats {
          display:grid; grid-template-columns:repeat(4, 1fr); gap:14px;
          margin-top:28px;
        }
        .hk-stat {
          background:#fff; border:1px solid #e7ebf3; border-radius:18px;
          padding:22px 20px;
        }
        .hk-stat strong {
          display:block; font-size:28px; color:var(--accent);
          letter-spacing:-.02em;
        }
        .hk-stat span { display:block; color:#73809a; font-size:13px; margin-top:6px; line-height:1.4; }

        .hk-footer {
          padding:28px 42px; border-top:1px solid #e8edf4;
          color:#7a849c; font-size:12px;
          display:flex; justify-content:space-between; flex-wrap:wrap; gap:14px;
        }
        .hk-footer a { color:#5f6b8b; text-decoration:none; margin:0 8px; }
        .hk-footer strong { color:#425173; }

        @media (max-width: 980px) {
          .hk-dash { grid-template-columns:1fr; }
          .hk-links, .hk-actions .hk-btn:first-child { display:none; }
          .hk-menu-btn { display:inline-flex; align-items:center; justify-content:center; }
          .hk-nav { padding:0 18px; }
          .hk-wrap { padding:24px 18px 40px; }
          .hk-h1 { font-size:36px; }
          .hk-stats { grid-template-columns:repeat(2,1fr); }
        }
      `}</style>

      <div className="hk-site">
        <TopStripBubble accent={ACCENT} />
        <header className="hk-nav">
          <a className="hk-brand" href="/" aria-label="HKIMerek">
            <img className="hk-wordmark" src="/variants/purple-analisa-merek/logo-wordmark.webp" alt="HKIMerek — Analisa & Edukasi HKI" width="160" height="40" />
          </a>
          <nav className="hk-links">
            {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          </nav>
          <div className="hk-actions">
            <a className="hk-btn primary" href={waLink} target="_blank" rel="noopener noreferrer">♛ Konsultasi Gratis</a>
            <button className="hk-menu-btn" onClick={() => setMobileMenuOpen((v) => !v)} aria-label="Menu">☰</button>
          </div>
        </header>
        {mobileMenuOpen && (
          <nav style={{ padding: "12px 18px", background: "#fff", borderBottom: "1px solid #e8edf4", display: "flex", flexDirection: "column", gap: 8 }}>
            {NAV.map((n) => <a key={n.href} href={n.href} style={{ padding: "10px 0", textDecoration: "none", color: "#425173", fontWeight: 600 }}>{n.label}</a>)}
          </nav>
        )}

        <div className="hk-wrap">
          <div className="hk-dash">
            <div className="hk-left">
              <img className="hk-mascot-float" src="/variants/purple-analisa-merek/robot.webp" alt="" aria-hidden="true" width="140" height="140" />
              <span className="hk-eyebrow">Analisa Merek Berbasis AI</span>
              <h1 className="hk-h1">Analisa & Daftar Merek <span className="accent">Termurah</span><br />Berbasis Data Resmi DJKI</h1>
              <p className="hk-lead">Cek nama merek, analisa kemiripan visual & fonetik, rekomendasi kelas produk/jasa, dan insight strategis berdasarkan database resmi DJKI — semua dalam satu platform.</p>
              <div className="hk-price-pill">
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

              <ChatWidget
                brand={brand}
                brandName="HKIMerek"
                chatTitle="HKIMerek AI Analytics"
                chatSubtitle="Analisa"
                onlineLabel="Online • 24/7"
                initialGreeting={"Tulis nama merek yang ingin Anda analisa. Saya akan cek kemiripan, rekomendasikan kelas produk/jasa (NICE), dan berikan insight berbasis data resmi DJKI."}
                quickActions={QUICK_ACTIONS}
                placeholder="Tulis nama merek yang mau dianalisa..."
                ctaLabel="Mulai Analisa"
                minHeight={580}
              />
            </div>

            <aside className="hk-widgets">
              <div className="hk-widget">
                <div className="hk-widget-title">Tingkat Kemiripan (contoh)</div>
                <div className="hk-gauge">
                  <div className="hk-ring">
                    <div className="hk-ring-inner">28%</div>
                  </div>
                  <div className="hk-gauge-label">Risiko Rendah</div>
                </div>
              </div>

              <div className="hk-widget">
                <div className="hk-widget-title">Rekomendasi Kelas Produk/Jasa</div>
                <div className="hk-class-main">Kelas 9<small>Perangkat Lunak & Aplikasi</small></div>
                <div className="hk-chips">
                  {CLASSES.map((c) => <span key={c}>{c}</span>)}
                </div>
              </div>

              <div className="hk-widget">
                <div className="hk-widget-title">Tren Pendaftaran Merek (2022–2025)</div>
                <div className="hk-bars">
                  {BARS.map((h, i) => (
                    <div key={i} className="hk-bar" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="hk-bars-legend">
                  <span>2022</span><span>2023</span><span>2024</span><span>2025</span>
                </div>
              </div>
            </aside>
          </div>

          <div className="hk-stats">
            <div className="hk-stat"><strong>45 kelas</strong><span>NICE dianalisa AI</span></div>
            <div className="hk-stat"><strong>99%</strong><span>Akurasi data terbaru DJKI</span></div>
            <div className="hk-stat"><strong>1 detik</strong><span>Indikasi awal ketersediaan</span></div>
            <div className="hk-stat"><strong>24/7</strong><span>Konsultasi HKI bersama AI</span></div>
          </div>
        </div>

        <footer className="hk-footer">
          <div>
            <strong>HKIMerek</strong> dikelola oleh <strong>PT Sellora Optima Teknologi</strong> · © 2026 · info@hakio.id · 0851-4841-6800
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
        <FloatingWA domain="hkimerek.com" whatsappNumber={brand.whatsapp} accent={ACCENT} label="Chat HKIMerek" />
      </div>
    </>
  );
}
