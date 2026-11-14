import type { Metadata } from "next";
import Link from "next/link";

import { StructuredData } from "@/components/StructuredData";
import { Adoption } from "@/components/site/Adoption";
import {
  CaseStudyRows,
  Comparison,
  CtaBand,
  FaqList,
  Founders,
  GapStatement,
  PhaseScroll,
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

export default function HomePage() {
  const faqSchema = faqPageSchema(FAQ.map(([question, answer]) => ({ question, answer })));

  return (
    <PageShell>
      {faqSchema ? <StructuredData data={faqSchema} /> : null}

      <Hero />

      <Section className="border-t-0">
        <GapStatement />
      </Section>

      <Section title="What changes when the engineers sit with you">
        <Comparison />
      </Section>

      <Section
        title="How an engagement runs"
        intro="Five phases. Each one ends with a decision, and you continue only if the last one delivered."
      >
        <PhaseScroll />
        <p className="mt-10">
          <Link
            href="/how-we-work"
            className="font-medium text-green underline decoration-green/30 underline-offset-4 hover:decoration-green"
          >
            The full engagement model
          </Link>
        </p>
      </Section>

      <Section
        tone="panel"
        title="Adoption is our job"
        intro="Shipping is half the work. We measure who uses it and how fresh the data is, and we stay until the numbers prove it works."
      >
        <Adoption />
      </Section>

      <Section title="Recent engagements" intro="Clients stay anonymous until they approve being named.">
        <CaseStudyRows />
      </Section>

      <Section title="Who you'll work with">
        <Founders />
      </Section>

      <Section title={OWNERSHIP.heading}>
        <TermList items={OWNERSHIP.items} />
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
