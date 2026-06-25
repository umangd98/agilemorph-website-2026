import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeScript } from "@/components/ThemeScript";
import { TidioChat } from "@/components/TidioChat";
import { getSiteSettings } from "@/lib/get-site-settings";

const headingFont = Montserrat({
  variable: "--font-heading-var",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
});

const bodyFont = Inter({
  variable: "--font-body-var",
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
      className={`${headingFont.variable} ${bodyFont.variable} dark h-full`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>{children}</ThemeProvider>
        <TidioChat />
      </body>
    </html>
  );
}
