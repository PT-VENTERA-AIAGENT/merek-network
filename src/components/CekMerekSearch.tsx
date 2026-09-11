"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

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

function LogoImg({ src, alt, size = 64 }: { src: string; alt: string; size?: number }) {
  const [err, setErr] = useState(false);
  const style = { width: size, height: size, borderRadius: 10, objectFit: "contain" as const, background: "#f7f9fd", border: "1px solid var(--line, #e8edf7)", display: "block", flexShrink: 0 };
  const phStyle = { ...style, display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4ff", fontSize: size * 0.34, color: "var(--muted, #6c7897)" };
  if (err) return <div style={phStyle}>™</div>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} style={style} onError={() => setErr(true)} />;
}

function formatDate(iso: string, fallback: string) {
  if (!iso) return fallback || "—";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const MODAL_STYLES = `
  .cmk-overlay{position:fixed;inset:0;background:rgba(15,34,77,.48);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)}
  .cmk-modal{background:#fff;border-radius:22px;padding:32px;max-width:580px;width:100%;position:relative;box-shadow:0 28px 72px rgba(15,34,77,.2);max-height:90vh;overflow-y:auto}
  .cmk-modal-close{position:absolute;top:14px;right:16px;background:none;border:none;font-size:28px;color:#6c7897;cursor:pointer;line-height:1;padding:0}
  .cmk-modal-close:hover{color:#0f224d}
  .cmk-mhdr{display:flex;gap:18px;align-items:flex-start;margin-bottom:24px}
  .cmk-mtitle{font-size:20px;font-weight:900;color:#0f224d;margin-bottom:4px;line-height:1.2}
  .cmk-mserial{font-size:12px;color:#6c7897;font-family:monospace;margin-bottom:8px}
  .cmk-mgrid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px}
  .cmk-mfull{grid-column:1/-1}
  .cmk-mfield{display:flex;flex-direction:column;gap:5px}
  .cmk-mlabel{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#6c7897}
  .cmk-mval{font-size:14px;color:#0f224d;font-weight:600;line-height:1.5}
  .cmk-mgoods{font-size:13.5px;font-weight:400;line-height:1.65;color:#0f224d}
  .cmk-mfooter{display:flex;align-items:center;justify-content:space-between;padding-top:16px;border-top:1px solid #e8edf7}
  .cmk-mextlink{font-size:12.5px;color:#6c7897;text-decoration:none;font-weight:600}
  .cmk-mextlink:hover{color:#0f224d;text-decoration:underline}
  .cmk-badge{border-radius:99px;padding:3px 11px;font-size:11px;font-weight:700;white-space:nowrap}
  .cmk-badge-active{background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0}
  .cmk-badge-expired{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}
  .cmk-badge-pending{background:#fffbeb;color:#d97706;border:1px solid #fde68a}
  .cmk-class-pill{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:9px;background:var(--accent,#1e3a8a);color:#fff;font-weight:800;font-size:14px}
  @media(max-width:600px){.cmk-modal{padding:22px 16px}.cmk-mgrid{grid-template-columns:1fr}}
`;

function DetailModal({ result, onClose }: { result: Result; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      <style>{MODAL_STYLES}</style>
      <div className="cmk-overlay" onClick={onClose}>
        <div className="cmk-modal" onClick={e => e.stopPropagation()}>
          <button className="cmk-modal-close" onClick={onClose} aria-label="Tutup">×</button>

          <div className="cmk-mhdr">
            <LogoImg src={result.image_url} alt={result.brand_name} size={80} />
            <div>
              <div className="cmk-mtitle">{result.brand_name}</div>
              <div className="cmk-mserial">{result.serial_number}</div>
              <StatusBadge status={result.status} />
            </div>
          </div>

          <div className="cmk-mgrid">
            <div className="cmk-mfield">
              <span className="cmk-mlabel">Kelas NICE</span>
              <span className="cmk-mval">
                {result.nice_class
                  ? <span className="cmk-class-pill">{result.nice_class}</span>
                  : "—"}
              </span>
            </div>
            <div className="cmk-mfield">
              <span className="cmk-mlabel">Tanggal Pendaftaran</span>
              <span className="cmk-mval">{formatDate(result.filing_date_iso, result.filing_date)}</span>
            </div>
            <div className="cmk-mfield cmk-mfull">
              <span className="cmk-mlabel">Barang / Jasa</span>
              <span className="cmk-mgoods">{result.goods_services || "—"}</span>
            </div>
          </div>

          <div className="cmk-mfooter">
            <span style={{ fontSize: 12, color: "#6c7897" }}>Sumber: DJKI via Jumbomark</span>
            <a className="cmk-mextlink" href={result.detail_url} target="_blank" rel="noopener">
              Lihat di DJKI ↗
            </a>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

export default function CekMerekSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Result | null>(null);

  async function doSearch(q: string, p = 1) {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}?q=${encodeURIComponent(q)}&page=${p}`);
      const data = await res.json();
      if (data.code === "RATE_LIMITED") throw new Error(data.error);
      if (!data.ok) throw new Error("Gagal mengambil data");
      if (p === 1) setResults(data.results ?? []);
      else setResults(prev => [...prev, ...(data.results ?? [])]);
      setTotal(data.total ?? 0);
      setPage(p);
      setSearched(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal terhubung ke database. Coba lagi.");
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
    <>
      <style>{`
        .cmk-box{background:var(--soft,#f0f4ff);border:1.5px solid var(--line,#e8edf7);border-radius:20px;padding:28px 24px;margin-bottom:24px}
        .cmk-row{display:flex;gap:10px}
        .cmk-input{flex:1;height:52px;padding:0 18px;font-size:15px;border:1.5px solid var(--line,#e8edf7);border-radius:12px;outline:none;font-family:inherit;color:var(--ink,#0f224d);background:#fff;transition:border-color .15s}
        .cmk-input:focus{border-color:var(--accent,#1e3a8a)}
        .cmk-btn{height:52px;padding:0 26px;border-radius:12px;background:var(--accent,#1e3a8a);color:#fff;font-size:15px;font-weight:700;border:none;cursor:pointer;font-family:inherit;transition:opacity .15s;white-space:nowrap}
        .cmk-btn:hover{opacity:.88}
        .cmk-btn:disabled{opacity:.5;cursor:default}
        .cmk-hint{margin-top:10px;font-size:12.5px;color:var(--muted,#6c7897)}
        .cmk-hint b{color:var(--ink,#0f224d);cursor:pointer;text-decoration:underline;text-underline-offset:2px}
        .cmk-meta{font-size:13px;color:var(--muted,#6c7897);margin-bottom:14px}
        /* Table: break out of sp-content (max-width 920px) and sp-workspace padding (48px) */
        .cmk-wrap{margin:0 -48px;width:calc(100% + 96px);overflow-x:auto;border-top:1px solid var(--line,#e8edf7);border-bottom:1px solid var(--line,#e8edf7);margin-bottom:20px}
        .cmk-table{width:100%;min-width:700px;border-collapse:collapse;font-size:13.5px}
        .cmk-table th{background:var(--soft,#f0f4ff);color:var(--muted,#6c7897);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:10px 16px;text-align:left;white-space:nowrap;border-bottom:1px solid var(--line,#e8edf7)}
        .cmk-table td{padding:14px 16px;border-bottom:1px solid var(--line,#e8edf7);vertical-align:middle;color:var(--ink,#0f224d)}
        .cmk-table tr:last-child td{border-bottom:none}
        .cmk-table tbody tr:hover td{background:#f7f9fd;cursor:pointer}
        .cmk-brand{font-weight:800;font-size:14px;color:var(--ink,#0f224d)}
        .cmk-serial{font-size:11px;color:var(--muted,#6c7897);font-family:monospace;margin-top:3px}
        .cmk-goods{max-width:320px;color:var(--muted,#6c7897);font-size:12.5px;line-height:1.55}
        .cmk-date{white-space:nowrap;font-size:12.5px}
        .cmk-detail-btn{padding:6px 14px;border-radius:8px;border:1.5px solid var(--line,#e8edf7);background:#fff;color:var(--accent,#1e3a8a);font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:border-color .15s,background .15s;white-space:nowrap}
        .cmk-detail-btn:hover{border-color:var(--accent,#1e3a8a);background:#f0f4ff}
        .cmk-more{margin-top:20px;text-align:center}
        .cmk-more-btn{padding:11px 28px;border-radius:10px;border:1.5px solid var(--line,#e8edf7);background:#fff;color:var(--ink,#0f224d);font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:border-color .15s}
        .cmk-more-btn:hover{border-color:var(--accent,#1e3a8a)}
        .cmk-empty{text-align:center;padding:40px 20px;color:var(--muted,#6c7897);font-size:15px}
        .cmk-spin{display:inline-block;width:18px;height:18px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:cmk-rotate .7s linear infinite;vertical-align:middle;margin-right:6px}
        @keyframes cmk-rotate{to{transform:rotate(360deg)}}
        @media(max-width:760px){
          .cmk-wrap{margin:0 -20px;width:calc(100% + 40px)}
          .cmk-row{flex-direction:column}
          .cmk-btn{width:100%;height:48px}
          .cmk-input{height:48px}
          .cmk-goods{max-width:180px}
        }
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
              <span key={s}>{i > 0 && ", "}<b onClick={() => { setQuery(s); doSearch(s, 1); }}>{s}</b></span>
            ))}
          </div>
        </form>
      </div>

      {error && <p style={{ color: "#dc2626", fontSize: 14, marginBottom: 14 }}>{error}</p>}

      {searched && !loading && (
        <div>
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
                      <tr key={`${r.serial_number}-${i}`} onClick={() => setSelected(r)}>
                        <td><LogoImg src={r.image_url} alt={r.brand_name} size={64} /></td>
                        <td>
                          <div className="cmk-brand">{r.brand_name}</div>
                          <div className="cmk-serial">{r.serial_number}</div>
                        </td>
                        <td>
                          {r.nice_class
                            ? <span className="cmk-class-pill">{r.nice_class}</span>
                            : <span style={{ color: "var(--muted,#6c7897)", fontSize: 12 }}>—</span>}
                        </td>
                        <td>
                          <div className="cmk-goods" title={r.goods_services}>
                            {r.goods_services
                              ? r.goods_services.length > 130 ? r.goods_services.slice(0, 127) + "…" : r.goods_services
                              : "—"}
                          </div>
                        </td>
                        <td><div className="cmk-date">{formatDate(r.filing_date_iso, r.filing_date)}</div></td>
                        <td><StatusBadge status={r.status} /></td>
                        <td>
                          <button
                            className="cmk-detail-btn"
                            onClick={e => { e.stopPropagation(); setSelected(r); }}
                          >
                            Detail →
                          </button>
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
        </div>
      )}

      {selected && <DetailModal result={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
