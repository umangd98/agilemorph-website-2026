import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { CaseStudyRows, CtaBand } from "@/components/site/blocks";
import { PageShell } from "@/components/site/PageShell";
import { Section, TermList } from "@/components/site/Section";
import { FOUNDER_TRACK } from "@/content/case-studies";

export const metadata: Metadata = {
  title: "Case studies",
  description:
    "Engagements where Agilemorph's engineers embedded with the team, found where AI fits, built it in production and measured whether people used it.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <PageShell>
      <section className="pt-14 pb-16 sm:pt-20">
        <Container>
          <h1 className="type-display max-w-4xl">Work from the field</h1>
          <p className="type-lede mt-8 max-w-2xl text-ink-muted">
            Engagements where our engineers embedded with the team, found where AI fits, built it
            in production and measured whether people used it. Clients stay anonymous until they
            approve being named.
          </p>
        </Container>
      </section>

      <Section>
        <CaseStudyRows />
      </Section>

      <Section
        title="What our founders have built"
        intro="Before and alongside Agilemorph. Our founders' own experience, not Agilemorph client work."
      >
        <TermList items={FOUNDER_TRACK} />
      </Section>

      <CtaBand />
    </PageShell>
  );
}
