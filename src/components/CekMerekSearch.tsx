"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const SEARCH_API = "https://api.hakimerek.com/api/search";
const DETAIL_API = "https://api.hakimerek.com/api/detail";

interface Result {
  brand_name: string;
  serial_number: string;
  nice_class: string;
  goods_services: string;
  filing_date: string;
  filing_date_iso: string;
  status: string;
  image_url: string;
  brand_slug: string;
}

interface Detail {
  serial_number: string;
  brand_name: string;
  nice_class: string;
  goods_services: string;
  status: string;
  image_url: string;
  owner: string | null;
  representative: string | null;
  filing_date: string | null;
  registration_number: string | null;
  registration_date: string | null;
  expiration_date: string | null;
  remaining_protection_days: number | null;
  colours: string | null;
  publication_number: string | null;
  publication_date: string | null;
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
  const base = { width: size, height: size, borderRadius: 10, objectFit: "contain" as const, background: "#f7f9fd", border: "1px solid var(--line,#e8edf7)", display: "block" };
  if (err) return <div style={{ ...base, display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4ff", fontSize: size * 0.35, color: "var(--muted,#6c7897)" }}>™</div>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} style={base} onError={() => setErr(true)} />;
}

function formatDate(s: string | null | undefined) {
  if (!s) return "—";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function RemainingDays({ days }: { days: number | null }) {
  if (days === null) return <span>—</span>;
  if (days <= 0) return <span style={{ color: "#dc2626", fontWeight: 700 }}>Kadaluwarsa</span>;
  const years = Math.floor(days / 365);
  const rem = days % 365;
  const label = years > 0 ? `${years} thn ${Math.floor(rem / 30)} bln` : `${days} hari`;
  const color = days < 365 ? "#d97706" : "#16a34a";
  return <span style={{ color, fontWeight: 700 }}>{label}</span>;
}

function DetailModal({ serial, brandSlug, onClose }: { serial: string; brandSlug: string; onClose: () => void }) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${DETAIL_API}?id=${encodeURIComponent(serial)}&brand=${encodeURIComponent(brandSlug)}`);
        const data = await res.json();
        if (!cancelled) {
          if (data.ok && data.detail) setDetail(data.detail);
          else setError("Data tidak ditemukan.");
        }
      } catch {
        if (!cancelled) setError("Gagal terhubung. Coba lagi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [serial, brandSlug]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!mounted) return null;

  const modal = (
    <div className="cmk-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cmk-modal" role="dialog" aria-modal="true">
        <button className="cmk-modal-close" onClick={onClose} aria-label="Tutup">×</button>

        {loading && (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--muted,#6c7897)" }}>
            <span className="cmk-spin" style={{ borderTopColor: "#1e3a8a", borderColor: "rgba(30,58,138,.2)" }} />
            Memuat data…
          </div>
        )}

        {error && !loading && (
          <div style={{ padding: "32px 24px", textAlign: "center", color: "#dc2626" }}>{error}</div>
        )}

        {detail && !loading && (
          <>
            <div className="cmk-modal-header">
              <LogoImg src={detail.image_url} alt={detail.brand_name} size={80} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="cmk-modal-brand">{detail.brand_name || serial}</div>
                <div className="cmk-serial" style={{ marginBottom: 6 }}>{detail.serial_number}</div>
                <StatusBadge status={detail.status} />
              </div>
            </div>

            <div className="cmk-modal-grid">
              {detail.owner && (
                <div className="cmk-modal-field">
                  <div className="cmk-modal-label">Nama Pemilik</div>
                  <div className="cmk-modal-value">{detail.owner}</div>
                </div>
              )}
              {detail.representative && (
                <div className="cmk-modal-field">
                  <div className="cmk-modal-label">Kuasa Hukum</div>
                  <div className="cmk-modal-value">{detail.representative}</div>
                </div>
              )}
              {detail.registration_number && (
                <div className="cmk-modal-field">
                  <div className="cmk-modal-label">Nomor Pendaftaran</div>
                  <div className="cmk-modal-value" style={{ fontFamily: "monospace", fontWeight: 700 }}>{detail.registration_number}</div>
                </div>
              )}
              {detail.nice_class && (
                <div className="cmk-modal-field">
                  <div className="cmk-modal-label">Kelas NICE</div>
                  <div className="cmk-modal-value">
                    <span className="cmk-class-pill" style={{ width: "auto", padding: "0 14px", borderRadius: 8, fontSize: 13 }}>{detail.nice_class}</span>
                  </div>
                </div>
              )}
              {detail.colours && (
                <div className="cmk-modal-field">
                  <div className="cmk-modal-label">Warna</div>
                  <div className="cmk-modal-value">{detail.colours}</div>
                </div>
              )}
              <div className="cmk-modal-field">
                <div className="cmk-modal-label">Sisa Perlindungan</div>
                <div className="cmk-modal-value"><RemainingDays days={detail.remaining_protection_days} /></div>
              </div>
              <div className="cmk-modal-field">
                <div className="cmk-modal-label">Tgl Permohonan</div>
                <div className="cmk-modal-value">{formatDate(detail.filing_date)}</div>
              </div>
              {detail.registration_date && (
                <div className="cmk-modal-field">
                  <div className="cmk-modal-label">Tgl Pendaftaran</div>
                  <div className="cmk-modal-value">{formatDate(detail.registration_date)}</div>
                </div>
              )}
              {detail.expiration_date && (
                <div className="cmk-modal-field">
                  <div className="cmk-modal-label">Tgl Berakhir</div>
                  <div className="cmk-modal-value">{formatDate(detail.expiration_date)}</div>
                </div>
              )}
            </div>

            {detail.goods_services && (
              <div style={{ marginTop: 16, padding: "14px 16px", background: "var(--soft,#f0f4ff)", borderRadius: 10 }}>
                <div className="cmk-modal-label" style={{ marginBottom: 6 }}>Barang / Jasa</div>
                <div style={{ fontSize: 13, color: "#3a4666", lineHeight: 1.65 }}>{detail.goods_services}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

export default function CekMerekSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [activeDetail, setActiveDetail] = useState<{ serial: string; brandSlug: string } | null>(null);

  async function doSearch(q: string, p = 1) {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${SEARCH_API}?q=${encodeURIComponent(q)}&page=${p}`);
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
        .cmk-wrap{width:100%;overflow-x:auto;border-top:1px solid var(--line,#e8edf7);border-bottom:1px solid var(--line,#e8edf7);margin-bottom:20px}
        .cmk-table{width:100%;min-width:680px;border-collapse:collapse;font-size:13.5px}
        .cmk-table th{background:var(--soft,#f0f4ff);color:var(--muted,#6c7897);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:10px 16px;text-align:left;white-space:nowrap;border-bottom:1px solid var(--line,#e8edf7)}
        .cmk-table td{padding:14px 16px;border-bottom:1px solid var(--line,#e8edf7);vertical-align:middle;color:var(--ink,#0f224d)}
        .cmk-table tr:last-child td{border-bottom:none}
        .cmk-table tbody tr:hover td{background:#f7f9fd}
        .cmk-badge{border-radius:99px;padding:3px 11px;font-size:11px;font-weight:700;white-space:nowrap}
        .cmk-badge-active{background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0}
        .cmk-badge-expired{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}
        .cmk-badge-pending{background:#fffbeb;color:#d97706;border:1px solid #fde68a}
        .cmk-brand{font-weight:800;font-size:14px;color:var(--ink,#0f224d)}
        .cmk-serial{font-size:11px;color:var(--muted,#6c7897);font-family:monospace;margin-top:3px}
        .cmk-class-pill{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:9px;background:var(--accent,#1e3a8a);color:#fff;font-weight:800;font-size:14px}
        .cmk-goods{max-width:340px;color:var(--muted,#6c7897);font-size:12.5px;line-height:1.55}
        .cmk-date{white-space:nowrap;font-size:12.5px}
        .cmk-detail-btn{padding:5px 12px;border-radius:8px;border:1.5px solid var(--line,#e8edf7);background:#fff;color:var(--ink,#0f224d);font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;transition:border-color .15s}
        .cmk-detail-btn:hover{border-color:var(--accent,#1e3a8a);color:var(--accent,#1e3a8a)}
        .cmk-more{margin-top:20px;text-align:center}
        .cmk-more-btn{padding:11px 28px;border-radius:10px;border:1.5px solid var(--line,#e8edf7);background:#fff;color:var(--ink,#0f224d);font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:border-color .15s}
        .cmk-more-btn:hover{border-color:var(--accent,#1e3a8a)}
        .cmk-empty{text-align:center;padding:40px 20px;color:var(--muted,#6c7897);font-size:15px}
        .cmk-spin{display:inline-block;width:18px;height:18px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:cmk-rotate .7s linear infinite;vertical-align:middle;margin-right:6px}
        @keyframes cmk-rotate{to{transform:rotate(360deg)}}
        .cmk-disclaimer{font-size:12px;color:var(--muted,#6c7897);line-height:1.65;margin-top:16px;padding:12px 16px;background:var(--soft,#f0f4ff);border-radius:10px;border:1px solid var(--line,#e8edf7)}
        .cmk-overlay{position:fixed;inset:0;background:rgba(15,34,77,.45);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)}
        .cmk-modal{background:#fff;border-radius:20px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;padding:28px;position:relative;box-shadow:0 32px 64px rgba(15,34,77,.22)}
        .cmk-modal-close{position:absolute;top:16px;right:18px;width:32px;height:32px;border-radius:50%;border:1.5px solid var(--line,#e8edf7);background:#fff;font-size:20px;line-height:1;cursor:pointer;color:var(--muted,#6c7897);display:flex;align-items:center;justify-content:center}
        .cmk-modal-close:hover{background:#f7f9fd}
        .cmk-modal-header{display:flex;gap:16px;align-items:flex-start;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--line,#e8edf7)}
        .cmk-modal-brand{font-size:20px;font-weight:800;color:var(--ink,#0f224d);letter-spacing:-.01em;margin-bottom:4px}
        .cmk-modal-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .cmk-modal-field{background:var(--soft,#f0f4ff);border-radius:10px;padding:10px 12px}
        .cmk-modal-label{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted,#6c7897);margin-bottom:4px}
        .cmk-modal-value{font-size:13.5px;font-weight:600;color:var(--ink,#0f224d)}
        @media(max-width:760px){
          .cmk-row{flex-direction:column}
          .cmk-btn{width:100%;height:48px}
          .cmk-input{height:48px}
          .cmk-goods{max-width:180px}
          .cmk-modal-grid{grid-template-columns:1fr}
          .cmk-modal{padding:20px}
        }
      `}</style>

      <div className="cmk-box">
        <form onSubmit={e => { e.preventDefault(); doSearch(query, 1); }}>
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
              : `Menampilkan ${results.length} dari ${total.toLocaleString("id-ID")} merek untuk "${query}" — data DJKI`}
          </p>

          {results.length === 0 ? (
            <div className="cmk-empty">
              Tidak ada merek terdaftar dengan nama ini.<br />
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
                        <td><LogoImg src={r.image_url} alt={r.brand_name} /></td>
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
                          <div className="cmk-goods">
                            {r.goods_services
                              ? r.goods_services.length > 130 ? r.goods_services.slice(0, 127) + "…" : r.goods_services
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
                          <button
                            className="cmk-detail-btn"
                            onClick={() => setActiveDetail({ serial: r.serial_number, brandSlug: r.brand_slug })}
                          >
                            Detail
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

              <p className="cmk-disclaimer">
                <strong>Disclaimer:</strong> Data bersumber dari database publik DJKI. Layanan ini tidak menjamin keakuratan maupun kelengkapan informasi yang tersedia. Pembaruan, koreksi, atau perubahan terkini mungkin belum tercakup. Hasil pencarian ini tidak dapat dijadikan dasar nasihat hukum secara langsung. Untuk kepastian hukum, konsultasikan dengan Konsultan KI Indonesia yang bersertifikat.
              </p>
            </>
          )}
        </div>
      )}

      {activeDetail && (
        <DetailModal
          serial={activeDetail.serial}
          brandSlug={activeDetail.brandSlug}
          onClose={() => setActiveDetail(null)}
        />
      )}
    </>
  );
}
