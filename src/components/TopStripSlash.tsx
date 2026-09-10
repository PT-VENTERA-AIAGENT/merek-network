/**
 * TopStrip variant #5: SLASH — untuk daftarmerekmu.com (burgundy).
 * Design: sharp angled slash cutouts kiri-kanan, minimal editorial look,
 * font monospace di angka harga supaya beda tegas dari 4 lain.
 */
export default function TopStripSlash({ accent = "#b91c1c" }: { accent?: string }) {
  return (
    <>
      <style>{`
        .tss {
          background:#111827;
          color:#fff;
          padding:0;
          border-bottom:1px solid #000;
          position:relative;
          overflow:hidden;
        }
        .tss::before, .tss::after {
          content:""; position:absolute; top:0; bottom:0; width:80px;
          background:${accent};
          transform:skewX(-16deg);
        }
        .tss::before { left:-40px; }
        .tss::after { right:-40px; }
        .tss-inner {
          max-width:1240px; margin:0 auto;
          padding:11px 24px;
          display:flex; align-items:center; justify-content:center;
          gap:18px; flex-wrap:wrap;
          position:relative; z-index:1;
        }
        .tss-tag {
          display:inline-flex; align-items:center; gap:8px;
          color:${accent};
          font-family:'JetBrains Mono', 'SF Mono', Consolas, monospace;
          font-size:11px; font-weight:900;
          letter-spacing:.15em;
        }
        .tss-tag::before {
          content:""; width:10px; height:10px; background:${accent};
          transform:rotate(45deg);
        }
        .tss-item {
          display:inline-flex; align-items:baseline; gap:6px;
          font-size:13px; font-weight:600; color:#d1d5db;
        }
        .tss-item b {
          color:#fff;
          font-family:'JetBrains Mono', 'SF Mono', Consolas, monospace;
          font-size:14px; font-weight:800;
          letter-spacing:.01em;
        }
        .tss-sep { color:${accent}; font-weight:900; }
        .tss-blink {
          display:inline-block; width:8px; height:8px; border-radius:50%;
          background:#34d399; margin-right:6px;
          animation:tssBlink 1.4s ease-in-out infinite;
        }
        @keyframes tssBlink { 0%,100%{opacity:1} 50%{opacity:.4} }
        @media (max-width:720px) {
          .tss-inner { gap:10px; padding:9px 16px; }
          .tss-item { font-size:12px; }
          .tss-item b { font-size:13px; }
          .tss::before, .tss::after { width:40px; }
        }
      `}</style>
      <div className="tss" role="banner">
        <div className="tss-inner">
          <span className="tss-tag">
            <span className="tss-blink" />
            TERMURAH · DIJAMIN
          </span>
          <span className="tss-item">UMKM <span className="tss-sep">/</span> <b>Rp 1.299.000</b></span>
          <span className="tss-item">Non-UMK <span className="tss-sep">/</span> <b>Rp 2.490.000</b></span>
          <span className="tss-item">Selisih lebih murah <span className="tss-sep">/</span> <b>Kami ganti 100%</b></span>
        </div>
      </div>
    </>
  );
}
