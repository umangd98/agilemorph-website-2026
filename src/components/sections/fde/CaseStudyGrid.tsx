import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import type { CaseStudySummary } from "@/sanity/types";

export function caseStudyHref(slug: string) {
  return `/case-studies/${slug}`;
}

export function CaseStudyCard({ study }: { study: CaseStudySummary }) {
  return (
    <Link
      href={caseStudyHref(study.slug)}
      className="group flex h-full flex-col rounded-2xl border border-line bg-bg-elevated p-6 transition-colors duration-200 hover:border-signal/40"
    >
      <div className="flex flex-wrap items-center gap-2">
        {study.status ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[0.6875rem] leading-none text-fg-muted">
            <span
              aria-hidden
              className={`h-1.5 w-1.5 rounded-full ${
                study.status === "In progress" ? "bg-human" : "bg-signal"
              }`}
            />
            {study.status}
          </span>
        ) : null}
        {(study.tags ?? []).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full border border-line px-2.5 py-1 font-mono text-[0.6875rem] leading-none text-fg-muted"
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="mt-5 text-lg font-medium leading-snug tracking-[-0.01em] text-fg">
        {study.title}
      </h3>
      {study.headline ? (
        <p className="mt-2 text-[0.9375rem] font-medium leading-snug text-fg">
          {study.headline}
        </p>
      ) : null}
      {study.summary ? (
        <p className="mt-3 flex-1 text-pretty text-[0.9375rem] leading-relaxed text-fg-muted">
          {study.summary}
        </p>
      ) : (
        <span className="flex-1" />
      )}
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-signal">
        Read the case study
        <ArrowRight
          size={15}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

export function CaseStudyGrid({ items }: { items: CaseStudySummary[] }) {
  if (!items.length) return null;

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((study, i) => (
        <Reveal as="li" key={study._id} delay={i * 0.05} className="min-w-0">
          <CaseStudyCard study={study} />
        </Reveal>
      ))}
    </ul>
  );
}
