"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Brand } from "@/lib/brands";
import JsonLd from "./JsonLd";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE =
  "Halo! 👋 Saya AI CekHaki. Ketik nama brand yang ingin dicek — **100% gratis** dan instan!\n\nSaya akan bantu cek ketersediaan di database PDKI/DJKI, rekomendasi kelas NICE, dan estimasi biaya.\n\nSetelah itu, tim Hakio siap lanjut via WhatsApp untuk proses pendaftaran resminya.";

const QUICK_PILLS = [
  { label: "Cek Nama Merek", template: "Saya ingin cek nama merek: ", icon: "search" },
  { label: "Kelas NICE", template: "Saya butuh rekomendasi kelas NICE untuk bisnis ", icon: "grid" },
  { label: "Analisa Kemiripan", template: "Tolong analisa kemiripan merek ", icon: "file" },
  { label: "Biaya Pendaftaran", template: "Berapa biaya pendaftaran merek untuk ", icon: "coin" },
] as const;

function fmt(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
}

export default function CekHakiHeroPage({ brand }: { brand: Brand }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWA, setShowWA] = useState(false);
  const [waClicked, setWaClicked] = useState(false);
  const [activePill, setActivePill] = useState<string>(QUICK_PILLS[0].label);
  const [menuOpen, setMenuOpen] = useState(false);
  const [leadData, setLeadData] = useState<{
    nama?: string;
    kelas?: string;
    entitas?: string;
    user?: string;
  } | null>(null);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasConversation = messages.length > 0;

  const waText = leadData?.nama
    ? `Halo CekHaki!${leadData.user ? ` Nama saya ${leadData.user}.` : ""} Saya sudah cek merek via AI dan ingin lanjut pendaftaran:\n- Nama Merek: ${leadData.nama}\n- Kelas NICE: ${leadData.kelas}\n- Jenis Entitas: ${leadData.entitas}\n\nBisa bantu proses selanjutnya?`
    : `Halo Hakio! Saya ingin konsultasi cek merek via CekHaki AI. Mohon dibantu.`;
  const waLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(waText)}`;

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
    if (hasConversation) {
      window.scrollTo({ top: (chatRef.current?.offsetTop ?? 0) - 80, behavior: "smooth" });
    }
  }, [messages, loading, hasConversation]);

  const sendMessage = useCallback(
    async (text: string) => {
      const userText = text.trim();
      if (!userText || loading) return;

      const isFirstMessage = messages.length === 0;
      const seeded: Message[] = isFirstMessage
        ? [{ role: "assistant", content: INITIAL_MESSAGE }, { role: "user", content: userText }]
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
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Batas percakapan gratis telah tercapai. Hubungi tim Hakio langsung via WhatsApp untuk konsultasi lanjutan.",
            },
          ]);
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

  const usePill = (pill: (typeof QUICK_PILLS)[number]) => {
    setActivePill(pill.label);
    setInput(pill.template);
    setTimeout(() => {
      const el = inputRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }, 20);
  };

  const handleWaClick = () => {
    setWaClicked(true);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Terima kasih${leadData?.user ? `, ${leadData.user}` : ""}! Admin Hakio akan segera membalas via WhatsApp. Selamat mengamankan merek Anda!`,
      },
    ]);
  };

  return (
    <>
      <JsonLd brand={brand} />
      <style>{`
        /* ========= Reset & fonts ========= */
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Caveat:wght@500;600&display=swap');
        .ck * { box-sizing: border-box; margin: 0; padding: 0; }
        .ck {
          --navy-900:#0F1E3C; --navy-800:#14264A; --gold-500:#D5A34A;
          --gold-400:#E4B963; --gold-100:#F5E4C1; --cream-50:#FBF6EC;
          --cream-100:#F5EDDD; --cream-200:#EEE3CC; --border:rgba(15,30,60,.08);
          --border-strong:rgba(15,30,60,.14); --text-muted:#5F6B85; --text-soft:#8794AE;
          --shadow-card:0 20px 60px -20px rgba(15,30,60,.15);
          --shadow-bubble:0 10px 30px -12px rgba(15,30,60,.18);
          --font-body:"Plus Jakarta Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          --font-script:"Caveat",cursive;
          font-family:var(--font-body); color:var(--navy-900); min-height:100vh;
          background:linear-gradient(135deg,#FBF6EC 0%,#F3E8D3 55%,#EEE0C4 100%);
          overflow-x:hidden; position:relative; padding-top:76px;
          -webkit-font-smoothing:antialiased;
        }
        .ck::before {
          content:""; position:fixed; top:0; right:-100px;
          width:60vw; height:100vh;
          background:
            radial-gradient(circle at 90% 30%, rgba(213,163,74,.14) 0%, transparent 45%),
            radial-gradient(circle at 70% 80%, rgba(15,30,60,.05) 0%, transparent 50%);
          pointer-events:none; z-index:0;
        }
        .ck::after {
          content:""; position:fixed; bottom:-150px; left:-150px;
          width:500px; height:500px;
          background:radial-gradient(circle, rgba(213,163,74,.10) 0%, transparent 60%);
          pointer-events:none; z-index:0;
        }
        .ck-deco-h {
          position:fixed; right:-80px; top:50%; transform:translateY(-50%);
          width:520px; height:520px; opacity:.35; pointer-events:none; z-index:0;
        }
        .ck-deco-left {
          position:fixed; left:0; top:35%; width:200px; height:400px;
          opacity:.5; pointer-events:none; z-index:0;
        }

        /* ========= Navbar ========= */
        .ck-nav {
          position:fixed; top:0; left:0; right:0; z-index:100;
          background:rgba(255,255,255,.72);
          backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
          border-bottom:1px solid var(--border); height:76px;
        }
        .ck-nav-inner {
          max-width:1440px; margin:0 auto; height:100%;
          padding:0 32px; display:flex; align-items:center;
          justify-content:space-between; gap:24px;
        }
        .ck-brand { display:flex; align-items:center; gap:12px; text-decoration:none; color:inherit; }
        .ck-brand-mark {
          width:44px; height:44px; border-radius:12px;
          background:linear-gradient(135deg,var(--navy-800),var(--navy-900));
          display:flex; align-items:center; justify-content:center;
          color:var(--gold-500); font-weight:800; font-size:22px;
          letter-spacing:-.03em;
          box-shadow:0 6px 16px -6px rgba(15,30,60,.4);
        }
        .ck-brand-text { display:flex; flex-direction:column; line-height:1.1; }
        .ck-brand-title { font-weight:800; font-size:1.05rem; color:var(--navy-900); letter-spacing:-.02em; }
        .ck-brand-sub { font-size:.68rem; color:var(--text-muted); font-weight:500; margin-top:2px; }
        .ck-links { display:flex; align-items:center; gap:4px; }
        .ck-link {
          font-size:.875rem; font-weight:500; color:var(--text-muted);
          text-decoration:none; padding:8px 14px; border-radius:8px;
          transition:color .15s,background .15s; position:relative;
        }
        .ck-link:hover { color:var(--navy-900); background:rgba(15,30,60,.04); }
        .ck-link.active { color:var(--navy-900); font-weight:600; }
        .ck-link.active::after {
          content:""; position:absolute; left:14px; right:14px; bottom:4px;
          height:2px; background:var(--gold-500); border-radius:2px;
        }
        .ck-actions { display:flex; align-items:center; gap:14px; }
        .ck-bell {
          width:44px; height:44px; border:1px solid var(--border); border-radius:12px;
          background:#fff; display:flex; align-items:center; justify-content:center;
          cursor:pointer; position:relative; color:var(--navy-900);
          transition:background .15s;
        }
        .ck-bell:hover { background:var(--cream-50); }
        .ck-bell-dot {
          position:absolute; top:10px; right:11px; width:8px; height:8px;
          border-radius:50%; background:#EF4444; border:2px solid #fff;
        }
        .ck-cta {
          display:inline-flex; align-items:center; gap:10px;
          padding:12px 22px; border-radius:999px;
          background:var(--navy-900); color:#fff; text-decoration:none;
          font-weight:600; font-size:.9rem;
          transition:background .15s,transform .1s;
          box-shadow:0 8px 20px -8px rgba(15,30,60,.5);
        }
        .ck-cta:hover { background:var(--navy-800); }
        .ck-cta:active { transform:translateY(1px); }
        .ck-cta-crown { color:var(--gold-500); }
        .ck-menu-btn {
          display:none; width:44px; height:44px; border-radius:12px;
          border:1px solid var(--border); background:#fff;
          align-items:center; justify-content:center; cursor:pointer;
          color:var(--navy-900);
        }
        .ck-mobile-menu {
          display:none; position:absolute; top:76px; left:0; right:0;
          background:#fff; border-bottom:1px solid var(--border);
          padding:16px; flex-direction:column; gap:4px;
          box-shadow:0 8px 20px -8px rgba(15,30,60,.1);
        }
        .ck-mobile-menu.open { display:flex; }

        /* ========= Main ========= */
        .ck-main {
          flex:1; max-width:1440px; width:100%; margin:0 auto;
          padding:24px 32px 40px; position:relative; z-index:1;
        }

        /* ========= Hero ========= */
        .ck-hero { position:relative; padding:56px 0 32px; text-align:center; }
        .ck-hero-pill {
          display:inline-flex; align-items:center; gap:10px;
          padding:8px 16px 8px 8px; background:#fff;
          border:1px solid var(--border); border-radius:999px;
          box-shadow:0 4px 12px -4px rgba(15,30,60,.08);
          font-size:.875rem; font-weight:600; color:var(--navy-900);
          margin-bottom:36px;
        }
        .ck-hero-pill-mark {
          width:28px; height:28px; border-radius:8px;
          background:linear-gradient(135deg,var(--navy-800),var(--navy-900));
          color:var(--gold-500); display:flex; align-items:center; justify-content:center;
          font-weight:800; font-size:.85rem;
        }
        .ck-hero h1 {
          font-size:clamp(2.2rem,5.5vw,4.5rem); font-weight:800;
          letter-spacing:-.03em; line-height:1.05; color:var(--navy-900);
          margin-bottom:24px;
        }
        .ck-accent { color:var(--gold-500); }
        .ck-hero-sub {
          font-size:clamp(1rem,1.5vw,1.2rem); color:var(--text-muted);
          max-width:640px; margin:0 auto; line-height:1.55;
        }

        /* Mascot area */
        .ck-mascot-area {
          position:relative; margin:40px auto 0; max-width:800px;
          height:320px; display:flex; align-items:center; justify-content:center;
        }
        .ck-mascot {
          height:280px; width:auto;
          filter:drop-shadow(0 20px 40px rgba(15,30,60,.2));
          animation:ckFloat 4.5s ease-in-out infinite; z-index:2;
        }
        @keyframes ckFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .ck-bubble {
          position:absolute; display:flex; align-items:center; gap:10px;
          background:#fff; padding:12px 18px; border-radius:20px;
          box-shadow:var(--shadow-bubble); font-size:.9rem; font-weight:500;
          color:var(--navy-900); border:1px solid var(--border);
          animation:ckFloatBubble 5s ease-in-out infinite;
        }
        .ck-bubble.left { left:15%; top:12%; animation-delay:.3s; }
        .ck-bubble.right { right:12%; top:45%; animation-delay:1.2s; }
        @keyframes ckFloatBubble { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .ck-bubble-mark {
          width:24px; height:24px; border-radius:6px;
          background:linear-gradient(135deg,var(--navy-800),var(--navy-900));
          color:var(--gold-500); display:flex; align-items:center; justify-content:center;
          font-weight:800; font-size:.7rem; flex-shrink:0;
        }
        .ck-deco-script {
          position:absolute; left:2%; top:52%;
          font-family:var(--font-script); font-size:1.6rem;
          color:var(--gold-500); line-height:1.15; font-weight:600;
          text-align:left; z-index:1;
        }
        .ck-deco-flourish {
          display:block; width:110px; height:14px; margin-top:6px;
          background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 110 14'><path d='M2 8 C 22 2, 44 12, 64 6 S 100 4, 108 8' stroke='%23D5A34A' stroke-width='2' fill='none' stroke-linecap='round'/></svg>") no-repeat;
        }
        .ck-deco-upper {
          position:absolute; right:2%; top:55%; text-align:right;
          font-size:.7rem; font-weight:600; letter-spacing:.35em;
          color:rgba(15,30,60,.35); line-height:2;
          text-transform:uppercase; z-index:1;
        }

        /* ========= Composer card ========= */
        .ck-composer {
          position:relative; z-index:3; max-width:960px; margin:32px auto 0;
          background:#fff; border:1px solid var(--border); border-radius:28px;
          padding:28px 32px; box-shadow:var(--shadow-card);
        }
        .ck-composer-head {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:20px; flex-wrap:wrap; gap:12px;
        }
        .ck-composer-title { display:flex; align-items:center; gap:12px; }
        .ck-composer-title-icon {
          width:40px; height:40px; border-radius:12px;
          background:var(--cream-100); display:flex; align-items:center;
          justify-content:center; color:var(--navy-900); flex-shrink:0;
        }
        .ck-composer-title h2 { font-size:1.1rem; font-weight:700; color:var(--navy-900); letter-spacing:-.01em; }
        .ck-composer-badge {
          display:inline-flex; align-items:center; gap:6px;
          font-size:.8rem; font-weight:500; color:var(--text-muted);
        }
        .ck-composer-badge svg { color:var(--navy-900); }
        .ck-composer-input-wrap {
          position:relative; display:flex; align-items:center; gap:12px;
          background:var(--cream-50); border:1px solid var(--border);
          border-radius:999px; padding:8px 8px 8px 20px;
          transition:border-color .15s,background .15s;
        }
        .ck-composer-input-wrap:focus-within { border-color:var(--gold-500); background:#fff; }
        .ck-composer-clip { color:var(--text-soft); flex-shrink:0; display:flex; align-items:center; }
        .ck-composer-input {
          flex:1; background:transparent; border:none; outline:none;
          font-family:var(--font-body); font-size:1rem; color:var(--navy-900);
          padding:12px 8px; min-height:24px; resize:none;
          line-height:1.5; max-height:120px;
        }
        .ck-composer-input::placeholder { color:var(--text-soft); }
        .ck-composer-send {
          width:52px; height:52px; border-radius:50%;
          background:var(--navy-900); color:#fff; border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:background .15s,transform .1s; flex-shrink:0;
          box-shadow:0 6px 14px -6px rgba(15,30,60,.5);
        }
        .ck-composer-send:hover:not(:disabled) { background:var(--navy-800); }
        .ck-composer-send:active { transform:scale(.96); }
        .ck-composer-send:disabled { opacity:.4; cursor:not-allowed; }
        .ck-pills { display:flex; flex-wrap:wrap; gap:12px; margin-top:20px; }
        .ck-pill {
          display:inline-flex; align-items:center; gap:10px;
          padding:12px 22px; border-radius:999px;
          border:1px solid var(--border); background:#fff;
          color:var(--navy-900); font-size:.9rem; font-weight:500;
          font-family:var(--font-body); cursor:pointer; transition:all .15s;
        }
        .ck-pill:hover { background:var(--cream-50); border-color:var(--border-strong); }
        .ck-pill.active {
          background:var(--cream-100); border-color:var(--gold-500);
          color:var(--navy-900); font-weight:600;
        }
        .ck-pill-icon { color:var(--gold-500); flex-shrink:0; display:flex; align-items:center; }

        /* ========= Chat view ========= */
        .ck-chat-view {
          max-width:960px; margin:20px auto 0; padding:24px;
          background:#fff; border:1px solid var(--border); border-radius:24px;
          box-shadow:var(--shadow-card); position:relative; z-index:3;
          display:flex; flex-direction:column; gap:16px;
        }
        .ck-msg { display:flex; gap:12px; align-items:flex-start; }
        .ck-msg.user { justify-content:flex-end; }
        .ck-msg-avatar {
          width:36px; height:36px; border-radius:10px;
          background:linear-gradient(135deg,var(--navy-800),var(--navy-900));
          color:var(--gold-500); display:flex; align-items:center; justify-content:center;
          font-weight:800; font-size:.85rem; flex-shrink:0;
        }
        .ck-msg-bubble { font-size:.95rem; line-height:1.6; white-space:pre-wrap; max-width:75%; }
        .ck-msg.ai .ck-msg-bubble { color:var(--navy-900); padding-top:4px; }
        .ck-msg.user .ck-msg-bubble {
          background:var(--navy-900); color:#fff;
          border-radius:18px 18px 4px 18px; padding:12px 18px;
        }
        .ck-wa-btn {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 24px; border-radius:999px;
          background:#25D366; color:#fff; font-size:.9rem; font-weight:600;
          text-decoration:none; margin-top:14px; transition:opacity .15s; border:none; cursor:pointer;
        }
        .ck-wa-btn:hover { opacity:.9; }
        .ck-typing { display:flex; gap:5px; align-items:center; padding:8px 0; }
        .ck-typing span {
          width:7px; height:7px; background:var(--text-soft);
          border-radius:50%; animation:ckDot 1.2s ease infinite;
        }
        .ck-typing span:nth-child(2) { animation-delay:.2s; }
        .ck-typing span:nth-child(3) { animation-delay:.4s; }
        @keyframes ckDot { 0%,80%,100%{opacity:.3;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }

        /* ========= Footer ========= */
        .ck-footer {
          border-top:1px solid var(--border);
          padding:32px 20px 28px;
          background:rgba(255,255,255,.5); backdrop-filter:blur(8px);
          position:relative; z-index:1;
        }
        .ck-footer-links {
          max-width:960px; margin:0 auto 16px;
          display:flex; flex-wrap:wrap; justify-content:center; gap:6px 18px;
        }
        .ck-footer-links a {
          font-size:.8rem; color:var(--text-muted); text-decoration:none;
          transition:color .15s;
        }
        .ck-footer-links a:hover { color:var(--navy-900); }
        .ck-footer-links span { color:var(--text-soft); font-size:.75rem; }
        .ck-footer-info {
          text-align:center; font-size:.75rem;
          color:var(--text-muted); line-height:1.7;
        }
        .ck-footer-info strong { color:var(--navy-900); }
        .ck-footer-copy { text-align:center; font-size:.7rem; color:var(--text-soft); margin-top:8px; }

        /* ========= Responsive ========= */
        @media (max-width:900px) {
          .ck-links { display:none; }
          .ck-menu-btn { display:flex; }
          .ck-brand-sub { display:none; }
          .ck-deco-script, .ck-deco-upper { display:none; }
          .ck-mascot { height:200px; }
          .ck-mascot-area { height:240px; }
          .ck-bubble.left { left:5%; top:5%; font-size:.8rem; }
          .ck-bubble.right { right:5%; top:50%; font-size:.8rem; }
          .ck-composer { padding:20px; margin-top:20px; border-radius:22px; }
          .ck-pills { overflow-x:auto; flex-wrap:nowrap; padding-bottom:4px; }
          .ck-pill { flex-shrink:0; }
          .ck-hero { padding:32px 0 20px; }
          .ck-main { padding:16px 20px 32px; }
          .ck-nav-inner { padding:0 20px; }
          .ck-deco-h { width:320px; height:320px; right:-100px; }
        }
        @media (max-width:600px) {
          .ck-cta span { display:none; }
          .ck-cta { padding:12px 14px; }
          .ck-composer-head { flex-direction:column; align-items:flex-start; }
          .ck-composer-badge { align-self:flex-end; }
        }
      `}</style>

      <div className="ck">
        {/* Decorative background */}
        <svg className="ck-deco-h" viewBox="0 0 400 400" aria-hidden="true">
          <path d="M80 40 C 60 120, 40 200, 80 360" stroke="#D5A34A" strokeWidth="18" fill="none" strokeLinecap="round" opacity=".55" />
          <path d="M320 40 C 340 120, 360 200, 320 360" stroke="#0F1E3C" strokeWidth="18" fill="none" strokeLinecap="round" opacity=".45" />
          <path d="M80 200 L 320 200" stroke="#D5A34A" strokeWidth="14" fill="none" strokeLinecap="round" opacity=".5" />
        </svg>
        <svg className="ck-deco-left" viewBox="0 0 200 400" aria-hidden="true">
          <path d="M-20 40 C 60 120, 120 200, 20 380" stroke="#D5A34A" strokeWidth="2" fill="none" opacity=".4" />
        </svg>

        {/* Navbar */}
        <nav className="ck-nav" role="navigation" aria-label="Utama">
          <div className="ck-nav-inner">
            <a className="ck-brand" href="/" aria-label="CekHaki beranda">
              <div className="ck-brand-mark" aria-hidden="true">H</div>
              <div className="ck-brand-text">
                <span className="ck-brand-title">CekHaki AI</span>
                <span className="ck-brand-sub">by Hakio.id</span>
              </div>
            </a>
            <div className="ck-links">
              <a className="ck-link active" href="/">Beranda</a>
              <a className="ck-link" href="https://hakio.id/cek-merek">Cek Merek</a>
              <a className="ck-link" href="https://hakio.id/kelas-nice">Kelas NICE</a>
              <a className="ck-link" href="https://hakio.id/biaya-merek">Biaya</a>
              <a className="ck-link" href="https://hakio.id/blog">Blog</a>
              <a className="ck-link" href="https://hakio.id/contact">Kontak</a>
            </div>
            <div className="ck-actions">
              <button className="ck-bell" aria-label="Notifikasi" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                <span className="ck-bell-dot" aria-hidden="true"></span>
              </button>
              <a className="ck-cta" href={waLink} target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ck-cta-crown" aria-hidden="true"><path d="M2 4l4 12h12l4-12-6 4-4-8-4 8-6-4z" /></svg>
                <span>Konsultasi</span>
              </a>
              <button className="ck-menu-btn" aria-label="Menu" type="button" onClick={() => setMenuOpen((v) => !v)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              </button>
            </div>
          </div>
          <div className={`ck-mobile-menu${menuOpen ? " open" : ""}`}>
            <a className="ck-link active" href="/">Beranda</a>
            <a className="ck-link" href="https://hakio.id/cek-merek">Cek Merek</a>
            <a className="ck-link" href="https://hakio.id/kelas-nice">Kelas NICE</a>
            <a className="ck-link" href="https://hakio.id/biaya-merek">Biaya</a>
            <a className="ck-link" href="https://hakio.id/blog">Blog</a>
            <a className="ck-link" href="https://hakio.id/contact">Kontak</a>
          </div>
        </nav>

        <main className="ck-main">
          {!hasConversation && (
            <section className="ck-hero" aria-label="Chat AI CekHaki">
              <div className="ck-hero-pill" role="presentation">
                <span className="ck-hero-pill-mark">H</span>
                <span>CekHaki AI Pro</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }} aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
              </div>

              <h1>
                Halo! Siap Amankan<br />
                <span className="ck-accent">Merek Anda?</span>
              </h1>
              <p className="ck-hero-sub">
                Cek nama merek, analisa kemiripan, rekomendasi kelas NICE, lalu lanjut via WhatsApp.
              </p>

              <div className="ck-deco-script" aria-hidden="true">
                Jaga<br />Ide Anda,<br />Melangkah Lebih Jauh
                <span className="ck-deco-flourish"></span>
              </div>
              <div className="ck-deco-upper" aria-hidden="true">
                HAKI<br />UNTUK<br />MASA DEPAN<br />LEBIH BESAR
              </div>

              <div className="ck-mascot-area">
                <div className="ck-bubble left">
                  <span className="ck-bubble-mark">H</span>
                  <span>Halo! Mau cek merek?</span>
                </div>
                {/* TODO: replace /mascot.png with final 3D robot mascot (1024x1024 transparent bg) */}
                <img
                  className="ck-mascot"
                  src="/mascot.png"
                  alt="Maskot robot CekHaki AI"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
                <div className="ck-bubble right">
                  <span className="ck-bubble-mark">H</span>
                  <span>Nama brand Anda apa?</span>
                </div>
              </div>
            </section>
          )}

          {/* Composer card */}
          <section className="ck-composer" aria-label="Mulai konsultasi">
            <div className="ck-composer-head">
              <div className="ck-composer-title">
                <div className="ck-composer-title-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                </div>
                <h2>Mulai konsultasi CekHaki</h2>
              </div>
              <div className="ck-composer-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <span>Aman, Rahasia, Profesional</span>
              </div>
            </div>

            <div className="ck-composer-input-wrap">
              <span className="ck-composer-clip" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
              </span>
              <textarea
                ref={inputRef}
                className="ck-composer-input"
                rows={1}
                placeholder="Tulis nama merek Anda atau deskripsi bisnis Anda…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
              />
              <button
                className="ck-composer-send"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                aria-label="Kirim"
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              </button>
            </div>

            <div className="ck-pills" role="group" aria-label="Aksi cepat">
              {QUICK_PILLS.map((pill) => (
                <button
                  key={pill.label}
                  className={`ck-pill${activePill === pill.label ? " active" : ""}`}
                  onClick={() => usePill(pill)}
                  type="button"
                >
                  <span className="ck-pill-icon">{renderPillIcon(pill.icon)}</span>
                  {pill.label}
                </button>
              ))}
            </div>
          </section>

          {/* Chat conversation view */}
          {hasConversation && (
            <section className="ck-chat-view" ref={chatRef} aria-live="polite" aria-label="Percakapan">
              {messages.map((m, i) => (
                <div key={i} className={`ck-msg ${m.role === "user" ? "user" : "ai"}`}>
                  {m.role === "assistant" && <div className="ck-msg-avatar">H</div>}
                  <div className="ck-msg-bubble" dangerouslySetInnerHTML={{ __html: m.role === "assistant" ? fmt(m.content) : escapeHtml(m.content) }} />
                </div>
              ))}
              {loading && (
                <div className="ck-msg ai">
                  <div className="ck-msg-avatar">H</div>
                  <div className="ck-typing"><span></span><span></span><span></span></div>
                </div>
              )}
              {showWA && !waClicked && (
                <div className="ck-msg ai">
                  <div className="ck-msg-avatar">H</div>
                  <div>
                    <div className="ck-msg-bubble">Tim Hakio siap melanjutkan proses via WhatsApp 🎉</div>
                    <a className="ck-wa-btn" href={waLink} target="_blank" rel="noopener noreferrer" onClick={handleWaClick}>
                      💬 Lanjutkan via WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </section>
          )}
        </main>

        <footer className="ck-footer">
          <div className="ck-footer-links">
            <a href="https://hakio.id/cek-merek">Cek Merek</a><span>·</span>
            <a href="https://hakio.id/daftar-merek">Daftar Merek</a><span>·</span>
            <a href="https://hakio.id/biaya-merek">Biaya</a><span>·</span>
            <a href="https://hakio.id/kelas-nice">Kelas NICE</a><span>·</span>
            <a href="https://hakio.id/perpanjang-merek">Perpanjang</a><span>·</span>
            <a href="https://hakio.id/oposisi-merek">Oposisi</a><span>·</span>
            <a href="https://hakio.id/sertifikat-merek">Sertifikat</a><span>·</span>
            <a href="https://hakio.id/about">Tentang</a><span>·</span>
            <a href="https://hakio.id/tim">Tim</a><span>·</span>
            <a href="https://hakio.id/blog">Blog</a><span>·</span>
            <a href="https://hakio.id/faq">FAQ</a><span>·</span>
            <a href="https://hakio.id/contact">Kontak</a>
          </div>
          <div className="ck-footer-info">
            info@hakio.id &nbsp;·&nbsp; 0851-4841-6800 &nbsp;·&nbsp; Gedung AD Premier Office Park Lt. 9, Jl. TB. Simatupang No. 5, Jakarta Selatan<br />
            Dikelola oleh <strong>PT Ventera Intellix Group</strong>
          </div>
          <div className="ck-footer-copy">© 2026 CekHaki AI by Hakio. Semua hak dilindungi undang-undang.</div>
        </footer>
      </div>
    </>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderPillIcon(icon: string) {
  switch (icon) {
    case "search":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
      );
    case "grid":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
      );
    case "file":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
      );
    case "coin":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" /></svg>
      );
  }
  return null;
}
