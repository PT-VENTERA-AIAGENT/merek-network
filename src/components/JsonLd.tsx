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
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
