"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Brand } from "@/lib/brands";
import { BRANDS } from "@/lib/brands";
import JsonLd from "./JsonLd";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE =
  "Halo! Saya Asisten Merek AI. Saya siap bantu kamu cek, konsultasi, dan daftarkan merek dagangmu ke DJKI. Ceritakan dulu nama merek yang ingin kamu lindungi, atau tanyakan apa saja seputar merek dagang. 😊";

export default function ChatPage({ brand }: { brand: Brand }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: INITIAL_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWA, setShowWA] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const otherBrands = Object.values(BRANDS).filter((b) => b.id !== brand.id);

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
        if (data.show_wa) setShowWA(true);
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
    [messages, loading]
  );

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const waLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
    `Halo, saya ingin konsultasi pendaftaran merek dagang via ${brand.name}.`
  )}`;

  const accentStyle = { "--accent": brand.accent, "--accent-light": brand.accentLight } as React.CSSProperties;

  return (
    <>
      <JsonLd brand={brand} />
      <style>{`
        :root { --accent: ${brand.accent}; --accent-light: ${brand.accentLight}; --accent-rgb: ${brand.accentRgb}; }
        .accent-bg { background-color: var(--accent); }
        .accent-bg-light { background-color: var(--accent-light); }
        .accent-text { color: var(--accent-light); }
        .accent-border { border-color: var(--accent-light); }
        .accent-ring:focus { outline: none; box-shadow: 0 0 0 2px rgba(var(--accent-rgb),.4); }
        .accent-chip-hover:hover { background: rgba(var(--accent-rgb),.12); color: var(--accent-light); border-color: rgba(var(--accent-rgb),.3); }
        .accent-gradient { background: linear-gradient(135deg, var(--accent), var(--accent-light)); }
        .wa-btn-hover:hover { opacity: 0.88; }
      `}</style>

      <div className="flex flex-col h-screen bg-[#0a0a0a] text-[#ececec] overflow-hidden" style={accentStyle}>
        {/* Nav */}
        <nav className="fixed top-0 inset-x-0 z-50 h-13 flex items-center justify-between px-5 bg-[#0a0a0a] border-b border-white/8">
          <a href="/" className="text-[1.05rem] font-bold tracking-tight text-[#ececec] no-underline">
            <b className="accent-text">{brand.name.slice(0, 4)}</b>
            {brand.name.slice(4)}
          </a>
          <div className="flex items-center gap-0.5">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[.8rem] text-[#a0a0a0] no-underline px-3.5 py-1.5 rounded-lg transition-colors hover:bg-[#1e1e1e] hover:text-[#ececec]"
            >
              Konsultasi
            </a>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-[.8rem] text-[#a0a0a0] px-3.5 py-1.5 rounded-lg transition-colors hover:bg-[#1e1e1e] hover:text-[#ececec] bg-transparent border-none cursor-pointer font-[inherit]"
              >
                Situs Lain ▾
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-[#1e1e1e] border border-white/8 rounded-xl py-1 min-w-[180px] shadow-2xl z-50">
                  {otherBrands.map((b) => (
                    <a
                      key={b.id}
                      href={`https://${b.id}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2.5 text-[.8125rem] text-[#a0a0a0] no-underline hover:bg-[#2f2f2f] hover:text-[#ececec] transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="font-semibold" style={{ color: b.accentLight }}>
                        {b.name.slice(0, 4)}
                      </span>
                      {b.name.slice(4)}
                    </a>
                  ))}
                  <div className="my-1 border-t border-white/8" />
                  <a
                    href="https://hakio.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2.5 text-[.8125rem] text-[#a0a0a0] no-underline hover:bg-[#2f2f2f] hover:text-[#ececec] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="font-semibold text-[#3b5fc0]">Hakio</span>.id — Portal Utama
                  </a>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Chat area */}
        <div className="flex flex-col flex-1 pt-13 min-h-0">
          {/* Messages */}
          <div
            ref={msgsRef}
            className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5 max-w-[720px] w-full mx-auto"
          >
            {messages.length === 1 && (
              <div className="text-center pt-10 pb-6 animate-fadeup">
                <h1 className="text-[clamp(2rem,5vw,2.8rem)] font-extrabold tracking-[-0.05em] text-[#ececec] mb-2 leading-tight">
                  {brand.tagline}
                </h1>
                <p className="text-[#a0a0a0] text-[.9375rem] mb-8">{brand.description}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {brand.chips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      className="px-[18px] py-[9px] rounded-full border border-white/8 bg-[#141414] text-[#a0a0a0] text-[.8125rem] font-medium cursor-pointer transition-all font-[inherit] accent-chip-hover"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 max-w-full animate-fadeup ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg accent-gradient flex items-center justify-center text-[.7rem] font-bold flex-shrink-0 mt-0.5 text-white">
                    AI
                  </div>
                )}
                <div
                  className={`text-[.9375rem] leading-[1.65] whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#2f2f2f] text-[#ececec] rounded-[18px_18px_4px_18px] px-4 py-2.5 max-w-[75%]"
                      : "text-[#ececec] pt-0.5"
                  }`}
                >
                  {msg.content}
                  {msg.role === "assistant" && showWA && i === messages.length - 1 && (
                    <div className="mt-3">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-[22px] py-[11px] rounded-full bg-[#25D366] text-white text-[.875rem] font-semibold no-underline wa-btn-hover transition-opacity"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Lanjut via WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 animate-fadeup">
                <div className="w-7 h-7 rounded-lg accent-gradient flex items-center justify-center text-[.7rem] font-bold flex-shrink-0 mt-0.5 text-white">
                  AI
                </div>
                <div className="flex gap-1 items-center pt-1.5">
                  <span className="w-1.5 h-1.5 bg-[#666] rounded-full typing-dot" />
                  <span className="w-1.5 h-1.5 bg-[#666] rounded-full typing-dot" />
                  <span className="w-1.5 h-1.5 bg-[#666] rounded-full typing-dot" />
                </div>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="px-4 pb-4 pt-2 max-w-[720px] w-full mx-auto">
            {showWA && (
              <div className="mb-3 text-center">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-[.875rem] font-semibold no-underline wa-btn-hover transition-opacity"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Konsultasi via WhatsApp
                </a>
              </div>
            )}
            <div className="flex items-end gap-3 bg-[#141414] border border-white/8 rounded-2xl px-4 py-3 focus-within:border-white/16 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Tanya seputar merek dagang..."
                rows={1}
                className="flex-1 bg-transparent text-[#ececec] text-[.9375rem] resize-none outline-none border-none placeholder:text-[#555] max-h-32 leading-[1.5] font-[inherit] accent-ring"
                style={{ scrollbarWidth: "none" }}
                disabled={loading}
                onInput={(e) => {
                  const t = e.currentTarget;
                  t.style.height = "auto";
                  t.style.height = Math.min(t.scrollHeight, 128) + "px";
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="w-8 h-8 rounded-full accent-gradient flex items-center justify-center flex-shrink-0 disabled:opacity-30 transition-opacity cursor-pointer border-none"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="text-center text-[.7rem] text-[#444] mt-2">
              Konsultasi gratis · Ditenagai GPT-4o ·{" "}
              <a href="https://hakio.id" className="text-[#555] no-underline hover:text-[#777]">
                Hakio.id
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
