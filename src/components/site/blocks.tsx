import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/Container";
import { CASE_STUDIES } from "@/content/case-studies";
import {
  COMPANY,
  COMPARISON,
  FAQ,
  FDE_EXPLAINER,
  FOUNDERS,
  GAP,
  PHASES,
} from "@/content/site";
import { cn } from "@/lib/utils";

import { BookButton } from "./Button";

/** The plain-English definition. Shown in the first screen of every page that names FDE. */
export function Explainer({ className }: { className?: string }) {
  return (
    <div className={cn("border-l-2 border-green pl-5", className)}>
      <p className="text-sm font-medium text-ink">What forward deployed engineering means</p>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">{FDE_EXPLAINER}</p>
    </div>
  );
}

export function GapStatement() {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
      <div>
        <h2 className="type-title max-w-xl">{GAP.heading}</h2>
        <p className="type-lede mt-6 max-w-xl text-ink-muted">{GAP.body}</p>
      </div>
      <div>
        <ul className="border-b border-rule">
          {GAP.symptoms.map((symptom) => (
            <li key={symptom} className="flex items-baseline gap-4 border-t border-rule py-5">
              <span aria-hidden className="h-2 w-2 shrink-0 translate-y-[-2px] rounded-full bg-red" />
              <span className="text-lg">{symptom}</span>
            </li>
          ))}
        </ul>
        <p className="type-heading mt-10">{GAP.closing}</p>
      </div>
    </div>
  );
}

export function Comparison() {
  return (
    <>
      {/* Phones: one block per question, our answer last and strongest. */}
      <dl className="border-b border-rule md:hidden">
        {COMPARISON.rows.map(([label, before, after]) => (
          <div key={label} className="border-t border-rule py-5">
            <dt className="text-[0.9375rem] font-medium">{label}</dt>
            <dd className="mt-2 text-ink-muted">
              <span className="sr-only">{COMPARISON.before}: </span>
              <s className="decoration-ink-faint">{before}</s>
            </dd>
            <dd className="mt-1 text-lg font-medium leading-snug text-green-deep">
              <span className="sr-only">{COMPARISON.after}: </span>
              {after}
            </dd>
          </div>
        ))}
      </dl>
      <table className="hidden w-full border-collapse text-left md:table">
        <caption className="sr-only">
          {COMPARISON.before} compared with {COMPARISON.after}
        </caption>
        <thead>
          <tr>
            <td className="w-[24%] pb-4" />
            <th scope="col" className="w-[38%] pb-4 pr-6 text-[0.9375rem] font-medium text-ink-muted">
              {COMPARISON.before}
            </th>
            <th scope="col" className="w-[38%] pb-4 text-[0.9375rem] font-medium text-green-deep">
              {COMPARISON.after}
            </th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON.rows.map(([label, before, after]) => (
            <tr key={label} className="border-t border-rule align-top">
              <th scope="row" className="py-5 pr-6 text-[0.9375rem] font-medium">
                {label}
              </th>
              <td className="py-5 pr-6 text-ink-muted">{before}</td>
              <td className="py-5 text-lg font-medium leading-snug">{after}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/** The five phases as a horizontal track. Each ends with the client's decision. */
export function PhaseTrack() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-panel bg-rule ring-1 ring-rule md:grid-cols-5">
      {PHASES.map((phase, i) => (
        <li key={phase.name} className="flex flex-col bg-paper p-6">
          <span className="font-display text-3xl font-semibold text-green tabular-nums">{i + 1}</span>
          <h3 className="type-heading mt-4">{phase.name}</h3>
          <p className="mt-3 flex-1 text-[0.9375rem] text-ink-muted">{phase.summary}</p>
          <p className="mt-6 border-t border-dashed border-rule pt-4 text-sm">
            <span className="text-ink-faint">You decide: </span>
            {phase.decision}
          </p>
        </li>
      ))}
    </ol>
  );
}

/** The five phases in full, for How we work. */
export function PhaseList() {
  return (
    <ol className="border-b border-rule">
      {PHASES.map((phase, i) => (
        <li
          key={phase.name}
          className="grid gap-4 border-t border-rule py-10 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1.2fr)] md:gap-8"
        >
          <span className="font-display text-4xl font-semibold text-green tabular-nums">{i + 1}</span>
          <div>
            <h3 className="type-heading">{phase.name}</h3>
            <p className="mt-3 text-ink-muted">{phase.summary}</p>
          </div>
          <div>
            <ul className="flex flex-col gap-2">
              {phase.details.map((detail) => (
                <li key={detail} className="flex gap-3">
                  <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-ink" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm">
              <span className="text-ink-faint">You decide: </span>
              {phase.decision}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Founders() {
  return (
    <div className="grid gap-16 md:grid-cols-2 md:gap-12">
      {FOUNDERS.map((founder) => (
        <article key={founder.name}>
          <p className="font-display text-5xl font-semibold tracking-[-0.035em] sm:text-6xl">{founder.trait}.</p>
          <div className="mt-8 flex items-center gap-4">
            <Image
              src={founder.photo}
              alt={founder.name}
              width={72}
              height={72}
              className="h-[72px] w-[72px] rounded-full bg-panel object-cover object-top"
            />
            <div>
              <h3 className="type-heading">{founder.name}</h3>
              <p className="text-[0.9375rem] text-ink-muted">{founder.role}</p>
            </div>
          </div>
          <p className="mt-6 max-w-lg">{founder.bio}</p>
          <p className="mt-4 max-w-lg text-[0.9375rem] text-ink-muted">{founder.stack}</p>
        </article>
      ))}
    </div>
  );
}

export function CaseStudyRows({ limit }: { limit?: number }) {
  const studies = limit ? CASE_STUDIES.slice(0, limit) : CASE_STUDIES;
  return (
    <ul className="border-b border-rule">
      {studies.map((study) => (
        <li key={study.slug} className="border-t border-rule">
          <Link
            href={`/case-studies/${study.slug}`}
            className="group grid gap-2 py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_8rem] md:items-baseline md:gap-8"
          >
            <h3 className="type-heading group-hover:text-green">{study.client}</h3>
            <p className="text-ink-muted">{study.headline}</p>
            <p className="text-sm text-ink-faint md:text-right">
              {study.status ? (
                <span className="text-amber">{study.status}, </span>
              ) : null}
              {study.region}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function FaqList() {
  return (
    <div className="border-b border-rule">
      {FAQ.map(([question, answer]) => (
        <details key={question} className="group border-t border-rule">
          <summary className="flex list-none items-baseline justify-between gap-6 py-5 text-lg font-medium [&::-webkit-details-marker]:hidden">
            {question}
            <span
              aria-hidden
              className="shrink-0 font-display text-2xl leading-none text-green transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="max-w-2xl pb-6 text-ink-muted">{answer}</p>
        </details>
      ))}
    </div>
  );
}

/** Closing call to action on a green band. */
export function CtaBand({
  heading = "Let's pick one workflow and prove it on site.",
  body = "Book a discovery call. We'll tell you where AI fits in your operation and what a pilot would take.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section className="bg-green text-white">
      <Container className="grid gap-10 py-20 sm:py-24 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <h2 className="type-title max-w-2xl">{heading}</h2>
          <p className="type-lede mt-5 max-w-xl text-white/85">{body}</p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <BookButton variant="inverse" />
          <a
            href={`mailto:${COMPANY.email}`}
            className="text-[0.9375rem] text-white/90 underline decoration-white/40 underline-offset-4 hover:decoration-white"
          >
            or email {COMPANY.email}
          </a>
        </div>
      </Container>
    </section>
  );
}
