/**
 * Top strip banner di atas navbar — muncul di semua brand.
 * Fungsi: memaksa visitor langsung nggeh kita jual jasa TERMURAH,
 * lengkap dengan angka harga di depan mata. Anti-abstract, langsung numerik.
 * Klik mana pun di strip = scroll ke pricing section (opsional).
 */
export default function TopStrip({ accent = "#d6a64a" }: { accent?: string }) {
  return (
    <>
      <style>{`
        .ts-bar {
          background:linear-gradient(90deg, #0d2457 0%, ${accent} 55%, #0d2457 100%);
          color:#fff;
          font-size:13.5px;
          font-weight:700;
          letter-spacing:.005em;
          padding:9px 16px;
          text-align:center;
          border-bottom:1px solid rgba(0,0,0,.08);
          position:relative;
          overflow:hidden;
        }
        .ts-bar::before {
          content:"";
          position:absolute; inset:0;
          background:repeating-linear-gradient(45deg, transparent 0 12px, rgba(255,255,255,.05) 12px 24px);
          pointer-events:none;
        }
        .ts-bar-inner {
          position:relative; z-index:1;
          display:inline-flex; align-items:center; gap:12px; flex-wrap:wrap; justify-content:center;
        }
        .ts-badge {
          background:#ffd700; color:#0d2457;
          padding:3px 10px; border-radius:999px;
          font-weight:900; font-size:11.5px;
          letter-spacing:.05em;
          box-shadow:0 2px 6px rgba(255,215,0,.35);
        }
        .ts-price {
          background:rgba(255,255,255,.15);
          border:1px solid rgba(255,255,255,.25);
          padding:3px 12px; border-radius:999px;
          font-weight:800; font-size:12.5px;
        }
        .ts-price b { color:#ffd700; }
        .ts-sep { opacity:.35; }
        @media (max-width:720px) {
          .ts-bar { font-size:12px; padding:8px 12px; }
          .ts-badge, .ts-price { font-size:11px; padding:2px 8px; }
          .ts-sep { display:none; }
        }
      `}</style>
      <div className="ts-bar" role="banner">
        <div className="ts-bar-inner">
          <span className="ts-badge">🏆 GARANSI TERMURAH SE-INDONESIA</span>
          <span className="ts-price">UMKM <b>Rp 1.299.000</b>/kelas</span>
          <span className="ts-sep">·</span>
          <span className="ts-price">Non-UMK <b>Rp 2.490.000</b>/kelas</span>
          <span className="ts-sep">·</span>
          <span>Ada yang lebih murah? <b>Selisih diganti</b></span>
        </div>
      </div>
    </>
  );
}
