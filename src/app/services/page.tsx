import type { Metadata } from "next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { PageCtaSection } from "@/components/sections/PageCtaSection";
import { ServicesCatalogSection } from "@/components/sections/ServicesCatalogSection";
import { getServicePages } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services | AgileMorph Solutions",
  description:
    "Explore AgileMorph services — AI automation, agents, workflow integrations, digital marketing, virtual assistance, and web development.",
};

export default async function ServicesPageRoute() {
  const pages = await getServicePages();

  return (
    <>
      <SiteNavbar />
      <main className="flex-1">
        <ServicesCatalogSection pages={pages} />
        <PageCtaSection
          heading="Not sure where to start?"
          description="Book a discovery call and we'll map the highest-impact automation and supporting services for your team."
          button={{ label: "Get in Touch", href: "/contact#book" }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
