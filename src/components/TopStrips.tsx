/**
 * 4 varian TopStrip yang beda-beda per domain — supaya visual tidak
 * typical Hakio semua. Isi angka harga dan garansi tetap sama, cuma
 * shell design + wording beda:
 *
 * - TopStripDark      → cekhaki (existing dark gradient + diagonal texture)
 * - TopStripMarquee   → hakimerek (running text scrolling left-to-right)
 * - TopStripBubble    → hkimerek (multiple floating pill bubbles)
 * - TopStripRibbon    → merekin (paper ribbon overlay minimalist)
 */

/* ─────────────────────────────────────────────────────────────
   1. DARK (untuk cekhaki — biru premium)
   ───────────────────────────────────────────────────────────── */
export function TopStripDark({ accent = "#2f9cff" }: { accent?: string }) {
  return (
    <>
      <style>{`
        .tsd {
          background:linear-gradient(90deg, #0d2457 0%, ${accent} 55%, #0d2457 100%);
          color:#fff; font-size:13.5px; font-weight:700;
          padding:9px 16px; text-align:center;
          border-bottom:1px solid rgba(0,0,0,.08);
          position:relative; overflow:hidden;
        }
        .tsd::before {
          content:""; position:absolute; inset:0;
          background:repeating-linear-gradient(45deg, transparent 0 12px, rgba(255,255,255,.05) 12px 24px);
          pointer-events:none;
        }
        .tsd-inner { position:relative; z-index:1; display:inline-flex; align-items:center; gap:12px; flex-wrap:wrap; justify-content:center; }
        .tsd-badge { background:#ffd700; color:#0d2457; padding:3px 10px; border-radius:999px; font-weight:900; font-size:11.5px; letter-spacing:.05em; box-shadow:0 2px 6px rgba(255,215,0,.35); }
        .tsd-price { background:rgba(255,255,255,.15); border:1px solid rgba(255,255,255,.25); padding:3px 12px; border-radius:999px; font-weight:800; font-size:12.5px; }
        .tsd-price b { color:#ffd700; }
        .tsd-sep { opacity:.35; }
        @media (max-width:720px) {
          .tsd { font-size:12px; padding:8px 12px; }
          .tsd-badge, .tsd-price { font-size:11px; }
          .tsd-sep { display:none; }
        }
      `}</style>
      <div className="tsd" role="banner">
        <div className="tsd-inner">
          <span className="tsd-badge">🏆 GARANSI TERMURAH SE-INDONESIA</span>
          <span className="tsd-price">UMKM <b>Rp 1.299.000</b>/kelas</span>
          <span className="tsd-sep">·</span>
          <span className="tsd-price">Non-UMK <b>Rp 2.490.000</b>/kelas</span>
          <span className="tsd-sep">·</span>
          <span>Ada lebih murah? <b>Selisih diganti</b></span>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. MARQUEE (untuk hakimerek — running text seperti stock ticker)
   ───────────────────────────────────────────────────────────── */
export function TopStripMarquee({ accent = "#0b8d68" }: { accent?: string }) {
  return (
    <>
      <style>{`
        .tsm {
          background:${accent};
          color:#fff; padding:0; overflow:hidden;
          position:relative; border-bottom:1px solid rgba(0,0,0,.1);
        }
        .tsm-track {
          display:flex; gap:44px; padding:10px 0;
          white-space:nowrap;
          animation:tsmScroll 30s linear infinite;
          font-size:13.5px; font-weight:700;
          width:max-content;
        }
        .tsm-item { display:inline-flex; align-items:center; gap:8px; }
        .tsm-item b { color:#ffe066; }
        .tsm-badge { display:inline-flex; align-items:center; gap:6px; padding:2px 12px; border-radius:999px; background:#ffe066; color:#0b3d2a; font-weight:900; font-size:12px; letter-spacing:.03em; }
        .tsm-dot { width:8px; height:8px; border-radius:50%; background:#ffe066; }
        @keyframes tsmScroll {
          from { transform:translateX(0); }
          to { transform:translateX(-50%); }
        }
        .tsm:hover .tsm-track { animation-play-state:paused; }
        @media (max-width:720px) { .tsm-track { animation-duration:22s; font-size:12.5px; } }
      `}</style>
      <div className="tsm" role="banner">
        <div className="tsm-track">
          {[...Array(2)].map((_, dupe) => (
            <div key={dupe} style={{ display: "flex", gap: 44 }}>
              <span className="tsm-item"><span className="tsm-badge">🏆 GARANSI TERMURAH SE-INDONESIA</span></span>
              <span className="tsm-item"><span className="tsm-dot" /> UMKM cuma <b>Rp 1.299.000</b>/kelas</span>
              <span className="tsm-item"><span className="tsm-dot" /> Non-UMK <b>Rp 2.490.000</b>/kelas</span>
              <span className="tsm-item"><span className="tsm-dot" /> Sudah termasuk biaya DJKI resmi</span>
              <span className="tsm-item"><span className="tsm-dot" /> Ada lebih murah? <b>Selisih diganti 100%</b></span>
              <span className="tsm-item"><span className="tsm-dot" /> Konsultasi gratis via WhatsApp</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. BUBBLE (untuk hkimerek — playful floating bubbles)
   ───────────────────────────────────────────────────────────── */
export function TopStripBubble({ accent = "#7657ff" }: { accent?: string }) {
  return (
    <>
      <style>{`
        .tsb {
          background:linear-gradient(135deg, #f0edff 0%, #fff 60%, #f7f4ff 100%);
          padding:10px 16px;
          border-bottom:1px solid #eee6ff;
          position:relative; overflow:hidden;
        }
        .tsb::before {
          content:""; position:absolute; top:0; right:-40px; width:180px; height:100%;
          background:radial-gradient(circle at 50% 50%, color-mix(in srgb, ${accent} 22%, transparent) 0%, transparent 70%);
          pointer-events:none;
        }
        .tsb-inner {
          position:relative; z-index:1;
          display:flex; align-items:center; justify-content:center; gap:8px; flex-wrap:wrap;
        }
        .tsb-bubble {
          padding:5px 14px; border-radius:999px;
          background:#fff; border:1.5px solid #e6dfff;
          font-size:12.5px; font-weight:800; color:#3d2f8c;
          box-shadow:0 4px 12px rgba(118,87,255,.08);
          animation:tsbBob 3.6s ease-in-out infinite;
          display:inline-flex; align-items:center; gap:6px;
        }
        .tsb-bubble:nth-child(1) { animation-delay:0s; }
        .tsb-bubble:nth-child(2) { animation-delay:.4s; }
        .tsb-bubble:nth-child(3) { animation-delay:.8s; }
        .tsb-bubble:nth-child(4) { animation-delay:1.2s; }
        .tsb-bubble.hero { background:linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 65%, #ffd166)); color:#fff; border-color:transparent; box-shadow:0 8px 20px color-mix(in srgb, ${accent} 30%, transparent); }
        .tsb-bubble b { color:${accent}; }
        .tsb-bubble.hero b { color:#ffe066; }
        @keyframes tsbBob {
          0%, 100% { transform:translateY(0); }
          50% { transform:translateY(-4px); }
        }
        @media (max-width:720px) { .tsb-bubble { font-size:11px; padding:4px 10px; } .tsb-bubble:nth-child(n+4) { display:none; } }
      `}</style>
      <div className="tsb" role="banner">
        <div className="tsb-inner">
          <span className="tsb-bubble hero">🏆 <b>GARANSI TERMURAH</b> se-Indonesia</span>
          <span className="tsb-bubble">UMKM <b>Rp 1.299.000</b></span>
          <span className="tsb-bubble">Non-UMK <b>Rp 2.490.000</b></span>
          <span className="tsb-bubble">✓ Sudah termasuk DJKI</span>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. RIBBON (untuk merekin — friendly paper ribbon with tilt)
   ───────────────────────────────────────────────────────────── */
export function TopStripRibbon({ accent = "#ff6a2d" }: { accent?: string }) {
  return (
    <>
      <style>{`
        .tsr {
          background:linear-gradient(180deg, #fff9f5 0%, #fff 100%);
          padding:12px 16px;
          border-bottom:1px dashed #f5d5c1;
          position:relative;
        }
        .tsr::before, .tsr::after {
          content:""; position:absolute; top:50%; width:28px; height:2px;
          background:linear-gradient(90deg, transparent, ${accent}, transparent);
          transform:translateY(-50%);
        }
        .tsr::before { left:0; }
        .tsr::after { right:0; }
        .tsr-inner {
          max-width:1180px; margin:0 auto;
          display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap;
        }
        .tsr-ribbon {
          display:inline-flex; align-items:center; gap:10px;
          padding:8px 20px;
          background:${accent}; color:#fff;
          border-radius:6px;
          font-weight:900; font-size:13px; letter-spacing:.02em;
          position:relative;
          box-shadow:0 4px 12px color-mix(in srgb, ${accent} 32%, transparent);
        }
        .tsr-ribbon::before, .tsr-ribbon::after {
          content:""; position:absolute; top:0;
          border:16px solid transparent; border-top-color:${accent}; border-bottom-color:${accent};
        }
        .tsr-ribbon::before { left:-12px; border-left-color:transparent; }
        .tsr-ribbon::after { right:-12px; border-right-color:transparent; }
        .tsr-info { display:inline-flex; gap:14px; align-items:center; flex-wrap:wrap; font-size:12.5px; color:#5c4a3c; font-weight:700; }
        .tsr-info b { color:${accent}; font-weight:900; }
        .tsr-chip { padding:4px 12px; border-radius:999px; background:#fff0e6; border:1px solid #ffd4b3; color:#a04016; font-size:12px; font-weight:800; }
        @media (max-width:720px) {
          .tsr { padding:10px 12px; }
          .tsr-ribbon { font-size:12px; padding:6px 16px; }
          .tsr::before, .tsr::after { display:none; }
          .tsr-info { font-size:11.5px; gap:8px; }
        }
      `}</style>
      <div className="tsr" role="banner">
        <div className="tsr-inner">
          <span className="tsr-ribbon">🏆 TERMURAH SE-INDONESIA</span>
          <span className="tsr-info">
            <span className="tsr-chip">UMKM <b>Rp 1.299rb</b></span>
            <span className="tsr-chip">Non-UMK <b>Rp 2.490rb</b></span>
            <span>Lebih murah di tempat lain? <b>Selisih diganti!</b></span>
          </span>
        </div>
      </div>
    </>
  );
}
