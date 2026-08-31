"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Brand, BrandId } from "@/lib/brands";
import { BRANDS } from "@/lib/brands";
import JsonLd from "./JsonLd";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE =
  "Halo! Saya Asisten Merek AI Hakio 👋\n\nSaya bantu proses pendaftaran merek dagang ke DJKI — mulai dari cek nama, rekomendasi kelas NICE, sampai estimasi biaya.\n\nBoleh tahu nama merek yang ingin Anda daftarkan?";

interface LandingContent {
  heroTitle: string;
  heroSubtitle: string;
}

const LANDING: Record<BrandId, LandingContent> = {
  hakimerek: {
    heroTitle: "Lindungi Merekmu Sebelum Orang Lain Mendaftarnya",
    heroSubtitle:
      "Ribuan merek dicuri tiap tahun karena pemilik aslinya terlambat mendaftar. Konsultan AI kami bantu kamu cek dan daftar sekarang.",
  },
  cekhaki: {
    heroTitle: "Cek Nama Merekmu — Sebelum Orang Lain Mendaftarnya",
    heroSubtitle:
      "Cek database DJKI secara instan. Konsultasi AI gratis, lanjut ke WhatsApp jika siap daftar.",
  },
  merekin: {
    heroTitle: "Daftarkan Merekmu — Proses 100% Online",
    heroSubtitle:
      "Dari konsultasi hingga sertifikat resmi DJKI, semua bisa dikerjakan dari smartphone.",
  },
  hkimerek: {
    heroTitle: "Platform HKI Merek Berbasis AI Pertama di Indonesia",
    heroSubtitle:
      "Analisis otomatis nama merek, rekomendasi kelas NICE, dan proses DJKI yang transparan.",
  },
  daftarmerekmu: {
    heroTitle: "Cara Paling Mudah Daftar Merek Dagang",
    heroSubtitle:
      "Tidak perlu paham hukum. Konsultan AI kami pandu langkah demi langkah hingga sertifikat terbit.",
  },
};

const WaIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const SendIcon = ({ active }: { active: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    stroke={active ? "#fff" : "#bbb"}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" fill={active ? "#fff" : "#bbb"} stroke="none" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CheckIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function ChatPage({ brand }: { brand: Brand }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: INITIAL_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWA, setShowWA] = useState(false);
  const [waClicked, setWaClicked] = useState(false);
  const [leadData, setLeadData] = useState<{
    nama?: string; kelas?: string; entitas?: string; user?: string;
  } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const msgsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const otherBrands = Object.values(BRANDS).filter((b) => b.id !== brand.id);
  const landing = LANDING[brand.id];
  const hasConversation = messages.length > 1;

  const waText = leadData?.nama
    ? `Halo ${brand.name}!${leadData.user ? ` Nama saya ${leadData.user}.` : ""} Saya sudah konsultasi via AI dan ingin melanjutkan pendaftaran merek:\n- Nama Merek: ${leadData.nama}\n- Kelas NICE: ${leadData.kelas}\n- Jenis Entitas: ${leadData.entitas}\n\nBisa bantu proses selanjutnya?`
    : `Halo, saya ingin konsultasi pendaftaran merek dagang via ${brand.name}.`;
  const waLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(waText)}`;

  const a = brand.accent;
  const aRgb = brand.accentRgb;

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      const userText = text.trim();
      if (!userText || loading) return;

      const newMessages: Message[] = [
        ...messages,
        { role: "user", content: userText },
      ];
      setMessages(newMessages);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.slice(-20),
            brand: brand.id,
          }),
        });

        const data = await res.json();

        if (res.status === 429 || data.rate_limited) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Batas percakapan gratis telah tercapai. Hubungi kami langsung via WhatsApp untuk konsultasi lanjutan.",
            },
          ]);
          setShowWA(true);
          return;
        }

        if (data.error) throw new Error(data.error);

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
        if (data.show_wa) {
          setShowWA(true);
          if (data.lead) setLeadData(data.lead);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Maaf, terjadi gangguan koneksi. Coba lagi sebentar atau hubungi kami via WhatsApp.",
          },
        ]);
        setShowWA(true);
      } finally {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [messages, loading, brand.id]
  );

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleWaClick = () => {
    setWaClicked(true);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Terima kasih${leadData?.user ? `, ${leadData.user}` : ""}! Admin kami akan segera membalas via WhatsApp. Selamat berbisnis! 🎉`,
      },
    ]);
  };

  return (
    <>
      <JsonLd brand={brand} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .ch-root * { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
        .ch-root h1, .ch-root h2 { font-family: 'Instrument Serif', Georgia, serif; }

        .ch-root { background: #fff; min-height: 100vh; color: #111; }

        /* Nav */
        .ch-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          height: 54px; display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #ebebeb;
        }
        .ch-logo { text-decoration: none; display: flex; align-items: baseline; }
        .ch-logo-accent { font-family: 'Instrument Serif', Georgia, serif; font-style: italic; color: ${a}; font-size: 1.25rem; }
        .ch-logo-rest { font-family: 'Instrument Serif', Georgia, serif; color: #111; font-size: 1.25rem; }
        .ch-nav-link {
          font-size: .8125rem; color: #888; text-decoration: none;
          padding: 6px 12px; border-radius: 8px; transition: color .15s, background .15s;
          background: none; border: none; cursor: pointer; font-family: inherit;
        }
        .ch-nav-link:hover { color: #111; background: #f5f5f3; }
        .ch-dropdown {
          position: absolute; right: 0; top: calc(100% + 6px);
          background: #fff; border: 1px solid #ebebeb; border-radius: 14px;
          padding: 6px; min-width: 190px;
          box-shadow: 0 8px 32px rgba(0,0,0,.1);
          z-index: 200;
        }
        .ch-dropdown-link {
          display: block; padding: 9px 12px; font-size: .8125rem;
          text-decoration: none; color: #555; border-radius: 8px; transition: background .12s;
        }
        .ch-dropdown-link:hover { background: #f5f5f3; color: #111; }
        .ch-dropdown-sep { height: 1px; background: #ebebeb; margin: 4px 0; }

        /* Hero */
        .ch-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(${aRgb},.07); color: ${a};
          font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 100px; margin-bottom: 20px;
        }
        .ch-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: ${a}; }
        .ch-h1 {
          font-size: clamp(1.85rem, 4.5vw, 2.9rem); font-weight: 400;
          line-height: 1.2; color: #111; margin: 0 0 12px; letter-spacing: -.025em;
        }
        .ch-subtitle { font-size: .9375rem; color: #888; line-height: 1.65; margin: 0; }

        /* Chat box */
        .ch-box {
          border: 1px solid #e8e8e6;
          border-radius: 20px; background: #fff;
          box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 6px 48px rgba(0,0,0,.08);
          display: flex; flex-direction: column; overflow: hidden;
          height: 560px;
        }
        .ch-box-header {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 18px; border-bottom: 1px solid #eee; flex-shrink: 0;
        }
        .ch-ai-avatar {
          width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
          background: linear-gradient(135deg, ${a}, ${brand.accentLight});
          display: flex; align-items: center; justify-content: center;
          font-size: .62rem; font-weight: 800; color: #fff; letter-spacing: .02em;
        }
        .ch-online-dot { width: 5px; height: 5px; border-radius: 50%; background: #22c55e; }

        /* Messages */
        .ch-msgs { flex: 1; overflow-y: auto; padding: 20px 18px; display: flex; flex-direction: column; gap: 18px; }
        .ch-msgs::-webkit-scrollbar { width: 3px; }
        .ch-msgs::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }

        .ch-msg-user { display: flex; justify-content: flex-end; }
        .ch-bubble-user {
          background: ${a}; color: #fff;
          padding: 10px 16px; border-radius: 18px 18px 4px 18px;
          font-size: .9rem; line-height: 1.6; max-width: 72%; white-space: pre-wrap;
        }
        .ch-msg-ai { display: flex; gap: 10px; align-items: flex-start; }
        .ch-bubble-ai { font-size: .9rem; line-height: 1.65; color: #222; white-space: pre-wrap; max-width: 86%; padding-top: 2px; }

        /* Chips */
        .ch-chips { padding: 0 18px 14px; display: flex; flex-wrap: wrap; gap: 7px; flex-shrink: 0; }
        .ch-chip {
          padding: 7px 14px; border-radius: 100px;
          border: 1px solid #e8e8e6; background: #fafaf8;
          font-size: .8rem; color: #666; cursor: pointer; font-family: inherit;
          font-weight: 500; transition: all .15s;
        }
        .ch-chip:hover { background: rgba(${aRgb},.07); border-color: rgba(${aRgb},.3); color: ${a}; }

        /* Input area */
        .ch-input-area { padding: 12px 14px 14px; border-top: 1px solid #eee; flex-shrink: 0; }
        .ch-input-wrap {
          display: flex; align-items: flex-end; gap: 10px;
          background: #f8f8f6; border: 1.5px solid #e8e8e6;
          border-radius: 14px; padding: 10px 10px 10px 16px;
          transition: border-color .15s, box-shadow .15s;
        }
        .ch-input-wrap:focus-within {
          border-color: rgba(${aRgb},.45);
          box-shadow: 0 0 0 3px rgba(${aRgb},.07);
        }
        .ch-textarea {
          flex: 1; background: transparent; border: none; outline: none;
          color: #111; font-size: .9rem; resize: none; max-height: 108px;
          line-height: 1.5; font-family: inherit;
        }
        .ch-textarea::placeholder { color: #bbb; }
        .ch-send {
          width: 34px; height: 34px; border-radius: 10px; border: none;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; cursor: pointer; transition: background .15s;
        }
        .ch-send-active { background: ${a}; }
        .ch-send-disabled { background: #eee; cursor: not-allowed; }

        /* WA buttons */
        .ch-wa-sticky {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 11px 20px; border-radius: 100px;
          color: #fff; font-size: .875rem; font-weight: 600; text-decoration: none;
          transition: opacity .15s; border: none; cursor: pointer; font-family: inherit;
          margin-bottom: 8px;
        }
        .ch-wa-green { background: #22c55e; }
        .ch-wa-green:hover { background: #16a34a; }
        .ch-wa-dark { background: #16a34a; }

        .ch-wa-inline {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 100px;
          background: #22c55e; color: #fff; font-size: .875rem; font-weight: 600;
          text-decoration: none; transition: background .15s; border: none; cursor: pointer;
        }
        .ch-wa-inline:hover { background: #16a34a; }
        .ch-action-chip {
          padding: 6px 14px; border-radius: 100px;
          border: 1px solid #e8e8e6; background: #f8f8f6;
          font-size: .775rem; color: #666; cursor: pointer; font-family: inherit;
          transition: all .15s;
        }
        .ch-action-chip:hover { background: #f0f0ee; color: #333; }

        /* Typing dots */
        @keyframes ch-dot { 0%,80%,100%{transform:scale(.55);opacity:.3;} 40%{transform:scale(1);opacity:1;} }
        .ch-dot { animation: ch-dot 1.2s ease infinite; }
        .ch-dot:nth-child(2){animation-delay:.2s;}
        .ch-dot:nth-child(3){animation-delay:.4s;}

        /* Fade-up */
        @keyframes ch-up { from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);} }
        .ch-up { animation: ch-up 0.28s ease forwards; }

        /* Trust bar */
        .ch-trust {
          border-top: 1px solid #ebebeb; border-bottom: 1px solid #ebebeb;
          padding: 20px; display: flex; justify-content: center;
        }
        .ch-trust-inner {
          display: flex; align-items: center; gap: 0; max-width: 480px; width: 100%; justify-content: center;
        }
        .ch-trust-item { text-align: center; flex: 1; }
        .ch-trust-sep { width: 1px; height: 32px; background: #ebebeb; flex-shrink: 0; }
        .ch-trust-num { font-size: 1rem; font-weight: 700; color: ${a}; }
        .ch-trust-label { font-size: .7rem; color: #aaa; margin-top: 2px; }

        /* Pricing */
        .ch-price-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .ch-price-card {
          border: 1.5px solid #e8e8e6; border-radius: 18px;
          padding: 24px; background: #fff; display: flex; flex-direction: column;
          transition: box-shadow .2s;
        }
        .ch-price-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.06); }
        .ch-price-featured { border-color: ${a} !important; border-width: 2px !important; }
        .ch-price-badge {
          position: absolute; top: 0; right: 0;
          background: ${a}; color: #fff;
          font-size: .6rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 0 16px 0 10px;
        }
        .ch-price-label { font-size: .68rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 10px; }
        .ch-price-amount { font-size: 1.9rem; font-weight: 800; color: #111; line-height: 1; margin-bottom: 4px; }
        .ch-price-per { font-size: .78rem; color: #bbb; margin-bottom: 20px; }
        .ch-price-list { list-style: none; padding: 0; margin: 0 0 20px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .ch-price-item { display: flex; align-items: flex-start; gap: 8px; font-size: .8375rem; color: #555; }
        .ch-btn-primary {
          display: block; text-align: center; padding: 12px;
          border-radius: 10px; background: ${a}; color: #fff;
          font-size: .875rem; font-weight: 600; text-decoration: none;
          transition: opacity .15s; border: none; cursor: pointer; font-family: inherit;
        }
        .ch-btn-primary:hover { opacity: .88; }
        .ch-btn-secondary {
          display: block; text-align: center; padding: 12px;
          border-radius: 10px; border: 1.5px solid #e8e8e6;
          background: #fff; color: #555;
          font-size: .875rem; font-weight: 600; text-decoration: none;
          transition: background .15s; cursor: pointer;
        }
        .ch-btn-secondary:hover { background: #f8f8f6; }

        /* Guarantee */
        .ch-guarantee {
          background: rgba(${aRgb},.04);
          border-top: 1px solid rgba(${aRgb},.12);
          border-bottom: 1px solid rgba(${aRgb},.12);
          padding: 22px 20px; text-align: center;
        }
        .ch-guarantee-inner {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: .9rem; color: #333;
        }
        .ch-guarantee-icon { color: ${a}; display: flex; align-items: center; }

        /* Footer */
        .ch-footer { padding: 32px 20px; text-align: center; border-top: 1px solid #ebebeb; }
        .ch-footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px 24px; margin-bottom: 14px; }
        .ch-footer-link { font-size: .8rem; text-decoration: none; color: #ccc; }
        .ch-footer-link:hover { color: #888; }
        .ch-footer-link-active { color: ${a} !important; font-weight: 600; }
        .ch-footer-copy { font-size: .75rem; color: #ddd; }
        .ch-footer-copy a { color: #ccc; text-decoration: none; }
        .ch-footer-copy a:hover { color: #888; }

        /* Caption below chat */
        .ch-caption { text-align: center; font-size: .72rem; color: #ccc; margin-top: 10px; letter-spacing: .01em; }

        /* Section heading */
        .ch-section-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: 1.7rem; font-weight: 400; color: #111;
          letter-spacing: -.02em; margin: 0 0 8px;
        }
        .ch-section-sub { font-size: .875rem; color: #aaa; margin: 0; }

        /* Responsive */
        @media(max-width: 640px) {
          .ch-h1 { font-size: clamp(1.6rem, 6vw, 2rem); }
          .ch-box { height: 490px; }
          .ch-price-grid { grid-template-columns: 1fr; }
          .ch-bubble-user { max-width: 85%; }
          .ch-bubble-ai { max-width: 92%; }
          .ch-trust-inner { gap: 0; }
        }
      `}</style>

      <div className="ch-root">

        {/* ── NAV ── */}
        <nav className="ch-nav">
          <a href="/" className="ch-logo">
            <span className="ch-logo-accent">{brand.name.slice(0, 3)}</span>
            <span className="ch-logo-rest">{brand.name.slice(3)}</span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <a href="/harga" className="ch-nav-link">Harga</a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="ch-nav-link">Konsultasi</a>
            <div style={{ position: "relative" }}>
              <button className="ch-nav-link" onClick={() => setMenuOpen(!menuOpen)}>
                Situs Lain ▾
              </button>
              {menuOpen && (
                <div className="ch-dropdown">
                  {otherBrands.map((b) => (
                    <a
                      key={b.id}
                      href={`https://${b.id}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ch-dropdown-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span style={{ color: b.accentLight, fontWeight: 600 }}>{b.name.slice(0, 4)}</span>
                      {b.name.slice(4)}
                    </a>
                  ))}
                  <div className="ch-dropdown-sep" />
                  <a
                    href="https://hakio.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ch-dropdown-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span style={{ color: "#3b5fc0", fontWeight: 600 }}>Hakio</span>.id — Portal Utama
                  </a>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* ── MAIN ── */}
        <main style={{ paddingTop: "54px" }}>

          {/* ── HERO + CHAT ── */}
          <section style={{ maxWidth: "760px", margin: "0 auto", padding: "44px 20px 0" }}>

            {/* Headline */}
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div className="ch-badge">
                <span className="ch-badge-dot" />
                Konsultasi Gratis · AI-Powered · Garansi Termurah
              </div>
              <h1 className="ch-h1">{landing.heroTitle}</h1>
              <p className="ch-subtitle" style={{ maxWidth: "520px", margin: "0 auto" }}>
                {landing.heroSubtitle}
              </p>
            </div>

            {/* ── CHAT BOX (always expanded) ── */}
            <div className="ch-box">

              {/* Header */}
              <div className="ch-box-header">
                <div className="ch-ai-avatar">AI</div>
                <div>
                  <div style={{ fontSize: ".875rem", fontWeight: 600, color: "#111" }}>
                    Asisten Merek AI
                  </div>
                  <div style={{ fontSize: ".7rem", color: "#22c55e", display: "flex", alignItems: "center", gap: "5px" }}>
                    <span className="ch-online-dot" />
                    Online sekarang
                  </div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: ".7rem", color: "#ccc", fontWeight: 400 }}>
                  Ditenagai GPT-4o
                </div>
              </div>

              {/* Messages */}
              <div ref={msgsRef} className="ch-msgs">
                {messages.map((msg, i) => (
                  <div key={i} className={`ch-up ${msg.role === "user" ? "ch-msg-user" : "ch-msg-ai"}`}>
                    {msg.role === "assistant" && (
                      <div className="ch-ai-avatar" style={{ width: "27px", height: "27px", borderRadius: "7px", fontSize: ".58rem", flexShrink: 0 }}>
                        AI
                      </div>
                    )}
                    <div className={msg.role === "user" ? "ch-bubble-user" : "ch-bubble-ai"}>
                      {msg.content}

                      {/* WA CTA on last AI message */}
                      {msg.role === "assistant" && showWA && i === messages.length - 1 && !waClicked && (
                        <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            <button
                              className="ch-action-chip"
                              onClick={() => sendMessage("Bagaimana cara cek apakah nama merek saya sudah terdaftar?")}
                            >
                              Cara cek nama merek
                            </button>
                            <button
                              className="ch-action-chip"
                              onClick={() => sendMessage("Berapa total biaya yang harus saya bayar?")}
                            >
                              Total biaya?
                            </button>
                          </div>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleWaClick}
                            className="ch-wa-inline"
                          >
                            <WaIcon />
                            Lanjut ke WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="ch-up ch-msg-ai">
                    <div className="ch-ai-avatar" style={{ width: "27px", height: "27px", borderRadius: "7px", fontSize: ".58rem", flexShrink: 0 }}>
                      AI
                    </div>
                    <div style={{ display: "flex", gap: "4px", alignItems: "center", paddingTop: "8px" }}>
                      <span className="ch-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ccc", display: "inline-block" }} />
                      <span className="ch-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ccc", display: "inline-block" }} />
                      <span className="ch-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ccc", display: "inline-block" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Chips — only when no conversation yet */}
              {!hasConversation && (
                <div className="ch-chips">
                  {brand.chips.map((chip) => (
                    <button key={chip} className="ch-chip" onClick={() => sendMessage(chip)}>
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input area */}
              <div className="ch-input-area">
                {showWA && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWaClick}
                    className={`ch-wa-sticky ${waClicked ? "ch-wa-dark" : "ch-wa-green"}`}
                  >
                    <WaIcon />
                    {waClicked
                      ? "WhatsApp Terbuka ✓"
                      : leadData?.user
                      ? `Lanjut ke WhatsApp, ${leadData.user}`
                      : "Lanjut ke WhatsApp"}
                  </a>
                )}
                <div className="ch-input-wrap">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Tanya seputar merek dagang..."
                    rows={1}
                    disabled={loading}
                    className="ch-textarea"
                    style={{ scrollbarWidth: "none" }}
                    onInput={(e) => {
                      const t = e.currentTarget;
                      t.style.height = "auto";
                      t.style.height = Math.min(t.scrollHeight, 108) + "px";
                    }}
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={loading || !input.trim()}
                    className={`ch-send ${loading || !input.trim() ? "ch-send-disabled" : "ch-send-active"}`}
                  >
                    <SendIcon active={!loading && !!input.trim()} />
                  </button>
                </div>
              </div>
            </div>

            <p className="ch-caption">Gratis · Instan · Ditenagai GPT-4o · Dilanjut via WhatsApp</p>
          </section>

          {/* ── TRUST BAR ── */}
          <div className="ch-trust" style={{ marginTop: "48px" }}>
            <div className="ch-trust-inner">
              <div className="ch-trust-item">
                <div className="ch-trust-num">5.000+</div>
                <div className="ch-trust-label">merek terdaftar</div>
              </div>
              <div className="ch-trust-sep" />
              <div className="ch-trust-item">
                <div className="ch-trust-num">7 tahun</div>
                <div className="ch-trust-label">pengalaman</div>
              </div>
              <div className="ch-trust-sep" />
              <div className="ch-trust-item">
                <div className="ch-trust-num">Garansi</div>
                <div className="ch-trust-label">harga termurah</div>
              </div>
            </div>
          </div>

          {/* ── PRICING ── */}
          <section style={{ maxWidth: "720px", margin: "0 auto", padding: "64px 20px" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h2 className="ch-section-title">Harga Pendaftaran Merek</h2>
              <p className="ch-section-sub">
                Semua sudah termasuk biaya resmi DJKI + pendampingan hingga sertifikat terbit
              </p>
            </div>

            <div className="ch-price-grid">
              {/* UMKM */}
              <div className="ch-price-card ch-price-featured" style={{ position: "relative" }}>
                <div className="ch-price-badge">Paling Laris</div>
                <div className="ch-price-label" style={{ color: a }}>UMKM / Perorangan</div>
                <div className="ch-price-amount">Rp 1.299.000</div>
                <div className="ch-price-per">per kelas NICE</div>
                <ul className="ch-price-list">
                  {[
                    "Biaya PNBP DJKI termasuk",
                    "Pemeriksaan nama merek",
                    "Konsultasi kelas NICE",
                    "Pengajuan e-Filing DJKI",
                    "Nomor permohonan resmi",
                    "Pendampingan hingga sertifikat",
                  ].map((item) => (
                    <li key={item} className="ch-price-item">
                      <CheckIcon color={a} />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="ch-btn-primary">
                  Daftar Sekarang
                </a>
              </div>

              {/* PT */}
              <div className="ch-price-card">
                <div className="ch-price-label" style={{ color: "#bbb" }}>Perusahaan / PT / CV</div>
                <div className="ch-price-amount">Rp 2.490.000</div>
                <div className="ch-price-per">per kelas NICE</div>
                <ul className="ch-price-list">
                  {[
                    "Biaya PNBP DJKI termasuk",
                    "Pemeriksaan nama merek",
                    "Konsultasi kelas NICE",
                    "Pengajuan e-Filing DJKI",
                    "Nomor permohonan resmi",
                    "Pendampingan hingga sertifikat",
                  ].map((item) => (
                    <li key={item} className="ch-price-item">
                      <CheckIcon color="#ccc" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="ch-btn-secondary">
                  Konsultasi Dulu
                </a>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <a href="/harga" style={{ fontSize: ".8125rem", color: a, textDecoration: "none", fontWeight: 500 }}>
                Lihat rincian biaya lengkap →
              </a>
            </div>
          </section>

          {/* ── GUARANTEE ── */}
          <div className="ch-guarantee">
            <div className="ch-guarantee-inner">
              <span className="ch-guarantee-icon"><ShieldIcon /></span>
              <strong>Garansi harga termurah se-Indonesia</strong>
              <span style={{ color: "#888", fontSize: ".875rem" }}>
                — ada yang lebih murah? Kami ganti selisihnya.
              </span>
            </div>
          </div>

          {/* ── FOOTER ── */}
          <footer className="ch-footer">
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
              <div className="ch-footer-links">
                {Object.values(BRANDS).map((b) => (
                  <a
                    key={b.id}
                    href={`https://${b.id}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`ch-footer-link ${b.id === brand.id ? "ch-footer-link-active" : ""}`}
                    style={b.id === brand.id ? { color: a } : undefined}
                  >
                    {b.name}
                  </a>
                ))}
                <a
                  href="https://hakio.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ch-footer-link"
                >
                  Hakio.id
                </a>
              </div>
              <p className="ch-footer-copy">
                © {new Date().getFullYear()} {brand.name} · Layanan pendaftaran merek dagang di Indonesia ·{" "}
                <a href="/harga">Harga</a>
                {" · "}
                <a href={waLink} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </p>
            </div>
          </footer>

        </main>
      </div>
    </>
  );
}
