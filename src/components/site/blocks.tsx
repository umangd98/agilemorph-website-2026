import Image from "next/image";
import Link from "next/link";

import { CASE_STUDIES } from "@/content/case-studies";
import { FOUNDERS, GAP, PHASES } from "@/content/site";

export { Explainer } from "./Explainer";
export { ComparisonSwitch as Comparison, CtaBand, FaqAccordion as FaqList, PhaseScroll } from "./interactive";

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
              <span aria-hidden className="relative flex h-2 w-2 shrink-0 translate-y-[-2px]">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-50 [animation-duration:2.4s] motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
              </span>
              <span className="text-lg">{symptom}</span>
            </li>
          ))}
        </ul>
        <p className="type-heading mt-10">{GAP.closing}</p>
      </div>
    </div>
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
            className="group relative grid gap-2 py-7 before:absolute before:inset-x-0 before:-top-px before:h-px before:origin-left before:scale-x-0 before:bg-green before:transition-transform before:duration-500 before:ease-out hover:before:scale-x-100 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_8rem] md:items-baseline md:gap-8"
          >
            <h3 className="type-heading transition-[color,transform] duration-300 group-hover:translate-x-2 group-hover:text-green">
              {study.client}
            </h3>
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
