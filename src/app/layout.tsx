import type { Metadata, Viewport } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";
import { PageIntro } from "@/components/fx/PageIntro";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-jb", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "CROSS · Adolescentes e Jovens da IBB",
    template: "%s · CROSS",
  },
  description: site.description,
  keywords: ["CROSS", "UP", "GO", "ministério de jovens", "adolescentes", "IBB", "Igreja Batista do Bacacheri", "Curitiba"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "CROSS",
    title: "CROSS · Adolescentes e Jovens da IBB",
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: "CROSS · Adolescentes e Jovens da IBB",
    description: site.description,
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192" }, { url: "/icons/icon-512.png", sizes: "512x512" }],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "CROSS" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${inter.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
        <PageIntro />
      </body>
    </html>
  );
}
