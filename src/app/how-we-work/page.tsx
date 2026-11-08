import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import {
  CardGridSection,
  ComparisonSection,
  EngagementModelSection,
  FdeExplainer,
  FdePageHero,
  FinalCtaSection,
  PhaseFlowSection,
  ProseSection,
} from "@/components/sections/fde";
import { FDE_EXPLAINER } from "@/data/positioning";
import { seoToMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import { howWeWorkPageQuery } from "@/sanity/queries";
import type { HowWeWorkPage } from "@/sanity/types";

const fallbackMetadata: Metadata = {
  title: "How we work: Forward Deployed Engineering",
  description: FDE_EXPLAINER,
  alternates: { canonical: "/how-we-work" },
};

async function getPage() {
  return sanityFetch<HowWeWorkPage | null>({
    query: howWeWorkPageQuery,
    tags: ["howWeWorkPage"],
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage();
  if (!page) return { title: "Not Found", robots: { index: false } };
  return seoToMetadata(page.seo, fallbackMetadata);
}

export default async function HowWeWorkRoute() {
  const page = await getPage();
  if (!page?.hero?.heading) notFound();

  return (
    <>
      <SiteNavbar />
      <main className="flex-1">
        <FdePageHero
          eyebrow={page.hero.eyebrow}
          heading={page.hero.heading}
          ctaPrimary={page.hero.ctaPrimary}
          ctaSecondary={page.hero.ctaSecondary}
        >
          <FdeExplainer text={page.hero.description} />
        </FdePageHero>
        <CardGridSection index="01" block={page.problem} tone="symptom" columns={4} />
        <ProseSection index="02" block={page.ourRead} />
        <ComparisonSection index="03" block={page.comparison} />
        <PhaseFlowSection id="phases" index="04" block={page.phases} layout="timeline" />
        <CardGridSection id="discovery-audit" index="05" block={page.audit} columns={4} />
        <PhaseFlowSection id="architecture" index="06" block={page.architecture} />
        <CardGridSection index="07" block={page.adoption} columns={5} />
        <EngagementModelSection id="engagement-model" index="08" block={page.engagement} />
        <CardGridSection id="security" index="09" block={page.security} columns={4} />
        <FinalCtaSection block={page.cta} />
      </main>
      <SiteFooter />
    </>
  );
}
