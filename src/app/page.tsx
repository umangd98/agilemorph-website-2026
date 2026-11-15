import type { Metadata } from "next";
import Link from "next/link";

import { EngineFilm } from "@/components/deconstruction-v3/EngineFilm";
import { StructuredData } from "@/components/StructuredData";
import { Adoption } from "@/components/site/Adoption";
import {
  CaseStudyRows,
  Comparison,
  CtaBand,
  FaqList,
  Founders,
  FunctionExplorer,
  GapStatement,
} from "@/components/site/blocks";
import { Hero } from "@/components/site/Hero";
import { PageShell } from "@/components/site/PageShell";
import { Section, TermList } from "@/components/site/Section";
import { CLIENT_TYPES, FAQ, OWNERSHIP, SITE_DESCRIPTION, SITE_TITLE } from "@/content/site";
import { faqPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const textLink =
  "font-medium text-green underline decoration-green/30 underline-offset-4 hover:decoration-green";

export default function HomePage() {
  const faqSchema = faqPageSchema(FAQ.map(([question, answer]) => ({ question, answer })));

  return (
    <PageShell>
      {faqSchema ? <StructuredData data={faqSchema} /> : null}

      <Hero />

      <Section className="border-t-0">
        <GapStatement />
      </Section>

      {/* The loop, told as the department engine being taken apart and rebuilt */}
      <EngineFilm embedded />

      <Section
        tone="panel"
        title="Where AI usually fits"
        intro="Every business is different, so we start by watching the work. These are the places we find it most often."
      >
        <FunctionExplorer />
      </Section>

      <Section title="What changes when the engineers sit with you">
        <Comparison />
      </Section>

      <Section
        tone="panel"
        title="Adoption is our job"
        intro="Shipping is half the work. We measure who uses it, listen to what they tell us, and keep improving it until the numbers prove it works."
      >
        <Adoption />
      </Section>

      <Section title={OWNERSHIP.heading}>
        <TermList items={OWNERSHIP.items} />
      </Section>

      <Section title="Who you'll work with">
        <Founders />
      </Section>

      <Section title="Some of our work" intro="Clients stay anonymous until they approve being named.">
        <CaseStudyRows limit={3} />
        <p className="mt-10">
          <Link href="/case-studies" className={textLink}>
            All case studies
          </Link>
        </p>
      </Section>

      <Section title="Who we work with">
        <TermList items={CLIENT_TYPES} />
      </Section>

      <Section title="Questions buyers ask us">
        <FaqList />
      </Section>

      <CtaBand />
    </PageShell>
  );
}
