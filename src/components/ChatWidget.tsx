"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Brand } from "@/lib/brands";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatQuickAction {
  label: string;
  template: string;
}

interface Props {
  brand: Brand;
  brandName: string;
  chatTitle: string;
  chatSubtitle?: string;
  onlineLabel?: string;
  initialGreeting: string;
  seedBubbles?: string[];
  quickActions: ChatQuickAction[];
  placeholder: string;
  ctaLabel?: string;
  bottomHint?: string;
  minHeight?: number;
}

function fmt(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
}
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Chat widget high (min-height 560), used across HakiMerek/HKIMerek/Merekin.
 * Preserved: /api/chat backend, lead extraction, WA handoff pattern, quick actions.
 * Colors inherit from parent (--accent, --accent-2). Layout minimal — parent controls placement.
 */
export default function ChatWidget({
  brand,
  brandName,
  chatTitle,
  chatSubtitle,
  onlineLabel = "Online",
  initialGreeting,
  seedBubbles,
  quickActions,
  placeholder,
  ctaLabel = "Kirim",
  bottomHint,
  minHeight = 560,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const seeds: Message[] = [];
    seeds.push({ role: "assistant", content: initialGreeting });
    (seedBubbles ?? []).forEach((b) => seeds.push({ role: "assistant", content: b }));
    return seeds;
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWA, setShowWA] = useState(false);
  const [waClicked, setWaClicked] = useState(false);
  const [leadData, setLeadData] = useState<{
    nama?: string; kelas?: string; entitas?: string; user?: string;
  } | null>(null);

  const msgsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasUserMessage = messages.some((m) => m.role === "user");
  const waText = leadData?.nama
    ? `Halo ${brandName}!${leadData.user ? ` Nama saya ${leadData.user}.` : ""} Saya sudah cek merek via chat AI dan ingin lanjut pendaftaran:\n- Nama Merek: ${leadData.nama}\n- Kelas Produk/Jasa: ${leadData.kelas}\n- Jenis Entitas: ${leadData.entitas}\n\nBisa bantu proses selanjutnya?`
    : `Halo ${brandName}! Saya ingin konsultasi merek dagang. Mohon dibantu.`;
  const waLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(waText)}`;

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string) => {
    const userText = text.trim();
    if (!userText || loading) return;
    const nextMsgs: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(nextMsgs);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMsgs.slice(-20), brand: brand.id }),
      });
      const data = await res.json();
      if (res.status === 429 || data.rate_limited) {
        setMessages((prev) => [...prev, { role: "assistant", content: "Batas percakapan tercapai. Hubungi tim kami langsung via WhatsApp untuk konsultasi lanjutan." }]);
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
      setMessages((prev) => [...prev, { role: "assistant", content: "Maaf, koneksi terputus. Coba lagi sebentar atau hubungi kami via WhatsApp." }]);
      setShowWA(true);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [messages, loading, brand.id]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); sendMessage(input); }
  };
  const useQuickAction = (act: ChatQuickAction) => {
    setInput(act.template);
    setTimeout(() => inputRef.current?.focus(), 20);
  };
  const handleWaClick = () => {
    setWaClicked(true);
    setMessages((prev) => [...prev, { role: "assistant", content: `Terima kasih${leadData?.user ? `, ${leadData.user}` : ""}! Admin ${brandName} akan segera membalas via WhatsApp.` }]);
  };

  return (
    <>
      <style>{`
        @property --cw-angle {
          syntax:'<angle>'; initial-value:0deg; inherits:false;
        }
        .cw-glow-wrap {
          position:relative; border-radius:24px;
          padding:2px;
          background: conic-gradient(from var(--cw-angle),
            color-mix(in srgb, var(--accent) 0%, transparent) 0%,
            color-mix(in srgb, var(--accent) 65%, transparent) 12%,
            color-mix(in srgb, var(--accent) 100%, transparent) 20%,
            color-mix(in srgb, var(--accent) 55%, transparent) 30%,
            color-mix(in srgb, var(--accent) 0%, transparent) 40%,
            color-mix(in srgb, var(--accent) 0%, transparent) 100%);
          animation: cwSpin 4s linear infinite;
          box-shadow:0 24px 60px color-mix(in srgb, var(--accent) 18%, transparent);
        }
        @keyframes cwSpin {
          0% { --cw-angle:0deg; }
          100% { --cw-angle:360deg; }
        }
        /* Safari / browsers tanpa @property support: fallback dengan background-position spin */
        @supports not (background: conic-gradient(from 0deg, red, blue)) {
          .cw-glow-wrap {
            background:linear-gradient(90deg, transparent, var(--accent), transparent);
            background-size:200% 100%;
            animation:cwShine 3s linear infinite;
          }
          @keyframes cwShine { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        }
        .cw {
          display:flex; flex-direction:column;
          background:#fff; border:1px solid #e7ebf3; border-radius:22px;
          box-shadow:0 20px 50px rgba(18,39,82,.08);
          overflow:hidden;
          position:relative; z-index:1;
        }
        .cw-head {
          display:flex; align-items:center; justify-content:space-between;
          padding:16px 18px; border-bottom:1px solid #eef1f6;
          background:linear-gradient(180deg, color-mix(in srgb, var(--accent) 5%, #fff), #fff);
        }
        .cw-title { font-weight:800; font-size:15px; }
        .cw-online { font-size:12px; color:#2e9c5b; margin-top:2px; }
        .cw-online::before { content:""; display:inline-block; width:8px; height:8px; border-radius:50%; background:#28c76f; margin-right:6px; }
        .cw-badge { padding:6px 12px; border-radius:999px; background:color-mix(in srgb, var(--accent) 12%, white); color:var(--accent); font-size:12px; font-weight:800; }
        .cw-msgs {
          flex:1;
          padding:20px 20px 8px;
          display:flex; flex-direction:column; gap:14px;
          overflow-y:auto;
          scroll-behavior:smooth;
        }
        .cw-msgs::-webkit-scrollbar{width:6px}
        .cw-msgs::-webkit-scrollbar-thumb{background:#d4dae8;border-radius:6px}
        .cw-row { display:flex; }
        .cw-row.user { justify-content:flex-end; }
        .cw-bubble {
          max-width:82%; padding:13px 16px; border-radius:16px;
          line-height:1.55; font-size:14.5px;
          white-space:pre-wrap;
        }
        .cw-row.bot .cw-bubble { background:#f4f6fb; color:#33415f; border-top-left-radius:6px; }
        .cw-row.user .cw-bubble { background:var(--accent); color:#fff; border-top-right-radius:6px; }
        .cw-typing { display:flex; gap:5px; padding:6px 2px; }
        .cw-typing span { width:7px; height:7px; background:#8e99b3; border-radius:50%; animation: cwdot 1.2s ease infinite; }
        .cw-typing span:nth-child(2) { animation-delay:.2s; }
        .cw-typing span:nth-child(3) { animation-delay:.4s; }
        @keyframes cwdot { 0%,80%,100%{opacity:.3;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }
        .cw-wa {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 22px; border-radius:14px;
          background:#25D366; color:#fff; text-decoration:none;
          font-size:14px; font-weight:800; margin-top:10px; border:0; cursor:pointer;
        }
        .cw-wa:hover { filter:brightness(1.05); }
        .cw-quick {
          display:grid; grid-template-columns:repeat(2, 1fr); gap:10px;
          padding:12px 18px 12px;
          border-top:1px solid #eef1f6;
          background:#fafbfe;
        }
        .cw-quick button {
          border:1px solid #e1e6ef; background:#fff;
          border-radius:12px; padding:11px 12px;
          color:#354464; font-weight:700; font-size:13px;
          cursor:pointer; text-align:left;
          transition:border-color .12s, background .12s;
          font-family:inherit;
        }
        .cw-quick button:hover {
          border-color:color-mix(in srgb, var(--accent) 40%, transparent);
          background:color-mix(in srgb, var(--accent) 6%, white);
        }
        .cw-composer {
          display:grid; grid-template-columns:1fr auto; gap:10px;
          padding:14px 18px 16px; border-top:1px solid #eef1f6;
        }
        .cw-input {
          height:56px; border:1px solid #dfe5ef; border-radius:14px;
          padding:0 16px; outline:none; font-size:15px;
          transition:border-color .12s;
        }
        .cw-input:focus { border-color:var(--accent); }
        .cw-send {
          height:56px; border:0; border-radius:14px;
          background:var(--accent); color:#fff;
          padding:0 22px; font-weight:800; cursor:pointer;
          font-family:inherit; font-size:14px;
          box-shadow:0 8px 16px color-mix(in srgb, var(--accent) 22%, transparent);
        }
        .cw-send:hover:not(:disabled) { filter:brightness(1.05); }
        .cw-send:disabled { opacity:.5; cursor:not-allowed; }
        .cw-hint { padding:0 18px 14px; color:#23a45a; font-size:12px; font-weight:800; }
      `}</style>

      <div className="cw-glow-wrap">
      <section className="cw" style={{ minHeight }}>
        <div className="cw-head">
          <div>
            <div className="cw-title">{chatTitle}</div>
            <div className="cw-online">{onlineLabel}</div>
          </div>
          {chatSubtitle && <span className="cw-badge">{chatSubtitle}</span>}
        </div>

        <div className="cw-msgs" ref={msgsRef} aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`cw-row ${m.role === "user" ? "user" : "bot"}`}>
              <div className="cw-bubble" dangerouslySetInnerHTML={{ __html: m.role === "assistant" ? fmt(m.content) : escapeHtml(m.content) }} />
            </div>
          ))}
          {loading && (
            <div className="cw-row bot">
              <div className="cw-bubble">
                <div className="cw-typing"><span></span><span></span><span></span></div>
              </div>
            </div>
          )}
          {showWA && !waClicked && (
            <div className="cw-row bot">
              <div>
                <div className="cw-bubble">Tim kami siap melanjutkan proses via WhatsApp 🎉</div>
                <a className="cw-wa" href={waLink} target="_blank" rel="noopener noreferrer" onClick={handleWaClick}>
                  💬 Lanjutkan via WhatsApp
                </a>
              </div>
            </div>
          )}
          {waClicked && (
            <div className="cw-row bot">
              <div className="cw-bubble">Admin akan segera membalas 👋</div>
            </div>
          )}
        </div>

        {!hasUserMessage && (
          <div className="cw-quick">
            {quickActions.map((q) => (
              <button key={q.label} onClick={() => useQuickAction(q)}>{q.label}</button>
            ))}
          </div>
        )}

        <div className="cw-composer">
          <input
            ref={inputRef}
            className="cw-input"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
          />
          <button className="cw-send" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
            {ctaLabel}
          </button>
        </div>

        {bottomHint && <div className="cw-hint">{bottomHint}</div>}
      </section>
      </div>
    </>
  );
}
