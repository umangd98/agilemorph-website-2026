import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { BookButton } from "@/components/site/Button";
import { Comparison, CtaBand, Explainer, GapStatement, LoopPipeline } from "@/components/site/blocks";
import { Adoption } from "@/components/site/Adoption";
import { ConsoleDemo } from "@/components/site/ConsoleDemo";
import { PageShell } from "@/components/site/PageShell";
import { Section, TermList } from "@/components/site/Section";
import {
  ADOPTION,
  CAPABILITIES,
  CERTIFICATIONS,
  DISCOVERY_AUDIT,
  ENGAGEMENTS,
  OUR_READ,
  OWNERSHIP,
} from "@/content/site";

export const metadata: Metadata = {
  title: "How we work: Forward Deployed Engineering",
  description:
    "Forward Deployed Engineering, explained. Our engineers embed with your teams, build AI into the systems you already run or from scratch, and stay until it's used.",
  alternates: { canonical: "/how-we-work" },
};

export default function HowWeWorkPage() {
  return (
    <PageShell>
      <section className="pt-14 pb-16 sm:pt-20 sm:pb-20">
        <Container>
          <h1 className="type-display max-w-4xl">Find it, build it, ship it, get it used, make it better.</h1>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
            <Explainer className="self-start" />
            <nav aria-label="On this page" className="text-[0.9375rem]">
              <ul className="flex flex-col border-b border-rule">
                {[
                  ["The loop", "#phases"],
                  ["What the discovery audit covers", "#discovery-audit"],
                  ["What we build", "#what-we-build"],
                  ["How engagements are structured", "#engagement-model"],
                ].map(([label, href]) => (
                  <li key={href} className="border-t border-rule">
                    <a href={href} className="flex py-3 text-ink-muted hover:text-ink">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </section>

      <Section>
        <GapStatement />
      </Section>

      <Section title={OUR_READ.heading}>
        <div className="flex max-w-2xl flex-col gap-5 type-lede text-ink-muted">
          {OUR_READ.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <section aria-label="An example architecture" className="bg-panel py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            <div>
              <h2 className="type-title max-w-xl">From wherever the work happens to a record in your system</h2>
              <p className="type-lede mt-6 max-w-lg text-ink-muted">
                A pattern we build often, in sales, finance, support and operations alike. AI
                captures the update where it happens, checks it against the system of record, asks a
                person to confirm anything uncertain, and writes the record through the API.
              </p>
            </div>
            <ConsoleDemo />
          </div>
        </Container>
      </section>

      <Section title="A traditional IT vendor, and how we work instead">
        <Comparison />
      </Section>

      <Section
        id="phases"
        title="Find, build, ship, adopt, iterate"
        intro="Each stage ends with a decision. You continue only if the previous one delivered."
      >
        <LoopPipeline showDetails />
      </Section>

      <Section
        id="discovery-audit"
        title="What the discovery audit covers"
        intro="Fixed scope, fixed fee, alongside your teams."
      >
        <TermList items={DISCOVERY_AUDIT} />
      </Section>

      <Section
        title="Adoption is our job"
        intro="We measure who uses it, listen to what they tell us, and keep improving it until the numbers prove it works."
      >
        <Adoption />
        <TermList items={ADOPTION} className="mt-16" />
      </Section>

      <Section
        id="what-we-build"
        title="What we build during an engagement"
        intro="Chosen for the workflow, built inside your stack. No-code where it fits, Python, TypeScript or Java where it doesn't."
      >
        <ul className="border-b border-rule">
          {CAPABILITIES.map((capability) => (
            <li
              key={capability.name}
              className="grid gap-2 border-t border-rule py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-10"
            >
              <h3 className="type-heading">{capability.name}</h3>
              <div>
                <p>{capability.body}</p>
                <p className="mt-2 text-[0.9375rem] text-ink-muted">{capability.tools}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-3xl text-ink-muted">
          Certified with{" "}
          {CERTIFICATIONS.map(([name, level], i) => (
            <span key={name}>
              <span className="text-ink">{name}</span> ({level.toLowerCase()})
              {i < CERTIFICATIONS.length - 2 ? ", " : i === CERTIFICATIONS.length - 2 ? " and " : "."}
            </span>
          ))}
        </p>
      </Section>

      <Section id="engagement-model" title="How engagements are structured" intro="Two entry points, one model. We scope and quote after the audit.">
        <div className="grid gap-px overflow-hidden rounded-panel bg-rule ring-1 ring-rule lg:grid-cols-2">
          {ENGAGEMENTS.map((engagement) => (
            <article key={engagement.name} className="flex flex-col bg-paper p-8 sm:p-10">
              <p className="text-[0.9375rem] text-ink-muted">{engagement.forWhom}</p>
              <h3 className="type-title mt-2 text-[2rem] sm:text-[2.25rem]">{engagement.name}</h3>
              <ol className="mt-8 flex flex-1 flex-col gap-5">
                {engagement.steps.map(([name, detail], i) => (
                  <li key={name} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
                    <span className="font-display font-semibold text-green tabular-nums">{i + 1}</span>
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="mt-1 text-[0.9375rem] text-ink-muted">{detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-8 border-t border-dashed border-rule pt-5 text-[0.9375rem] text-ink-muted">
                {engagement.note}
              </p>
              <BookButton className="mt-6 self-start">{engagement.cta}</BookButton>
            </article>
          ))}
        </div>
      </Section>

      <Section title={OWNERSHIP.heading}>
        <TermList items={OWNERSHIP.items} />
      </Section>

      <CtaBand body="Every engagement starts with a discovery audit. Book a call and we'll tell you what yours would cover." />
    </PageShell>
  );
}
