"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Brand } from "@/lib/brands";
import JsonLd from "./JsonLd";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE =
  "Halo! 👋 Saya Hakio AI. Ketik nama brand yang ingin dicek — **100% gratis** dan instan!\n\nSaya bantu cek ketersediaan di database PDKI/DJKI, rekomendasi kelas NICE, dan estimasi biaya.\n\nSetelah itu tim Hakio siap lanjut via WhatsApp untuk proses pendaftaran resminya.";

const QUICK_PILLS = [
  { label: "Cek Nama Merek", template: "Saya mau cek nama merek: ", icon: "search", primary: true },
  { label: "Kelas NICE", template: "Tolong rekomendasikan kelas NICE untuk bisnis saya ", icon: "grid", primary: false },
  { label: "Analisa Kemiripan", template: "Tolong analisa kemiripan merek ", icon: "file", primary: false },
  { label: "Biaya Pendaftaran", template: "Berapa biaya pendaftaran merek untuk ", icon: "coin", primary: false },
] as const;

function fmt(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function CekHakiHeroPage({ brand }: { brand: Brand }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWA, setShowWA] = useState(false);
  const [waClicked, setWaClicked] = useState(false);
  const [activePill, setActivePill] = useState<string>(QUICK_PILLS[0].label);
  const [leadData, setLeadData] = useState<{
    nama?: string; kelas?: string; entitas?: string; user?: string;
  } | null>(null);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasConversation = messages.length > 0;

  const waText = leadData?.nama
    ? `Halo Hakio!${leadData.user ? ` Nama saya ${leadData.user}.` : ""} Saya sudah cek merek via Hakio AI dan ingin lanjut pendaftaran:\n- Nama Merek: ${leadData.nama}\n- Kelas NICE: ${leadData.kelas}\n- Jenis Entitas: ${leadData.entitas}\n\nBisa bantu proses selanjutnya?`
    : `Halo Hakio! Saya ingin konsultasi merek dagang via Hakio AI. Mohon dibantu.`;
  const waLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(waText)}`;

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      const userText = text.trim();
      if (!userText || loading) return;

      const isFirst = messages.length === 0;
      const seeded: Message[] = isFirst
        ? [
            { role: "assistant", content: INITIAL_MESSAGE },
            { role: "user", content: userText },
          ]
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
        autoGrow(el);
      }
    }, 20);
  };

  const handleWaClick = () => {
    setWaClicked(true);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Terima kasih${leadData?.user ? `, ${leadData.user}` : ""}! Admin Hakio akan segera membalas via WhatsApp.`,
      },
    ]);
  };

  const autoGrow = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  return (
    <>
      <JsonLd brand={brand} />
      <style>{`
        :root{
          --navy:#10285d;
          --navy-2:#16336f;
          --gold:#d6a64a;
          --gold-2:#f3cf78;
          --ink:#0f224d;
          --muted:#6c7897;
          --line:#dce3f0;
          --panel:#ffffff;
          --bg:#f8faff;
          --soft:#eef4ff;
          --shadow:0 28px 70px rgba(15,34,77,.12);
          --shadow-soft:0 12px 32px rgba(24,48,99,.10);
          --radius:28px;
        }
        html,body{margin:0;padding:0;overflow-x:hidden}
        body{
          min-height:100vh;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color:var(--ink);
          background:
            radial-gradient(circle at 76% 10%, rgba(245,211,139,.30), transparent 26%),
            radial-gradient(circle at 60% 42%, rgba(191,214,255,.42), transparent 31%),
            linear-gradient(180deg,#fbfbfe 0%,#f4f6fb 100%);
        }
        .hk-page{min-height:100vh;padding:56px 46px}
        .hk-app{
          width:min(1460px,calc(100vw - 92px));
          min-height:900px;margin:0 auto;
          display:grid;grid-template-columns:86px 1fr;
          background:rgba(255,255,255,.76);
          border:8px solid rgba(255,255,255,.95);
          border-radius:40px;
          box-shadow:0 22px 70px rgba(36,47,80,.14);
          overflow:hidden;
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
        }
        /* ============ Sidebar ============ */
        .hk-sidebar{
          background:linear-gradient(180deg,#172f66 0%,#0d2457 100%);
          border-radius:28px 0 0 28px;
          display:flex;flex-direction:column;align-items:center;
          padding:22px 12px 18px;gap:15px;position:relative;
          box-shadow:inset -1px 0 0 rgba(255,255,255,.08);
        }
        .hk-brand-mark{
          width:48px;height:48px;border-radius:14px;
          display:grid;place-items:center;background:#0d1d48;
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.08), 0 8px 20px rgba(0,0,0,.18);
          margin-bottom:10px;text-decoration:none;
        }
        .hk-side-btn{
          width:44px;height:44px;border-radius:50%;
          display:grid;place-items:center;color:#dbe5ff;
          background:transparent;border:1px solid transparent;
          cursor:pointer;transition:.2s ease;text-decoration:none;
        }
        .hk-side-btn:hover{background:rgba(255,255,255,.09);transform:translateY(-1px)}
        .hk-side-btn.active{background:#fff;color:var(--navy);box-shadow:0 7px 16px rgba(5,19,55,.22)}
        .hk-side-spacer{flex:1}
        .hk-side-rule{width:42px;height:1px;background:rgba(255,255,255,.15);margin:6px 0}
        .hk-ico{width:19px;height:19px;display:block}

        /* ============ Workspace ============ */
        .hk-workspace{
          position:relative;overflow:hidden;
          background:
            radial-gradient(circle at 75% 39%, rgba(195,216,255,.48), transparent 32%),
            radial-gradient(circle at 24% 72%, rgba(255,229,176,.23), transparent 28%),
            linear-gradient(180deg,rgba(255,255,255,.98),rgba(249,251,255,.98));
          border-radius:0 28px 28px 0;
        }
        .hk-workspace::before{
          content:"";position:absolute;inset:0;
          background:
            linear-gradient(120deg, transparent 0 18%, rgba(255,255,255,.65) 28%, transparent 36%),
            radial-gradient(circle at 100% 0, rgba(255,222,167,.23), transparent 33%);
          pointer-events:none;
        }
        /* ============ Topbar ============ */
        .hk-topbar{
          height:96px;display:grid;grid-template-columns:1fr auto 1fr;
          align-items:center;padding:0 28px 0 30px;position:relative;z-index:3;
        }
        .hk-model-select{
          justify-self:start;height:54px;padding:0 18px 0 14px;
          display:flex;align-items:center;gap:10px;
          border-radius:16px;background:rgba(255,255,255,.88);
          border:1px solid #e5e9f2;box-shadow:0 8px 18px rgba(30,48,93,.07);
          font-weight:700;color:#22345d;font-size:15px;
        }
        .hk-mini-logo{width:27px;height:27px;border-radius:8px;background:#112859;display:grid;place-items:center}
        .hk-brand-title{font-size:24px;font-weight:800;letter-spacing:-.02em;color:#0f2455}
        .hk-top-actions{justify-self:end;display:flex;align-items:center;gap:14px}
        .hk-notification{
          width:42px;height:42px;border-radius:13px;display:grid;place-items:center;
          background:rgba(255,255,255,.65);border:1px solid rgba(222,228,240,.8);
          position:relative;cursor:pointer;
        }
        .hk-notification::after{
          content:"";position:absolute;width:8px;height:8px;border-radius:50%;
          background:var(--gold);right:8px;top:7px;border:2px solid #fff;
        }
        .hk-consult-btn{
          border:0;color:#fff;background:linear-gradient(180deg,#17366f,#10285d);
          min-width:165px;height:52px;padding:0 24px;border-radius:14px;
          font-size:16px;font-weight:700;display:flex;gap:10px;align-items:center;
          justify-content:center;box-shadow:0 12px 24px rgba(16,40,93,.20);
          cursor:pointer;text-decoration:none;
        }
        .hk-consult-btn:hover{filter:brightness(1.05)}

        /* ============ Hero ============ */
        .hk-hero{
          position:relative;min-height:760px;padding:44px 48px 54px;
          display:flex;flex-direction:column;align-items:center;z-index:2;
        }
        .hk-headline{
          margin-top:4px;text-align:center;max-width:900px;
          line-height:.98;letter-spacing:-.045em;font-weight:850;
          font-size:clamp(48px,4.7vw,78px);
        }
        .hk-headline .gold{color:var(--gold)}
        .hk-subhead{
          margin-top:22px;text-align:center;max-width:760px;
          font-size:21px;line-height:1.45;color:#5d6a8d;font-weight:500;
        }
        .hk-hero-visual{
          width:100%;max-width:860px;min-height:270px;margin-top:8px;
          position:relative;display:grid;place-items:center;
        }
        .hk-chat-bubble{
          position:absolute;display:flex;align-items:center;gap:9px;
          padding:12px 16px;border-radius:16px;
          background:rgba(255,255,255,.95);border:1px solid #e4e8f2;
          box-shadow:0 12px 26px rgba(34,54,101,.12);color:#21345d;
          font-size:15px;font-weight:650;white-space:nowrap;z-index:4;
          animation:hkFloatBubble 5s ease-in-out infinite;
        }
        .hk-bubble-left{left:13%;top:42%;animation-delay:.3s}
        .hk-bubble-right{right:9%;top:54%;animation-delay:1.2s}
        @keyframes hkFloatBubble{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .hk-bmark{width:26px;height:26px;border-radius:8px;background:#132b63;display:grid;place-items:center}
        .hk-scribble{
          position:absolute;left:-20px;bottom:8px;transform:rotate(-3deg);
          color:#7f889b;font-family:"Segoe Script","Bradley Hand",cursive;
          font-size:21px;line-height:1.25;opacity:.75;z-index:3;
        }
        .hk-scribble::after{
          content:"";display:block;width:72px;height:3px;
          background:var(--gold);margin-top:12px;border-radius:999px;
          transform:rotate(-10deg);
        }
        .hk-ghost-h{
          position:absolute;right:-8%;top:-20px;font-weight:900;
          font-size:330px;color:rgba(230,189,105,.10);line-height:1;
          user-select:none;pointer-events:none;
        }
        .hk-micro{
          position:absolute;right:18px;top:320px;width:170px;
          text-align:left;color:#8a95b4;font-size:12px;line-height:1.8;
          letter-spacing:.22em;text-transform:uppercase;z-index:3;
        }
        .hk-micro::after{
          content:"";display:block;width:40px;height:3px;
          background:var(--gold);margin-top:12px;border-radius:99px;
        }

        /* ============ Mascot (image) ============ */
        .hk-mascot-wrap{
          width:230px;height:230px;position:relative;margin-top:18px;
          display:grid;place-items:center;
          animation:hkFloat 4.5s ease-in-out infinite;
        }
        @keyframes hkFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .hk-mascot-img{
          width:100%;height:100%;object-fit:contain;
          filter:drop-shadow(0 22px 40px rgba(15,30,90,.22));
        }
        /* Fallback SVG-built mascot shown only if img fails */
        .hk-mascot-fallback{width:210px;height:210px;position:relative}
        .hk-mascot-fallback .antenna{position:absolute;left:50%;top:2px;transform:translateX(-50%);width:5px;height:34px;background:#0e285d;border-radius:8px}
        .hk-mascot-fallback .antenna::before{content:"";position:absolute;left:50%;top:-10px;transform:translateX(-50%);width:18px;height:18px;border-radius:50%;background:linear-gradient(180deg,#f4d178,#d9a43d);box-shadow:0 4px 10px rgba(190,137,27,.25)}
        .hk-mascot-fallback .head{position:absolute;left:50%;top:30px;transform:translateX(-50%);width:124px;height:96px;border-radius:34px 34px 42px 42px;background:linear-gradient(180deg,#fbfcff,#e4e9f4);border:1px solid #cfd8e8;box-shadow:0 14px 28px rgba(23,46,97,.16)}
        .hk-mascot-fallback .face{position:absolute;inset:17px 17px 21px;border-radius:22px;background:linear-gradient(180deg,#10275c,#071944);box-shadow:inset 0 1px 8px rgba(255,255,255,.13)}
        .hk-mascot-fallback .eye{position:absolute;top:27px;width:19px;height:11px;border:4px solid #fff;border-top:0;border-left-color:transparent;border-right-color:transparent;border-radius:0 0 20px 20px}
        .hk-mascot-fallback .eye.l{left:20px}.hk-mascot-fallback .eye.r{right:20px}
        .hk-mascot-fallback .smile{position:absolute;left:50%;bottom:15px;transform:translateX(-50%);width:25px;height:11px;border:3px solid #b7c7f8;border-top:0;border-left-color:transparent;border-right-color:transparent;border-radius:0 0 20px 20px}
        .hk-mascot-fallback .ear{position:absolute;top:50px;width:20px;height:46px;border-radius:12px;background:linear-gradient(180deg,#e4b658,#c89b3f)}
        .hk-mascot-fallback .ear.l{left:-8px}.hk-mascot-fallback .ear.r{right:-8px}
        .hk-mascot-fallback .body{position:absolute;left:50%;top:118px;transform:translateX(-50%);width:106px;height:84px;border-radius:45px 45px 38px 38px;background:linear-gradient(180deg,#f8faff,#dce4f2);border:1px solid #cfd8e8;box-shadow:0 16px 26px rgba(27,47,92,.15)}
        .hk-mascot-fallback .chest{position:absolute;left:50%;top:17px;transform:translateX(-50%);width:40px;height:40px;border-radius:11px;background:#11285d;display:grid;place-items:center}
        .hk-mascot-fallback .arm{position:absolute;top:124px;width:28px;height:72px;border-radius:18px;background:linear-gradient(180deg,#1d3979,#10285d);transform-origin:top center}
        .hk-mascot-fallback .arm.l{left:35px;transform:rotate(36deg)}
        .hk-mascot-fallback .arm.r{right:38px;transform:rotate(-42deg)}
        .hk-mascot-fallback .hand{position:absolute;width:34px;height:34px;border-radius:50%;background:#e7edf7;bottom:-13px;left:-3px;border:1px solid #ccd6e6}

        /* ============ Composer (BESAR & TINGGI) ============ */
        .hk-composer{
          width:min(1000px,94%);margin-top:6px;
          background:rgba(255,255,255,.95);border:1px solid #e2e7f0;
          border-radius:26px;box-shadow:var(--shadow);
          overflow:hidden;position:relative;z-index:4;
          backdrop-filter:blur(18px);
        }
        .hk-composer-head{
          height:78px;padding:0 28px;display:flex;align-items:center;
          justify-content:space-between;border-bottom:1px solid #edf0f5;
          font-size:19px;font-weight:800;
        }
        .hk-composer-title{display:flex;align-items:center;gap:14px}
        .hk-secure{font-size:14px;font-weight:600;color:#7f8aad;display:flex;align-items:center;gap:8px}
        .hk-input-wrap{
          display:flex;align-items:flex-end;gap:14px;
          padding:22px 24px;margin:20px 22px 16px;
          border-radius:20px;background:#fbfcff;
          border:1px solid #dfe5ef;
          box-shadow:inset 0 2px 6px rgba(21,45,90,.03);
          transition:border-color .15s,background .15s;
        }
        .hk-input-wrap:focus-within{border-color:var(--gold);background:#fff}
        .hk-clip{color:#8e99b3;flex-shrink:0;padding-bottom:6px}
        .hk-input{
          flex:1;border:0;outline:0;background:transparent;
          font:inherit;font-size:18px;color:#27395f;line-height:1.55;
          min-height:64px;max-height:200px;resize:none;padding:4px 0;
        }
        .hk-input::placeholder{color:#9aa5bc}
        .hk-send{
          width:56px;height:56px;border-radius:50%;border:0;
          display:grid;place-items:center;color:#fff;
          background:linear-gradient(180deg,#18356f,#10285d);
          box-shadow:0 10px 20px rgba(17,40,93,.22);cursor:pointer;flex-shrink:0;
          transition:transform .1s,filter .15s;
        }
        .hk-send:hover:not(:disabled){filter:brightness(1.1)}
        .hk-send:active{transform:scale(.95)}
        .hk-send:disabled{opacity:.4;cursor:not-allowed}
        .hk-quick-actions{
          display:grid;grid-template-columns:repeat(4,1fr);gap:12px;
          padding:0 22px 24px;
        }
        .hk-quick{
          min-height:60px;border-radius:16px;border:1px solid #dde3ed;
          background:#fff;display:flex;align-items:center;justify-content:center;
          gap:10px;color:#26385f;font-size:15px;font-weight:650;cursor:pointer;
          font-family:inherit;
          box-shadow:0 6px 14px rgba(30,52,95,.04);
          transition:transform .1s,box-shadow .15s,border-color .15s;
        }
        .hk-quick:hover{transform:translateY(-1px);box-shadow:0 10px 20px rgba(30,52,95,.08)}
        .hk-quick.primary{background:linear-gradient(180deg,#fff9ec,#faeed1);border-color:#eed8aa}

        /* ============ Chat conversation view (BESAR & TINGGI) ============ */
        .hk-chat-view{
          width:min(1000px,94%);margin:24px auto 0;
          background:#fff;border:1px solid #e2e7f0;
          border-radius:24px;box-shadow:var(--shadow);
          padding:28px 32px;display:flex;flex-direction:column;gap:20px;
          max-height:70vh;overflow-y:auto;position:relative;z-index:4;
        }
        .hk-chat-view::-webkit-scrollbar{width:6px}
        .hk-chat-view::-webkit-scrollbar-thumb{background:#d4dae8;border-radius:6px}
        .hk-msg{display:flex;gap:14px;align-items:flex-start;font-size:15.5px;line-height:1.65}
        .hk-msg.user{justify-content:flex-end}
        .hk-msg-avatar{
          width:38px;height:38px;border-radius:10px;
          background:linear-gradient(180deg,#17366f,#10285d);
          color:var(--gold);display:grid;place-items:center;
          font-weight:800;font-size:.9rem;flex-shrink:0;
        }
        .hk-msg-bubble{max-width:78%;color:#213258;padding-top:4px;white-space:pre-wrap}
        .hk-msg.user .hk-msg-bubble{
          background:linear-gradient(180deg,#17366f,#10285d);color:#fff;
          border-radius:18px 18px 4px 18px;padding:14px 20px;
        }
        .hk-typing{display:flex;gap:5px;align-items:center;padding:8px 0}
        .hk-typing span{width:7px;height:7px;background:#8e99b3;border-radius:50%;animation:hkDot 1.2s ease infinite}
        .hk-typing span:nth-child(2){animation-delay:.2s}
        .hk-typing span:nth-child(3){animation-delay:.4s}
        @keyframes hkDot{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}
        .hk-wa-btn{
          display:inline-flex;align-items:center;gap:8px;
          padding:14px 26px;border-radius:999px;
          background:#25D366;color:#fff;font-size:.95rem;font-weight:700;
          text-decoration:none;margin-top:14px;border:0;cursor:pointer;
          transition:opacity .15s,transform .1s;
        }
        .hk-wa-btn:hover{opacity:.9}
        .hk-wa-btn:active{transform:scale(.97)}

        /* ============ Footer (SEO deep links) ============ */
        .hk-seo-footer{
          max-width:1460px;margin:16px auto 0;padding:20px 12px;
          text-align:center;color:#7c85a5;font-size:12px;line-height:1.8;
        }
        .hk-seo-footer a{color:#5f6b8b;text-decoration:none;margin:0 6px}
        .hk-seo-footer a:hover{color:var(--navy);text-decoration:underline}
        .hk-seo-footer .sep{color:#c8cee0}

        /* ============ Responsive ============ */
        @media (max-width:1100px){
          .hk-page{padding:20px}
          .hk-app{width:100%;grid-template-columns:72px 1fr;min-height:830px}
          .hk-hero{padding:30px 26px 40px}
          .hk-headline{font-size:56px}
          .hk-quick-actions{grid-template-columns:repeat(2,1fr)}
          .hk-scribble,.hk-micro{display:none}
        }
        @media (max-width:760px){
          .hk-page{padding:0}
          .hk-app{width:100%;min-height:100vh;border:0;border-radius:0;grid-template-columns:1fr}
          .hk-sidebar{display:none}
          .hk-workspace{border-radius:0}
          .hk-topbar{height:76px;padding:0 16px;grid-template-columns:1fr auto}
          .hk-brand-title{display:none}
          .hk-top-actions{grid-column:2}
          .hk-notification{display:none}
          .hk-consult-btn{min-width:auto;padding:0 16px}
          .hk-hero{padding:28px 14px 36px;min-height:auto}
          .hk-headline{font-size:42px}
          .hk-subhead{font-size:17px}
          .hk-hero-visual{min-height:245px}
          .hk-mascot-wrap{width:180px;height:180px}
          .hk-bubble-left{left:0;top:40%;font-size:13px}
          .hk-bubble-right{right:0;top:61%;font-size:13px}
          .hk-composer{width:100%;border-radius:22px}
          .hk-composer-head{padding:0 16px;height:64px;font-size:16px}
          .hk-secure{display:none}
          .hk-quick-actions{grid-template-columns:1fr 1fr;padding:0 14px 18px}
          .hk-input-wrap{margin:16px 14px 12px;padding:16px 18px}
          .hk-input{font-size:16px;min-height:48px}
          .hk-quick{font-size:13px;min-height:52px}
          .hk-ghost-h{font-size:220px;right:-20%}
          .hk-chat-view{max-height:60vh;padding:20px}
        }
      `}</style>

      <div className="hk-page">
        <main className="hk-app">
          {/* ============ SIDEBAR ============ */}
          <aside className="hk-sidebar" aria-label="Navigasi utama">
            <a href="/" className="hk-brand-mark" aria-label="Hakio beranda">
              <svg viewBox="0 0 32 32" fill="none" width="30" height="30"><path d="M7 7h6v7l6-7h6v18h-6v-7l-6 7H7V7Z" fill="#E4B658"/></svg>
            </a>

            <a href="/" className="hk-side-btn active" title="Beranda" aria-label="Beranda">
              <svg className="hk-ico" viewBox="0 0 24 24" fill="none"><path d="M3 10.5 12 3l9 7.5v9A1.5 1.5 0 0 1 19.5 21h-15A1.5 1.5 0 0 1 3 19.5v-9Z" stroke="currentColor" strokeWidth="1.8"/><path d="M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.8"/></svg>
            </a>
            <a href="https://hakio.id/cek-merek" className="hk-side-btn" title="Cek Merek" aria-label="Cek Merek">
              <svg className="hk-ico" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8"/><path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </a>
            <a href="https://hakio.id/kelas-nice" className="hk-side-btn" title="Kelas NICE" aria-label="Kelas NICE">
              <svg className="hk-ico" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </a>
            <a href="https://hakio.id/oposisi-merek" className="hk-side-btn" title="Keamanan Merek" aria-label="Keamanan Merek">
              <svg className="hk-ico" viewBox="0 0 24 24" fill="none"><path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" stroke="currentColor" strokeWidth="1.8"/><path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a href="https://hakio.id/konsultasi-merek" className="hk-side-btn" title="Konsultasi" aria-label="Konsultasi">
              <svg className="hk-ico" viewBox="0 0 24 24" fill="none"><path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4.5 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8"/><path d="M7 9h10M7 13h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </a>
            <a href="https://hakio.id/biaya-merek" className="hk-side-btn" title="Biaya" aria-label="Biaya">
              <svg className="hk-ico" viewBox="0 0 24 24" fill="none"><path d="M5 20V12M10 20V8M15 20V5M20 20V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </a>
            <a href="https://hakio.id/tim" className="hk-side-btn" title="Tim" aria-label="Tim">
              <svg className="hk-ico" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8"/><circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.8"/><path d="M3 20c0-4 2.6-6.5 6-6.5S15 16 15 20M14 15c3.6 0 6 2 7 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </a>

            <div className="hk-side-spacer"></div>
            <div className="hk-side-rule"></div>
            <a href="https://hakio.id/about" className="hk-side-btn" title="Tentang" aria-label="Tentang">
              <svg className="hk-ico" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M19 13.5v-3l2-1.5-2-3.4-2.4 1a8 8 0 0 0-2.6-1.5L13.5 2h-3L10 5.1a8 8 0 0 0-2.6 1.5L5 5.6 3 9l2 1.5v3L3 15l2 3.4 2.4-1A8 8 0 0 0 10 18.9l.5 3.1h3l.5-3.1a8 8 0 0 0 2.6-1.5l2.4 1 2-3.4-2-1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
            </a>
            <a href="https://hakio.id/faq" className="hk-side-btn" title="Bantuan" aria-label="Bantuan / FAQ">
              <svg className="hk-ico" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M9.7 9.3a2.5 2.5 0 1 1 4.7 1.2c-.8 1.2-2.4 1.4-2.4 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>
            </a>
          </aside>

          {/* ============ WORKSPACE ============ */}
          <section className="hk-workspace">
            <header className="hk-topbar">
              <div className="hk-model-select">
                <div className="hk-mini-logo">
                  <svg viewBox="0 0 32 32" fill="none" width="18" height="18"><path d="M7 7h6v7l6-7h6v18h-6v-7l-6 7H7V7Z" fill="#E4B658"/></svg>
                </div>
                <span>Hakio AI Pro</span>
                <span style={{ fontSize: 12 }}>⌄</span>
              </div>
              <div className="hk-brand-title">Hakio AI</div>
              <div className="hk-top-actions">
                <div className="hk-notification" aria-label="Notifikasi">
                  <svg className="hk-ico" viewBox="0 0 24 24" fill="none"><path d="M6 9a6 6 0 0 1 12 0v5l2 2H4l2-2V9Z" stroke="#22365f" strokeWidth="1.8"/><path d="M10 19h4" stroke="#22365f" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </div>
                <a className="hk-consult-btn" href={waLink} target="_blank" rel="noopener noreferrer">
                  <span>♛</span>
                  <span>Konsultasi</span>
                </a>
              </div>
            </header>

            <div className="hk-hero">
              <div className="hk-ghost-h" aria-hidden="true">H</div>
              <div className="hk-micro" aria-hidden="true">HAKI UNTUK<br />MASA DEPAN<br />LEBIH BESAR</div>

              {!hasConversation && (
                <>
                  <h1 className="hk-headline">
                    Halo! Siap Amankan<br /><span className="gold">Merek Anda?</span>
                  </h1>
                  <p className="hk-subhead">
                    Cek nama merek, analisa kemiripan, rekomendasi kelas NICE,<br />
                    lalu lanjut via WhatsApp.
                  </p>

                  <div className="hk-hero-visual">
                    <div className="hk-scribble" aria-hidden="true">Jaga Ide Anda,<br />Melangkah Lebih Jauh</div>

                    <div className="hk-chat-bubble hk-bubble-left">
                      <span className="hk-bmark">
                        <svg viewBox="0 0 32 32" width="17" height="17" fill="none"><path d="M7 7h6v7l6-7h6v18h-6v-7l-6 7H7V7Z" fill="#E4B658"/></svg>
                      </span>
                      Halo! Mau cek merek?
                    </div>

                    <div className="hk-mascot-wrap" aria-label="Maskot Hakio AI">
                      {/* TODO: replace /mascot.png with final 3D robot mascot (1024x1024 transparent bg).
                          Kalau file belum ada, fallback ke SVG mascot muncul otomatis. */}
                      <img
                        className="hk-mascot-img"
                        src="/mascot.png"
                        alt="Maskot robot Hakio AI"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          img.style.display = "none";
                          const wrap = img.parentElement;
                          if (wrap && !wrap.querySelector(".hk-mascot-fallback")) {
                            const fb = document.createElement("div");
                            fb.className = "hk-mascot-fallback";
                            fb.innerHTML = `
                              <div class="antenna"></div>
                              <div class="head">
                                <div class="ear l"></div><div class="ear r"></div>
                                <div class="face">
                                  <div class="eye l"></div><div class="eye r"></div>
                                  <div class="smile"></div>
                                </div>
                              </div>
                              <div class="body">
                                <div class="chest"><svg viewBox="0 0 32 32" width="26" height="26" fill="none"><path d="M7 7h6v7l6-7h6v18h-6v-7l-6 7H7V7Z" fill="#E4B658"/></svg></div>
                              </div>
                              <div class="arm l"><div class="hand"></div></div>
                              <div class="arm r"><div class="hand"></div></div>
                            `;
                            wrap.appendChild(fb);
                          }
                        }}
                      />
                    </div>

                    <div className="hk-chat-bubble hk-bubble-right">
                      <span className="hk-bmark">
                        <svg viewBox="0 0 32 32" width="17" height="17" fill="none"><path d="M7 7h6v7l6-7h6v18h-6v-7l-6 7H7V7Z" fill="#E4B658"/></svg>
                      </span>
                      Nama brand Anda apa?
                    </div>
                  </div>
                </>
              )}

              {/* ============ CHAT VIEW (muncul setelah user submit pertama) ============ */}
              {hasConversation && (
                <section className="hk-chat-view" ref={chatRef} aria-live="polite" aria-label="Percakapan">
                  {messages.map((m, i) => (
                    <div key={i} className={`hk-msg ${m.role === "user" ? "user" : "ai"}`}>
                      {m.role === "assistant" && <div className="hk-msg-avatar">H</div>}
                      <div
                        className="hk-msg-bubble"
                        dangerouslySetInnerHTML={{
                          __html: m.role === "assistant" ? fmt(m.content) : escapeHtml(m.content),
                        }}
                      />
                    </div>
                  ))}
                  {loading && (
                    <div className="hk-msg ai">
                      <div className="hk-msg-avatar">H</div>
                      <div className="hk-typing"><span></span><span></span><span></span></div>
                    </div>
                  )}
                  {showWA && !waClicked && (
                    <div className="hk-msg ai">
                      <div className="hk-msg-avatar">H</div>
                      <div>
                        <div className="hk-msg-bubble">Tim Hakio siap melanjutkan proses via WhatsApp 🎉</div>
                        <a className="hk-wa-btn" href={waLink} target="_blank" rel="noopener noreferrer" onClick={handleWaClick}>
                          💬 Lanjutkan via WhatsApp
                        </a>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* ============ COMPOSER (BESAR & TINGGI) ============ */}
              <section className="hk-composer" aria-label="Mulai konsultasi">
                <div className="hk-composer-head">
                  <div className="hk-composer-title">
                    <svg className="hk-ico" viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="12" rx="3" stroke="#d6a64a" strokeWidth="1.8"/><path d="M8 18v3l4-3" stroke="#d6a64a" strokeWidth="1.8" strokeLinejoin="round"/></svg>
                    <span>Mulai konsultasi Hakio</span>
                  </div>
                  <div className="hk-secure">
                    <svg className="hk-ico" viewBox="0 0 24 24" fill="none"><path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" stroke="#8795bd" strokeWidth="1.8"/><path d="m9 12 2 2 4-4" stroke="#8795bd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Aman, Rahasia, Profesional
                  </div>
                </div>

                <div className="hk-input-wrap">
                  <svg className="hk-clip hk-ico" viewBox="0 0 24 24" fill="none"><path d="m8 12 5.5-5.5a3.2 3.2 0 0 1 4.5 4.5L10.5 18.5a5 5 0 1 1-7-7L11 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  <textarea
                    ref={inputRef}
                    className="hk-input"
                    rows={2}
                    placeholder="Tulis nama merek Anda atau deskripsi bisnis Anda…"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); autoGrow(e.currentTarget); }}
                    onKeyDown={handleKey}
                    disabled={loading}
                  />
                  <button
                    className="hk-send"
                    onClick={() => sendMessage(input)}
                    disabled={loading || !input.trim()}
                    aria-label="Kirim"
                    type="button"
                  >
                    <svg className="hk-ico" viewBox="0 0 24 24" fill="none"><path d="m4 12 16-8-5 16-3.5-6.5L4 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="m11.5 13.5 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </button>
                </div>

                <div className="hk-quick-actions">
                  {QUICK_PILLS.map((pill) => (
                    <button
                      key={pill.label}
                      className={`hk-quick${(pill.primary && activePill === QUICK_PILLS[0].label) || activePill === pill.label ? " primary" : ""}`}
                      onClick={() => usePill(pill)}
                      type="button"
                    >
                      {renderPillIcon(pill.icon)}
                      {pill.label}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </main>

        {/* SEO deep-link footer — text links crawler bisa baca (sidebar icon-only) */}
        <nav className="hk-seo-footer" aria-label="Peta situs Hakio">
          <a href="https://hakio.id/">Hakio.id</a><span className="sep">·</span>
          <a href="https://hakio.id/cek-merek">Cek Merek</a><span className="sep">·</span>
          <a href="https://hakio.id/daftar-merek">Daftar Merek</a><span className="sep">·</span>
          <a href="https://hakio.id/biaya-merek">Biaya</a><span className="sep">·</span>
          <a href="https://hakio.id/kelas-nice">Kelas NICE</a><span className="sep">·</span>
          <a href="https://hakio.id/perpanjang-merek">Perpanjang</a><span className="sep">·</span>
          <a href="https://hakio.id/oposisi-merek">Oposisi</a><span className="sep">·</span>
          <a href="https://hakio.id/sertifikat-merek">Sertifikat</a><span className="sep">·</span>
          <a href="https://hakio.id/konsultasi-merek">Konsultasi</a><span className="sep">·</span>
          <a href="https://hakio.id/merek-umkm">Merek UMKM</a><span className="sep">·</span>
          <a href="https://hakio.id/jasa-merek-jakarta">Jasa Merek Jakarta</a><span className="sep">·</span>
          <a href="https://hakio.id/blog">Blog</a><span className="sep">·</span>
          <a href="https://hakio.id/faq">FAQ</a><span className="sep">·</span>
          <a href="https://hakio.id/about">Tentang</a><span className="sep">·</span>
          <a href="https://hakio.id/tim">Tim</a><span className="sep">·</span>
          <a href="https://hakio.id/contact">Kontak</a>
          <div style={{ marginTop: 10, fontSize: 11, color: "#8f97b3" }}>
            © 2026 Hakio AI · Dikelola oleh <strong style={{ color: "#5a6889" }}>PT Ventera Intellix Group</strong>
          </div>
        </nav>
      </div>
    </>
  );
}

function renderPillIcon(icon: string) {
  const cn = "hk-ico";
  switch (icon) {
    case "search":
      return <svg className={cn} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8"/><path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
    case "grid":
      return <svg className={cn} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/></svg>;
    case "file":
      return <svg className={cn} viewBox="0 0 24 24" fill="none"><path d="M6 3h9l3 3v15H6V3Z" stroke="currentColor" strokeWidth="1.8"/><path d="M14 3v4h4M9 11h6M9 15h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
    case "coin":
      return <svg className={cn} viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.8"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" stroke="currentColor" strokeWidth="1.8"/></svg>;
  }
  return null;
}
