import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

import { SiteNavbar } from "@/components/SiteNavbar";
import { SiteFooter } from "@/components/SiteFooter";
import { FaqSection, HeroSection, PartnersSection } from "@/components/sections";
import {
  CardGridSection,
  CaseStudyGrid,
  ComparisonSection,
  FdeSection,
  FinalCtaSection,
  FoundersPairSection,
  PhaseFlowSection,
} from "@/components/sections/fde";
import { Reveal } from "@/components/Reveal";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/data/positioning";
import { seoToMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import {
  homepageAboveFoldQuery,
  homepageBelowFoldQuery,
} from "@/sanity/queries";
import type { HomepageAboveFold, HomepageBelowFold } from "@/sanity/types";

const fallbackMetadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await sanityFetch<HomepageAboveFold | null>({
    query: homepageAboveFoldQuery,
    tags: ["homepage"],
  });

  const metadata = seoToMetadata(homepage?.seo, fallbackMetadata);
  // The homepage title is the full brand title, not "<page> | Agilemorph".
  return {
    ...metadata,
    title: { absolute: homepage?.seo?.title ?? SITE_TITLE },
  };
}

async function BelowFoldSections() {
  const homepage = await sanityFetch<HomepageBelowFold | null>({
    query: homepageBelowFoldQuery,
    tags: ["homepage", "caseStudy"],
  });

  const caseStudies = (homepage?.caseStudies?.items ?? []).filter(Boolean);

  return (
    <>
      <CardGridSection index="01" block={homepage?.problem} tone="symptom" columns={4} />
      <ComparisonSection index="02" block={homepage?.fde} />
      <PhaseFlowSection index="03" block={homepage?.phases} />

      {caseStudies.length ? (
        <FdeSection
          index="04"
          eyebrow={homepage?.caseStudies?.eyebrow}
          heading={homepage?.caseStudies?.heading}
          intro={homepage?.caseStudies?.intro}
        >
          <CaseStudyGrid items={caseStudies} />
          <Reveal>
            <Link
              href="/case-studies"
              className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-signal"
            >
              All case studies
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </Reveal>
        </FdeSection>
      ) : null}

      <FoundersPairSection index="05" block={homepage?.founders} />
      <CardGridSection index="06" block={homepage?.capabilities} columns={3} />
      <PartnersSection
        heading={homepage?.partners?.heading}
        items={homepage?.partners?.items}
      />
      <CardGridSection index="07" block={homepage?.security} columns={4} />

      <FaqSection index="08" />
      <CardGridSection index="09" block={homepage?.clientTypes} columns={4} />
      <FinalCtaSection block={homepage?.finalCta} />
    </>
  );
}

export default async function HomePage() {
  const homepage = await sanityFetch<HomepageAboveFold | null>({
    query: homepageAboveFoldQuery,
    tags: ["homepage"],
  });

  if (!homepage) {
    return (
      <>
        <SiteNavbar />
        <main className="flex flex-1 items-center justify-center px-6 py-24">
          <p className="font-body text-muted-foreground">
            Homepage content is not available yet. Add it in Sanity Studio.
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteNavbar />

      <main className="flex-1">
        <HeroSection hero={homepage.hero} />
        <Suspense fallback={null}>
          <BelowFoldSections />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}
