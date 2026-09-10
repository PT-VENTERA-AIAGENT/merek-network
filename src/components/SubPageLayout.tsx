"use client";

import { useState, type ReactNode } from "react";
import type { Brand } from "@/lib/brands";

export interface PageBreadcrumb {
  label: string;
}

interface Props {
  brand: Brand;
  activeNav: string;
  title: string;
  eyebrow?: string;
  intro?: string;
  breadcrumb?: PageBreadcrumb;
  children: ReactNode;
}

const NAV = [
  { label: "Beranda", href: "/" },
  { label: "Cek Merek", href: "/cek-merek" },
  { label: "Daftar Merek", href: "/daftar-merek" },
  { label: "Kelas Produk/Jasa", href: "/kelas-produk-jasa" },
  { label: "Biaya", href: "/biaya" },
  { label: "Perpanjang", href: "/perpanjang" },
  { label: "Blog", href: "/blog" },
  { label: "Kontak", href: "/kontak" },
];

export default function SubPageLayout({ brand, activeNav, title, eyebrow, intro, breadcrumb, children }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const waText = `Halo Hakio! Saya baru baca halaman \"${title}\" di CekHaki. Boleh minta bantuan lebih lanjut?`;
  const waLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(waText)}`;

  return (
    <>
      <style>{`
        :root{
          --navy:#10285d;--gold:#d6a64a;--gold-2:#f3cf78;--ink:#0f224d;
          --muted:#6c7897;--line:#dce3f0;--soft:#eef4ff;
          --shadow:0 28px 70px rgba(15,34,77,.12);
        }
        html,body{margin:0;padding:0;overflow-x:hidden}
        body{
          min-height:100vh;color:var(--ink);
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          background:
            radial-gradient(circle at 76% 10%, rgba(245,211,139,.30), transparent 26%),
            radial-gradient(circle at 60% 42%, rgba(191,214,255,.42), transparent 31%),
            linear-gradient(180deg,#fbfbfe 0%,#f4f6fb 100%);
        }
        .sp-page{min-height:100vh;padding:28px 22px}
        .sp-app{
          width:min(1520px,calc(100vw - 44px));min-height:900px;margin:0 auto;
          background:rgba(255,255,255,.76);border:8px solid rgba(255,255,255,.95);
          border-radius:40px;box-shadow:0 22px 70px rgba(36,47,80,.14);
          overflow:hidden;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
        }
        .sp-navbar{
          background:linear-gradient(180deg,#172f66 0%,#0d2457 100%);
          border-radius:28px 28px 0 0;
          display:flex;align-items:center;justify-content:space-between;
          padding:14px 22px;gap:16px;
        }
        .sp-brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:#fff}
        .sp-brand-mark{
          width:44px;height:44px;border-radius:12px;overflow:hidden;
          box-shadow:0 8px 20px rgba(0,0,0,.18);display:grid;place-items:center;
        }
        .sp-brand-mark img{width:100%;height:100%;object-fit:cover}
        .sp-brand-text{display:flex;flex-direction:column;line-height:1.05}
        .sp-brand-name{font-size:1.05rem;font-weight:800;letter-spacing:-.02em;color:#fff}
        .sp-brand-sub{font-size:.7rem;color:#8fa4d1;font-weight:500;margin-top:2px}
        .sp-links{display:flex;align-items:center;gap:2px;flex:1;justify-content:center;flex-wrap:wrap}
        .sp-link{
          font-size:.9rem;font-weight:600;color:#dbe5ff;text-decoration:none;
          padding:9px 16px;border-radius:10px;transition:background .15s,color .15s;
        }
        .sp-link:hover{background:rgba(255,255,255,.08);color:#fff}
        .sp-link.active{background:#fff;color:var(--navy);box-shadow:0 4px 12px rgba(5,19,55,.22)}
        .sp-cta{
          display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 22px;
          border-radius:12px;background:linear-gradient(180deg,var(--gold-2),var(--gold));
          color:#0d2457;font-weight:800;font-size:.9rem;text-decoration:none;
          box-shadow:0 8px 18px rgba(214,166,74,.35);
        }
        .sp-menu-btn{display:none;width:42px;height:42px;border-radius:12px;
          background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);
          color:#fff;cursor:pointer;align-items:center;justify-content:center;
        }
        .sp-mobile-menu{display:none}
        .sp-workspace{padding:40px 48px 60px;position:relative}
        .sp-breadcrumb{font-size:.8rem;color:var(--muted);margin-bottom:16px}
        .sp-breadcrumb a{color:var(--muted);text-decoration:none}
        .sp-breadcrumb a:hover{color:var(--navy)}
        .sp-eyebrow{
          display:inline-block;font-size:.75rem;font-weight:800;letter-spacing:.15em;
          text-transform:uppercase;color:var(--gold);padding:6px 14px;
          border:1px solid rgba(214,166,74,.35);border-radius:999px;
          background:rgba(214,166,74,.08);margin-bottom:14px;
        }
        .sp-title{
          font-size:clamp(36px,3.8vw,58px);font-weight:850;letter-spacing:-.03em;
          line-height:1.06;color:var(--ink);max-width:920px;margin-bottom:16px;
        }
        .sp-intro{
          font-size:clamp(16px,1.3vw,19px);color:var(--muted);line-height:1.6;
          max-width:760px;margin-bottom:36px;
        }
        .sp-content{max-width:920px}
        .sp-content h2{font-size:26px;font-weight:800;color:var(--ink);letter-spacing:-.02em;margin:32px 0 12px}
        .sp-content h3{font-size:18px;font-weight:700;color:var(--ink);margin:20px 0 8px}
        .sp-content p{font-size:15.5px;line-height:1.7;color:#3a4666;margin-bottom:14px}
        .sp-content ul{padding-left:22px;margin-bottom:14px}
        .sp-content li{font-size:15.5px;line-height:1.75;color:#3a4666;margin-bottom:6px}
        .sp-content strong{color:var(--ink);font-weight:700}
        .sp-content a{color:var(--navy);text-decoration:underline;text-underline-offset:2px}
        .sp-card-grid{
          display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;
          margin:24px 0;
        }
        .sp-card{
          background:#fff;border:1px solid #e2e7f0;border-radius:18px;padding:20px 22px;
          box-shadow:0 8px 20px rgba(24,48,99,.06);
        }
        .sp-card-title{font-size:15px;font-weight:800;color:var(--ink);margin-bottom:6px}
        .sp-card-desc{font-size:13.5px;color:var(--muted);line-height:1.55}
        .sp-cta-block{
          margin-top:36px;padding:28px 30px;border-radius:22px;
          background:linear-gradient(180deg,#fffbf1,#fdf3d9);border:1px solid #eed8aa;
          display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;
        }
        .sp-cta-text{flex:1;min-width:220px}
        .sp-cta-text b{font-size:17px;font-weight:800;color:var(--ink);display:block;margin-bottom:4px}
        .sp-cta-text span{font-size:14px;color:#6b6255}
        .sp-cta-block .sp-cta{margin-left:auto}
        .sp-footer{
          max-width:1520px;margin:16px auto 0;padding:20px 12px;
          text-align:center;color:#7c85a5;font-size:12px;line-height:1.8;
        }
        .sp-footer a{color:#5f6b8b;text-decoration:none;margin:0 6px}
        .sp-footer a:hover{color:var(--navy);text-decoration:underline}
        .sp-footer .sep{color:#c8cee0}
        @media (max-width:900px){
          .sp-links{display:none}
          .sp-menu-btn{display:flex}
          .sp-brand-sub{display:none}
          .sp-mobile-menu{
            display:none;position:absolute;top:76px;left:22px;right:22px;
            background:#122b62;border-radius:16px;padding:12px;
            flex-direction:column;gap:2px;z-index:20;
            box-shadow:0 20px 40px rgba(0,0,0,.3);
          }
          .sp-mobile-menu.open{display:flex}
          .sp-mobile-menu .sp-link{width:100%;text-align:left}
        }
        @media (max-width:760px){
          .sp-page{padding:0}
          .sp-app{width:100%;min-height:100vh;border:0;border-radius:0}
          .sp-navbar{border-radius:0;padding:12px 16px}
          .sp-workspace{padding:24px 20px 40px}
          .sp-cta span:last-child{display:none}
          .sp-cta{padding:0 14px;height:40px}
        }
      `}</style>

      <div className="sp-page">
        <div className="sp-app">
          <nav className="sp-navbar" role="navigation" aria-label="Navigasi Hakio">
            <a href="/" className="sp-brand">
              <div className="sp-brand-mark"><img src="/hakio-mark.png" alt="" width="44" height="44" /></div>
              <div className="sp-brand-text">
                <span className="sp-brand-name">Hakio AI</span>
                <span className="sp-brand-sub">Chat AI Merek Dagang</span>
              </div>
            </a>
            <div className="sp-links">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} className={`sp-link${activeNav === n.href ? " active" : ""}`}>{n.label}</a>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <a className="sp-cta" href={waLink} target="_blank" rel="noopener noreferrer">
                <span>♛</span><span>Konsultasi</span>
              </a>
              <button className="sp-menu-btn" aria-label="Menu" onClick={() => setMobileMenuOpen((v) => !v)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className={`sp-mobile-menu${mobileMenuOpen ? " open" : ""}`}>
              {NAV.map((n) => (
                <a key={n.href} href={n.href} className={`sp-link${activeNav === n.href ? " active" : ""}`}>{n.label}</a>
              ))}
            </div>
          </nav>

          <div className="sp-workspace">
            <div className="sp-breadcrumb">
              <a href="/">Beranda</a> <span aria-hidden="true"> › </span>
              <span>{breadcrumb?.label ?? title}</span>
            </div>
            {eyebrow && <span className="sp-eyebrow">{eyebrow}</span>}
            <h1 className="sp-title">{title}</h1>
            {intro && <p className="sp-intro">{intro}</p>}
            <div className="sp-content">{children}</div>

            <div className="sp-cta-block">
              <div className="sp-cta-text">
                <b>Mau langsung dibantu tim Hakio?</b>
                <span>Chat admin via WhatsApp — respon cepat di jam kerja WIB.</span>
              </div>
              <a className="sp-cta" href={waLink} target="_blank" rel="noopener noreferrer">
                <span>♛</span><span>Konsultasi</span>
              </a>
            </div>
          </div>
        </div>

        <nav className="sp-footer" aria-label="Peta situs">
          <a href="/">Beranda</a><span className="sep">·</span>
          <a href="/cek-merek">Cek Merek</a><span className="sep">·</span>
          <a href="/daftar-merek">Daftar Merek</a><span className="sep">·</span>
          <a href="/kelas-produk-jasa">Kelas Produk/Jasa</a><span className="sep">·</span>
          <a href="/biaya">Biaya</a><span className="sep">·</span>
          <a href="/perpanjang">Perpanjang</a><span className="sep">·</span>
          <a href="/blog">Blog</a><span className="sep">·</span>
          <a href="/kontak">Kontak</a>
          <div style={{ marginTop: 14, fontSize: 12, color: "#7c85a5", lineHeight: 1.65, maxWidth: 720, margin: "14px auto 0" }}>
            <strong style={{ color: "#5a6889" }}>Hakio</strong> dikelola oleh <strong style={{ color: "#5a6889" }}>PT Ventera Intellix Group</strong>
            {" "}— berpengalaman mendaftarkan ribuan merek dagang ke DJKI untuk UMKM dan perusahaan Indonesia.
            <br />
            <span style={{ color: "#d6a64a", fontWeight: 700 }}>🏆 Garansi Termurah se-Indonesia</span>
            {" "}— jika ada jasa pendaftaran merek lebih murah dengan cakupan setara, selisih harganya kami ganti.
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: "#8f97b3" }}>© 2026 Hakio AI · info@hakio.id · 0851-4841-6800</div>
        </nav>
      </div>
    </>
  );
}
