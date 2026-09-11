"use client";

/**
 * HakiMerek — Editorial Monograph edition.
 *
 * Design POV: "Practice note dari jurnal hukum kekayaan intelektual",
 * bukan lagi chatbot landing. Referensi vibe:
 *  - The Economist / WSJ typography
 *  - Aesop web micro-site
 *  - Studio arsitek/hukum monograph
 *
 * Yang berubah dari versi AI-generic sebelumnya:
 *  - Font Inter → Instrument Serif (display italic thin) + IBM Plex Sans body
 *  - Palette pastel emerald → INK #163D33 + PAPER #F4EFE4 + SIENNA #A13E21
 *  - Mascot chibi 3D robot dihapus → ganti monochrome ink illustration
 *  - Rounded 20px cards + gradient wash → sharp corners + hairline rules
 *  - Conic-glow chat container → editorial "Q&A" framed box
 *  - "Eyebrow pill" capsule → byline metadata mono
 *  - Grid symmetric 4-col process → numbered spreads asimetris 01/04-04/04
 *  - Center-aligned tegak → 8-col grid dengan breakout illustration
 *
 * Aset yang di-generate lewat Codex nanti (fallback graceful kalau missing):
 *  - /hakimerek/hero-illustration.webp
 *  - /hakimerek/process-01.webp .. process-04.webp
 *  - /hakimerek/grain.png (subtle noise overlay)
 */

import { useState } from "react";
import type { Brand } from "@/lib/brands";
import JsonLd from "./JsonLd";
import ChatWidget from "./ChatWidget";
import FloatingWA from "./FloatingWA";

const INK = "#163D33";
const PAPER = "#F4EFE4";
const SIENNA = "#A13E21";
const OFFWHITE = "#FEFCF6";
const CHARCOAL = "#262523";

const NAV = [
  { label: "Cek", href: "/cek-merek" },
  { label: "Daftar", href: "/daftar-merek" },
  { label: "Kelas", href: "/kelas-produk-jasa" },
  { label: "Biaya", href: "/biaya" },
  { label: "Perpanjang", href: "/perpanjang" },
  { label: "Blog", href: "/blog" },
];

const PROCESS = [
  {
    n: "01",
    title: "Konsultasi & Cek Nama",
    body:
      "Kami cek dulu nama Anda di database resmi DJKI dan indikator kemiripan visual+fonetik. Kalau ada risiko, kami sampaikan sebelum Anda bayar.",
  },
  {
    n: "02",
    title: "Analisa Risiko",
    body:
      "Analisa perbandingan merek terdaftar yang berpotensi konflik, argumen kelas produk/jasa, dan strategi peluang lolos pemeriksaan substantif.",
  },
  {
    n: "03",
    title: "Rekomendasi Kelas",
    body:
      "Rekomendasi kelas NICE (Kelas Produk/Jasa) yang mencakup cakupan bisnis Anda tanpa buang biaya di kelas irelevan.",
  },
  {
    n: "04",
    title: "Pendaftaran ke DJKI",
    body:
      "Kami susun dokumen sesuai format DJKI, ajukan lewat sistem resmi, dan monitor status permohonan sampai sertifikat elektronik keluar.",
  },
];

const QUICK_ACTIONS = [
  { label: "Cek ketersediaan nama", template: "Cek ketersediaan nama merek: " },
  { label: "Rekomendasi kelas", template: "Rekomendasi kelas produk/jasa untuk bisnis: " },
  { label: "Analisa kemiripan", template: "Analisa kemiripan merek: " },
  { label: "Estimasi biaya", template: "Estimasi biaya total pendaftaran merek: " },
];

export default function HakiMerekPage({ brand }: { brand: Brand }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const waLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
    "Halo hakimerek.com, saya mau konsultasi pendaftaran merek saya \"...\""
  )}`;

  return (
    <>
      <JsonLd brand={brand} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

        :root {
          --ink: ${INK};
          --paper: ${PAPER};
          --sienna: ${SIENNA};
          --offwhite: ${OFFWHITE};
          --charcoal: ${CHARCOAL};
          --rule: rgba(22,61,51,.14);
          --rule-strong: rgba(22,61,51,.35);
          --serif: 'Instrument Serif', 'PT Serif', Georgia, serif;
          --sans: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          --mono: 'IBM Plex Mono', 'SF Mono', ui-monospace, monospace;
        }
        html, body { margin:0; padding:0; overflow-x:hidden; }
        body {
          font-family: var(--sans);
          background: var(--paper);
          color: var(--ink);
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        /* Grain overlay — subtle print texture */
        .hkm-grain::before {
          content:""; position:fixed; inset:0; pointer-events:none; z-index:1;
          background-image:url('/hakimerek/grain.png');
          background-repeat:repeat; background-size:512px;
          opacity:.045; mix-blend-mode:multiply;
        }

        /* ============ TOP STRIP EDITORIAL ============
           Bukan marquee playful lagi — running ticker editorial style */
        .hkm-strip {
          background: var(--ink); color: var(--paper);
          border-bottom: 1px solid var(--ink);
          position: relative; overflow: hidden;
          padding: 8px 0;
          font-family: var(--mono); font-size: 11.5px;
          letter-spacing: .06em; text-transform: uppercase;
          font-weight: 500;
        }
        .hkm-strip-track {
          display: flex; gap: 44px; white-space: nowrap;
          animation: hkmScroll 42s linear infinite;
          width: max-content;
        }
        .hkm-strip:hover .hkm-strip-track { animation-play-state: paused; }
        .hkm-strip-item { display: inline-flex; align-items: center; gap: 10px; }
        .hkm-strip-item::before {
          content:"§"; color: var(--sienna); font-family: var(--serif);
          font-style: italic; font-size: 15px; margin-right: 2px;
        }
        .hkm-strip-item em {
          font-style: normal; color: var(--sienna); font-weight: 600;
        }
        @keyframes hkmScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* ============ MASTHEAD ============ */
        .hkm-masthead {
          border-bottom: 1px solid var(--rule);
          background: var(--paper);
          position: sticky; top: 0; z-index: 30;
          padding: 22px 0 20px;
        }
        .hkm-container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .hkm-masthead-grid {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 40px;
        }
        .hkm-logomark {
          display: flex; align-items: center; gap: 14px;
          text-decoration: none; color: var(--ink);
        }
        .hkm-logomark-stack {
          font-family: var(--mono); font-size: 10px;
          font-weight: 700; letter-spacing: .15em;
          line-height: 1; text-transform: uppercase;
          border-right: 1px solid var(--rule-strong);
          padding-right: 14px;
        }
        .hkm-logomark-stack span { display: block; }
        .hkm-logomark-stack span + span { margin-top: 3px; color: var(--sienna); }
        .hkm-logomark-wordmark {
          font-family: var(--serif);
          font-size: 26px; line-height: 1;
          letter-spacing: -.02em;
          font-weight: 400;
        }
        .hkm-logomark-wordmark em { font-style: italic; color: var(--sienna); }
        .hkm-nav {
          display: flex; align-items: center; justify-content: center;
          gap: 0; flex-wrap: wrap;
          font-family: var(--sans); font-size: 13.5px;
          color: var(--ink); font-weight: 500;
        }
        .hkm-nav a {
          text-decoration: none; color: inherit;
          padding: 4px 12px;
          transition: color .12s;
          position: relative;
        }
        .hkm-nav a:hover { color: var(--sienna); }
        .hkm-nav a + a::before {
          content:"·"; position: absolute; left: -3px; color: var(--rule-strong);
        }
        .hkm-cta-link {
          font-family: var(--sans); font-size: 13.5px; font-weight: 600;
          color: var(--ink); text-decoration: none;
          padding: 6px 0 6px 22px;
          border-left: 1px solid var(--rule-strong);
          display: inline-flex; align-items: center; gap: 8px;
          transition: color .12s;
        }
        .hkm-cta-link:hover { color: var(--sienna); }
        .hkm-cta-link::after {
          content:"→"; font-family: var(--serif); font-size: 18px; line-height: 1;
        }
        .hkm-hamburger {
          display: none; width: 40px; height: 40px;
          background: transparent; border: 1px solid var(--rule-strong);
          border-radius: 0; cursor: pointer; color: var(--ink); font-size: 18px;
        }

        /* ============ HERO ============ */
        .hkm-hero {
          padding: 64px 0 96px;
          position: relative;
        }
        .hkm-hero-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 40px;
          align-items: start;
        }
        .hkm-hero-text { grid-column: 1 / 6; padding-top: 8px; }
        .hkm-hero-illus { grid-column: 6 / 9; }
        .hkm-byline {
          font-family: var(--mono); font-size: 11.5px; font-weight: 500;
          text-transform: uppercase; letter-spacing: .12em;
          color: var(--ink); opacity: .78;
          margin-bottom: 26px;
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
        }
        .hkm-byline em { font-style: italic; color: var(--sienna); font-weight: 600; }
        .hkm-byline span::after {
          content:""; display: inline-block; width: 22px; height: 1px;
          background: var(--rule-strong); vertical-align: middle;
          margin: 0 8px 3px 8px;
        }
        .hkm-byline span:last-child::after { display: none; }
        .hkm-h1 {
          font-family: var(--serif); font-weight: 400;
          font-size: clamp(48px, 6vw, 84px);
          line-height: .95; letter-spacing: -.025em;
          color: var(--ink); margin: 0 0 32px;
        }
        .hkm-h1 em { font-style: italic; color: var(--sienna); }
        .hkm-dek {
          font-family: var(--sans); font-weight: 400;
          font-size: 17.5px; line-height: 1.55;
          color: var(--ink); opacity: .82;
          max-width: 440px; margin: 0 0 32px;
        }
        .hkm-dek strong { font-weight: 600; color: var(--ink); opacity: 1; }
        .hkm-hero-anchor {
          display: inline-flex; align-items: baseline; gap: 10px;
          font-family: var(--sans); font-weight: 600; font-size: 14px;
          color: var(--ink); text-decoration: none;
          padding-bottom: 4px;
          border-bottom: 1px solid var(--ink);
        }
        .hkm-hero-anchor::after {
          content:"⌘K"; font-family: var(--mono); font-size: 11px;
          font-weight: 500; opacity: .5;
        }

        /* Illustration slot */
        .hkm-illus-frame {
          aspect-ratio: 4 / 5;
          background: var(--offwhite);
          border: 1px solid var(--rule);
          position: relative;
          overflow: hidden;
        }
        .hkm-illus-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .hkm-illus-fallback {
          position: absolute; inset: 0;
          display: grid; place-items: center;
          font-family: var(--serif); font-style: italic;
          font-size: 96px; color: var(--ink); opacity: .12;
          user-select: none;
        }
        .hkm-illus-caption {
          font-family: var(--mono); font-size: 10.5px; font-weight: 500;
          text-transform: uppercase; letter-spacing: .12em;
          color: var(--ink); opacity: .55;
          margin-top: 10px;
          display: flex; justify-content: space-between; align-items: baseline;
        }
        .hkm-illus-caption em { font-style: italic; color: var(--sienna); }

        /* ============ FEES ============ */
        .hkm-fees {
          padding: 48px 0 72px;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
        }
        .hkm-fees-header {
          font-family: var(--mono); font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: .15em;
          opacity: .55; margin-bottom: 22px;
          display: flex; justify-content: space-between;
        }
        .hkm-fees-header em { font-style: italic; color: var(--sienna); }
        .hkm-fees-table {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr auto;
          gap: 0;
          font-family: var(--sans);
        }
        .hkm-fee-row {
          display: contents;
        }
        .hkm-fee-row > div {
          padding: 18px 0;
          border-top: 1px solid var(--rule);
        }
        .hkm-fee-label { font-weight: 500; font-size: 15.5px; }
        .hkm-fee-strike {
          font-family: var(--mono); font-size: 14.5px;
          text-decoration: line-through;
          text-decoration-color: var(--sienna);
          text-decoration-thickness: 1.5px;
          color: var(--ink); opacity: .48;
        }
        .hkm-fee-price {
          font-family: var(--serif); font-size: 30px; font-weight: 400;
          line-height: 1; letter-spacing: -.02em;
          color: var(--ink);
          text-align: right;
        }
        .hkm-fee-unit {
          font-family: var(--mono); font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: .12em;
          color: var(--ink); opacity: .55;
          padding-left: 20px;
          text-align: right;
          align-self: end;
        }
        .hkm-fees-note {
          font-family: var(--sans); font-size: 13.5px;
          opacity: .68; margin-top: 22px; padding-top: 22px;
          border-top: 1px solid var(--rule);
          display: flex; justify-content: space-between; align-items: baseline; gap: 20px;
          flex-wrap: wrap;
        }
        .hkm-fees-note strong { color: var(--sienna); font-weight: 600; }

        /* ============ PROCESS SPREADS ============ */
        .hkm-process {
          padding: 96px 0;
        }
        .hkm-section-eyebrow {
          font-family: var(--mono); font-size: 11.5px; font-weight: 500;
          text-transform: uppercase; letter-spacing: .12em;
          color: var(--ink); opacity: .7;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 14px;
        }
        .hkm-section-eyebrow::after {
          content:""; flex: 1; height: 1px; background: var(--rule);
          max-width: 240px;
        }
        .hkm-section-eyebrow em { color: var(--sienna); font-style: italic; font-weight: 600; }
        .hkm-section-title {
          font-family: var(--serif); font-weight: 400;
          font-size: clamp(36px, 4vw, 54px);
          line-height: 1; letter-spacing: -.02em;
          margin: 0 0 12px; max-width: 720px;
        }
        .hkm-section-title em { font-style: italic; color: var(--sienna); }
        .hkm-section-lead {
          font-family: var(--sans); font-size: 15.5px;
          opacity: .78; max-width: 620px; line-height: 1.55;
          margin: 0 0 56px;
        }
        .hkm-spread {
          display: grid;
          grid-template-columns: 80px 1fr 1fr;
          gap: 40px;
          align-items: start;
          padding: 40px 0;
          border-top: 1px solid var(--rule-strong);
        }
        .hkm-spread:last-of-type { border-bottom: 1px solid var(--rule-strong); }
        .hkm-spread.reverse {
          grid-template-columns: 80px 1fr 1fr;
        }
        .hkm-spread.reverse .hkm-spread-text { grid-column: 3 / 4; grid-row: 1; }
        .hkm-spread.reverse .hkm-spread-illus { grid-column: 2 / 3; grid-row: 1; }
        .hkm-spread-n {
          font-family: var(--serif); font-style: italic;
          font-size: 44px; line-height: 1;
          color: var(--sienna);
          padding-top: 4px;
        }
        .hkm-spread-n small {
          display: block;
          font-family: var(--mono); font-style: normal; font-size: 11px;
          color: var(--ink); opacity: .55; letter-spacing: .12em;
          margin-top: 4px; font-weight: 500;
        }
        .hkm-spread-text h3 {
          font-family: var(--serif); font-weight: 400;
          font-size: 30px; line-height: 1.05; letter-spacing: -.015em;
          margin: 0 0 14px;
        }
        .hkm-spread-text p {
          font-family: var(--sans); font-size: 15px; line-height: 1.6;
          opacity: .78; margin: 0; max-width: 460px;
        }
        .hkm-spread-illus {
          aspect-ratio: 1;
          background: var(--offwhite);
          border: 1px solid var(--rule);
          position: relative; overflow: hidden;
        }
        .hkm-spread-illus img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .hkm-spread-illus-fallback {
          position: absolute; inset: 0;
          display: grid; place-items: center;
          font-family: var(--serif); font-style: italic;
          font-size: 80px; color: var(--ink); opacity: .1;
        }

        /* ============ Q&A + STICKY PRICING ============ */
        .hkm-qa {
          padding: 96px 0;
          border-top: 1px solid var(--rule);
        }
        .hkm-qa-grid {
          display: grid;
          grid-template-columns: 1.4fr .8fr;
          gap: 60px;
          align-items: start;
        }
        .hkm-qa-header h2 {
          font-family: var(--serif); font-weight: 400;
          font-size: clamp(34px, 3.5vw, 50px);
          line-height: 1; letter-spacing: -.02em;
          margin: 0 0 16px;
        }
        .hkm-qa-header h2 em { font-style: italic; color: var(--sienna); }
        .hkm-qa-header p {
          font-family: var(--sans); font-size: 14.5px; line-height: 1.6;
          opacity: .78; margin: 0 0 32px; max-width: 480px;
        }
        /* Overrides untuk ChatWidget supaya masuk vibe editorial */
        .hkm-chat-frame .cw-glow-wrap {
          background: transparent !important;
          animation: none !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .hkm-chat-frame .cw {
          background: var(--offwhite) !important;
          border: 1px solid var(--ink) !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }
        .hkm-chat-frame .cw-head {
          background: var(--ink) !important;
          color: var(--paper) !important;
          border-bottom: 0 !important;
          padding: 14px 20px !important;
          font-family: var(--mono);
        }
        .hkm-chat-frame .cw-title {
          font-family: var(--mono) !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          text-transform: uppercase !important;
          letter-spacing: .12em !important;
          color: var(--paper) !important;
        }
        .hkm-chat-frame .cw-online {
          color: rgba(244,239,228,.7) !important;
          font-family: var(--mono);
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: .1em;
        }
        .hkm-chat-frame .cw-online::before { background: var(--sienna) !important; }
        .hkm-chat-frame .cw-badge {
          background: transparent !important;
          color: var(--paper) !important;
          border: 1px solid rgba(244,239,228,.35);
          font-family: var(--mono);
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: .1em;
        }
        .hkm-chat-frame .cw-msgs { background: var(--offwhite) !important; }
        .hkm-chat-frame .cw-bubble { font-family: var(--sans) !important; font-size: 14.5px !important; }
        .hkm-chat-frame .cw-row.bot .cw-bubble {
          background: transparent !important;
          border-left: 2px solid var(--sienna) !important;
          border-radius: 0 !important;
          padding: 4px 14px 4px 16px !important;
          color: var(--ink) !important;
        }
        .hkm-chat-frame .cw-row.user .cw-bubble {
          background: var(--ink) !important;
          border-radius: 0 !important;
          color: var(--paper) !important;
        }
        .hkm-chat-frame .cw-quick {
          background: var(--offwhite) !important;
          border-top: 1px solid var(--rule) !important;
          padding: 12px 20px !important;
        }
        .hkm-chat-frame .cw-quick button {
          border-radius: 0 !important;
          border: 1px solid var(--rule-strong) !important;
          background: transparent !important;
          font-family: var(--mono) !important;
          font-size: 11px !important;
          font-weight: 500 !important;
          text-transform: uppercase !important;
          letter-spacing: .1em !important;
          color: var(--ink) !important;
          padding: 5px 12px !important;
        }
        .hkm-chat-frame .cw-quick button:hover {
          background: var(--ink) !important; color: var(--paper) !important;
          border-color: var(--ink) !important;
        }
        .hkm-chat-frame .cw-composer {
          background: var(--paper) !important;
          border-top: 1px solid var(--ink) !important;
          padding: 16px 20px !important;
        }
        .hkm-chat-frame .cw-input {
          border-radius: 0 !important;
          border: 1px solid var(--rule-strong) !important;
          background: var(--offwhite) !important;
          font-family: var(--sans) !important;
        }
        .hkm-chat-frame .cw-input:focus { border-color: var(--ink) !important; }
        .hkm-chat-frame .cw-send {
          border-radius: 0 !important;
          background: var(--ink) !important;
          box-shadow: none !important;
          font-family: var(--mono) !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
          letter-spacing: .08em !important;
          font-size: 12px !important;
        }
        .hkm-chat-frame .cw-hint {
          font-family: var(--mono); font-size: 10.5px;
          color: var(--sienna) !important;
          text-transform: uppercase; letter-spacing: .1em;
        }

        /* Sticky pricing card */
        .hkm-sidebar {
          position: sticky; top: 120px;
          padding: 28px 30px;
          background: var(--ink); color: var(--paper);
          border: 1px solid var(--ink);
        }
        .hkm-sidebar-eyebrow {
          font-family: var(--mono); font-size: 10.5px; font-weight: 500;
          text-transform: uppercase; letter-spacing: .15em;
          color: rgba(244,239,228,.7); margin-bottom: 20px;
          padding-bottom: 16px; border-bottom: 1px solid rgba(244,239,228,.2);
        }
        .hkm-sidebar-row {
          display: flex; justify-content: space-between; align-items: baseline;
          padding: 16px 0; border-bottom: 1px dashed rgba(244,239,228,.2);
          font-family: var(--sans);
        }
        .hkm-sidebar-row:last-of-type { border-bottom: 0; }
        .hkm-sidebar-row-label {
          font-size: 13px; font-weight: 500; color: rgba(244,239,228,.85);
        }
        .hkm-sidebar-row-value {
          display: flex; flex-direction: column; align-items: flex-end; gap: 2px;
        }
        .hkm-sidebar-strike {
          font-family: var(--mono); font-size: 11.5px;
          text-decoration: line-through; text-decoration-thickness: 1.5px;
          text-decoration-color: var(--sienna);
          opacity: .55;
        }
        .hkm-sidebar-final {
          font-family: var(--serif); font-size: 22px;
          line-height: 1; letter-spacing: -.02em;
          color: var(--paper);
        }
        .hkm-sidebar-djki {
          margin-top: 20px; padding-top: 16px;
          border-top: 1px solid rgba(244,239,228,.2);
          font-family: var(--mono); font-size: 10.5px; letter-spacing: .1em;
          text-transform: uppercase; color: var(--sienna); font-weight: 500;
        }

        /* ============ COLOPHON FOOTER ============ */
        .hkm-colophon {
          padding: 80px 0 40px;
          border-top: 1px solid var(--rule);
          margin-top: 40px;
        }
        .hkm-colophon-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 60px;
          margin-bottom: 40px;
        }
        .hkm-colophon-title {
          font-family: var(--mono); font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: .15em;
          margin-bottom: 20px; color: var(--ink); opacity: .55;
        }
        .hkm-colophon-body {
          font-family: var(--sans); font-size: 13.5px;
          line-height: 1.65; color: var(--ink); opacity: .78;
          max-width: 620px;
        }
        .hkm-colophon-body strong { font-weight: 600; opacity: 1; }
        .hkm-colophon-body em {
          font-family: var(--serif); font-style: italic;
          font-size: 15px; color: var(--sienna);
        }
        .hkm-colophon-links {
          display: flex; flex-direction: column; gap: 8px;
          font-family: var(--sans); font-size: 13px;
        }
        .hkm-colophon-links a {
          color: var(--ink); text-decoration: none; opacity: .7;
          transition: opacity .12s, color .12s;
        }
        .hkm-colophon-links a:hover { opacity: 1; color: var(--sienna); }
        .hkm-colophon-rule {
          border-top: 1px solid var(--rule);
          padding-top: 20px;
          display: flex; justify-content: space-between; align-items: baseline;
          font-family: var(--mono); font-size: 10.5px;
          text-transform: uppercase; letter-spacing: .12em;
          color: var(--ink); opacity: .55; font-weight: 500;
          flex-wrap: wrap; gap: 12px;
        }
        .hkm-colophon-rule em { color: var(--sienna); font-style: italic; font-weight: 600; }

        /* ============ RESPONSIVE ============ */
        @media (max-width: 900px) {
          .hkm-container { padding: 0 22px; }
          .hkm-masthead-grid { grid-template-columns: 1fr auto; gap: 16px; }
          .hkm-nav, .hkm-cta-link { display: none; }
          .hkm-hamburger { display: inline-flex; align-items: center; justify-content: center; }
          .hkm-hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .hkm-hero-text { grid-column: 1 / -1; }
          .hkm-hero-illus { grid-column: 1 / -1; }
          .hkm-fees-table { grid-template-columns: 1fr 1fr; gap: 4px 16px; }
          .hkm-fees-table > div:nth-child(4n+3) { text-align: left; }
          .hkm-spread { grid-template-columns: 60px 1fr; gap: 24px; padding: 32px 0; }
          .hkm-spread.reverse .hkm-spread-text { grid-column: 2; grid-row: 1; }
          .hkm-spread.reverse .hkm-spread-illus { grid-column: 1 / -1; grid-row: 2; }
          .hkm-spread-illus { grid-column: 1 / -1; margin-top: 20px; aspect-ratio: 3/2; }
          .hkm-qa-grid { grid-template-columns: 1fr; gap: 40px; }
          .hkm-sidebar { position: relative; top: 0; }
          .hkm-colophon-grid { grid-template-columns: 1fr; gap: 32px; }
        }
        @media (max-width: 640px) {
          .hkm-hero { padding: 44px 0 60px; }
          .hkm-h1 { font-size: 46px; }
          .hkm-strip { font-size: 10px; letter-spacing: .04em; }
        }
      `}</style>

      <div className="hkm-grain">
        {/* ==== TOP STRIP editorial ==== */}
        <div className="hkm-strip" role="banner">
          <div className="hkm-strip-track">
            {[...Array(2)].map((_, dupe) => (
              <div key={dupe} style={{ display: "flex", gap: 44 }}>
                <span className="hkm-strip-item">Garansi termurah se-Indonesia</span>
                <span className="hkm-strip-item">UMKM · <em>Rp 1.299.000</em> per kelas</span>
                <span className="hkm-strip-item">Non-UMK · <em>Rp 2.490.000</em> per kelas</span>
                <span className="hkm-strip-item">Sudah termasuk biaya DJKI resmi</span>
                <span className="hkm-strip-item">Ada yang lebih murah? <em>Selisih diganti</em></span>
              </div>
            ))}
          </div>
        </div>

        {/* ==== MASTHEAD ==== */}
        <header className="hkm-masthead">
          <div className="hkm-container hkm-masthead-grid">
            <a className="hkm-logomark" href="/">
              <div className="hkm-logomark-stack">
                <span>Haki</span>
                <span>Merek</span>
              </div>
              <div className="hkm-logomark-wordmark">
                Haki<em>Merek</em>
              </div>
            </a>
            <nav className="hkm-nav" aria-label="Navigasi utama">
              {NAV.map((n) => (
                <a key={n.href} href={n.href}>{n.label}</a>
              ))}
            </nav>
            <a
              className="hkm-cta-link"
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Konsultasi
            </a>
            <button
              className="hkm-hamburger"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              ☰
            </button>
          </div>
          {mobileMenuOpen && (
            <div style={{ borderTop: `1px solid ${INK}20`, padding: "16px 22px", background: PAPER }}>
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  style={{
                    display: "block",
                    padding: "10px 0",
                    fontFamily: "var(--sans)",
                    fontSize: 15,
                    color: INK,
                    textDecoration: "none",
                    borderBottom: `1px solid ${INK}15`,
                  }}
                >
                  {n.label}
                </a>
              ))}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  marginTop: 14,
                  padding: "12px 16px",
                  background: INK,
                  color: PAPER,
                  textDecoration: "none",
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: ".1em",
                }}
              >
                Konsultasi →
              </a>
            </div>
          )}
        </header>

        {/* ==== HERO ==== */}
        <section className="hkm-container hkm-hero">
          <div className="hkm-hero-grid">
            <div className="hkm-hero-text">
              <div className="hkm-byline">
                <span>Practice Note</span>
                <span>No. <em>001</em></span>
                <span>03 min</span>
                <span>Rev. 2026</span>
              </div>
              <h1 className="hkm-h1">
                Merek dagang<br />
                yang <em>aman</em><br />
                didaftarkan.
              </h1>
              <p className="hkm-dek">
                Analisa risiko, rekomendasi kelas produk/jasa, pendaftaran ke DJKI, hingga
                pendampingan sampai sertifikat terbit. <strong>Didampingi konsultan berpengalaman</strong> —
                Anda cukup fokus jualan.
              </p>
              <a className="hkm-hero-anchor" href="#konsultasi">
                Mulai konsultasi
              </a>
            </div>

            <div className="hkm-hero-illus">
              <div className="hkm-illus-frame">
                <img
                  src="/hakimerek/hero-illustration.webp"
                  alt="Ilustrasi editorial: sertifikat merek, pena, dan cap DJKI"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.style.display = "none";
                    const fb = document.createElement("div");
                    fb.className = "hkm-illus-fallback";
                    fb.textContent = "§";
                    img.parentElement?.appendChild(fb);
                  }}
                />
              </div>
              <div className="hkm-illus-caption">
                <span>Fig. 001 · Editorial illustration</span>
                <em>Hakim Merek</em>
              </div>
            </div>
          </div>
        </section>

        {/* ==== FEES ==== */}
        <section className="hkm-container hkm-fees">
          <div className="hkm-fees-header">
            <span>Fees · Biaya per kelas</span>
            <em>Termasuk PNBP DJKI resmi</em>
          </div>
          <div className="hkm-fees-table">
            <div className="hkm-fee-row">
              <div className="hkm-fee-label">UMKM / Perorangan</div>
              <div className="hkm-fee-strike">Rp 2.500.000</div>
              <div className="hkm-fee-price">Rp 1.299.000</div>
              <div className="hkm-fee-unit">per kelas</div>
            </div>
            <div className="hkm-fee-row">
              <div className="hkm-fee-label">Perusahaan / PT</div>
              <div className="hkm-fee-strike">Rp 3.950.000</div>
              <div className="hkm-fee-price">Rp 2.490.000</div>
              <div className="hkm-fee-unit">per kelas</div>
            </div>
          </div>
          <div className="hkm-fees-note">
            <span>
              Sudah termasuk biaya <strong>DJKI resmi</strong> + jasa pendampingan sampai sertifikat elektronik terbit.
              Kalau ada tempat yang lebih murah dengan cakupan setara, kirim penawarannya — selisih diganti.
            </span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase" }}>
              § Ref. Peraturan Menkeu No. 28/2024
            </span>
          </div>
        </section>

        {/* ==== PROCESS SPREADS ==== */}
        <section className="hkm-container hkm-process">
          <div className="hkm-section-eyebrow">
            <span>Practice</span> · <em>Proses pendaftaran</em>
          </div>
          <h2 className="hkm-section-title">
            Empat tahap sampai <em>sertifikat</em> keluar.
          </h2>
          <p className="hkm-section-lead">
            Dokumentasi & pengajuan sesuai standar DJKI. Tim konsultan mendampingi setiap tahap,
            dari analisa awal sampai monitoring pemeriksaan substantif.
          </p>

          {PROCESS.map((p, i) => (
            <div key={p.n} className={`hkm-spread${i % 2 === 1 ? " reverse" : ""}`}>
              <div className="hkm-spread-n">
                {p.n}
                <small>Of 04</small>
              </div>
              <div className="hkm-spread-text">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
              <div className="hkm-spread-illus">
                <img
                  src={`/hakimerek/process-${p.n}.webp`}
                  alt={`Ilustrasi ${p.title}`}
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.style.display = "none";
                    const fb = document.createElement("div");
                    fb.className = "hkm-spread-illus-fallback";
                    fb.textContent = p.n;
                    img.parentElement?.appendChild(fb);
                  }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* ==== Q&A + STICKY PRICING ==== */}
        <section id="konsultasi" className="hkm-container hkm-qa">
          <div className="hkm-qa-grid">
            <div className="hkm-chat-frame">
              <div className="hkm-section-eyebrow" style={{ marginBottom: 24 }}>
                <span>Reader Q&A</span> · <em>Chat AI</em>
              </div>
              <div className="hkm-qa-header">
                <h2>
                  Ketik nama merek Anda.<br />
                  Kami <em>jawab langsung</em>.
                </h2>
                <p>
                  Cek ketersediaan di database PDKI/DJKI, indikator kemiripan visual+fonetik,
                  rekomendasi kelas produk/jasa. Kalau siap lanjut, admin arahkan ke WhatsApp.
                </p>
              </div>
              <ChatWidget
                brand={brand}
                brandName="HakiMerek"
                chatTitle="Q&A · HakiMerek"
                chatSubtitle="Practice desk"
                onlineLabel="Online · Senin–Jumat WIB"
                initialGreeting={
                  "Halo. Saya asisten AI HakiMerek. Ketik nama merek yang ingin didaftarkan — saya cek ketersediaan di database PDKI/DJKI + rekomendasi kelas produk/jasa.\n\nKalau siap lanjut, admin akan bantu proses ke DJKI langsung dari WhatsApp."
                }
                quickActions={QUICK_ACTIONS}
                placeholder="Nama merek Anda…"
                ctaLabel="Kirim"
                minHeight={580}
              />
            </div>

            <aside className="hkm-sidebar">
              <div className="hkm-sidebar-eyebrow">Fees Summary</div>
              <div className="hkm-sidebar-row">
                <span className="hkm-sidebar-row-label">UMKM / Perorangan</span>
                <span className="hkm-sidebar-row-value">
                  <span className="hkm-sidebar-strike">Rp 2.500.000</span>
                  <span className="hkm-sidebar-final">Rp 1.299.000</span>
                </span>
              </div>
              <div className="hkm-sidebar-row">
                <span className="hkm-sidebar-row-label">Perusahaan / PT</span>
                <span className="hkm-sidebar-row-value">
                  <span className="hkm-sidebar-strike">Rp 3.950.000</span>
                  <span className="hkm-sidebar-final">Rp 2.490.000</span>
                </span>
              </div>
              <div className="hkm-sidebar-djki">✓ Termasuk PNBP DJKI resmi</div>
            </aside>
          </div>
        </section>

        {/* ==== COLOPHON FOOTER ==== */}
        <footer className="hkm-container hkm-colophon">
          <div className="hkm-colophon-grid">
            <div>
              <div className="hkm-colophon-title">Colophon</div>
              <p className="hkm-colophon-body">
                <em>HakiMerek</em> adalah layanan pendaftaran merek dagang yang dikelola <strong>PT Sellora Optima Teknologi</strong> —
                berpengalaman mendaftarkan ribuan merek dagang ke DJKI untuk UMKM dan perusahaan Indonesia.
                Set dengan <em>Instrument Serif</em> untuk display, <em>IBM Plex Sans</em> untuk body,
                dan <em>IBM Plex Mono</em> untuk metadata. Grain overlay <strong>4%</strong>.
              </p>
            </div>
            <div>
              <div className="hkm-colophon-title">Navigasi</div>
              <div className="hkm-colophon-links">
                <a href="/cek-merek">Cek Merek</a>
                <a href="/daftar-merek">Daftar Merek</a>
                <a href="/kelas-produk-jasa">Kelas Produk/Jasa</a>
                <a href="/biaya">Biaya</a>
                <a href="/perpanjang">Perpanjang</a>
                <a href="/kontak">Kontak</a>
              </div>
            </div>
          </div>
          <div className="hkm-colophon-rule">
            <span>© 2026 HakiMerek</span>
            <span><em>info@hakio.id</em> · 0851-4841-6800</span>
            <span>Set in Cream #F4EFE4 & Ink #163D33</span>
          </div>
        </footer>

        <FloatingWA
          domain="hakimerek.com"
          whatsappNumber={brand.whatsapp}
          accent={SIENNA}
          label="Chat"
        />
      </div>
    </>
  );
}
