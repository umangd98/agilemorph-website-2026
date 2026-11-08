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
  title: "What we build: AI agents, automation and integration",
  alternates: { canonical: "/what-we-build" },
  description:
    "AI agents, workflow automation, CRM and messaging automation, RAG, voice AI and self-hosted AI infrastructure, built inside the systems you already run.",
};

export async function generateMetadata(): Promise<Metadata> {
  const servicesIndex = await sanityFetch<ServicesIndexPage | null>({
    query: servicesIndexPageQuery,
    tags: ["servicesIndexPage"],
  });

  return seoToMetadata(servicesIndex?.seo, fallbackMetadata);
}

export default async function WhatWeBuildPageRoute() {
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
          heading={servicesIndex?.cta?.heading ?? "Every build starts with a discovery audit"}
          description={
            servicesIndex?.cta?.description ??
            "Every build starts with a discovery audit. See how we work."
          }
          button={servicesIndex?.cta?.button ?? { label: "See how we work", href: "/how-we-work" }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
