import type { Brand } from "@/lib/brands";

export default function JsonLd({ brand }: { brand: Brand }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `https://${brand.id}.com/#organization`,
        name: brand.schema.name,
        description: brand.schema.description,
        url: `https://${brand.id}.com`,
        telephone: "+62851-4841-6800",
        address: {
          "@type": "PostalAddress",
          addressCountry: "ID",
          addressLocality: "Jakarta",
        },
        sameAs: ["https://hakio.id"],
        serviceType: "Pendaftaran Merek Dagang HAKI",
        areaServed: "Indonesia",
        priceRange: "Rp 1.299.000 – Rp 2.490.000",
      },
      {
        "@type": "WebSite",
        "@id": `https://${brand.id}.com/#website`,
        url: `https://${brand.id}.com`,
        name: brand.name,
        description: brand.description,
        inLanguage: "id-ID",
        publisher: { "@id": `https://${brand.id}.com/#organization` },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Berapa biaya pendaftaran merek dagang?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "UMKM/Perorangan: Rp 1.299.000 per kelas. Perusahaan/PT: Rp 2.490.000 per kelas. Harga sudah termasuk biaya DJKI dan jasa pendaftaran.",
            },
          },
          {
            "@type": "Question",
            name: "Berapa lama proses pendaftaran merek?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Proses pendaftaran merek di DJKI memakan waktu sekitar 12–18 bulan total, mencakup pemeriksaan formal, pengumuman, dan pemeriksaan substantif.",
            },
          },
          {
            "@type": "Question",
            name: "Apa itu kelas NICE dalam pendaftaran merek?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Kelas NICE adalah sistem klasifikasi internasional untuk produk dan jasa, terdiri dari 45 kelas. Setiap merek didaftarkan per kelas sesuai jenis bisnis Anda.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
