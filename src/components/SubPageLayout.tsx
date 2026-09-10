"use client";

import { useState, type ReactNode } from "react";
import type { Brand } from "@/lib/brands";
import { VARIANT_BY_BRAND } from "@/lib/variants";

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
  const variant = VARIANT_BY_BRAND[brand.id];
  const brandName = variant?.brandName ?? brand.name;
  const brandSub = variant?.brandSub ?? "Chat AI Merek Dagang";
  const accent = variant?.accent ?? brand.accent;
  const accentDeep = variant?.accentDeep ?? brand.accentLight;
  const waText = `Halo ${brandName}! Saya baru baca halaman "${title}". Boleh minta bantuan lebih lanjut?`;
  const waLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(waText)}`;

  return (
    <>
      <style>{`
        :root{
          --accent:${accent};--accent-deep:${accentDeep};
          --dark:#10285d;--ink:#0f224d;
          --muted:#6c7897;--line:#e8edf7;--soft:color-mix(in srgb, ${accent} 8%, white);
          --shadow:0 22px 50px rgba(16,40,93,.10);
        }
        html,body{margin:0;padding:0;overflow-x:hidden}
        body{
          min-height:100vh;color:var(--ink);
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          background:
            radial-gradient(circle at 90% 0%, rgba(255,255,255,.75), transparent 32%),
            radial-gradient(circle at 5% 100%, color-mix(in srgb, ${accent} 14%, white), transparent 25%),
            linear-gradient(180deg,#f7f9fd,#f2f5fb);
        }
        .sp-page{min-height:100vh;padding:24px 22px}
        .sp-app{
          max-width:1380px;margin:0 auto;
          background:rgba(255,255,255,.9);border:1px solid #eef2fb;
          border-radius:32px;box-shadow:var(--shadow);
          overflow:hidden;backdrop-filter:blur(16px);
        }
        .sp-navbar{
          display:flex;align-items:center;justify-content:space-between;
          padding:18px 28px;background:rgba(255,255,255,.84);
          border-bottom:1px solid var(--line);
          position:sticky;top:0;z-index:10;
        }
        .sp-brand{display:flex;align-items:center;gap:14px;text-decoration:none;color:inherit}
        .sp-brand-mark{
          width:46px;height:46px;border-radius:13px;
          background:linear-gradient(135deg,var(--accent),var(--accent-deep));
          display:grid;place-items:center;color:#fff;
          font-weight:900;font-size:22px;letter-spacing:-.02em;
          box-shadow:0 10px 22px color-mix(in srgb, var(--accent) 30%, transparent);
        }
        .sp-brand-text{display:flex;flex-direction:column;line-height:1.1}
        .sp-brand-name{font-size:17px;font-weight:800;letter-spacing:-.02em;color:var(--dark)}
        .sp-brand-sub{font-size:12px;color:var(--muted);font-weight:500;margin-top:2px}
        .sp-links{display:flex;align-items:center;gap:4px;flex:1;justify-content:center;flex-wrap:wrap}
        .sp-link{
          font-size:.9rem;font-weight:600;color:#33456c;text-decoration:none;
          padding:11px 14px;border-radius:12px;transition:background .15s,color .15s;
        }
        .sp-link:hover{background:rgba(0,0,0,.04)}
        .sp-link.active{background:color-mix(in srgb, var(--accent) 12%, white);color:color-mix(in srgb, var(--accent) 82%, var(--dark))}
        .sp-cta{
          display:inline-flex;align-items:center;gap:10px;height:46px;padding:0 22px;
          border-radius:14px;
          background:linear-gradient(135deg,var(--accent),color-mix(in srgb, var(--accent) 70%, var(--accent-deep)));
          color:#fff;font-weight:800;font-size:.9rem;text-decoration:none;
          box-shadow:0 14px 26px color-mix(in srgb, var(--accent) 22%, transparent);
        }
        .sp-menu-btn{display:none;width:42px;height:42px;border-radius:12px;
          background:#fff;border:1px solid var(--line);
          color:var(--dark);cursor:pointer;align-items:center;justify-content:center;
        }
        .sp-mobile-menu{display:none}
        .sp-workspace{padding:40px 48px 60px;position:relative}
        .sp-breadcrumb{font-size:.8rem;color:var(--muted);margin-bottom:16px}
        .sp-breadcrumb a{color:var(--muted);text-decoration:none}
        .sp-breadcrumb a:hover{color:var(--navy)}
        .sp-eyebrow{
          display:inline-block;font-size:.75rem;font-weight:800;letter-spacing:.15em;
          text-transform:uppercase;color:var(--accent);padding:6px 14px;
          border:1px solid color-mix(in srgb, var(--accent) 30%, transparent);border-radius:999px;
          background:color-mix(in srgb, var(--accent) 8%, white);margin-bottom:14px;
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
          background:
            radial-gradient(circle at 15% 15%, color-mix(in srgb, var(--accent) 12%, white), transparent 40%),
            linear-gradient(180deg, color-mix(in srgb, var(--accent) 5%, white), white);
          border:1px solid color-mix(in srgb, var(--accent) 24%, white);
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
            display:none;position:absolute;top:80px;left:22px;right:22px;
            background:#fff;border:1px solid var(--line);border-radius:16px;padding:12px;
            flex-direction:column;gap:2px;z-index:20;
            box-shadow:0 20px 40px rgba(16,40,93,.10);
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
          <nav className="sp-navbar" role="navigation" aria-label="Navigasi utama">
            <a href="/" className="sp-brand">
              <div className="sp-brand-mark" aria-hidden="true">{brandName.charAt(0)}</div>
              <div className="sp-brand-text">
                <span className="sp-brand-name">{brandName}</span>
                <span className="sp-brand-sub">{brandSub}</span>
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
                <b>Mau langsung dibantu tim kami?</b>
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
            <strong style={{ color: "#5a6889" }}>{brandName}</strong> dikelola oleh <strong style={{ color: "#5a6889" }}>PT Sellora Optima Teknologi</strong>
            {" "}— berpengalaman mendaftarkan ribuan merek dagang ke DJKI untuk UMKM dan perusahaan Indonesia.
            <br />
            <span style={{ color: "#d6a64a", fontWeight: 700 }}>🏆 Garansi Termurah se-Indonesia</span>
            {" "}— jika ada jasa pendaftaran merek lebih murah dengan cakupan setara, selisih harganya kami ganti.
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: "#8f97b3" }}>© 2026 {brandName} · info@hakio.id · 0851-4841-6800</div>
        </nav>
      </div>
    </>
  );
}
