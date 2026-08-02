import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { MotionProvider } from "@/components/MotionProvider";
import { ServiceWorkerCleanup } from "@/components/ServiceWorkerCleanup";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeScript } from "@/components/ThemeScript";
import { TidioChat } from "@/components/TidioChat";
import { getSiteSettings } from "@/lib/get-site-settings";

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

  return {
    title: {
      default: siteSettings?.siteTitle ?? "AGILEMORPH | Digital Accelerators",
      template: "%s | AgileMorph",
    },
    description:
      siteSettings?.siteDescription ??
      "We revolutionize efficiency with AI Automation, craft production-ready experiences through Website Development, and amplify influence via Digital Marketing and Virtual Assistance.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <ServiceWorkerCleanup />
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
