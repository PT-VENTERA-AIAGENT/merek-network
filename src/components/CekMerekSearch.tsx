"use client";

import { useState } from "react";

const API = "https://api.hakimerek.com/api/search";

interface Result {
  brand_name: string;
  serial_number: string;
  nice_class: string;
  goods_services: string;
  filing_date: string;
  filing_date_iso: string;
  status: string;
  image_url: string;
  detail_url: string;
}

function StatusBadge({ status }: { status: string }) {
  const isExpired = /expired/i.test(status);
  const isPending = /pending|published|announced/i.test(status);
  if (isExpired) return <span className="cmk-badge cmk-badge-expired">Kadaluwarsa</span>;
  if (isPending) return <span className="cmk-badge cmk-badge-pending">Diajukan</span>;
  return <span className="cmk-badge cmk-badge-active">Terdaftar</span>;
}

function LogoCell({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (err) return <div className="cmk-logo-ph">™</div>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="cmk-logo" src={src} alt={alt} onError={() => setErr(true)} />;
}

export default function CekMerekSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

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

  const QUICK = ["Indomie", "Tokopedia", "Aqua", "Gojek"];

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
        /* Table */
        .cmk-wrap { width: 100%; overflow-x: auto; border-radius: 16px; border: 1px solid var(--line, #e8edf7); }
        .cmk-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .cmk-table th { background: var(--soft, #f0f4ff); color: var(--muted, #6c7897); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; padding: 10px 14px; text-align: left; white-space: nowrap; border-bottom: 1px solid var(--line, #e8edf7); }
        .cmk-table td { padding: 12px 14px; border-bottom: 1px solid var(--line, #e8edf7); vertical-align: middle; color: var(--ink, #0f224d); }
        .cmk-table tr:last-child td { border-bottom: none; }
        .cmk-table tr:hover td { background: #f7f9fd; }
        .cmk-logo { width: 44px; height: 44px; border-radius: 8px; object-fit: contain; background: #f7f9fd; border: 1px solid var(--line, #e8edf7); display: block; }
        .cmk-logo-ph { width: 44px; height: 44px; border-radius: 8px; background: #f0f4ff; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .cmk-brand { font-weight: 800; font-size: 14px; color: var(--ink, #0f224d); }
        .cmk-serial { font-size: 11px; color: var(--muted, #6c7897); font-family: monospace; margin-top: 2px; }
        .cmk-class-pill { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; background: var(--accent, #1e3a8a); color: #fff; font-weight: 800; font-size: 13px; }
        .cmk-goods { max-width: 280px; color: var(--muted, #6c7897); font-size: 12px; line-height: 1.5; }
        .cmk-date { white-space: nowrap; font-size: 12px; }
        /* Badge */
        .cmk-badge { border-radius: 99px; padding: 3px 10px; font-size: 11px; font-weight: 700; white-space: nowrap; }
        .cmk-badge-active { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .cmk-badge-expired { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .cmk-badge-pending { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
        /* Detail link */
        .cmk-link { color: var(--accent, #1e3a8a); text-decoration: none; font-size: 12px; font-weight: 600; }
        .cmk-link:hover { text-decoration: underline; }
        /* More */
        .cmk-more { margin-top: 20px; text-align: center; }
        .cmk-more-btn { padding: 11px 28px; border-radius: 10px; border: 1.5px solid var(--line, #e8edf7); background: #fff; color: var(--ink, #0f224d); font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: border-color .15s; }
        .cmk-more-btn:hover { border-color: var(--accent, #1e3a8a); }
        .cmk-empty { text-align: center; padding: 40px 20px; color: var(--muted, #6c7897); font-size: 15px; }
        .cmk-spin { display: inline-block; width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: cmk-rotate .7s linear infinite; vertical-align: middle; margin-right: 6px; }
        @keyframes cmk-rotate { to { transform: rotate(360deg); } }
        @media(max-width:600px){ .cmk-row{flex-direction:column} .cmk-btn{width:100%;height:48px} .cmk-input{height:48px} .cmk-goods{max-width:180px} }
      `}</style>

      {/* Search box */}
      <div className="cmk-box">
        <form onSubmit={handleSubmit}>
          <div className="cmk-row">
            <input
              className="cmk-input"
              type="text"
              placeholder='Cari merek dagang… contoh: "Indomie", "Nike", "Tokopedia"'
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="cmk-btn" type="submit" disabled={loading || !query.trim()}>
              {loading ? <><span className="cmk-spin" />Mencari…</> : "Cek Merek"}
            </button>
          </div>
          <div className="cmk-hint">
            Coba:{" "}
            {QUICK.map((s, i) => (
              <span key={s}>
                {i > 0 && ", "}
                <b onClick={() => { setQuery(s); doSearch(s, 1); }}>{s}</b>
              </span>
            ))}
          </div>
        </form>
      </div>

      {error && <p style={{ color: "#dc2626", fontSize: 14, marginBottom: 14 }}>{error}</p>}

      {searched && !loading && (
        <>
          <p className="cmk-meta">
            {results.length === 0
              ? `Tidak ditemukan merek untuk "${query}"`
              : `Menampilkan ${results.length} dari ${total.toLocaleString("id-ID")} merek untuk "${query}" — data DJKI via Jumbomark`}
          </p>

          {results.length === 0 ? (
            <div className="cmk-empty">
              ✅ Tidak ada merek terdaftar dengan nama ini.<br />
              <span style={{ fontSize: 13 }}>Nama tersedia — pertimbangkan segera mendaftarkan merek Anda.</span>
            </div>
          ) : (
            <>
              <div className="cmk-wrap">
                <table className="cmk-table">
                  <thead>
                    <tr>
                      <th>Logo</th>
                      <th>Nama Merek</th>
                      <th>Kelas</th>
                      <th>Barang / Jasa</th>
                      <th>Tgl Daftar</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={`${r.serial_number}-${i}`}>
                        <td><LogoCell src={r.image_url} alt={r.brand_name} /></td>
                        <td>
                          <div className="cmk-brand">{r.brand_name}</div>
                          <div className="cmk-serial">{r.serial_number}</div>
                        </td>
                        <td>
                          {r.nice_class
                            ? <span className="cmk-class-pill">{r.nice_class}</span>
                            : <span style={{ color: "var(--muted, #6c7897)", fontSize: 12 }}>—</span>}
                        </td>
                        <td>
                          <div className="cmk-goods" title={r.goods_services}>
                            {r.goods_services
                              ? r.goods_services.length > 120
                                ? r.goods_services.slice(0, 117) + "…"
                                : r.goods_services
                              : "—"}
                          </div>
                        </td>
                        <td>
                          <div className="cmk-date">
                            {r.filing_date_iso
                              ? new Date(r.filing_date_iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                              : r.filing_date || "—"}
                          </div>
                        </td>
                        <td><StatusBadge status={r.status} /></td>
                        <td>
                          <a className="cmk-link" href={r.detail_url} target="_blank" rel="noopener">Detail →</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {results.length < total && results.length >= 20 && (
                <div className="cmk-more">
                  <button className="cmk-more-btn" onClick={() => doSearch(query, page + 1)} disabled={loading}>
                    {loading ? "Memuat…" : `Tampilkan lebih banyak (${(total - results.length).toLocaleString("id-ID")} lagi)`}
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
