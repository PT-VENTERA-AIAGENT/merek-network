/**
 * Floating WhatsApp bubble di kanan-bawah — muncul di semua LP.
 * Pretext WA include nama domain asal supaya admin Hakio tahu
 * sumber lead-nya tanpa perlu tanya. Contoh:
 *   "Halo Hakio! Saya dari cekhaki.com — mau konsultasi merek dagang."
 */
"use client";

interface Props {
  domain: string;    // "cekhaki.com", "hakimerek.com", etc.
  whatsappNumber: string;  // "6285148416800"
  accent: string;
  label?: string;
}

export default function FloatingWA({ domain, whatsappNumber, accent, label = "Chat Admin" }: Props) {
  const text = `Halo ${domain}, saya mau konsultasi pendaftaran merek saya "..."`;
  const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  return (
    <>
      <style>{`
        .fwa {
          position:fixed; bottom:24px; right:24px; z-index:60;
          display:flex; align-items:center; gap:0;
          background:linear-gradient(135deg, #25D366, #128C7E);
          color:#fff; padding:14px 18px 14px 14px;
          border-radius:999px;
          box-shadow:0 12px 32px rgba(37,211,102,.45), 0 4px 12px rgba(0,0,0,.15);
          text-decoration:none; font-weight:800; font-size:14px;
          transition:transform .18s, box-shadow .18s;
          animation:fwaPulse 2.4s ease-in-out infinite;
        }
        .fwa:hover {
          transform:translateY(-2px) scale(1.03);
          box-shadow:0 16px 40px rgba(37,211,102,.55);
        }
        @keyframes fwaPulse {
          0%, 100% { box-shadow: 0 12px 32px rgba(37,211,102,.45), 0 4px 12px rgba(0,0,0,.15), 0 0 0 0 rgba(37,211,102,.6); }
          50% { box-shadow: 0 12px 32px rgba(37,211,102,.45), 0 4px 12px rgba(0,0,0,.15), 0 0 0 14px rgba(37,211,102,0); }
        }
        .fwa-icon {
          width:36px; height:36px; border-radius:50%;
          background:#fff; color:#25D366;
          display:grid; place-items:center; margin-right:8px;
          font-size:18px;
        }
        .fwa-label { padding-right:6px; }
        .fwa-note { font-size:11px; opacity:.85; font-weight:600; display:block; }
        @media (max-width:640px) {
          .fwa { padding:12px; }
          .fwa-label, .fwa-note { display:none; }
          .fwa-icon { margin-right:0; width:32px; height:32px; }
        }
      `}</style>
      <a
        className="fwa"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat ${domain} via WhatsApp`}
        style={{ borderColor: accent }}
      >
        <span className="fwa-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 2C6.478 2 2 6.478 2 12c0 1.99.582 3.844 1.586 5.404L2 22l4.777-1.564A9.947 9.947 0 0012 22c5.522 0 10-4.478 10-10S17.522 2 12 2z"/>
          </svg>
        </span>
        <span className="fwa-label">
          {label}
          <span className="fwa-note">Balas cepat WIB</span>
        </span>
      </a>
    </>
  );
}
