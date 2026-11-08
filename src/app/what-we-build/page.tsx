import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { PartnersSection } from "@/components/sections";
import {
  CapabilityListSection,
  CardGridSection,
  FdePageHero,
  FinalCtaSection,
} from "@/components/sections/fde";
import { seoToMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import { homepagePartnersQuery, whatWeBuildPageQuery } from "@/sanity/queries";
import type { PartnersSection as PartnersBlock, WhatWeBuildPage } from "@/sanity/types";

const fallbackMetadata: Metadata = {
  title: "What we build",
  description:
    "AI agents, field capture, workflow automation, document intelligence, voice AI and self-hosted AI infrastructure, built inside the systems you already run.",
  alternates: { canonical: "/what-we-build" },
};

async function getPage() {
  return sanityFetch<WhatWeBuildPage | null>({
    query: whatWeBuildPageQuery,
    tags: ["whatWeBuildPage"],
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage();
  if (!page) return { title: "Not Found", robots: { index: false } };
  return seoToMetadata(page.seo, fallbackMetadata);
}

export default async function WhatWeBuildRoute() {
  const [page, partners] = await Promise.all([
    getPage(),
    sanityFetch<PartnersBlock | null>({ query: homepagePartnersQuery, tags: ["homepage"] }),
  ]);
  if (!page?.hero?.heading) notFound();

  return (
    <>
      <SiteNavbar />
      <main className="flex-1">
        <FdePageHero
          eyebrow={page.hero.eyebrow}
          heading={page.hero.heading}
          description={page.hero.description}
        />
        <CapabilityListSection index="01" capabilities={page.capabilities} />
        <CardGridSection index="02" block={page.principles} columns={3} />
        <PartnersSection heading={partners?.heading} items={partners?.items} />
        <FinalCtaSection block={page.cta} />
      </main>
      <SiteFooter />
    </>
  );
}
