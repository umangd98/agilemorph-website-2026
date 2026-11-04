import type { Metadata } from "next";
import {
  Archivo,
  Caveat,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

import { PeakWeekCalculator } from "./PeakWeekCalculator";
import "./peak-week-calculator.css";

const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-peak-display",
  display: "swap",
});
const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-peak-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-peak-mono",
  display: "swap",
});
const hand = Caveat({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-peak-hand",
  display: "swap",
});

const PATH = "/resources/peak-week-calculator";
const TITLE = "Black Friday Support Hours Calculator";
const DESCRIPTION =
  "Estimate the support hours Black Friday week will need, plan staffing day by day, and cut tickets early with a 13-tip playbook. Free, no sign-up.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    siteName: "AgileMorph",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function PeakWeekCalculatorPage() {
  return (
    <>
      <SiteNavbar />
      <main className="flex-1">
        <PeakWeekCalculator
          className={`${display.variable} ${body.variable} ${mono.variable} ${hand.variable}`}
        />
      </main>
      <SiteFooter />
    </>
  );
}
