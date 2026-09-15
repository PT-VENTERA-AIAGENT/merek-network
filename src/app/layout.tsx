import type { Metadata } from "next";
import { headers } from "next/headers";
import { getBrandById } from "@/lib/brands";
import "./globals.css";

export const metadata: Metadata = {
  title: "Merek Network",
  description: "Layanan merek dagang Indonesia",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/hakio-mark.png", type: "image/png", sizes: "128x128" },
    ],
    apple: [{ url: "/hakio-mark.png", sizes: "128x128" }],
    shortcut: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();
  const brandId = hdrs.get("x-brand-id") ?? "hakimerek";
  const brand = getBrandById(brandId);
  const gtagId = brand.gtagId;
  const gtagConversionLabel = brand.gtagConversionLabel;

  return (
    <html lang="id">
      <head>
        {gtagId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gtagId}');`,
              }}
            />
          </>
        )}
        {gtagConversionLabel && (
          <script
            dangerouslySetInnerHTML={{
              __html: `function gtag_report_conversion(url){var cb=function(){if(typeof url!='undefined'){window.location=url;}};gtag('event','conversion',{'send_to':'${gtagConversionLabel}','value':1.0,'currency':'IDR','event_callback':cb});return false;}`,
            }}
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
