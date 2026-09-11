"use client";

import { useState, useRef } from "react";

const API = "https://api.hakimerek.com/api/search";

interface Result {
  brand_name: string;
  serial_number: string;
  filing_date: string;
  image_url: string;
  detail_url: string;
}

function StatusBadge({ serial }: { serial: string }) {
  // Derive rough status from serial prefix
  const prefix = serial.slice(0, 1);
  const isExpired = serial.startsWith("R0020") && parseInt(serial.slice(-4)) < 2010;
  if (isExpired) return <span style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>Kadaluwarsa</span>;
  return <span style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>Terdaftar</span>;
}

export default function CekMerekSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function doSearch(q: string, p = 1) {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}?q=${encodeURIComponent(q)}&page=${p}`);
      const data = await res.json();
      if (!data.ok) throw new Error("Gagal mengambil data");
      if (p === 1) setResults(data.results ?? []);
      else setResults(prev => [...prev, ...(data.results ?? [])]);
      setTotal(data.total ?? 0);
      setPage(p);
      setSearched(true);
    } catch {
      setError("Gagal terhubung ke database. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    doSearch(query, 1);
  }

  return (
    <div style={{ marginBottom: 32 }}>
      <style>{`
        .cmk-box { background: var(--soft, #f0f4ff); border: 1.5px solid var(--line, #e8edf7); border-radius: 20px; padding: 28px 24px; margin-bottom: 24px; }
        .cmk-row { display: flex; gap: 10px; }
        .cmk-input { flex: 1; height: 52px; padding: 0 18px; font-size: 15px; border: 1.5px solid var(--line, #e8edf7); border-radius: 12px; outline: none; font-family: inherit; color: var(--ink, #0f224d); background: #fff; transition: border-color .15s; }
        .cmk-input:focus { border-color: var(--accent, #1e3a8a); }
        .cmk-btn { height: 52px; padding: 0 26px; border-radius: 12px; background: var(--accent, #1e3a8a); color: #fff; font-size: 15px; font-weight: 700; border: none; cursor: pointer; font-family: inherit; transition: opacity .15s; white-space: nowrap; }
        .cmk-btn:hover { opacity: .88; }
        .cmk-btn:disabled { opacity: .5; cursor: default; }
        .cmk-hint { margin-top: 10px; font-size: 12.5px; color: var(--muted, #6c7897); }
        .cmk-hint b { color: var(--ink, #0f224d); cursor: pointer; text-decoration: underline; text-underline-offset: 2px; }
        .cmk-meta { font-size: 13px; color: var(--muted, #6c7897); margin-bottom: 14px; }
        .cmk-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
        .cmk-card { background: #fff; border: 1px solid var(--line, #e8edf7); border-radius: 16px; padding: 16px; display: flex; gap: 14px; align-items: flex-start; transition: box-shadow .15s; }
        .cmk-card:hover { box-shadow: 0 6px 24px rgba(16,40,93,.09); }
        .cmk-logo { width: 56px; height: 56px; border-radius: 10px; object-fit: contain; background: #f7f9fd; border: 1px solid var(--line, #e8edf7); flex-shrink: 0; }
        .cmk-logo-ph { width: 56px; height: 56px; border-radius: 10px; background: #f0f4ff; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .cmk-info { flex: 1; min-width: 0; }
        .cmk-name { font-size: 14px; font-weight: 800; color: var(--ink, #0f224d); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cmk-serial { font-size: 11px; color: var(--muted, #6c7897); margin-bottom: 6px; font-family: monospace; }
        .cmk-date { font-size: 11.5px; color: var(--muted, #6c7897); margin-top: 5px; }
        .cmk-more { margin-top: 20px; text-align: center; }
        .cmk-more-btn { padding: 11px 28px; border-radius: 10px; border: 1.5px solid var(--line, #e8edf7); background: #fff; color: var(--ink, #0f224d); font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: border-color .15s; }
        .cmk-more-btn:hover { border-color: var(--accent, #1e3a8a); }
        .cmk-empty { text-align: center; padding: 40px 20px; color: var(--muted, #6c7897); font-size: 15px; }
        .cmk-spin { display: inline-block; width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: cmk-rotate .7s linear infinite; vertical-align: middle; margin-right: 6px; }
        @keyframes cmk-rotate { to { transform: rotate(360deg); } }
        @media(max-width:600px){ .cmk-grid{grid-template-columns:1fr} .cmk-row{flex-direction:column} .cmk-btn{width:100%;height:48px} .cmk-input{height:48px} }
      `}</style>

      {/* Search box */}
      <div className="cmk-box">
        <form onSubmit={handleSubmit}>
          <div className="cmk-row">
            <input
              ref={inputRef}
              className="cmk-input"
              type="text"
              placeholder='Cari merek dagang… contoh: "Indomie", "Nike", "Tokopedia"'
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="cmk-btn" type="submit" disabled={loading || !query.trim()}>
              {loading ? <><span className="cmk-spin" />Mencari…</> : "🔍 Cek Merek"}
            </button>
          </div>
          <div className="cmk-hint">
            Coba: {["Indomie","Tokopedia","Aqua","Gojek"].map(s => (
              <b key={s} onClick={() => { setQuery(s); doSearch(s, 1); }}>{s}</b>
            )).reduce((acc: React.ReactNode[], el, i) => i === 0 ? [el] : [...acc, <span key={`sep${i}`}>, </span>, el], [])}
          </div>
        </form>
      </div>

      {/* Error */}
      {error && <p style={{ color: "#dc2626", fontSize: 14, marginBottom: 14 }}>{error}</p>}

      {/* Results */}
      {searched && !loading && (
        <>
          <p className="cmk-meta">
            {results.length === 0
              ? `Tidak ditemukan merek untuk "${query}"`
              : `Menampilkan ${results.length} dari ${total} merek untuk "${query}" — data dari database DJKI`}
          </p>

          {results.length === 0 ? (
            <div className="cmk-empty">
              ✅ Tidak ada merek terdaftar dengan nama ini.<br />
              <span style={{ fontSize: 13 }}>Nama tersedia — pertimbangkan segera mendaftarkan merek Anda.</span>
            </div>
          ) : (
            <>
              <div className="cmk-grid">
                {results.map((r, i) => (
                  <a key={`${r.serial_number}-${i}`} className="cmk-card" href={r.detail_url} target="_blank" rel="noopener" style={{ textDecoration: "none" }}>
                    <LogoImg src={r.image_url} alt={r.brand_name} />
                    <div className="cmk-info">
                      <div className="cmk-name" title={r.brand_name}>{r.brand_name}</div>
                      <div className="cmk-serial">{r.serial_number}</div>
                      <StatusBadge serial={r.serial_number} />
                      {r.filing_date && <div className="cmk-date">Didaftarkan: {r.filing_date}</div>}
                    </div>
                  </a>
                ))}
              </div>

              {results.length < total && results.length >= 20 && (
                <div className="cmk-more">
                  <button className="cmk-more-btn" onClick={() => doSearch(query, page + 1)} disabled={loading}>
                    {loading ? "Memuat…" : `Tampilkan lebih banyak (${total - results.length} lagi)`}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function LogoImg({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (err) return <div className="cmk-logo-ph">™</div>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="cmk-logo"
      src={src}
      alt={alt}
      onError={() => setErr(true)}
    />
  );
}
