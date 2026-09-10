"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Brand } from "@/lib/brands";
import type { HakioVariant } from "@/lib/variants";
import JsonLd from "./JsonLd";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function buildInitialMessage(brandName: string): string {
  return `Halo! 👋 Saya asisten AI ${brandName}. Ketik nama brand yang ingin dicek — **100% gratis** dan instan!\n\nSaya bantu cek ketersediaan di database PDKI/DJKI, rekomendasi kelas produk/jasa (klasifikasi NICE), dan estimasi biaya.\n\nSetelah itu tim kami siap lanjut via WhatsApp untuk proses pendaftaran resminya.`;
}

function fmt(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\*(.*?)\*/g, "<em>$1</em>");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

interface Props {
  brand: Brand;
  variant: HakioVariant;
}

export default function HakioMockupPage({ brand, variant: v }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWA, setShowWA] = useState(false);
  const [waClicked, setWaClicked] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [leadData, setLeadData] = useState<{
    nama?: string; kelas?: string; entitas?: string; user?: string;
  } | null>(null);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasConversation = messages.length > 0;

  const waText = leadData?.nama
    ? `Halo ${v.brandName}!${leadData.user ? ` Nama saya ${leadData.user}.` : ""} Saya sudah cek merek via chat AI dan ingin lanjut pendaftaran:\n- Nama Merek: ${leadData.nama}\n- Kelas Produk/Jasa: ${leadData.kelas}\n- Jenis Entitas: ${leadData.entitas}\n\nBisa bantu proses selanjutnya?`
    : `Halo ${v.brandName}! Saya ingin konsultasi merek dagang. Mohon dibantu.`;
  const waLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(waText)}`;

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
    if (hasConversation && chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages, loading, hasConversation]);

  const sendMessage = useCallback(async (text: string) => {
    const userText = text.trim();
    if (!userText || loading) return;
    const isFirst = messages.length === 0;
    const seeded: Message[] = isFirst
      ? [{ role: "assistant", content: buildInitialMessage(v.brandName) }, { role: "user", content: userText }]
      : [...messages, { role: "user", content: userText }];
    setMessages(seeded);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: seeded.slice(-20), brand: brand.id }),
      });
      const data = await res.json();
      if (res.status === 429 || data.rate_limited) {
        setMessages((prev) => [...prev, { role: "assistant", content: "Batas percakapan gratis telah tercapai. Hubungi tim Hakio via WhatsApp untuk konsultasi lanjutan." }]);
        setShowWA(true);
        return;
      }
      if (data.error) throw new Error(data.error);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      if (data.show_wa) {
        setShowWA(true);
        if (data.lead) setLeadData(data.lead);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Maaf, terjadi gangguan koneksi. Coba lagi sebentar atau hubungi kami via WhatsApp." }]);
      setShowWA(true);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [messages, loading, brand.id]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); sendMessage(input); }
  };
  const handleTabClick = (i: number) => {
    setActiveTab(i);
    const seed = i === 0 ? "Saya mau cek nama merek: " : i === 1 ? "Tolong rekomendasikan kelas produk/jasa untuk bisnis saya: " : i === 2 ? "Tolong analisa kemiripan merek " : "Berapa estimasi biaya untuk merek ";
    setInput(seed);
    setTimeout(() => inputRef.current?.focus(), 20);
  };
  const handleChipClick = (chip: string) => {
    setInput(`Saya mau cek nama merek di kategori ${chip}: `);
    setTimeout(() => inputRef.current?.focus(), 20);
  };
  const handleWaClick = () => {
    setWaClicked(true);
    setMessages((prev) => [...prev, { role: "assistant", content: `Terima kasih${leadData?.user ? `, ${leadData.user}` : ""}! Admin ${v.brandName} akan segera membalas via WhatsApp.` }]);
  };

  const assetBase = `/variants/${v.variantSlug}`;

  return (
    <>
      <JsonLd brand={brand} />
      <style>{`
        :root {
          --accent: ${v.accent};
          --accent-deep: ${v.accentDeep};
          --dark: #10285d;
          --soft: color-mix(in srgb, ${v.accent} 8%, white);
          --muted: #6c7897;
          --line: #e8edf7;
          --white: #ffffff;
          --radius: 24px;
          --shadow: 0 22px 50px rgba(16, 40, 93, .10);
        }
        html,body{margin:0;padding:0;overflow-x:hidden}
        body {
          font-family: Inter, system-ui, sans-serif;
          color: var(--dark);
          background:
            radial-gradient(circle at 90% 0%, rgba(255,255,255,.75), transparent 32%),
            radial-gradient(circle at 5% 100%, color-mix(in srgb, var(--accent) 14%, white), transparent 25%),
            linear-gradient(180deg, #f7f9fd, #f2f5fb);
          min-height:100vh;
        }
        .hm-page { max-width: 1380px; margin: 24px auto; background: rgba(255,255,255,.9); border: 1px solid #eef2fb; border-radius: 32px; box-shadow: var(--shadow); overflow: hidden; backdrop-filter: blur(16px); }
        .hm-nav { display: flex; align-items: center; justify-content: space-between; padding: 18px 28px; border-bottom: 1px solid var(--line); background: rgba(255,255,255,.84); position: sticky; top: 0; z-index: 10; }
        .hm-brand { display: flex; align-items: center; gap: 14px; text-decoration:none; color:inherit; }
        .hm-brand-mark {
          width: 46px; height: 46px; border-radius: 13px;
          background: linear-gradient(135deg, var(--accent), var(--accent-deep));
          display: grid; place-items: center; color: #fff;
          font-weight: 900; font-size: 22px; letter-spacing: -.02em;
          box-shadow: 0 10px 22px color-mix(in srgb, var(--accent) 30%, transparent);
        }
        .hm-brand strong { display:block; font-size:17px; font-weight:800; letter-spacing:-.02em; color: var(--dark); }
        .hm-brand .small { display: block; margin-top: 2px; font-size: 12px; color: var(--muted); }
        .hm-links { display: flex; align-items: center; gap: 26px; font-size: 14px; font-weight: 600; color: #33456c; }
        .hm-links a { color: inherit; text-decoration: none; padding:11px 14px; border-radius:12px; }
        .hm-links a:hover { background: rgba(0,0,0,.04); }
        .hm-links .active { padding: 11px 16px; background: color-mix(in srgb, var(--accent) 12%, white); border-radius: 14px; color: color-mix(in srgb, var(--accent) 82%, var(--dark)); }
        .hm-right { display: flex; align-items: center; gap: 12px; }
        .hm-ghost, .hm-btn, .hm-icon-btn { border: 1px solid var(--line); background: #fff; color: var(--dark); border-radius: 14px; height: 48px; padding: 0 18px; font-weight: 700; font-size: 14px; display: inline-flex; align-items: center; gap: 10px; text-decoration: none; cursor: pointer; font-family:inherit; }
        .hm-btn { background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, var(--accent-deep))); border: 0; color: #fff; box-shadow: 0 14px 26px color-mix(in srgb, var(--accent) 22%, transparent); }
        .hm-icon-btn { width: 48px; justify-content: center; padding: 0; }
        .hm-hero { display: grid; grid-template-columns: 1.15fr .85fr; gap: 26px; padding: 40px 44px 20px; align-items: center; background: radial-gradient(circle at 80% 25%, color-mix(in srgb, var(--accent) 10%, white), transparent 30%), linear-gradient(180deg, #fff, #fcfdff); }
        .hm-tag { display: inline-flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 999px; background: color-mix(in srgb, var(--accent) 10%, white); color: color-mix(in srgb, var(--accent) 78%, var(--dark)); font-weight: 700; font-size: 14px; margin-bottom: 20px; }
        .hm-h1 { margin: 0 0 16px; line-height: .98; font-size: clamp(44px, 6vw, 74px); letter-spacing: -.04em; }
        .hm-h1 .accent { color: var(--accent); }
        .hm-subtitle { font-size: 18px; line-height: 1.55; color: #5e6d8f; max-width: 680px; margin-bottom: 24px; }
        .hm-checks { display: flex; flex-wrap: wrap; gap: 16px 24px; color: #32517a; font-weight: 600; margin-bottom: 30px; }
        .hm-checks span::before { content: "✓"; display: inline-grid; place-items: center; width: 22px; height: 22px; margin-right: 10px; border-radius: 50%; background: color-mix(in srgb, var(--accent) 14%, white); color: var(--accent); font-size: 13px; font-weight: 900; }
        .hm-visual { position: relative; min-height: 480px; }
        .hm-visual-card { position: absolute; inset: 40px 0 20px 40px; background: radial-gradient(circle at 40% 30%, color-mix(in srgb, var(--accent) 10%, white), transparent 35%), linear-gradient(180deg, rgba(255,255,255,.94), rgba(255,255,255,.82)); border: 1px solid #eef2f8; border-radius: 28px; box-shadow: var(--shadow); }
        .hm-robot { position: absolute; right: 8px; top: 0; width: min(100%, 380px); height: auto; max-height: 420px; object-fit: contain; filter: drop-shadow(0 24px 30px rgba(16,40,93,.12)); z-index: 2; }
        .hm-note { position: absolute; left: 22px; bottom: 40px; font-size: 26px; line-height: 1.22; font-weight: 800; color: var(--dark); max-width: 260px; z-index: 3; }
        .hm-note .accent { color: var(--accent); }
        .hm-minibox { position: absolute; right: -4px; bottom: 32px; width: 220px; padding: 20px 22px; border-radius: 22px; background: rgba(255,255,255,.96); border: 1px solid #edf1f8; box-shadow: 0 16px 34px rgba(16, 40, 93, .10); z-index: 3; }
        .hm-minibox strong { display: block; margin-bottom: 8px; font-size: 20px; line-height: 1.2; }
        .hm-minibox p { margin: 0; color: #697898; line-height: 1.55; font-size: 14px; }
        .hm-searchcard { margin: 10px 44px 0; border: 1px solid var(--line); background: rgba(255,255,255,.92); border-radius: 28px; box-shadow: var(--shadow); overflow: hidden; }
        .hm-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; padding: 18px 18px 0; }
        .hm-tab { min-height: 56px; padding: 12px 16px; border-radius: 16px 16px 0 0; color: #697796; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; border-bottom: 3px solid transparent; background:transparent; border-left:0; border-right:0; border-top:0; cursor:pointer; font-family:inherit; font-size:14px; }
        .hm-tab.active { color: var(--dark); border-bottom-color: var(--accent); background: color-mix(in srgb, var(--accent) 6%, white); }
        .hm-search-inner { display: grid; grid-template-columns: 1fr 270px; gap: 16px; padding: 18px; align-items: center; }
        .hm-search-box { border: 1px solid var(--line); background: #fff; min-height: 94px; border-radius: 18px; padding: 18px 20px; display:flex; flex-direction:column; justify-content:center; transition:border-color .15s; }
        .hm-search-box:focus-within { border-color: var(--accent); }
        .hm-search-input { border:0; outline:0; background:transparent; font:inherit; font-size:18px; color:var(--dark); padding:0; width:100%; }
        .hm-search-input::placeholder { color: #8c98b0; }
        .hm-search-hint { color: #9ea8be; font-size: 13px; margin-top:8px; }
        .hm-cta { min-height: 94px; border: 0; border-radius: 20px; color: #fff; background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 68%, var(--accent-deep))); box-shadow: 0 18px 32px color-mix(in srgb, var(--accent) 22%, transparent); font-size: 16px; font-weight: 800; padding: 0 20px; cursor:pointer; font-family:inherit; }
        .hm-cta:disabled { opacity:.55; cursor:not-allowed; }
        .hm-cta small { display: block; opacity: .9; font-weight: 600; margin-top: 4px; font-size:13px; }
        .hm-chips { display: flex; flex-wrap: wrap; gap: 10px; padding: 0 18px 18px; align-items: center; color: #6b7995; font-size: 14px; }
        .hm-chip { padding: 8px 14px; border: 1px solid var(--line); border-radius: 999px; background: #fff; cursor:pointer; font-family:inherit; font-size:14px; color:inherit; }
        .hm-chip:hover { background: color-mix(in srgb, var(--accent) 6%, white); border-color: color-mix(in srgb, var(--accent) 24%, white); }
        .hm-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 24px 44px 0; }
        .hm-stat { border: 1px solid var(--line); border-radius: 22px; background: rgba(255,255,255,.88); padding: 22px; min-height: 104px; }
        .hm-stat .n { font-size: 34px; font-weight: 900; line-height: 1; margin-bottom: 8px; color: var(--accent); }
        .hm-stat .d { color: #6c7897; line-height: 1.5; font-size: 14px; }
        .hm-section { padding: 28px 44px 44px; }
        .hm-section h2 { margin: 0 0 10px; font-size: 42px; letter-spacing: -.03em; }
        .hm-section p.lead { margin: 0 0 22px; color: #6b7996; font-size: 18px; line-height: 1.55; max-width: 780px; }
        .hm-grid2 { display: grid; grid-template-columns: 1.15fr .85fr; gap: 20px; align-items: stretch; }
        .hm-card { background: rgba(255,255,255,.92); border: 1px solid var(--line); border-radius: 28px; box-shadow: 0 16px 34px rgba(16,40,93,.06); }
        .hm-feature { display: grid; grid-template-columns: 220px 1fr; gap: 18px; padding: 24px; background: radial-gradient(circle at 15% 15%, color-mix(in srgb, var(--accent) 10%, white), transparent 30%), linear-gradient(180deg, color-mix(in srgb, var(--accent) 4%, white), white); }
        .hm-feature img { width: 100%; border-radius: 18px; display: block; }
        .hm-feature h3 { margin: 6px 0 12px; font-size: 30px; line-height: 1.05; letter-spacing: -.03em; }
        .hm-feature p { color: #6b7996; line-height: 1.6; margin: 0 0 18px; font-size: 15.5px; }
        .hm-eyebrow { font-size:12px; letter-spacing:.14em; font-weight:800; text-transform:uppercase; color: var(--accent); }
        .hm-points { display: flex; flex-wrap: wrap; gap: 10px 18px; color: #365173; font-size: 14px; font-weight: 600; margin-top:14px; }
        .hm-points span::before { content: "•"; color: var(--accent); font-size: 22px; line-height: 0; vertical-align: middle; margin-right: 8px; }
        .hm-wa { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; background: linear-gradient(135deg, #25D366, #128C7E); color: white; padding: 14px 20px; border-radius: 14px; font-weight: 800; margin-top: 4px; font-size:14px; }
        .hm-pricing { padding: 24px; background: radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--accent) 10%, white), transparent 34%), linear-gradient(180deg, white, color-mix(in srgb, var(--accent) 4%, white)); }
        .hm-pricing h3 { margin: 10px 0 8px; font-size: 26px; line-height: 1.08; }
        .hm-pricing p { margin: 0 0 18px; color: #6b7996; line-height: 1.55; font-size:14px; }
        .hm-price-row { display: flex; justify-content: space-between; gap: 18px; padding: 14px 0; border-top: 1px dashed #dce3f2; font-weight: 700; font-size:14px; align-items:baseline; }
        .hm-price-row:first-of-type { border-top: 0; }
        .hm-price-row span:last-child { font-size: 22px; color: var(--dark); font-weight:800; }
        .hm-price-note { font-size:12px; color:#8794AE; margin-top:12px; padding-top:12px; border-top:1px solid #eef1f8; }
        .hm-price-note .djki { color:#16a34a; font-weight:800; }
        .hm-footer-strip { padding: 24px 44px 36px; border-top: 1px solid var(--line); color: #6a7794; font-size: 13px; display:flex; flex-wrap:wrap; gap:8px 18px; justify-content:center; }
        .hm-footer-strip a { color:#5f6b8b; text-decoration:none; }
        .hm-footer-strip a:hover { color: var(--dark); text-decoration:underline; }
        .hm-footer-strip .sep { color:#c8cee0; }
        .hm-footer-info { padding: 16px 44px 32px; text-align:center; font-size:12px; color:#7c85a5; line-height:1.7; }
        .hm-footer-info b { color:#5a6889; }
        .hm-footer-info .warranty { color: #d6a64a; font-weight:700; }

        /* Chat overlay (aktif setelah user submit) */
        .hm-chatview { margin: 0 44px 24px; padding:24px; background:#fff; border:1px solid var(--line); border-radius:24px; box-shadow: var(--shadow); display:flex; flex-direction:column; gap:16px; max-height:75vh; overflow-y:auto; scroll-behavior:smooth; }
        .hm-chatview::-webkit-scrollbar { width:6px; }
        .hm-chatview::-webkit-scrollbar-thumb { background:#d4dae8; border-radius:6px; }
        .hm-msg { display:flex; gap:12px; align-items:flex-start; font-size:15.5px; line-height:1.65; }
        .hm-msg.user { justify-content:flex-end; }
        .hm-avatar { width:38px; height:38px; border-radius:10px; background: linear-gradient(135deg, var(--accent), var(--accent-deep)); color:#fff; display:grid; place-items:center; font-weight:800; font-size:.9rem; flex-shrink:0; }
        .hm-bubble { max-width:78%; color:#213258; padding-top:4px; white-space:pre-wrap; }
        .hm-msg.user .hm-bubble { background:linear-gradient(135deg, var(--accent), var(--accent-deep)); color:#fff; border-radius:18px 18px 4px 18px; padding:12px 18px; }
        .hm-typing { display:flex; gap:5px; align-items:center; padding:6px 0; }
        .hm-typing span { width:6px; height:6px; background:#8e99b3; border-radius:50%; animation: hmDot 1.2s ease infinite; }
        .hm-typing span:nth-child(2) { animation-delay:.2s; }
        .hm-typing span:nth-child(3) { animation-delay:.4s; }
        @keyframes hmDot { 0%,80%,100%{opacity:.3; transform:scale(.8)} 40%{opacity:1; transform:scale(1)} }

        @media (max-width: 1100px) {
          .hm-hero, .hm-grid2 { grid-template-columns: 1fr; }
          .hm-visual { min-height: 380px; }
          .hm-stats { grid-template-columns: repeat(2, 1fr); }
          .hm-search-inner { grid-template-columns: 1fr; }
          .hm-feature { grid-template-columns: 1fr; }
          .hm-tabs { grid-template-columns: repeat(2, 1fr); }
          .hm-links { display: none; }
        }
        @media (max-width: 760px) {
          .hm-page { margin: 0; border-radius: 0; }
          .hm-nav, .hm-hero, .hm-section, .hm-footer-strip, .hm-footer-info { padding-left: 18px; padding-right: 18px; }
          .hm-searchcard, .hm-chatview { margin-left: 18px; margin-right: 18px; }
          .hm-stats { padding-left: 18px; padding-right: 18px; grid-template-columns: 1fr; }
          .hm-h1 { font-size: 42px; }
          .hm-note { font-size: 22px; max-width: 240px; }
          .hm-minibox { position: static; width: 100%; margin-top: 16px; }
          .hm-visual-card { inset: 0; }
          .hm-robot { right: 0; left: auto; width: 240px; }
        }
      `}</style>

      <div className="hm-page">
        <header className="hm-nav">
          <a href="/" className="hm-brand">
            <div className="hm-brand-mark" aria-hidden="true">
              <span>{v.brandName.charAt(0)}</span>
            </div>
            <div>
              <strong>{v.brandName}</strong>
              <span className="small">{v.brandSub}</span>
            </div>
          </a>
          <nav className="hm-links">
            <a href="/" className="active">Beranda</a>
            <a href="/cek-merek">Cek Merek</a>
            <a href="/daftar-merek">Daftar Merek</a>
            <a href="/kelas-produk-jasa">Kelas Produk/Jasa</a>
            <a href="/biaya">Harga</a>
            <a href="/blog">Blog</a>
            <a href="/kontak">Kontak</a>
          </nav>
          <div className="hm-right">
            <a href="/cek-merek" className="hm-icon-btn" aria-label="Cari">⌕</a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="hm-btn">Konsultasi</a>
          </div>
        </header>

        <section className="hm-hero">
          <div>
            <div className="hm-tag">{v.tag}</div>
            <h1 className="hm-h1">{v.h1Line1}<br /><span className="accent">{v.h1Line2Accent}</span></h1>
            <div className="hm-subtitle">{v.subtitle}</div>
            <div className="hm-checks">
              {v.checks.map((c) => <span key={c}>{c}</span>)}
            </div>
          </div>
          <div className="hm-visual">
            <div className="hm-visual-card"></div>
            <img className="hm-robot" src={`${assetBase}/robot.webp`} alt="Hakio robot" />
            <div className="hm-note">{v.noteMain}<br /><span className="accent">{v.noteAccent}</span><br />{v.noteEnd}</div>
            <div className="hm-minibox">
              <strong>{v.miniBoxTitle}</strong>
              <p>{v.miniBoxDesc}</p>
            </div>
          </div>
        </section>

        <section className="hm-searchcard">
          <div className="hm-tabs">
            {v.tabs.map((t, i) => (
              <button key={t} className={`hm-tab${activeTab === i ? " active" : ""}`} onClick={() => handleTabClick(i)}>{t}</button>
            ))}
          </div>
          <div className="hm-search-inner">
            <div className="hm-search-box">
              <input
                ref={inputRef}
                type="text"
                className="hm-search-input"
                placeholder={v.searchPlaceholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
              />
              <div className="hm-search-hint">{v.searchHint}</div>
            </div>
            <button className="hm-cta" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
              {v.ctaLabel}<small>{v.ctaSubLabel}</small>
            </button>
          </div>
          <div className="hm-chips">
            <strong>Pencarian populer:</strong>
            {v.chips.map((c) => (
              <button key={c} className="hm-chip" onClick={() => handleChipClick(c)}>{c}</button>
            ))}
          </div>
        </section>

        {hasConversation && (
          <section className="hm-chatview" ref={chatRef} aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`hm-msg ${m.role === "user" ? "user" : "ai"}`}>
                {m.role === "assistant" && <div className="hm-avatar">H</div>}
                <div className="hm-bubble" dangerouslySetInnerHTML={{ __html: m.role === "assistant" ? fmt(m.content) : escapeHtml(m.content) }} />
              </div>
            ))}
            {loading && (
              <div className="hm-msg ai">
                <div className="hm-avatar">H</div>
                <div className="hm-typing"><span></span><span></span><span></span></div>
              </div>
            )}
            {showWA && !waClicked && (
              <div className="hm-msg ai">
                <div className="hm-avatar">H</div>
                <div>
                  <div className="hm-bubble">Tim Hakio siap melanjutkan proses via WhatsApp 🎉</div>
                  <a className="hm-wa" href={waLink} target="_blank" rel="noopener noreferrer" onClick={handleWaClick}>💬 Lanjutkan via WhatsApp</a>
                </div>
              </div>
            )}
          </section>
        )}

        <section className="hm-stats">
          {v.stats.map((s, i) => (
            <div className="hm-stat" key={i}>
              <div className="n">{s.n}</div>
              <div className="d">{s.d}</div>
            </div>
          ))}
        </section>

        <section className="hm-section">
          <h2>{v.section2Title}</h2>
          <p className="lead">{v.section2Lead}</p>
          <div className="hm-grid2">
            <div className="hm-card hm-feature">
              <img src={`${assetBase}/robot.webp`} alt="Hakio robot" />
              <div>
                <div className="hm-eyebrow">{v.featureEyebrow}</div>
                <h3>{v.featureTitle}</h3>
                <p>{v.featureDesc}</p>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="hm-wa">💬 Konsultasi via WhatsApp</a>
                <div className="hm-points">
                  {v.featurePoints.map((p) => <span key={p}>{p}</span>)}
                </div>
              </div>
            </div>

            <div className="hm-card hm-pricing">
              <div className="hm-eyebrow">Mulai dari</div>
              <h3>{v.pricingHeading}</h3>
              <p>{v.pricingDesc}</p>
              <div className="hm-price-row"><span>UMKM / Perorangan</span><span>Rp 1.299.000<span style={{fontSize:12,color:"#8794AE",fontWeight:600,marginLeft:4}}>/kelas</span></span></div>
              <div className="hm-price-row"><span>Perusahaan / PT</span><span>Rp 2.490.000<span style={{fontSize:12,color:"#8794AE",fontWeight:600,marginLeft:4}}>/kelas</span></span></div>
              <div className="hm-price-note">
                Sudah termasuk <span className="djki">biaya DJKI / PNBP resmi</span> + jasa pengurusan.
                <br />🏆 <b>Garansi termurah</b> — kalau ada yang lebih murah dengan cakupan setara, selisih diganti.
              </div>
            </div>
          </div>
        </section>

        <nav className="hm-footer-strip" aria-label="Peta situs">
          <a href="/">Beranda</a><span className="sep">·</span>
          <a href="/cek-merek">Cek Merek</a><span className="sep">·</span>
          <a href="/daftar-merek">Daftar Merek</a><span className="sep">·</span>
          <a href="/kelas-produk-jasa">Kelas Produk/Jasa</a><span className="sep">·</span>
          <a href="/biaya">Biaya</a><span className="sep">·</span>
          <a href="/perpanjang">Perpanjang</a><span className="sep">·</span>
          <a href="/blog">Blog</a><span className="sep">·</span>
          <a href="/kontak">Kontak</a>
        </nav>
        <div className="hm-footer-info">
          <b>{v.brandName}</b> dikelola oleh <b>PT Ventera Intellix Group</b> — berpengalaman mendaftarkan ribuan merek dagang ke DJKI untuk UMKM dan perusahaan Indonesia.<br />
          <span className="warranty">🏆 Garansi Termurah se-Indonesia</span> — jika ada jasa pendaftaran merek lebih murah dengan cakupan setara, selisih diganti.<br />
          <span style={{ color: "#8f97b3" }}>© 2026 {v.brandName} · info@hakio.id · 0851-4841-6800</span>
        </div>
      </div>
    </>
  );
}
