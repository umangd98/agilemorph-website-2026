import type { Metadata } from "next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { PricingSection } from "@/components/sections/PricingSection";
import { getPricingPage } from "@/lib/get-pricing-page";
import { seoToMetadata } from "@/lib/seo";

const fallbackMetadata: Metadata = {
  title: "Pricing | AgileMorph Solutions",
  description:
    "Straightforward engagements and predictable outcomes. Fixed-scope project pricing and monthly retainer tiers for AI automation and digital operations.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pricingPage = await getPricingPage();
  return seoToMetadata(pricingPage.seo, fallbackMetadata);
}

export default async function PricingPageRoute() {
  const pricingPage = await getPricingPage();

  return (
    <>
      <SiteNavbar />
      <main className="flex-1">
        <PricingSection page={pricingPage} />
      </main>
      <SiteFooter />
    </>
  );
}
