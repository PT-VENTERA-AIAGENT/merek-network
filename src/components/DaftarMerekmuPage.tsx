"use client";

import { useState } from "react";
import type { Brand } from "@/lib/brands";
import JsonLd from "./JsonLd";
import ChatWidget from "./ChatWidget";
import TopStripSlash from "./TopStripSlash";
import FloatingWA from "./FloatingWA";

/**
 * Distinct 5th layout — burgundy, transaksional, editorial-magazine feel:
 * - Nav: minimal dark navy dengan burgundy accent bar (sharp corners, no rounded)
 * - Hero: 2-column split (headline besar kiri, "action card" kanan)
 * - Below hero: full-width chat dengan glow
 * - Then: process ladder vertical
 * - Then: pricing comparison table
 * - Footer: dark
 */

const ACCENT = "#b91c1c";       // burgundy/red-700
const ACCENT_2 = "#fee2e2";     // red-100
const ACCENT_DEEP = "#7f1d1d";  // red-900
const DARK = "#111827";         // gray-900

const NAV = [
  { label: "Beranda", href: "/" },
  { label: "Cek Merek", href: "/cek-merek" },
  { label: "Daftar Sekarang", href: "/daftar-merek" },
  { label: "Kelas Produk/Jasa", href: "/kelas-produk-jasa" },
  { label: "Harga", href: "/biaya" },
  { label: "Panduan", href: "/perpanjang" },
  { label: "Blog", href: "/blog" },
];

const LADDER = [
  { n: "01", title: "Chat AI 1 Menit", desc: "Ketik nama merek. AI cek ketersediaan + rekomendasi kelas produk/jasa langsung." },
  { n: "02", title: "Lanjut ke WhatsApp", desc: "Admin verifikasi data, kirim quotation final dan link pembayaran." },
  { n: "03", title: "Bayar & Pengajuan DJKI", desc: "Setelah lunas, tim langsung ajukan permohonan ke DJKI dalam 1×24 jam." },
  { n: "04", title: "Monitoring Sampai Sertifikat", desc: "Update per tahap: pengumuman, substantif, sampai sertifikat elektronik keluar." },
];

const QUICK_ACTIONS = [
  { label: "Daftar Merek Sekarang", template: "Saya mau daftar merek dagang untuk bisnis: " },
  { label: "Cek Nama Merek", template: "Cek ketersediaan nama merek: " },
  { label: "Rekomendasi Kelas", template: "Rekomendasikan kelas produk/jasa untuk bisnis: " },
  { label: "Butuh Konsultasi", template: "Saya butuh konsultasi dulu sebelum mendaftar. Bisnis saya: " },
];

export default function DaftarMerekmuPage({ brand }: { brand: Brand }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const waLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Halo daftarmerekmu.com, saya mau konsultasi pendaftaran merek saya \"...\"")}`;

  return (
    <>
      <JsonLd brand={brand} />
      <style>{`
        :root {
          --accent:${ACCENT}; --accent-2:${ACCENT_2}; --accent-deep:${ACCENT_DEEP};
          --dark:${DARK}; --line:#e5e7eb;
        }
        html,body{margin:0;padding:0;overflow-x:hidden}
        body {
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background:#f9fafb; color:#111827;
        }
        .dm-site { min-height:100vh; }

        /* Navbar: SLIM, sharp corners, dark stripe accent underneath */
        .dm-nav {
          height:74px; display:flex; align-items:center; justify-content:space-between;
          padding:0 44px;
          background:#fff;
          position:sticky; top:0; z-index:20;
          border-bottom:none;
          box-shadow:0 1px 0 var(--line);
        }
        .dm-nav::after {
          content:""; position:absolute; left:0; right:0; bottom:0;
          height:3px;
          background:linear-gradient(90deg, var(--accent) 0 25%, transparent 25% 75%, var(--accent) 75% 100%);
        }
        .dm-brand { display:flex; align-items:center; gap:12px; text-decoration:none; color:inherit; }
        .dm-wordmark { height:40px; width:auto; display:block; }
        .dm-brand-fallback {
          display:flex; align-items:center; gap:10px;
          font-weight:900; font-size:18px; letter-spacing:-.02em; color:var(--dark);
        }
        .dm-brand-fallback::before {
          content:""; width:8px; height:32px; background:var(--accent); border-radius:2px;
        }
        .dm-brand-fallback span:last-child { color:var(--accent); }
        .dm-links {
          display:flex; gap:24px; font-size:13.5px; font-weight:700;
          color:#4b5563; letter-spacing:.005em;
        }
        .dm-links a { text-decoration:none; color:inherit; padding:8px 0; position:relative; }
        .dm-links a:hover { color:var(--accent); }
        .dm-cta {
          display:inline-flex; align-items:center; gap:8px;
          padding:11px 20px; border-radius:0;
          background:var(--accent); color:#fff;
          font-weight:800; font-size:13.5px; text-decoration:none;
          text-transform:uppercase; letter-spacing:.06em;
          box-shadow:4px 4px 0 var(--dark);
          transition:transform .1s;
        }
        .dm-cta:hover { transform:translate(-2px,-2px); box-shadow:6px 6px 0 var(--dark); }
        .dm-cta:active { transform:translate(0,0); box-shadow:2px 2px 0 var(--dark); }
        .dm-menu-btn { display:none; width:42px; height:42px; border-radius:0; border:2px solid var(--dark); background:#fff; cursor:pointer; font-size:20px; }

        .dm-wrap { max-width:1240px; margin:0 auto; padding:52px 44px 64px; }

        /* HERO: 2 kolom asymmetric */
        .dm-hero {
          display:grid; grid-template-columns:1.15fr .85fr; gap:44px;
          align-items:center; margin-bottom:60px;
        }
        .dm-eyebrow {
          display:inline-flex; align-items:center; gap:10px;
          font-family:'JetBrains Mono', 'SF Mono', Consolas, monospace;
          font-size:12px; font-weight:800;
          color:var(--accent); letter-spacing:.15em;
          margin-bottom:22px;
        }
        .dm-eyebrow::before {
          content:""; width:32px; height:2px; background:var(--accent);
        }
        .dm-h1 {
          font-size:clamp(44px, 6vw, 74px); line-height:.95;
          letter-spacing:-.045em; margin:0 0 20px;
          font-weight:900; color:var(--dark);
        }
        .dm-h1 .accent { color:var(--accent); }
        .dm-h1 .strike { text-decoration:line-through; text-decoration-thickness:6px; text-decoration-color:var(--accent); color:#9ca3af; font-size:.6em; margin-right:8px; }
        .dm-lead {
          font-size:18px; line-height:1.6; color:#4b5563; margin:0 0 28px; max-width:520px;
        }
        .dm-hero-metrics {
          display:flex; gap:24px; padding:20px 0;
          border-top:1px solid var(--line); border-bottom:1px solid var(--line);
        }
        .dm-metric strong {
          display:block; font-size:28px; font-weight:900; color:var(--dark); letter-spacing:-.02em;
          font-family:'JetBrains Mono', 'SF Mono', Consolas, monospace;
        }
        .dm-metric span { color:#6b7280; font-size:12px; font-weight:600; }

        /* Action card kanan */
        .dm-action-card {
          background:var(--dark); color:#fff;
          padding:36px 32px;
          border-radius:0;
          position:relative;
          box-shadow:12px 12px 0 var(--accent);
        }
        .dm-action-card::before {
          content:"OFFER"; position:absolute; top:-14px; left:24px;
          background:var(--accent); color:#fff; padding:4px 14px;
          font-family:'JetBrains Mono', monospace; font-size:11px;
          font-weight:900; letter-spacing:.15em;
        }
        .dm-action-title {
          font-size:18px; font-weight:900; margin-bottom:6px; letter-spacing:-.02em;
        }
        .dm-action-sub { font-size:13px; color:#9ca3af; margin-bottom:22px; }
        .dm-price-row {
          display:flex; align-items:baseline; justify-content:space-between;
          padding:14px 0; border-bottom:1px dashed #374151;
        }
        .dm-price-row:last-of-type { border-bottom:0; }
        .dm-price-label { color:#e5e7eb; font-size:13px; font-weight:600; }
        .dm-price-value {
          display:flex; flex-direction:column; align-items:flex-end; gap:2px;
        }
        .dm-price-crossed {
          text-decoration:line-through;
          text-decoration-thickness:2px;
          text-decoration-color:var(--accent);
          color:#6b7280;
          font-size:14px;
          font-family:'JetBrains Mono', 'SF Mono', Consolas, monospace;
        }
        .dm-price-final {
          font-size:20px; font-weight:900; color:#fff;
          font-family:'JetBrains Mono', 'SF Mono', Consolas, monospace;
          letter-spacing:-.01em;
        }
        .dm-djki { margin-top:14px; padding:10px 12px; background:rgba(52,211,153,.15); color:#34d399; font-size:11px; font-weight:800; letter-spacing:.05em; }

        /* Chat section full-width */
        .dm-chat-section {
          margin:0 0 64px;
        }
        .dm-chat-eyebrow {
          font-family:'JetBrains Mono', monospace;
          font-size:12px; font-weight:800; letter-spacing:.15em;
          color:var(--accent); margin-bottom:14px;
          display:flex; align-items:center; gap:10px;
        }
        .dm-chat-eyebrow::before {
          content:""; width:32px; height:2px; background:var(--accent);
        }
        .dm-chat-title {
          font-size:36px; line-height:1.02; letter-spacing:-.03em;
          font-weight:900; color:var(--dark); margin:0 0 24px; max-width:640px;
        }

        /* Ladder proses vertical */
        .dm-ladder {
          margin-bottom:64px;
        }
        .dm-ladder-list {
          display:grid; grid-template-columns:repeat(4, 1fr); gap:2px;
          background:var(--line);
          border:1px solid var(--line);
        }
        .dm-step {
          background:#fff; padding:28px 24px;
          transition:background .15s;
          position:relative;
        }
        .dm-step:hover { background:var(--accent-2); }
        .dm-step-n {
          font-family:'JetBrains Mono', monospace;
          font-size:52px; font-weight:900; color:var(--accent);
          line-height:1; letter-spacing:-.04em; margin-bottom:14px;
        }
        .dm-step h3 { font-size:15px; font-weight:900; margin:0 0 8px; letter-spacing:-.01em; }
        .dm-step p { font-size:13px; color:#6b7280; line-height:1.5; margin:0; }

        /* Footer */
        .dm-footer {
          background:var(--dark); color:#9ca3af;
          padding:36px 44px; margin-top:0;
          border-top:4px solid var(--accent);
        }
        .dm-footer-inner {
          max-width:1240px; margin:0 auto;
          display:flex; flex-wrap:wrap; justify-content:space-between; gap:16px;
          font-size:12.5px; font-weight:600;
        }
        .dm-footer strong { color:#fff; }
        .dm-footer a { color:#e5e7eb; text-decoration:none; margin-right:16px; }
        .dm-footer a:hover { color:var(--accent); }

        @media (max-width:980px) {
          .dm-hero { grid-template-columns:1fr; gap:32px; }
          .dm-ladder-list { grid-template-columns:repeat(2, 1fr); }
          .dm-links, .dm-menu-btn { display:none; }
          .dm-menu-btn { display:inline-flex; align-items:center; justify-content:center; }
          .dm-wrap { padding:32px 20px 40px; }
          .dm-nav { padding:0 20px; }
        }
        @media (max-width:680px) {
          .dm-ladder-list { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="dm-site">
        <TopStripSlash accent={ACCENT} />
        <header className="dm-nav">
          <a className="dm-brand" href="/" aria-label="daftarmerekmu.com">
            <div className="dm-brand-fallback">
              <span>daftarmerekmu</span>
              <span>.com</span>
            </div>
          </a>
          <nav className="dm-links">
            {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          </nav>
          <a className="dm-cta" href={waLink} target="_blank" rel="noopener noreferrer">Konsultasi Gratis →</a>
        </header>

        <div className="dm-wrap">
          {/* HERO */}
          <section className="dm-hero">
            <div>
              <div className="dm-eyebrow">DAFTAR MEREK DAGANG · TERMURAH DIJAMIN</div>
              <h1 className="dm-h1">
                Daftar Merek Dagang<br />
                <span className="strike">Rp 2.500rb</span><span className="accent">Rp 1.299rb</span>
              </h1>
              <p className="dm-lead">Semua sudah termasuk biaya DJKI resmi. Chat AI 1 menit, admin verifikasi, langsung bayar dan diajukan. Tanpa datang ke kantor.</p>
              <div className="dm-hero-metrics">
                <div className="dm-metric">
                  <strong>10.000+</strong>
                  <span>Merek terdaftar</span>
                </div>
                <div className="dm-metric">
                  <strong>1×24j</strong>
                  <span>Ajukan ke DJKI</span>
                </div>
                <div className="dm-metric">
                  <strong>100%</strong>
                  <span>Garansi harga</span>
                </div>
              </div>
            </div>

            {/* Action card kanan */}
            <div className="dm-action-card">
              <div className="dm-action-title">Harga Paket Merek</div>
              <div className="dm-action-sub">Sudah termasuk biaya PNBP DJKI resmi.</div>
              <div className="dm-price-row">
                <div className="dm-price-label">UMKM / Perorangan</div>
                <div className="dm-price-value">
                  <span className="dm-price-crossed">Rp 2.500.000</span>
                  <span className="dm-price-final">Rp 1.299.000</span>
                </div>
              </div>
              <div className="dm-price-row">
                <div className="dm-price-label">Perusahaan / PT</div>
                <div className="dm-price-value">
                  <span className="dm-price-crossed">Rp 3.950.000</span>
                  <span className="dm-price-final">Rp 2.490.000</span>
                </div>
              </div>
              <div className="dm-djki">✓ TERMASUK BIAYA DJKI / PNBP RESMI</div>
            </div>
          </section>

          {/* Chat section — full width, glow */}
          <section className="dm-chat-section">
            <div className="dm-chat-eyebrow">AI CHAT · 24/7 · GRATIS</div>
            <h2 className="dm-chat-title">Ketik nama merek Anda. AI akan cek ketersediaan + rekomendasi kelas dalam 1 menit.</h2>
            <ChatWidget
              brand={brand}
              brandName="daftarmerekmu.com"
              chatTitle="AI daftarmerekmu.com"
              chatSubtitle="1-MENIT SETUP"
              onlineLabel="Online 24/7"
              initialGreeting={"Halo! 👋 Saya AI daftarmerekmu.com — bantu Anda daftar merek dagang dalam 1 menit setup awal.\n\nKetik nama brand yang mau didaftarkan, saya akan cek ketersediaan di database PDKI/DJKI + rekomendasi kelas produk/jasa yang tepat."}
              quickActions={QUICK_ACTIONS}
              placeholder="Ketik nama merek Anda..."
              ctaLabel="Mulai"
              bottomHint="⚡ Rata-rata 1 menit sampai admin verifikasi lewat WA"
              minHeight={620}
            />
          </section>

          {/* Ladder */}
          <section className="dm-ladder">
            <div className="dm-chat-eyebrow">4 LANGKAH · SIAP SERTIFIKAT</div>
            <h2 className="dm-chat-title">Dari chat AI sampai sertifikat DJKI keluar.</h2>
            <div className="dm-ladder-list">
              {LADDER.map((s) => (
                <div key={s.n} className="dm-step">
                  <div className="dm-step-n">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="dm-footer">
          <div className="dm-footer-inner">
            <div>
              <strong>daftarmerekmu.com</strong> dikelola oleh <strong>PT Sellora Optima Teknologi</strong><br />
              🏆 Garansi termurah — selisih diganti · info@hakio.id · 0851-4841-6800
            </div>
            <div>
              <a href="/cek-merek">Cek</a>
              <a href="/daftar-merek">Daftar</a>
              <a href="/kelas-produk-jasa">Kelas</a>
              <a href="/biaya">Biaya</a>
              <a href="/perpanjang">Perpanjang</a>
              <a href="/kontak">Kontak</a>
            </div>
          </div>
        </footer>

        <FloatingWA domain="daftarmerekmu.com" whatsappNumber={brand.whatsapp} accent={ACCENT} label="Chat Daftar" />
      </div>
    </>
  );
}
