import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";
import { StructuredData } from "@/components/StructuredData";
import { BookButton, ButtonLink } from "@/components/site/Button";
import {
  CaseStudyRows,
  Comparison,
  CtaBand,
  Explainer,
  FaqList,
  Founders,
  GapStatement,
  PhaseTrack,
} from "@/components/site/blocks";
import { FloorToSystem } from "@/components/site/FloorToSystem";
import { PageShell } from "@/components/site/PageShell";
import { Section, TermList } from "@/components/site/Section";
import { CLIENT_TYPES, FAQ, ONE_LINER, OWNERSHIP, PROOF, SITE_DESCRIPTION, SITE_TITLE } from "@/content/site";
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

      <section className="pt-12 pb-14 sm:pt-16 sm:pb-16">
        <Container>
          <h1 className="type-display max-w-5xl">
            AI that actually gets used. Built inside the systems you already run.
          </h1>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <p className="type-lede max-w-xl text-ink-muted">{ONE_LINER}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <BookButton />
                <ButtonLink href="/how-we-work">See how we work</ButtonLink>
              </div>
            </div>
            <Explainer className="self-start" />
          </div>
          <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-2 border-t border-rule pt-5 text-[0.9375rem] text-ink-muted">
            {PROOF.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-label="An example: from a WhatsApp message to an ERP record" className="bg-panel py-16 sm:py-20">
        <Container>
          <FloorToSystem />
        </Container>
      </section>

      <Section>
        <GapStatement />
      </Section>

      <Section title="What changes when the engineers sit with you">
        <Comparison />
      </Section>

      <Section
        title="How an engagement runs"
        intro="Five phases. Each one ends with a decision, and you continue only if the last one delivered."
      >
        <PhaseTrack />
        <p className="mt-8">
          <Link href="/how-we-work" className="font-medium text-green underline decoration-green/30 underline-offset-4 hover:decoration-green">
            The full engagement model
          </Link>
        </p>
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
