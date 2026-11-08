import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { MotionProvider } from "@/components/MotionProvider";
import { ServiceWorkerCleanup } from "@/components/ServiceWorkerCleanup";
import { StructuredData } from "@/components/StructuredData";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeScript } from "@/components/ThemeScript";
import { TidioChat } from "@/components/TidioChat";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/data/positioning";
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

  const title = siteSettings?.siteTitle ?? SITE_TITLE;
  const description = siteSettings?.siteDescription ?? SITE_DESCRIPTION;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: "%s | Agilemorph",
    },
    description,
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: "Agilemorph",
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
        <GoogleAnalytics />
      </body>
    </html>
  );
}
