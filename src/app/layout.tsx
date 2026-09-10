import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
