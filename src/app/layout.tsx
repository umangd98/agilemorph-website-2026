import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { MotionProvider } from "@/components/MotionProvider";
import { ServiceWorkerCleanup } from "@/components/ServiceWorkerCleanup";
import { StructuredData } from "@/components/StructuredData";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeScript } from "@/components/ThemeScript";
import { TidioChat } from "@/components/TidioChat";
import { getSiteSettings } from "@/lib/get-site-settings";
import {
  organizationSchema,
  SITE_URL,
  websiteSchema,
} from "@/lib/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();

  const title =
    siteSettings?.siteTitle ?? "Software & AI Engineering Partner | AgileMorph";
  const description =
    siteSettings?.siteDescription ??
    "AgileMorph builds custom software, AI products, data platforms, and operational automation for SMBs and enterprises.";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: "%s | AgileMorph",
    },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: "AgileMorph",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const siteSettings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <ServiceWorkerCleanup />
        <StructuredData
          data={[
            organizationSchema({
              description: siteSettings?.siteDescription,
              socialLinks: siteSettings?.socialLinks,
            }),
            websiteSchema({ name: siteSettings?.siteTitle }),
          ]}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
        <TidioChat />
      </body>
    </html>
  );
}
