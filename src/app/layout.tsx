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
  const gtagIds = [brand.gtagId, brand.ga4Id].filter(
    (id): id is string => Boolean(id),
  );
  const gtagConversionLabel = brand.gtagConversionLabel;
  const gtmId = brand.gtmId;
  const metaPixelId = brand.metaPixelId;

  return (
    <html lang="id">
      <head>
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
        {gtagIds.length > 0 && (
          <>
            {gtagIds.map((id) => (
              <script
                key={id}
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
              />
            ))}
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${gtagIds.map((id) => `gtag('config','${id}');`).join("")}`,
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
        {metaPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`,
            }}
          />
        )}
      </head>
      <body>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {metaPixelId && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
