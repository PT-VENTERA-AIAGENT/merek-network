"use client";

import { useState } from "react";
import type { Brand } from "@/lib/brands";
import JsonLd from "./JsonLd";
import ChatWidget from "./ChatWidget";

const ACCENT = "#0b8d68";
const ACCENT_2 = "#dff8ef";

const NAV = [
  { label: "Beranda", href: "/" },
  { label: "Cek Merek", href: "/cek-merek" },
  { label: "Daftar Merek", href: "/daftar-merek" },
  { label: "Kelas Produk/Jasa", href: "/kelas-produk-jasa" },
  { label: "Harga", href: "/biaya" },
  { label: "Panduan", href: "/perpanjang" },
  { label: "Blog", href: "/blog" },
];

const PROCESS = [
  { n: 1, title: "Konsultasi & Cek Nama", desc: "Pastikan nama merek tersedia sebelum daftar." },
  { n: 2, title: "Analisa Risiko", desc: "Cek kemiripan dan risiko penolakan." },
  { n: 3, title: "Rekomendasi Kelas", desc: "Pilih kelas produk/jasa yang tepat." },
  { n: 4, title: "Daftar Merek", desc: "Tim bantu sampai permohonan masuk DJKI." },
];

const QUICK_ACTIONS = [
  { label: "Daftar Merek", template: "Saya ingin daftar merek dagang, tolong bantu prosesnya untuk bisnis: " },
  { label: "Cek Nama", template: "Saya mau cek ketersediaan nama merek: " },
  { label: "Rekomendasi Kelas", template: "Tolong rekomendasikan kelas produk/jasa untuk bisnis saya: " },
  { label: "Estimasi Biaya", template: "Berapa estimasi biaya total untuk mendaftarkan merek dagang saya?" },
];

export default function HakiMerekPage({ brand }: { brand: Brand }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const waLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Halo HakiMerek! Saya ingin konsultasi pendaftaran merek dagang.")}`;

  return (
    <>
      <JsonLd brand={brand} />
      <style>{`
        :root { --accent:${ACCENT}; --accent-2:${ACCENT_2}; --dark:#0b2a27; --soft:#f7fffb; --line:#e7ebf3; }
        html,body{margin:0;padding:0;overflow-x:hidden}
        body {
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background:#f5f7fb; color:var(--dark);
        }
        .hm-site { min-height:100vh; background:linear-gradient(180deg,#fff,var(--soft)); }
        .hm-nav {
          height:78px; display:flex; align-items:center; justify-content:space-between;
          padding:0 42px; border-bottom:1px solid rgba(14,34,75,.08);
          background:rgba(255,255,255,.9); position:sticky; top:0; z-index:20; backdrop-filter:blur(12px);
        }
        .hm-brand { display:flex; align-items:center; gap:12px; text-decoration:none; color:inherit; }
        .hm-logo {
          width:42px; height:42px; border-radius:12px;
          background:linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 75%, #17204a));
          display:grid; place-items:center; color:#fff; font-weight:900; font-size:22px;
          box-shadow:0 8px 20px color-mix(in srgb, var(--accent) 20%, transparent);
        }
        .hm-brand-text strong { display:block; font-size:20px; letter-spacing:-.02em; }
        .hm-brand-text span { display:block; color:#7a849c; font-size:11px; margin-top:2px; }
        .hm-links { display:flex; gap:26px; color:#425173; font-size:14px; font-weight:600; }
        .hm-links a { text-decoration:none; color:inherit; padding:8px 0; }
        .hm-links a:hover { color:var(--accent); }
        .hm-actions { display:flex; gap:10px; align-items:center; }
        .hm-btn {
          border-radius:12px; padding:11px 16px; border:1px solid #dfe5ef;
          background:#fff; font-weight:700; text-decoration:none; color:inherit;
          font-size:14px; display:inline-flex; align-items:center; gap:8px;
        }
        .hm-btn.primary {
          background:var(--accent); border-color:var(--accent); color:#fff;
          box-shadow:0 10px 20px color-mix(in srgb, var(--accent) 25%, transparent);
        }
        .hm-menu-btn { display:none; width:42px; height:42px; border-radius:10px; border:1px solid #dfe5ef; background:#fff; cursor:pointer; }

        .hm-wrap { max-width:1240px; margin:0 auto; padding:44px 28px 60px; }

        .hm-intro-center { text-align:center; display:flex; flex-direction:column; align-items:center; margin-bottom:30px; }
        .hm-eyebrow {
          display:inline-flex; padding:8px 14px; border-radius:999px;
          background:var(--accent-2); color:var(--accent);
          font-size:12px; font-weight:800; letter-spacing:.05em;
          margin-bottom:16px;
        }
        .hm-h1 {
          font-size:clamp(38px, 5vw, 60px); line-height:1;
          letter-spacing:-.045em; margin:0 0 20px; max-width:900px; font-weight:850;
        }
        .hm-lead { font-size:18px; line-height:1.6; color:#5f6c87; max-width:820px; margin:0; }

        .hm-process-row {
          display:grid; grid-template-columns:repeat(4, 1fr); gap:12px;
          margin:32px 0 26px;
        }
        .hm-process {
          display:flex; gap:14px; align-items:flex-start;
          padding:18px; border-radius:18px; background:#fff; border:1px solid #e7ebf3;
        }
        .hm-process-n {
          width:36px; height:36px; border-radius:50%;
          display:grid; place-items:center; background:#eef2f7;
          font-weight:800; flex-shrink:0;
        }
        .hm-process.active { background:var(--accent-2); border-color:color-mix(in srgb, var(--accent) 25%, white); }
        .hm-process.active .hm-process-n { background:var(--accent); color:#fff; }
        .hm-process b { display:block; font-size:14px; letter-spacing:-.01em; }
        .hm-process small { display:block; color:#7a849c; margin-top:4px; line-height:1.4; font-size:12.5px; }

        .hm-main-chat { max-width:900px; margin:0 auto; }

        .hm-below {
          display:grid; grid-template-columns:1.2fr .8fr; gap:20px;
          margin-top:26px;
        }
        .hm-card {
          background:#fff; border:1px solid #e7ebf3; border-radius:20px;
          box-shadow:0 10px 30px rgba(18,39,82,.05);
          padding:26px 28px;
        }
        .hm-mini-title { font-weight:800; font-size:18px; margin-bottom:8px; letter-spacing:-.01em; }
        .hm-info-p { font-size:14.5px; color:#5f6c87; line-height:1.6; margin:0 0 16px; }
        .hm-price {
          display:flex; justify-content:space-between; align-items:baseline;
          padding:14px 0; border-top:1px dashed #dfe4ee;
        }
        .hm-price:first-of-type { border-top:0; }
        .hm-price strong { font-size:22px; color:var(--dark); letter-spacing:-.01em; }
        .hm-price-djki { font-size:12px; color:#16a34a; font-weight:700; margin-top:12px; }

        .hm-footer {
          padding:28px 42px; border-top:1px solid #e8edf4;
          color:#7a849c; font-size:12px;
          display:flex; justify-content:space-between; flex-wrap:wrap; gap:14px;
        }
        .hm-footer a { color:#5f6b8b; text-decoration:none; margin:0 8px; }
        .hm-footer .sep { color:#c8cee0; }
        .hm-footer strong { color:#425173; }

        @media (max-width: 980px) {
          .hm-links, .hm-actions .hm-btn:first-child { display:none; }
          .hm-menu-btn { display:inline-flex; align-items:center; justify-content:center; }
          .hm-nav { padding:0 18px; }
          .hm-wrap { padding:28px 18px 40px; }
          .hm-process-row { grid-template-columns:repeat(2,1fr); }
          .hm-below { grid-template-columns:1fr; }
          .hm-h1 { font-size:38px; }
        }
        @media (max-width: 680px) {
          .hm-process-row { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="hm-site">
        <header className="hm-nav">
          <a className="hm-brand" href="/">
            <div className="hm-logo">H</div>
            <div className="hm-brand-text">
              <strong>HakiMerek</strong>
              <span>Jasa Pendaftaran Merek</span>
            </div>
          </a>
          <nav className="hm-links">
            {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          </nav>
          <div className="hm-actions">
            <a className="hm-btn" href="/kontak">Masuk</a>
            <a className="hm-btn primary" href={waLink} target="_blank" rel="noopener noreferrer">♛ Konsultasi</a>
            <button className="hm-menu-btn" onClick={() => setMobileMenuOpen((v) => !v)} aria-label="Menu">☰</button>
          </div>
        </header>
        {mobileMenuOpen && (
          <nav style={{ padding: "12px 18px", background: "#fff", borderBottom: "1px solid #e8edf4", display: "flex", flexDirection: "column", gap: 8 }}>
            {NAV.map((n) => <a key={n.href} href={n.href} style={{ padding: "10px 0", textDecoration: "none", color: "#425173", fontWeight: 600 }}>{n.label}</a>)}
          </nav>
        )}

        <div className="hm-wrap">
          <section className="hm-intro-center">
            <span className="hm-eyebrow">Pendampingan Pendaftaran Merek</span>
            <h1 className="hm-h1">Daftarkan Merek Anda<br />dengan Pendampingan Ahli</h1>
            <p className="hm-lead">Cek ketersediaan nama, analisa risiko, rekomendasi kelas produk/jasa, hingga pendaftaran ke DJKI — semua didampingi konsultan berpengalaman. Anda cukup fokus jualan.</p>
          </section>

          <section className="hm-process-row">
            {PROCESS.map((p, i) => (
              <div key={p.n} className={`hm-process${i === 0 ? " active" : ""}`}>
                <span className="hm-process-n">{p.n}</span>
                <div>
                  <b>{p.title}</b>
                  <small>{p.desc}</small>
                </div>
              </div>
            ))}
          </section>

          <div className="hm-main-chat">
            <ChatWidget
              brand={brand}
              brandName="HakiMerek"
              chatTitle="Konsultasi Merek bersama HakiMerek"
              chatSubtitle="Didampingi Tim Ahli"
              onlineLabel="Online"
              initialGreeting={"Halo! 👋 Saya asisten AI HakiMerek. Ketik nama merek yang ingin didaftarkan — **100% gratis** untuk konsultasi awal.\n\nSaya bantu cek ketersediaan di database PDKI/DJKI, rekomendasi kelas produk/jasa, dan estimasi biaya pendaftaran."}
              seedBubbles={["Atau pilih menu di bawah untuk memulai."]}
              quickActions={QUICK_ACTIONS}
              placeholder="Tulis nama merek Anda di sini..."
              ctaLabel="Mulai"
              minHeight={620}
            />
          </div>

          <div className="hm-below">
            <div className="hm-card">
              <div className="hm-mini-title">Tidak yakin merek Anda layak didaftarkan?</div>
              <p className="hm-info-p">Konsultasikan langsung dengan konsultan kami untuk analisa awal, saran kelas, dan strategi pendaftaran yang paling efektif untuk bisnis Anda.</p>
              <a className="hm-btn primary" href={waLink} target="_blank" rel="noopener noreferrer">💬 Chat via WhatsApp</a>
            </div>
            <div className="hm-card">
              <div className="hm-mini-title">Biaya Pendaftaran Merek</div>
              <div className="hm-price"><span>UMKM / Perorangan</span><strong>Rp 1.299.000</strong></div>
              <div className="hm-price"><span>Perusahaan / PT</span><strong>Rp 2.490.000</strong></div>
              <div className="hm-price-djki">Sudah termasuk biaya DJKI / PNBP resmi + jasa pengurusan</div>
            </div>
          </div>
        </div>

        <footer className="hm-footer">
          <div>
            <strong>HakiMerek</strong> dikelola oleh <strong>PT Ventera Intellix Group</strong> · © 2026 · info@hakio.id · 0851-4841-6800
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <a href="/cek-merek">Cek Merek</a><span className="sep">·</span>
            <a href="/daftar-merek">Daftar</a><span className="sep">·</span>
            <a href="/kelas-produk-jasa">Kelas</a><span className="sep">·</span>
            <a href="/biaya">Biaya</a><span className="sep">·</span>
            <a href="/perpanjang">Perpanjang</a><span className="sep">·</span>
            <a href="/kontak">Kontak</a>
          </div>
        </footer>
      </div>
    </>
  );
}
