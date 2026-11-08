import type { Metadata } from "next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import {
  CardGridSection,
  CaseStudyGrid,
  FdeExplainer,
  FdePageHero,
  FdeSection,
  FinalCtaSection,
} from "@/components/sections/fde";
import { seoToMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import { caseStudiesIndexPageQuery, caseStudiesListQuery } from "@/sanity/queries";
import type { CaseStudiesIndexPage, CaseStudySummary } from "@/sanity/types";

const fallbackMetadata: Metadata = {
  title: "Case studies",
  description:
    "How Agilemorph's forward deployed engineers embed with a team, find where AI fits, build it in production and stay until it is used.",
  alternates: { canonical: "/case-studies" },
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<CaseStudiesIndexPage | null>({
    query: caseStudiesIndexPageQuery,
    tags: ["caseStudiesIndexPage"],
  });
  return seoToMetadata(page?.seo, fallbackMetadata);
}

export default async function CaseStudiesRoute() {
  const [page, studies] = await Promise.all([
    sanityFetch<CaseStudiesIndexPage | null>({
      query: caseStudiesIndexPageQuery,
      tags: ["caseStudiesIndexPage"],
    }),
    sanityFetch<CaseStudySummary[]>({
      query: caseStudiesListQuery,
      tags: ["caseStudy"],
    }),
  ]);

  const items = studies ?? [];

  return (
    <>
      <SiteNavbar />
      <main className="flex-1">
        <FdePageHero
          eyebrow={page?.hero?.eyebrow ?? "Case studies"}
          heading={page?.hero?.heading ?? "Case studies"}
          description={page?.hero?.description}
        >
          <FdeExplainer />
        </FdePageHero>

        <FdeSection index="01" eyebrow="Engagements" heading={items.length ? "Engagements" : undefined}>
          {items.length ? (
            <CaseStudyGrid items={items} />
          ) : (
            <p className="text-fg-muted">Case studies are being written up. Check back soon.</p>
          )}
        </FdeSection>

        <CardGridSection index="02" block={page?.founderTrack} columns={4} />
        <FinalCtaSection block={page?.cta} />
      </main>
      <SiteFooter />
    </>
  );
}
