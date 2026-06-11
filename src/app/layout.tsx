import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { keywords, site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#101114"
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Catedral Experience – Recomeços | Tributo beneficente em São Paulo",
    template: "%s | Catedral Experience – Recomeços"
  },
  description:
    "Tributo beneficente independente ao repertório da Banda Catedral, com venda de ingressos, cotas de patrocínio e arrecadação social em São Paulo.",
  keywords,
  authors: [{ name: "Catedral Experience – Recomeços" }],
  creator: "Catedral Experience – Recomeços",
  publisher: "Catedral Experience – Recomeços",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: "Catedral Experience – Recomeços",
    title: "Catedral Experience – Recomeços",
    description: "Mais que um show. Um recomeço.",
    images: [
      {
        url: "/assets/hero-concert.jpg",
        width: 1200,
        height: 630,
        alt: "Catedral Experience – Recomeços"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Catedral Experience – Recomeços",
    description: "Uma noite especial de música, propósito e impacto social.",
    images: ["/assets/hero-concert.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
