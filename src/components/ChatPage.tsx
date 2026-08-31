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
  "Halo! Saya Asisten Merek AI Hakio.\n\nSaya bantu proses pendaftaran merek dagang ke DJKI — mulai dari cek nama, rekomendasi kelas NICE, sampai estimasi biaya.\n\nBoleh tahu nama merek yang ingin Anda daftarkan?";

interface LandingContent {
  eyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
}

const LANDING: Record<BrandId, LandingContent> = {
  hakimerek: {
    eyebrow: "Pendaftaran Merek Dagang",
    heroTitle: "Lindungi Merekmu Sebelum Orang Lain Mendaftarnya",
    heroSubtitle:
      "Ribuan merek dicuri tiap tahun karena pemilik aslinya terlambat mendaftar. Konsultan AI kami bantu Anda cek dan daftar sekarang.",
  },
  cekhaki: {
    eyebrow: "Cek Nama Merek Gratis",
    heroTitle: "Pastikan Nama Merekmu Aman Sebelum Daftar",
    heroSubtitle:
      "Cek database DJKI secara instan. Konsultasi AI gratis, lanjut ke WhatsApp jika siap mendaftar.",
  },
  merekin: {
    eyebrow: "Pendaftaran Merek Online",
    heroTitle: "Daftarkan Merekmu. Proses 100% Online.",
    heroSubtitle:
      "Dari konsultasi hingga sertifikat resmi DJKI — semua bisa dikerjakan dari smartphone.",
  },
  hkimerek: {
    eyebrow: "Platform HKI Merek Berbasis AI",
    heroTitle: "HKI Merek yang Lebih Cerdas, Lebih Cepat",
    heroSubtitle:
      "Analisis otomatis nama merek, rekomendasi kelas NICE, dan pendampingan hingga sertifikat terbit.",
  },
  daftarmerekmu: {
    eyebrow: "Daftar Merek untuk UMKM",
    heroTitle: "Cara Paling Mudah Daftar Merek Dagang",
    heroSubtitle:
      "Tidak perlu paham hukum. AI konsultan kami pandu langkah demi langkah hingga sertifikat jadi.",
  },
};

/* ── Icons ──────────────────────────────────────────────────── */

const WaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const ArrowUpIcon = ({ active }: { active: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke={active ? "#fff" : "#aeaeb2"} strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CheckIcon = ({ color }: { color: string }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── Main component ─────────────────────────────────────────── */

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
  const hasConversation = messages.some((m) => m.role === "user");

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
        content: `Terima kasih${leadData?.user ? `, ${leadData.user}` : ""}! Admin kami akan segera membalas via WhatsApp. Selamat berbisnis!`,
      },
    ]);
  };

  return (
    <>
      <JsonLd brand={brand} />
      <style>{`
        /* ─ Reset & font ─────────────────────────────────────── */
        .ap * {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .ap { background: #fff; color: #1d1d1f; min-height: 100vh; }

        /* ─ Nav ─────────────────────────────────────────────── */
        .ap-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: 48px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 22px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }
        .ap-logo {
          text-decoration: none; display: flex; align-items: center;
          font-size: .9375rem; font-weight: 600; letter-spacing: -.01em;
          color: #1d1d1f;
        }
        .ap-logo-accent { color: ${a}; }
        .ap-nav-link {
          font-size: .8125rem; color: #6e6e70; text-decoration: none;
          padding: 5px 10px; border-radius: 6px;
          background: none; border: none; cursor: pointer;
          font-family: inherit; transition: color .12s, background .12s;
        }
        .ap-nav-link:hover { color: #1d1d1f; background: rgba(0,0,0,.05); }
        .ap-dropdown {
          position: absolute; right: 0; top: calc(100% + 6px);
          background: #fff; border: 1px solid #d2d2d7;
          border-radius: 12px; padding: 5px; min-width: 196px;
          box-shadow: 0 8px 32px rgba(0,0,0,.1); z-index: 200;
        }
        .ap-dropdown-item {
          display: block; padding: 8px 11px; font-size: .8125rem;
          text-decoration: none; color: #6e6e70; border-radius: 7px;
          transition: background .1s, color .1s;
        }
        .ap-dropdown-item:hover { background: #f5f5f7; color: #1d1d1f; }
        .ap-dropdown-sep { height: 1px; background: #d2d2d7; margin: 4px 2px; }

        /* ─ Eyebrow ─────────────────────────────────────────── */
        .ap-eyebrow {
          font-size: .8125rem; font-weight: 600;
          letter-spacing: .01em; text-transform: uppercase;
          color: ${a}; margin-bottom: 14px;
        }

        /* ─ Headline ─────────────────────────────────────────── */
        .ap-h1 {
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 700; line-height: 1.1;
          letter-spacing: -.03em; color: #1d1d1f;
          margin: 0 0 14px;
        }
        .ap-subtitle {
          font-size: clamp(1rem, 2vw, 1.1875rem);
          line-height: 1.6; color: #6e6e70; margin: 0;
        }

        /* ─ Chat box ─────────────────────────────────────────── */
        .ap-chat-box {
          border: 1px solid #d2d2d7;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,.04), 0 12px 48px rgba(0,0,0,.07);
          display: flex; flex-direction: column; overflow: hidden;
          height: 560px;
        }
        .ap-chat-header {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 16px;
          border-bottom: 1px solid #f0f0f0;
          flex-shrink: 0;
        }
        .ap-avatar {
          width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
          background: ${a};
          display: flex; align-items: center; justify-content: center;
          font-size: .6rem; font-weight: 700; color: #fff; letter-spacing: .02em;
        }
        .ap-avatar-sm {
          width: 26px; height: 26px; border-radius: 7px; font-size: .58rem;
        }
        .ap-online {
          display: flex; align-items: center; gap: 4px;
          font-size: .6875rem; color: #34c759;
        }
        .ap-online-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #34c759;
        }

        /* ─ Messages ─────────────────────────────────────────── */
        .ap-msgs {
          flex: 1; overflow-y: auto; padding: 18px 16px;
          display: flex; flex-direction: column; gap: 16px;
          scroll-behavior: smooth;
        }
        .ap-msgs::-webkit-scrollbar { width: 2px; }
        .ap-msgs::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }

        .ap-msg-ai { display: flex; gap: 9px; align-items: flex-start; }
        .ap-msg-user { display: flex; justify-content: flex-end; }

        .ap-bubble-ai {
          font-size: .9rem; line-height: 1.65; color: #1d1d1f;
          white-space: pre-wrap; max-width: 88%;
          padding-top: 1px;
        }
        .ap-bubble-user {
          background: ${a}; color: #fff;
          padding: 10px 15px;
          border-radius: 18px 18px 4px 18px;
          font-size: .9rem; line-height: 1.6;
          white-space: pre-wrap; max-width: 72%;
        }

        /* ─ Typing ───────────────────────────────────────────── */
        @keyframes ap-dot { 0%,80%,100%{transform:scale(.5);opacity:.25;} 40%{transform:scale(1);opacity:1;} }
        .ap-dot { animation: ap-dot 1.2s ease infinite; }

        /* ─ Fade up ──────────────────────────────────────────── */
        @keyframes ap-up { from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:translateY(0);} }
        .ap-up { animation: ap-up .24s ease forwards; }

        /* ─ Chips ────────────────────────────────────────────── */
        .ap-chips {
          padding: 0 16px 13px;
          display: flex; flex-wrap: wrap; gap: 6px; flex-shrink: 0;
        }
        .ap-chip {
          padding: 6px 13px; border-radius: 100px;
          border: 1px solid #d2d2d7; background: #f5f5f7;
          font-size: .78rem; color: #3a3a3c; cursor: pointer;
          font-family: inherit; font-weight: 500;
          transition: background .12s, border-color .12s, color .12s;
        }
        .ap-chip:hover {
          background: rgba(${aRgb},.07);
          border-color: rgba(${aRgb},.35);
          color: ${a};
        }

        /* ─ Input area ───────────────────────────────────────── */
        .ap-input-area {
          padding: 11px 12px 13px;
          border-top: 1px solid #f0f0f0;
          flex-shrink: 0;
        }
        .ap-input-wrap {
          display: flex; align-items: flex-end; gap: 8px;
          background: #f5f5f7;
          border: 1px solid #e0e0e0;
          border-radius: 13px;
          padding: 9px 9px 9px 14px;
          transition: border-color .15s, box-shadow .15s;
        }
        .ap-input-wrap:focus-within {
          border-color: rgba(${aRgb},.5);
          box-shadow: 0 0 0 3px rgba(${aRgb},.1);
          background: #fff;
        }
        .ap-textarea {
          flex: 1; background: transparent; border: none; outline: none;
          color: #1d1d1f; font-size: .9rem; resize: none;
          max-height: 108px; line-height: 1.5; font-family: inherit;
        }
        .ap-textarea::placeholder { color: #aeaeb2; }
        .ap-send {
          width: 32px; height: 32px; border-radius: 9px;
          border: none; cursor: pointer; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: background .15s; outline: none;
        }
        .ap-send-on { background: ${a}; }
        .ap-send-off { background: #e5e5ea; cursor: not-allowed; }

        /* ─ WA button ────────────────────────────────────────── */
        .ap-wa {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          width: 100%; padding: 11px; border-radius: 11px;
          color: #fff; font-size: .875rem; font-weight: 600;
          text-decoration: none; border: none; cursor: pointer;
          font-family: inherit; transition: opacity .15s;
          margin-bottom: 8px;
        }
        .ap-wa-green { background: #34c759; }
        .ap-wa-green:hover { opacity: .88; }
        .ap-wa-done { background: #248a3d; }

        .ap-wa-inline {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 100px;
          background: #34c759; color: #fff;
          font-size: .8375rem; font-weight: 600;
          text-decoration: none; transition: opacity .15s;
        }
        .ap-wa-inline:hover { opacity: .88; }

        /* WA post-summary chips */
        .ap-action-chip {
          padding: 6px 13px; border-radius: 100px;
          border: 1px solid #d2d2d7; background: #f5f5f7;
          font-size: .775rem; color: #6e6e70; cursor: pointer;
          font-family: inherit; transition: background .12s;
        }
        .ap-action-chip:hover { background: #ebebeb; color: #1d1d1f; }

        /* ─ Trust bar ────────────────────────────────────────── */
        .ap-trust {
          display: flex; justify-content: center;
          border-top: 1px solid #f0f0f0;
          border-bottom: 1px solid #f0f0f0;
          padding: 20px;
        }
        .ap-trust-inner {
          display: flex; align-items: center;
          max-width: 520px; width: 100%;
        }
        .ap-trust-item { flex: 1; text-align: center; }
        .ap-trust-num {
          font-size: 1.125rem; font-weight: 700;
          color: ${a}; letter-spacing: -.01em;
        }
        .ap-trust-label { font-size: .6875rem; color: #aeaeb2; margin-top: 2px; }
        .ap-trust-sep { width: 1px; height: 28px; background: #e5e5ea; }

        /* ─ Section heading ──────────────────────────────────── */
        .ap-sec-title {
          font-size: clamp(1.5rem, 3vw, 1.875rem);
          font-weight: 700; color: #1d1d1f;
          letter-spacing: -.025em; margin: 0 0 8px;
        }
        .ap-sec-sub { font-size: .9375rem; color: #6e6e70; margin: 0; }

        /* ─ Pricing cards ────────────────────────────────────── */
        .ap-price-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .ap-price-card {
          border: 1px solid #d2d2d7; border-radius: 18px;
          padding: 26px; background: #fff;
          display: flex; flex-direction: column;
          transition: box-shadow .2s;
        }
        .ap-price-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,.07); }
        .ap-price-featured { border-color: ${a}; border-width: 1.5px; }
        .ap-price-badge {
          display: inline-block;
          background: ${a}; color: #fff;
          font-size: .6rem; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          padding: 3px 10px; border-radius: 100px; margin-bottom: 14px;
          width: fit-content;
        }
        .ap-price-label {
          font-size: .6875rem; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          color: ${a}; margin-bottom: 12px;
        }
        .ap-price-label-muted {
          font-size: .6875rem; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          color: #aeaeb2; margin-bottom: 12px;
        }
        .ap-price-amount {
          font-size: 2rem; font-weight: 700;
          color: #1d1d1f; letter-spacing: -.03em;
          line-height: 1; margin-bottom: 4px;
        }
        .ap-price-per { font-size: .78rem; color: #aeaeb2; margin-bottom: 22px; }
        .ap-price-list {
          list-style: none; padding: 0; margin: 0 0 22px;
          display: flex; flex-direction: column; gap: 9px; flex: 1;
        }
        .ap-price-item {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: .84rem; color: #3a3a3c;
        }
        .ap-price-item-icon { flex-shrink: 0; margin-top: 1px; }

        /* ─ CTA buttons ──────────────────────────────────────── */
        .ap-btn-primary {
          display: block; text-align: center; padding: 12px 16px;
          border-radius: 10px; background: ${a}; color: #fff;
          font-size: .875rem; font-weight: 600; text-decoration: none;
          border: none; cursor: pointer; font-family: inherit;
          transition: opacity .15s;
        }
        .ap-btn-primary:hover { opacity: .88; }
        .ap-btn-secondary {
          display: block; text-align: center; padding: 12px 16px;
          border-radius: 10px; border: 1px solid #d2d2d7;
          background: #fff; color: #1d1d1f;
          font-size: .875rem; font-weight: 500; text-decoration: none;
          transition: background .12s;
        }
        .ap-btn-secondary:hover { background: #f5f5f7; }

        /* ─ Guarantee ────────────────────────────────────────── */
        .ap-guarantee {
          text-align: center; padding: 22px 20px;
          border-top: 1px solid #f0f0f0;
          border-bottom: 1px solid #f0f0f0;
        }
        .ap-guarantee-inner {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: .9rem; color: #6e6e70;
        }
        .ap-guarantee-icon { color: ${a}; display: flex; }
        .ap-guarantee-strong { color: #1d1d1f; font-weight: 600; }

        /* ─ Footer ───────────────────────────────────────────── */
        .ap-footer { padding: 28px 20px; text-align: center; }
        .ap-footer-links {
          display: flex; flex-wrap: wrap; justify-content: center;
          gap: 8px 20px; margin-bottom: 12px;
        }
        .ap-footer-link {
          font-size: .78rem; text-decoration: none; color: #aeaeb2;
          transition: color .12s;
        }
        .ap-footer-link:hover { color: #6e6e70; }
        .ap-footer-link-active { color: ${a} !important; font-weight: 500; }
        .ap-footer-copy { font-size: .72rem; color: #d2d2d7; line-height: 1.6; }
        .ap-footer-copy a { color: #aeaeb2; text-decoration: none; }
        .ap-footer-copy a:hover { color: #6e6e70; }

        /* ─ Caption ──────────────────────────────────────────── */
        .ap-caption {
          text-align: center; font-size: .6875rem; color: #d2d2d7;
          margin-top: 10px; letter-spacing: .01em;
        }

        /* ─ Responsive ───────────────────────────────────────── */
        @media(max-width: 640px) {
          .ap-h1 { font-size: 1.8rem; letter-spacing: -.025em; }
          .ap-chat-box { height: 490px; }
          .ap-price-grid { grid-template-columns: 1fr; }
          .ap-bubble-user { max-width: 84%; }
          .ap-bubble-ai { max-width: 92%; }
          .ap-nav { padding: 0 16px; }
        }
      `}</style>

      <div className="ap">

        {/* ── NAV ─────────────────────────────────────────────── */}
        <nav className="ap-nav">
          <a href="/" className="ap-logo">
            <span className="ap-logo-accent">{brand.name.slice(0, 3)}</span>
            {brand.name.slice(3)}
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <a href="/harga" className="ap-nav-link">Harga</a>
            <a
              href={waLink} target="_blank" rel="noopener noreferrer"
              className="ap-nav-link"
            >
              Konsultasi
            </a>
            <div style={{ position: "relative" }}>
              <button
                className="ap-nav-link"
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                Situs Lain <ChevronIcon />
              </button>
              {menuOpen && (
                <div className="ap-dropdown">
                  {otherBrands.map((b) => (
                    <a
                      key={b.id}
                      href={`https://${b.id}.com`}
                      target="_blank" rel="noopener noreferrer"
                      className="ap-dropdown-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span style={{ color: b.accentLight, fontWeight: 600 }}>
                        {b.name.slice(0, 4)}
                      </span>
                      {b.name.slice(4)}
                    </a>
                  ))}
                  <div className="ap-dropdown-sep" />
                  <a
                    href="https://hakio.id" target="_blank" rel="noopener noreferrer"
                    className="ap-dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span style={{ color: "#0066cc", fontWeight: 600 }}>Hakio</span>.id
                    — Portal Utama
                  </a>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* ── MAIN ────────────────────────────────────────────── */}
        <main style={{ paddingTop: "48px" }}>

          {/* ── HERO + CHAT ─────────────────────────────────── */}
          <section style={{
            maxWidth: "760px", margin: "0 auto",
            padding: "52px 20px 0",
          }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <p className="ap-eyebrow">{landing.eyebrow}</p>
              <h1 className="ap-h1">{landing.heroTitle}</h1>
              <p className="ap-subtitle" style={{ maxWidth: "540px", margin: "0 auto" }}>
                {landing.heroSubtitle}
              </p>
            </div>

            {/* ── CHAT BOX ──────────────────────────────────── */}
            <div className="ap-chat-box">

              {/* Header */}
              <div className="ap-chat-header">
                <div className="ap-avatar">AI</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: ".875rem", fontWeight: 600,
                    color: "#1d1d1f", lineHeight: 1.3,
                  }}>
                    Asisten Merek AI
                  </div>
                  <div className="ap-online">
                    <span className="ap-online-dot" />
                    Online sekarang
                  </div>
                </div>
                <div style={{ fontSize: ".6875rem", color: "#aeaeb2" }}>
                  GPT-4o
                </div>
              </div>

              {/* Messages */}
              <div ref={msgsRef} className="ap-msgs">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`ap-up ${msg.role === "user" ? "ap-msg-user" : "ap-msg-ai"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className={`ap-avatar ap-avatar-sm`}>AI</div>
                    )}
                    <div className={
                      msg.role === "user" ? "ap-bubble-user" : "ap-bubble-ai"
                    }>
                      {msg.content}

                      {/* WA CTA on last AI message */}
                      {msg.role === "assistant" && showWA &&
                        i === messages.length - 1 && !waClicked && (
                        <div style={{
                          marginTop: "14px",
                          display: "flex", flexDirection: "column", gap: "9px",
                        }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            <button
                              className="ap-action-chip"
                              onClick={() =>
                                sendMessage(
                                  "Bagaimana cara cek apakah nama merek saya sudah terdaftar?"
                                )
                              }
                            >
                              Cara cek nama merek
                            </button>
                            <button
                              className="ap-action-chip"
                              onClick={() =>
                                sendMessage("Berapa total biaya yang harus saya bayar?")
                              }
                            >
                              Total biaya?
                            </button>
                          </div>
                          <a
                            href={waLink}
                            target="_blank" rel="noopener noreferrer"
                            onClick={handleWaClick}
                            className="ap-wa-inline"
                          >
                            <WaIcon /> Lanjut ke WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="ap-up ap-msg-ai">
                    <div className="ap-avatar ap-avatar-sm">AI</div>
                    <div style={{
                      display: "flex", gap: "4px",
                      alignItems: "center", paddingTop: "7px",
                    }}>
                      {[0, 1, 2].map((n) => (
                        <span
                          key={n}
                          className="ap-dot"
                          style={{
                            width: "6px", height: "6px", borderRadius: "50%",
                            background: "#d2d2d7", display: "inline-block",
                            animationDelay: `${n * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Chips — only before first user message */}
              {!hasConversation && (
                <div className="ap-chips">
                  {brand.chips.map((chip) => (
                    <button
                      key={chip}
                      className="ap-chip"
                      onClick={() => sendMessage(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input area */}
              <div className="ap-input-area">
                {showWA && (
                  <a
                    href={waLink}
                    target="_blank" rel="noopener noreferrer"
                    onClick={handleWaClick}
                    className={`ap-wa ${waClicked ? "ap-wa-done" : "ap-wa-green"}`}
                  >
                    <WaIcon />
                    {waClicked
                      ? "WhatsApp Terbuka"
                      : leadData?.user
                      ? `Lanjut ke WhatsApp, ${leadData.user}`
                      : "Lanjut ke WhatsApp"}
                  </a>
                )}
                <div className="ap-input-wrap">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Tanya seputar merek dagang..."
                    rows={1}
                    disabled={loading}
                    className="ap-textarea"
                    style={{ scrollbarWidth: "none" }}
                    onInput={(e) => {
                      const t = e.currentTarget;
                      t.style.height = "auto";
                      t.style.height =
                        Math.min(t.scrollHeight, 108) + "px";
                    }}
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={loading || !input.trim()}
                    className={`ap-send ${
                      !loading && input.trim() ? "ap-send-on" : "ap-send-off"
                    }`}
                  >
                    <ArrowUpIcon active={!loading && !!input.trim()} />
                  </button>
                </div>
              </div>
            </div>

            <p className="ap-caption">
              Gratis · Instan · Ditenagai GPT-4o · Dilanjut via WhatsApp
            </p>
          </section>

          {/* ── TRUST BAR ───────────────────────────────────── */}
          <div className="ap-trust" style={{ marginTop: "48px" }}>
            <div className="ap-trust-inner">
              <div className="ap-trust-item">
                <div className="ap-trust-num">5.000+</div>
                <div className="ap-trust-label">merek terdaftar</div>
              </div>
              <div className="ap-trust-sep" />
              <div className="ap-trust-item">
                <div className="ap-trust-num">7 tahun</div>
                <div className="ap-trust-label">pengalaman</div>
              </div>
              <div className="ap-trust-sep" />
              <div className="ap-trust-item">
                <div className="ap-trust-num">Garansi</div>
                <div className="ap-trust-label">harga termurah</div>
              </div>
            </div>
          </div>

          {/* ── PRICING ─────────────────────────────────────── */}
          <section style={{
            maxWidth: "720px", margin: "0 auto",
            padding: "72px 20px",
          }}>
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <h2 className="ap-sec-title">Harga Pendaftaran Merek</h2>
              <p className="ap-sec-sub">
                Semua sudah termasuk biaya resmi DJKI dan pendampingan hingga sertifikat terbit.
                Tanpa biaya tersembunyi.
              </p>
            </div>

            <div className="ap-price-grid">
              {/* UMKM */}
              <div className="ap-price-card ap-price-featured">
                <div className="ap-price-badge">Paling Laris</div>
                <div className="ap-price-label">UMKM / Perorangan</div>
                <div className="ap-price-amount">Rp&nbsp;1.299.000</div>
                <div className="ap-price-per">per kelas NICE</div>
                <ul className="ap-price-list">
                  {[
                    "Biaya PNBP DJKI termasuk",
                    "Pemeriksaan nama merek",
                    "Konsultasi kelas NICE",
                    "Pengajuan e-Filing DJKI",
                    "Nomor permohonan resmi",
                    "Pendampingan hingga sertifikat",
                  ].map((item) => (
                    <li key={item} className="ap-price-item">
                      <span className="ap-price-item-icon">
                        <CheckIcon color={a} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={waLink} target="_blank" rel="noopener noreferrer"
                  className="ap-btn-primary"
                >
                  Daftar Sekarang
                </a>
              </div>

              {/* PT */}
              <div className="ap-price-card">
                <div className="ap-price-label-muted">Perusahaan / PT / CV</div>
                <div className="ap-price-amount">Rp&nbsp;2.490.000</div>
                <div className="ap-price-per">per kelas NICE</div>
                <ul className="ap-price-list">
                  {[
                    "Biaya PNBP DJKI termasuk",
                    "Pemeriksaan nama merek",
                    "Konsultasi kelas NICE",
                    "Pengajuan e-Filing DJKI",
                    "Nomor permohonan resmi",
                    "Pendampingan hingga sertifikat",
                  ].map((item) => (
                    <li key={item} className="ap-price-item">
                      <span className="ap-price-item-icon">
                        <CheckIcon color="#d2d2d7" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={waLink} target="_blank" rel="noopener noreferrer"
                  className="ap-btn-secondary"
                >
                  Konsultasi Dulu
                </a>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "18px" }}>
              <a
                href="/harga"
                style={{
                  fontSize: ".8125rem", color: a,
                  textDecoration: "none", fontWeight: 500,
                }}
              >
                Lihat rincian biaya dan metode pembayaran →
              </a>
            </div>
          </section>

          {/* ── GUARANTEE ───────────────────────────────────── */}
          <div className="ap-guarantee">
            <div className="ap-guarantee-inner">
              <span className="ap-guarantee-icon"><ShieldIcon /></span>
              <span>
                <span className="ap-guarantee-strong">
                  Garansi harga termurah se-Indonesia
                </span>
                {" "}— ada yang lebih murah? Kami ganti selisihnya.
              </span>
            </div>
          </div>

          {/* ── FOOTER ──────────────────────────────────────── */}
          <footer className="ap-footer">
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
              <div className="ap-footer-links">
                {Object.values(BRANDS).map((b) => (
                  <a
                    key={b.id}
                    href={`https://${b.id}.com`}
                    target="_blank" rel="noopener noreferrer"
                    className={`ap-footer-link ${
                      b.id === brand.id ? "ap-footer-link-active" : ""
                    }`}
                    style={b.id === brand.id ? { color: a } : undefined}
                  >
                    {b.name}
                  </a>
                ))}
                <a
                  href="https://hakio.id"
                  target="_blank" rel="noopener noreferrer"
                  className="ap-footer-link"
                >
                  Hakio.id
                </a>
              </div>
              <p className="ap-footer-copy">
                &copy; {new Date().getFullYear()} {brand.name}
                {" · "}
                <a href="/harga">Harga</a>
                {" · "}
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </p>
            </div>
          </footer>

        </main>
      </div>
    </>
  );
}
