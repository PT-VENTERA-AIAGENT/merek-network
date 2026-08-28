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
  "Halo! Saya Asisten Merek AI Hakio 👋\n\nSaya bantu proses pendaftaran merek dagang ke DJKI — mulai dari cek nama, rekomendasi kelas NICE, sampai estimasi biaya.\n\nBoleh tahu nama merek yang ingin Anda daftarkan?";

// ── Brand-specific landing content ──────────────────────────────────────────

interface LandingContent {
  heroTitle: string;
  heroSubtitle: string;
  faq: { q: string; a: string }[];
}

const LANDING: Record<BrandId, LandingContent> = {
  hakimerek: {
    heroTitle: "Lindungi Merekmu Sebelum Orang Lain Mendaftarnya",
    heroSubtitle:
      "Ribuan merek dicuri tiap tahun karena pemilik aslinya terlambat mendaftar. Jangan jadi korban berikutnya.",
    faq: [
      {
        q: "Apa itu merek dagang dan kenapa harus didaftarkan?",
        a: "Merek dagang adalah identitas bisnis Anda—nama, logo, atau slogan yang membedakan produk/jasa Anda dari kompetitor. Mendaftarkan merek memberikan perlindungan hukum sehingga tidak bisa digunakan atau diklaim pihak lain.",
      },
      {
        q: "Apa yang terjadi jika merek saya tidak didaftarkan?",
        a: "Tanpa pendaftaran, Anda tidak memiliki dasar hukum untuk melarang pihak lain menggunakan merek serupa. Bahkan, orang lain bisa mendaftarkan merek Anda terlebih dahulu dan melarang Anda menggunakannya sendiri.",
      },
      {
        q: "Berapa lama perlindungan merek berlaku?",
        a: "Merek yang terdaftar di DJKI mendapat perlindungan selama 10 tahun dan dapat diperpanjang setiap 10 tahun tanpa batas, selama merek masih digunakan.",
      },
      {
        q: "Apa itu kelas NICE dan berapa kelas yang saya butuhkan?",
        a: "Kelas NICE adalah sistem klasifikasi internasional 45 kelas untuk produk dan jasa. Anda mendaftarkan merek per kelas sesuai jenis bisnis. Satu bisnis kuliner misalnya cukup satu kelas (kelas 43), tapi jika Anda juga menjual produk kemasan, butuh kelas tambahan.",
      },
      {
        q: "Berapa biaya daftar merek?",
        a: "UMKM/Perorangan: Rp 1.299.000 per kelas. Perusahaan/PT: Rp 2.490.000 per kelas. Harga sudah termasuk biaya resmi DJKI dan jasa pendaftaran lengkap hingga sertifikat.",
      },
      {
        q: "Berapa lama proses dari pendaftaran hingga sertifikat?",
        a: "Proses resmi DJKI memakan waktu 12–18 bulan. Namun sejak pendaftaran diterima, merek Anda sudah mendapat tanggal prioritas (filing date) yang melindungi posisi Anda dari klaim pihak lain.",
      },
    ],
  },
  cekhaki: {
    heroTitle: "Cek Nama Merekmu Gratis — Sebelum Rugi Besar",
    heroSubtitle:
      "Pastikan nama brand-mu belum didaftarkan orang lain. Cek database DJKI secara instan.",
    faq: [
      {
        q: "Apa itu PDKI dan bagaimana cara menggunakannya?",
        a: "PDKI (Pangkalan Data Kekayaan Intelektual) adalah database resmi DJKI yang memuat semua merek terdaftar dan dalam proses pendaftaran di Indonesia. Anda bisa cek ketersediaan nama merek sebelum mendaftar.",
      },
      {
        q: "Bagaimana cara cek nama merek saya aman atau tidak?",
        a: "Ketik nama merek Anda di kolom chat, AI kami akan langsung memberikan analisis berdasarkan kemiripan fonetik, visual, dan konseptual dengan merek yang ada di database DJKI.",
      },
      {
        q: "Apakah nama merek yang mirip tetap bisa didaftarkan?",
        a: "Tidak selalu. Kemiripan dinilai dari apakah dapat menimbulkan kebingungan konsumen. Merek yang identik atau sangat mirip dalam kelas yang sama biasanya ditolak, tapi AI kami bisa membantu menilai tingkat risikonya.",
      },
      {
        q: "Apa bedanya merek terdaftar dan merek dalam pendaftaran?",
        a: "Merek terdaftar artinya sudah mendapat sertifikat resmi. Merek dalam pendaftaran sudah punya tanggal prioritas (filing date) dan masih dalam proses review DJKI. Keduanya bisa jadi hambatan bagi pendaftar baru.",
      },
      {
        q: "Apakah saya harus cek PDKI sebelum mendaftar merek?",
        a: "Sangat disarankan. Jika ada merek serupa yang sudah terdaftar, permohonan Anda berisiko ditolak dan biaya pendaftaran tidak dikembalikan. Cek terlebih dahulu menghemat waktu dan uang.",
      },
      {
        q: "Berapa lama hasil cek tersedia?",
        a: "Hasil analisis AI tersedia dalam hitungan detik. Untuk verifikasi mendalam ke database DJKI, AI kami membutuhkan 1–2 menit untuk memberikan laporan komprehensif.",
      },
    ],
  },
  merekin: {
    heroTitle: "Daftarkan Merekmu Sekarang — Proses 100% Online",
    heroSubtitle:
      "Dari konsultasi hingga sertifikat resmi DJKI, semua bisa dikerjakan dari smartphone-mu.",
    faq: [
      {
        q: "Dokumen apa saja yang dibutuhkan untuk daftar merek?",
        a: "Untuk UMKM/perorangan: KTP, nama dan logo merek, deskripsi barang/jasa. Untuk PT/CV: KTP direktur, akta pendirian, NPWP perusahaan, logo merek dalam format JPG/PNG resolusi tinggi.",
      },
      {
        q: "Apakah prosesnya bisa dilakukan sepenuhnya online?",
        a: "Ya, 100% online. Dari pengisian formulir, upload dokumen, pembayaran, hingga pengiriman ke DJKI semua dilakukan digital. Sertifikat pun diterbitkan secara elektronik oleh DJKI.",
      },
      {
        q: "Berapa lama proses pendaftaran merek secara online?",
        a: "Pengajuan awal bisa selesai dalam 1–2 hari kerja setelah dokumen lengkap. Proses review DJKI sendiri memakan 12–18 bulan, namun sejak pengajuan Anda sudah mendapat perlindungan sementara.",
      },
      {
        q: "Bagaimana jika logo merek saya belum ada atau masih dalam desain?",
        a: "Anda bisa mendaftarkan merek kata (wordmark) saja tanpa logo terlebih dahulu. Logo bisa didaftarkan terpisah atau bersama nama merek setelah desain final.",
      },
      {
        q: "Apakah saya perlu hadir secara fisik ke kantor DJKI?",
        a: "Tidak perlu. Semua proses dilakukan secara online melalui platform Merekin. Tim kami yang akan mengurus pengajuan ke sistem e-Filing DJKI atas nama Anda.",
      },
      {
        q: "Apa yang terjadi setelah saya submit dokumen?",
        a: "Tim kami memeriksa kelengkapan dokumen (1 hari kerja), lalu mengajukan ke DJKI. Anda mendapat nomor permohonan resmi sebagai bukti pendaftaran dan filing date yang sah.",
      },
    ],
  },
  hkimerek: {
    heroTitle: "Platform HKI Merek Pertama Berbasis AI di Indonesia",
    heroSubtitle:
      "Analisis otomatis nama merek, rekomendasi kelas NICE yang tepat, dan pendampingan hingga sertifikat terbit.",
    faq: [
      {
        q: "Apa perbedaan HKI Merek dengan Hak Cipta?",
        a: "HKI Merek melindungi nama, logo, atau slogan yang digunakan dalam perdagangan. Hak Cipta melindungi karya kreatif seperti tulisan, musik, dan seni. Keduanya berbeda dan memerlukan pendaftaran terpisah.",
      },
      {
        q: "Bagaimana AI menganalisis nama merek saya?",
        a: "AI kami menganalisis nama merek dari aspek kemiripan fonetik (bunyi), visual (tampilan), dan konseptual (makna) terhadap database merek yang ada. Hasilnya berupa skor risiko dan rekomendasi strategi pendaftaran.",
      },
      {
        q: "Apa keunggulan daftar HKI merek lewat HKIMerek vs langsung ke DJKI?",
        a: "Langsung ke DJKI tanpa bantuan sering mengakibatkan kesalahan kelas, nama yang bermasalah, atau dokumen kurang lengkap. HKIMerek memastikan permohonan Anda optimal sebelum masuk ke sistem DJKI, mengurangi risiko penolakan.",
      },
      {
        q: "Apakah AI bisa merekomendasikan kelas NICE yang tepat?",
        a: "Ya. Ceritakan produk atau jasa bisnis Anda, AI kami akan merekomendasikan kelas NICE yang paling sesuai dan menjelaskan alasannya. Ini mencegah pendaftaran di kelas yang salah.",
      },
      {
        q: "Apakah pendaftaran HKI merek berlaku untuk seluruh Indonesia?",
        a: "Ya. Merek yang terdaftar di DJKI mendapat perlindungan di seluruh wilayah Indonesia. Untuk perlindungan internasional, tersedia jalur Madrid Protocol yang kami bantu juga.",
      },
      {
        q: "Bagaimana status pendaftaran saya bisa dipantau?",
        a: "Setelah pendaftaran, Anda mendapat akses dashboard untuk memantau status permohonan di DJKI secara real-time. Tim kami juga mengirim notifikasi di setiap tahap penting proses.",
      },
    ],
  },
  daftarmerekmu: {
    heroTitle: "Cara Paling Mudah Daftar Merek Dagang — Dipandu Langkah demi Langkah",
    heroSubtitle:
      "Tidak perlu paham hukum. Konsultan AI kami akan pandu kamu dari awal hingga sertifikat jadi.",
    faq: [
      {
        q: "Saya tidak paham hukum, apakah bisa tetap daftar merek sendiri?",
        a: "Bisa. DaftarMerekmu dirancang untuk pemula. AI konsultan kami akan memandu Anda langkah demi langkah dari nol, menjelaskan setiap istilah, dan memastikan semua dokumen benar sebelum diajukan.",
      },
      {
        q: "Dokumen apa yang perlu saya siapkan sebagai UMKM?",
        a: "Untuk UMKM atau perorangan: cukup KTP, nama/logo merek yang ingin didaftarkan, dan deskripsi singkat produk atau jasa Anda. Tidak perlu akta notaris atau dokumen perusahaan.",
      },
      {
        q: "Berapa biaya daftar merek untuk UMKM?",
        a: "Rp 1.299.000 per kelas untuk UMKM dan perorangan. Harga ini sudah termasuk biaya resmi DJKI, jasa pendampingan, dan layanan hingga sertifikat terbit. Tidak ada biaya tersembunyi.",
      },
      {
        q: "Apakah UMKM benar-benar perlu daftar merek?",
        a: "Sangat perlu. Merek adalah aset bisnis Anda. Tanpa pendaftaran, kompetitor bisa mendaftarkan nama brand Anda lebih dulu dan melarang Anda menggunakannya. Ini sering terjadi pada UMKM yang sedang berkembang.",
      },
      {
        q: "Apa bedanya daftar merek sebagai perorangan vs PT?",
        a: "Perorangan menggunakan KTP, biaya lebih murah (Rp 1.299.000), cocok untuk UMKM. PT menggunakan akta perusahaan, biaya Rp 2.490.000, merek atas nama badan hukum yang lebih kuat untuk skala usaha besar.",
      },
      {
        q: "Setelah daftar, kapan saya bisa pakai simbol ® pada merek saya?",
        a: "Simbol ® hanya boleh digunakan setelah merek resmi terdaftar dan sertifikat terbit (sekitar 12–18 bulan). Selama proses, Anda bisa menggunakan simbol ™ sebagai tanda bahwa merek sedang dalam pendaftaran.",
      },
    ],
  },
};

// ── SVG Icons ────────────────────────────────────────────────────────────────

const WaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// ── Main component ───────────────────────────────────────────────────────────

export default function ChatPage({ brand }: { brand: Brand }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: INITIAL_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWA, setShowWA] = useState(false);
  const [waClicked, setWaClicked] = useState(false);
  const [leadData, setLeadData] = useState<{ nama?: string; kelas?: string; entitas?: string; user?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const msgsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatSectionRef = useRef<HTMLDivElement>(null);

  const otherBrands = Object.values(BRANDS).filter((b) => b.id !== brand.id);
  const landing = LANDING[brand.id];

  const waText = leadData?.nama
    ? `Halo ${brand.name}!${leadData.user ? ` Nama saya ${leadData.user}.` : ""} Saya sudah konsultasi via AI dan ingin melanjutkan pendaftaran merek:\n- Nama Merek: ${leadData.nama}\n- Kelas NICE: ${leadData.kelas}\n- Jenis Entitas: ${leadData.entitas}\n\nBisa bantu proses selanjutnya?`
    : `Halo, saya ingin konsultasi pendaftaran merek dagang via ${brand.name}.`;
  const waLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(waText)}`;

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      const userText = text.trim();
      if (!userText || loading) return;

      if (!chatOpen) {
        setChatOpen(true);
        setTimeout(() => inputRef.current?.focus(), 300);
      }

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
          body: JSON.stringify({ messages: newMessages.slice(-20), brand: brand.id }),
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
    [messages, loading, chatOpen]
  );

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const scrollToChat = () => {
    setChatOpen(true);
    setTimeout(() => {
      chatSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => inputRef.current?.focus(), 400);
    }, 100);
  };

  const handleWaClick = () => {
    setWaClicked(true);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Terima kasih${leadData?.user ? `, ${leadData.user}` : ""}! Admin kami akan segera membalas via WhatsApp. Sambil menunggu, pastikan WhatsApp Anda aktif. Selamat berbisnis! 🎉`,
      },
    ]);
  };

  const accentStyle = {
    "--accent": brand.accent,
    "--accent-light": brand.accentLight,
    "--accent-rgb": brand.accentRgb,
  } as React.CSSProperties;

  return (
    <>
      <JsonLd brand={brand} />
      <style>{`
        :root { --accent: ${brand.accent}; --accent-light: ${brand.accentLight}; --accent-rgb: ${brand.accentRgb}; }
        .accent-bg { background-color: var(--accent); }
        .accent-bg-light { background-color: var(--accent-light); }
        .accent-text { color: var(--accent-light); }
        .accent-border { border-color: var(--accent); }
        .accent-ring:focus { outline: none; box-shadow: 0 0 0 2px rgba(var(--accent-rgb),.4); }
        .accent-chip-hover:hover { background: rgba(var(--accent-rgb),.12); color: var(--accent-light); border-color: rgba(var(--accent-rgb),.3); }
        .accent-gradient { background: linear-gradient(135deg, var(--accent), var(--accent-light)); }
        .accent-glow { box-shadow: 0 0 40px rgba(var(--accent-rgb),.18); }
        .wa-btn-hover:hover { opacity: 0.88; }
        .section-card { background: #111; border: 1px solid rgba(255,255,255,0.06); }
        .pricing-card-featured { border-color: var(--accent) !important; }
        .pricing-featured-badge { background: var(--accent); }
        .step-num { background: rgba(var(--accent-rgb),.15); color: var(--accent-light); }
        .faq-btn:hover { background: rgba(255,255,255,0.03); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeup { animation: fadeUp 0.35s ease forwards; }
        @keyframes dot { 0%,80%,100%{transform:scale(.6);opacity:.4;} 40%{transform:scale(1);opacity:1;} }
        .typing-dot { animation: dot 1.2s ease infinite; }
        .typing-dot:nth-child(2){animation-delay:.2s;}
        .typing-dot:nth-child(3){animation-delay:.4s;}
        @media(max-width:640px){
          .hero-title{font-size:clamp(1.8rem,7vw,2.4rem)!important;}
          .stats-bar{flex-wrap:wrap;gap:.75rem!important;}
          .stats-sep{display:none!important;}
        }
      `}</style>

      <div className="min-h-screen bg-[#0a0a0a] text-[#ececec]" style={accentStyle}>

        {/* ── NAV ────────────────────────────────────────────────── */}
        <nav className="fixed top-0 inset-x-0 z-50 h-13 flex items-center justify-between px-5 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/8">
          <a href="/" className="text-[1.05rem] font-bold tracking-tight text-[#ececec] no-underline">
            <b className="accent-text">{brand.name.slice(0, 4)}</b>
            {brand.name.slice(4)}
          </a>
          <div className="flex items-center gap-0.5">
            <a href="/harga" className="text-[.8rem] text-[#a0a0a0] no-underline px-3 py-1.5 rounded-lg transition-colors hover:bg-[#1e1e1e] hover:text-[#ececec]">
              Harga
            </a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-[.8rem] text-[#a0a0a0] no-underline px-3.5 py-1.5 rounded-lg transition-colors hover:bg-[#1e1e1e] hover:text-[#ececec]">
              Konsultasi
            </a>
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-[.8rem] text-[#a0a0a0] px-3.5 py-1.5 rounded-lg transition-colors hover:bg-[#1e1e1e] hover:text-[#ececec] bg-transparent border-none cursor-pointer font-[inherit]">
                Situs Lain ▾
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-[#1e1e1e] border border-white/8 rounded-xl py-1 min-w-[180px] shadow-2xl z-50">
                  {otherBrands.map((b) => (
                    <a key={b.id} href={`https://${b.id}.com`} target="_blank" rel="noopener noreferrer" className="block px-4 py-2.5 text-[.8125rem] text-[#a0a0a0] no-underline hover:bg-[#2f2f2f] hover:text-[#ececec] transition-colors" onClick={() => setMenuOpen(false)}>
                      <span className="font-semibold" style={{ color: b.accentLight }}>{b.name.slice(0, 4)}</span>
                      {b.name.slice(4)}
                    </a>
                  ))}
                  <div className="my-1 border-t border-white/8" />
                  <a href="https://hakio.id" target="_blank" rel="noopener noreferrer" className="block px-4 py-2.5 text-[.8125rem] text-[#a0a0a0] no-underline hover:bg-[#2f2f2f] hover:text-[#ececec] transition-colors" onClick={() => setMenuOpen(false)}>
                    <span className="font-semibold text-[#3b5fc0]">Hakio</span>.id — Portal Utama
                  </a>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* ── MAIN CONTENT (below fixed nav) ─────────────────────── */}
        <main className="pt-13">

          {/* ── HERO ──────────────────────────────────────────────── */}
          <section className="relative px-5 pt-16 pb-14 text-center max-w-3xl mx-auto">
            {/* subtle accent glow behind headline */}
            <div
              className="absolute inset-x-0 top-0 h-64 pointer-events-none"
              style={{ background: `radial-gradient(ellipse 60% 40% at 50% 0%, rgba(${brand.accentRgb},.13) 0%, transparent 70%)` }}
            />
            <div className="relative">
              <span
                className="inline-block text-[.75rem] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-5"
                style={{ background: `rgba(${brand.accentRgb},.12)`, color: brand.accentLight }}
              >
                Konsultasi Gratis · AI-Powered · Garansi Termurah
              </span>
              <h1
                className="hero-title text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.04em] text-[#ececec] mb-4 leading-[1.15]"
              >
                {landing.heroTitle}
              </h1>
              <p className="text-[#999] text-[1rem] leading-[1.7] mb-8 max-w-xl mx-auto">
                {landing.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-[.9rem] font-semibold no-underline wa-btn-hover transition-opacity"
                >
                  <WaIcon />
                  Konsultasi via WhatsApp
                </a>
                <button
                  onClick={scrollToChat}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/12 bg-white/4 text-[#ececec] text-[.9rem] font-semibold cursor-pointer transition-colors hover:bg-white/8 font-[inherit]"
                >
                  Tanya AI Gratis
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {/* ── STATS BAR ─────────────────────────────────────────── */}
          <section className="border-y border-white/6 py-4 px-5">
            <div className="stats-bar flex items-center justify-center gap-6 text-center max-w-2xl mx-auto">
              {[
                { num: "5.000+", label: "merek terdaftar" },
                { num: "7 tahun", label: "pengalaman" },
                { num: "Garansi", label: "harga termurah" },
              ].map((s, i) => (
                <div key={s.num} className="flex items-center gap-6">
                  {i > 0 && <span className="stats-sep text-white/15 text-lg select-none">·</span>}
                  <div>
                    <div className="text-[1.1rem] font-bold accent-text">{s.num}</div>
                    <div className="text-[.75rem] text-[#666] mt-0.5">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── BENEFITS ──────────────────────────────────────────── */}
          <section className="px-5 py-14 max-w-5xl mx-auto">
            <h2 className="text-center text-[1.5rem] font-bold text-[#ececec] mb-2">Kenapa Pilih {brand.name}?</h2>
            <p className="text-center text-[#666] text-[.875rem] mb-10">Kami hadir untuk memastikan merek Anda terlindungi dengan cara termudah</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: "⚡",
                  title: "Proses Cepat",
                  desc: "Pengajuan ke DJKI dalam 1–2 hari kerja setelah dokumen lengkap. Tidak perlu antre atau datang ke kantor.",
                },
                {
                  icon: "💰",
                  title: "Harga Transparan",
                  desc: "UMKM Rp 1.299.000 · PT Rp 2.490.000. Tidak ada biaya tersembunyi. Garansi harga termurah se-Indonesia.",
                },
                {
                  icon: "🛡",
                  title: "Garansi Pendampingan",
                  desc: "Kami dampingi hingga sertifikat terbit. Jika ada kendala di DJKI, kami tangani tanpa biaya tambahan.",
                },
              ].map((b) => (
                <div key={b.title} className="section-card rounded-2xl p-6">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-[1.3rem] mb-4"
                    style={{ background: `rgba(${brand.accentRgb},.1)` }}
                  >
                    {b.icon}
                  </div>
                  <h3 className="text-[1rem] font-semibold text-[#ececec] mb-2">{b.title}</h3>
                  <p className="text-[.85rem] text-[#777] leading-[1.6]">{b.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── PRICING ───────────────────────────────────────────── */}
          <section className="px-5 py-14 max-w-5xl mx-auto">
            <h2 className="text-center text-[1.5rem] font-bold text-[#ececec] mb-2">Harga Pendaftaran Merek</h2>
            <p className="text-center text-[#666] text-[.875rem] mb-10">Harga sudah termasuk biaya resmi DJKI + jasa pendampingan</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {/* UMKM card */}
              <div className="section-card pricing-card-featured rounded-2xl p-6 relative overflow-hidden flex flex-col" style={{ borderColor: brand.accent }}>
                <div className="pricing-featured-badge absolute top-0 right-0 text-[.65rem] font-bold text-white px-3 py-1 rounded-bl-xl tracking-wide uppercase">
                  Paling Laris
                </div>
                <div className="text-[.8rem] font-semibold uppercase tracking-widest mb-1" style={{ color: brand.accentLight }}>
                  UMKM / Perorangan
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-[2.2rem] font-extrabold text-[#ececec] leading-none">Rp 1.299.000</span>
                </div>
                <div className="text-[.8rem] text-[#555] mb-5">per kelas NICE</div>
                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {[
                    "KTP perorangan / NIB UMKM",
                    "Biaya PNBP DJKI termasuk",
                    "Pemeriksaan nama merek",
                    "Pengajuan e-Filing DJKI",
                    "Nomor permohonan resmi",
                    "Pendampingan hingga sertifikat",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[.85rem] text-[#999]">
                      <span style={{ color: brand.accentLight }} className="mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="block text-center py-3 rounded-full text-white text-[.875rem] font-semibold no-underline wa-btn-hover transition-opacity accent-gradient">
                  Daftar Sekarang
                </a>
              </div>

              {/* PT card */}
              <div className="section-card rounded-2xl p-6 flex flex-col">
                <div className="text-[.8rem] font-semibold uppercase tracking-widest text-[#666] mb-1">
                  Perusahaan / PT / CV
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-[2.2rem] font-extrabold text-[#ececec] leading-none">Rp 2.490.000</span>
                </div>
                <div className="text-[.8rem] text-[#555] mb-5">per kelas NICE</div>
                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {[
                    "Akta pendirian perusahaan",
                    "Biaya PNBP DJKI termasuk",
                    "Pemeriksaan nama merek",
                    "Pengajuan e-Filing DJKI",
                    "Nomor permohonan resmi",
                    "Pendampingan hingga sertifikat",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[.85rem] text-[#999]">
                      <span className="text-[#555] mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="block text-center py-3 rounded-full border border-white/10 text-[#ececec] text-[.875rem] font-semibold no-underline transition-colors hover:bg-white/5">
                  Konsultasi Dulu
                </a>
              </div>
            </div>
            <p className="text-center text-[.75rem] text-[#444] mt-6">
              Butuh lebih dari 1 kelas?{" "}
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="no-underline hover:underline" style={{ color: brand.accentLight }}>
                Hubungi kami untuk harga bundling
              </a>
            </p>
          </section>

          {/* ── PROCESS STEPS ─────────────────────────────────────── */}
          <section className="px-5 py-14 max-w-5xl mx-auto">
            <h2 className="text-center text-[1.5rem] font-bold text-[#ececec] mb-2">Alur Pendaftaran Merek</h2>
            <p className="text-center text-[#666] text-[.875rem] mb-10">Dari konsultasi hingga sertifikat resmi DJKI</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  num: "01",
                  title: "Konsultasi",
                  desc: "Ceritakan nama merek dan bisnis Anda. AI kami analisis risiko dan rekomendasikan kelas NICE yang tepat.",
                },
                {
                  num: "02",
                  title: "Siapkan Dokumen",
                  desc: "Upload KTP/akta perusahaan dan logo merek. Kami periksa kelengkapan dalam 1 hari kerja.",
                },
                {
                  num: "03",
                  title: "Pengajuan DJKI",
                  desc: "Kami ajukan permohonan ke sistem e-Filing DJKI. Anda mendapat nomor pendaftaran resmi.",
                },
                {
                  num: "04",
                  title: "Sertifikat Terbit",
                  desc: "Setelah proses review DJKI (12–18 bulan), sertifikat merek resmi dikirim ke email Anda.",
                },
              ].map((step) => (
                <div key={step.num} className="section-card rounded-2xl p-5 relative">
                  <div className="step-num inline-flex items-center justify-center w-9 h-9 rounded-lg text-[.8rem] font-bold mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-[.95rem] font-semibold text-[#ececec] mb-2">{step.title}</h3>
                  <p className="text-[.8125rem] text-[#666] leading-[1.6]">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ───────────────────────────────────────────────── */}
          <section className="px-5 py-14 max-w-2xl mx-auto">
            <h2 className="text-center text-[1.5rem] font-bold text-[#ececec] mb-2">Pertanyaan Umum</h2>
            <p className="text-center text-[#666] text-[.875rem] mb-10">Hal-hal yang sering ditanyakan seputar pendaftaran merek</p>
            <div className="flex flex-col gap-2">
              {landing.faq.map((item, i) => (
                <div key={i} className="section-card rounded-xl overflow-hidden">
                  <button
                    className="faq-btn w-full text-left px-5 py-4 flex items-start justify-between gap-3 cursor-pointer bg-transparent border-none font-[inherit] transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="text-[.9rem] font-medium text-[#ececec] leading-[1.5]">{item.q}</span>
                    <span className="flex-shrink-0 mt-0.5 accent-text text-[1.1rem] leading-none transition-transform" style={{ transform: openFaq === i ? "rotate(45deg)" : "none" }}>
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 animate-fadeup">
                      <p className="text-[.875rem] text-[#888] leading-[1.7]">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── CHAT SECTION ──────────────────────────────────────── */}
          <section ref={chatSectionRef} className="px-5 py-14 max-w-3xl mx-auto" id="chat">
            <div className="text-center mb-8">
              <h2 className="text-[1.5rem] font-bold text-[#ececec] mb-2">Tanya AI Konsultan Kami</h2>
              <p className="text-[#666] text-[.875rem]">Gratis, instan, dan ditenagai GPT-4o</p>
            </div>

            {!chatOpen ? (
              /* Collapsed state */
              <div className="section-card accent-glow rounded-2xl p-8 text-center">
                <div className="w-14 h-14 rounded-2xl accent-gradient flex items-center justify-center text-[1.1rem] font-bold mx-auto mb-4 text-white">
                  AI
                </div>
                <p className="text-[#999] text-[.9rem] mb-6 leading-[1.6] max-w-sm mx-auto">
                  Tanyakan apa saja seputar merek dagang — nama, kelas NICE, biaya, proses, atau cek ketersediaan nama merek Anda.
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {brand.chips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      className="px-4 py-2 rounded-full border border-white/8 bg-[#141414] text-[#a0a0a0] text-[.8125rem] font-medium cursor-pointer transition-all font-[inherit] accent-chip-hover"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <button
                  onClick={scrollToChat}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-[.875rem] font-semibold cursor-pointer border-none font-[inherit] accent-gradient wa-btn-hover transition-opacity"
                >
                  Mulai Chat Gratis
                </button>
              </div>
            ) : (
              /* Expanded chat */
              <div className="section-card accent-glow rounded-2xl overflow-hidden flex flex-col" style={{ height: "520px" }}>
                {/* Chat header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
                  <div className="w-8 h-8 rounded-lg accent-gradient flex items-center justify-center text-[.7rem] font-bold text-white">
                    AI
                  </div>
                  <div>
                    <div className="text-[.875rem] font-semibold text-[#ececec]">Asisten Merek AI</div>
                    <div className="text-[.7rem] text-[#25D366] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full inline-block" />
                      Online sekarang
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div ref={msgsRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 animate-fadeup ${msg.role === "user" ? "justify-end" : ""}`}>
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-lg accent-gradient flex items-center justify-center text-[.65rem] font-bold flex-shrink-0 mt-0.5 text-white">
                          AI
                        </div>
                      )}
                      <div
                        className={`text-[.9rem] leading-[1.65] whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-[#2f2f2f] text-[#ececec] rounded-[18px_18px_4px_18px] px-4 py-2.5 max-w-[75%]"
                            : "text-[#ececec] pt-0.5 max-w-[88%]"
                        }`}
                      >
                        {msg.content}
                        {msg.role === "assistant" && showWA && i === messages.length - 1 && !waClicked && (
                          <div className="mt-4 flex flex-col gap-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => sendMessage("Bagaimana cara cek apakah nama merek saya sudah terdaftar?")}
                                className="px-3 py-1.5 rounded-full border border-white/12 bg-[#1a1a1a] text-[#b0b0b0] text-[.775rem] font-medium cursor-pointer transition-all font-[inherit] hover:border-white/24 hover:text-[#ececec]"
                              >
                                Cara cek nama merek
                              </button>
                              <button
                                onClick={() => sendMessage("Berapa total biaya yang harus saya bayar?")}
                                className="px-3 py-1.5 rounded-full border border-white/12 bg-[#1a1a1a] text-[#b0b0b0] text-[.775rem] font-medium cursor-pointer transition-all font-[inherit] hover:border-white/24 hover:text-[#ececec]"
                              >
                                Total biaya?
                              </button>
                            </div>
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={handleWaClick}
                              className="inline-flex items-center gap-2 px-[22px] py-[11px] rounded-full bg-[#25D366] text-white text-[.875rem] font-semibold no-underline wa-btn-hover transition-opacity w-fit"
                            >
                              <WaIcon />
                              Lanjut ke WhatsApp
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-3 animate-fadeup">
                      <div className="w-7 h-7 rounded-lg accent-gradient flex items-center justify-center text-[.65rem] font-bold flex-shrink-0 mt-0.5 text-white">
                        AI
                      </div>
                      <div className="flex gap-1 items-center pt-1.5">
                        <span className="w-1.5 h-1.5 bg-[#666] rounded-full typing-dot" />
                        <span className="w-1.5 h-1.5 bg-[#666] rounded-full typing-dot" />
                        <span className="w-1.5 h-1.5 bg-[#666] rounded-full typing-dot" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-white/8">
                  {showWA && (
                    <div className="mb-3 flex items-center gap-2 px-1">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleWaClick}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full text-white text-[.875rem] font-semibold no-underline transition-opacity"
                        style={{ background: waClicked ? "#128c57" : "#25D366" }}
                      >
                        <WaIcon />
                        {waClicked
                          ? "WhatsApp Terbuka ✓"
                          : leadData?.user
                          ? `Lanjut ke WhatsApp, ${leadData.user}`
                          : "Lanjut ke WhatsApp"}
                      </a>
                    </div>
                  )}
                  <div className="flex items-end gap-3 bg-[#0a0a0a] border border-white/8 rounded-2xl px-4 py-3 focus-within:border-white/16 transition-colors">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      placeholder="Tanya seputar merek dagang..."
                      rows={1}
                      className="flex-1 bg-transparent text-[#ececec] text-[.9rem] resize-none outline-none border-none placeholder:text-[#444] max-h-28 leading-[1.5] font-[inherit] accent-ring"
                      style={{ scrollbarWidth: "none" }}
                      disabled={loading}
                      onInput={(e) => {
                        const t = e.currentTarget;
                        t.style.height = "auto";
                        t.style.height = Math.min(t.scrollHeight, 112) + "px";
                      }}
                    />
                    <button
                      onClick={() => sendMessage(input)}
                      disabled={loading || !input.trim()}
                      className="w-8 h-8 rounded-full accent-gradient flex items-center justify-center flex-shrink-0 disabled:opacity-30 transition-opacity cursor-pointer border-none"
                    >
                      <SendIcon />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ── FOOTER ────────────────────────────────────────────── */}
          <footer className="border-t border-white/6 px-5 py-10 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-5">
                {Object.values(BRANDS).map((b) => (
                  <a key={b.id} href={`https://${b.id}.com`} target="_blank" rel="noopener noreferrer" className="text-[.8rem] no-underline hover:underline" style={{ color: b.id === brand.id ? b.accentLight : "#555" }}>
                    {b.name}
                  </a>
                ))}
                <a href="https://hakio.id" target="_blank" rel="noopener noreferrer" className="text-[.8rem] text-[#555] no-underline hover:text-[#777]">
                  Hakio.id
                </a>
              </div>
              <p className="text-[.75rem] text-[#3a3a3a]">
                &copy; {new Date().getFullYear()} {brand.name} · Layanan pendaftaran merek dagang di Indonesia ·{" "}
                <a href="/harga" className="text-[#444] no-underline hover:text-[#666]">Harga</a>
                {" · "}
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-[#444] no-underline hover:text-[#666]">WhatsApp</a>
              </p>
              <p className="text-[.7rem] text-[#2a2a2a] mt-2">
                Konsultasi gratis · Ditenagai GPT-4o · Powered by{" "}
                <a href="https://hakio.id" className="text-[#333] no-underline hover:text-[#555]">Hakio.id</a>
              </p>
            </div>
          </footer>

        </main>
      </div>
    </>
  );
}
