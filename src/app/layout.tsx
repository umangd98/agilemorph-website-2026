import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ServiceWorkerCleanup } from "@/components/ServiceWorkerCleanup";
import { StructuredData } from "@/components/StructuredData";
import { TidioChat } from "@/components/TidioChat";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/content/site";
import { organizationSchema, SITE_URL, websiteSchema } from "@/lib/structured-data";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s | Agilemorph" },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Agilemorph",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${interTight.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <ServiceWorkerCleanup />
        <StructuredData data={[organizationSchema(), websiteSchema()]} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-pill focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <TidioChat />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
