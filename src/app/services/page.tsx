import type { Metadata } from "next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { PageCtaSection } from "@/components/sections/PageCtaSection";
import { ServicesCatalogSection } from "@/components/sections/ServicesCatalogSection";
import { seoToMetadata } from "@/lib/seo";
import { getServicePages } from "@/lib/services";
import { sanityFetch } from "@/sanity/fetch";
import { servicesIndexPageQuery } from "@/sanity/queries";
import type { ServicesIndexPage } from "@/sanity/types";

const fallbackMetadata: Metadata = {
  title: "Services | AgileMorph Solutions",
  description:
    "Explore AgileMorph services: AI automation, agents, workflow integrations, digital marketing, virtual assistance, and web development.",
};

export async function generateMetadata(): Promise<Metadata> {
  const servicesIndex = await sanityFetch<ServicesIndexPage | null>({
    query: servicesIndexPageQuery,
    tags: ["servicesIndexPage"],
  });

  return seoToMetadata(servicesIndex?.seo, fallbackMetadata);
}

export default async function ServicesPageRoute() {
  const [pages, servicesIndex] = await Promise.all([
    getServicePages(),
    sanityFetch<ServicesIndexPage | null>({
      query: servicesIndexPageQuery,
      tags: ["servicesIndexPage"],
    }),
  ]);

  return (
    <>
      <SiteNavbar />
      <main className="flex-1">
        <ServicesCatalogSection
          pages={pages}
          heroEyebrow={servicesIndex?.hero?.eyebrow}
          heroHeading={servicesIndex?.hero?.heading}
          heroDescription={servicesIndex?.hero?.description}
        />
        <PageCtaSection
          heading={servicesIndex?.cta?.heading ?? "Not Sure Where To Start?"}
          description={
            servicesIndex?.cta?.description ??
            "Book a discovery call and we'll map the highest-impact automation and supporting services for your team."
          }
          button={servicesIndex?.cta?.button ?? { label: "Get In Touch", href: "/contact#book" }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
