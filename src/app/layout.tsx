diff --git a/src/app/layout.tsx b/src/app/layout.tsx
index 54b125a1678c9614b5280e8774c11fe07021454a..b7e632c804807190b5b28e3eda71a5c13c94c60e 100644
--- a/src/app/layout.tsx
+++ b/src/app/layout.tsx
@@ -1,37 +1,30 @@
 import type { Metadata, Viewport } from "next";
-import { Inter } from "next/font/google";
 import type { ReactNode } from "react";
 import "./globals.css";
 import { keywords, site } from "@/lib/site";
 
-const inter = Inter({
-  subsets: ["latin"],
-  display: "swap",
-  variable: "--font-inter"
-});
-
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
@@ -45,30 +38,30 @@ export const metadata: Metadata = {
         height: 630,
         alt: "Catedral Experience – Recomeços"
       }
     ]
   },
   twitter: {
     card: "summary_large_image",
     title: "Catedral Experience – Recomeços",
     description: "Uma noite especial de música, propósito e impacto social.",
     images: ["/assets/hero-image.png"]
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
-    <html lang="pt-BR" className={inter.variable}>
+    <html lang="pt-BR">
       <body className="font-sans antialiased">{children}</body>
     </html>
   );
 }
