import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const headingFont = Montserrat({
  variable: "--font-heading-var",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800", "900"],
});

const bodyFont = Inter({
  variable: "--font-body-var",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AGILEMORPH | Digital Accelerators",
    template: "%s | AgileMorph",
  },
  description:
    "We revolutionize efficiency with AI Automation, craft impactful experiences through Web Development, and amplify influence via Digital Marketing.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
