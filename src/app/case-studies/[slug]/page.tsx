import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { CtaBand } from "@/components/site/blocks";
import { PageShell } from "@/components/site/PageShell";
import { CASE_STUDIES, getCaseStudy } from "@/content/case-studies";
import { PHASES } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  return {
    title: `${study.client}: case study`,
    description: study.headline,
    alternates: { canonical: `/case-studies/${study.slug}` },
  };
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 border-t border-rule py-8 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-12">
      <h2 className="text-[0.9375rem] font-medium text-ink-muted">{label}</h2>
      <div className="max-w-2xl text-lg">{children}</div>
    </div>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();

  const phases = PHASES.filter((phase) => study.phases[phase.name]);

  return (
    <PageShell>
      <section className="pt-14 pb-12 sm:pt-20">
        <Container>
          <Link href="/case-studies" className="text-[0.9375rem] text-ink-muted hover:text-ink">
            Case studies
          </Link>
          <h1 className="type-display mt-6 max-w-4xl">{study.client}</h1>
          <p className="type-lede mt-6 max-w-2xl text-ink-muted">{study.headline}</p>
          <p className="mt-6 text-[0.9375rem] text-ink-faint">
            {study.status ? <span className="text-amber">{study.status}, </span> : null}
            {study.region}, client anonymised
          </p>
        </Container>
      </section>

      <Container className="pb-20">
        <div className="border-b border-rule">
          <Row label="Context">{study.context}</Row>
          {study.gap ? <Row label="The gap">{study.gap}</Row> : null}
          <Row label="How we worked">{study.howWeWorked}</Row>
          {study.built ? (
            <Row label="What we built">
              <ul className="flex flex-col gap-3">
                {study.built.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="mt-[0.8em] h-px w-3 shrink-0 bg-ink" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Row>
          ) : null}
          {phases.length ? (
            <Row label="The loop">
              <ol className="flex flex-col gap-4">
                {phases.map((phase) => (
                  <li key={phase.name}>
                    <span className="font-medium">{phase.name}.</span>{" "}
                    <span className="text-ink-muted">{study.phases[phase.name]}</span>
                  </li>
                ))}
              </ol>
            </Row>
          ) : null}
          <Row label="Outcome">
            {study.outcome ?? (
              <span className="text-ink-muted">
                {study.status === "In progress"
                  ? "The engagement is running. Results will be published with the client's approval."
                  : "Outcome figures are being confirmed with the client before we publish them."}
              </span>
            )}
          </Row>
          {study.stack ? (
            <Row label="Stack">
              <p className="text-ink-muted">{study.stack.join(", ")}</p>
            </Row>
          ) : null}
        </div>
      </Container>

      <CtaBand />
    </PageShell>
  );
}
