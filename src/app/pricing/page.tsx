import type { Metadata } from "next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { PricingSection } from "@/components/sections/PricingSection";

export const metadata: Metadata = {
  title: "Pricing — AgileMorph Solutions",
  description:
    "Straightforward engagements and predictable outcomes. Fixed-scope project pricing and monthly retainer tiers for AI automation and digital operations.",
};

export default function PricingPage() {
  return (
    <>
      <SiteNavbar />
      <main className="flex-1">
        <PricingSection />
      </main>
      <SiteFooter />
    </>
  );
}
