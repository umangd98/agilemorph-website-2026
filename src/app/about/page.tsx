import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { CtaBand, Explainer, Founders } from "@/components/site/blocks";
import { PageShell } from "@/components/site/PageShell";
import { Section } from "@/components/site/Section";
import { CERTIFICATIONS } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Agilemorph is one of India's first forward deployed engineering firms, based in Nagpur with clients in India, the US and Africa.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PageShell>
      <section className="pt-14 pb-16 sm:pt-20 sm:pb-20">
        <Container>
          <h1 className="type-display max-w-4xl">One of India&apos;s first forward deployed engineering firms.</h1>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
            <p className="type-lede max-w-xl text-ink-muted">
              We find where AI fits in your business, build it into the systems you already run,
              ship it, make sure your people use it, and keep improving it from their feedback.
            </p>
            <Explainer className="self-start" />
          </div>
        </Container>
      </section>

      <Section title="Where we come from">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <p className="type-lede">
            We are based in Nagpur, India, with clients in India, the US
            and Africa. Our work happens inside client businesses, alongside
            their teams.
          </p>
          <p className="type-lede text-ink-muted">
            We are a services firm with an R&amp;D arm. A share of what our engineering work earns
            funds the products we build, and CAT is the first one we have released.
          </p>
        </div>
      </Section>

      <Section title="The founders">
        <Founders />
      </Section>

      <Section title="Certified across the stack" intro="We pick the tool for the workflow, and write the code when no-code is the wrong fit.">
        <dl className="grid grid-cols-2 border-b border-rule sm:grid-cols-4 lg:grid-cols-7">
          {CERTIFICATIONS.map(([name, level]) => (
            <div key={name} className="border-t border-rule py-5 pr-4">
              <dt className="type-heading">{name}</dt>
              <dd className="mt-1 text-sm text-ink-muted">{level}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <CtaBand heading="Talk to the people who'll build it." />
    </PageShell>
  );
}
