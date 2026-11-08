import Link from "next/link";
import { ArrowRight, UserCheck } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import type { PhaseBlock, PhaseItem } from "@/sanity/types";

import { FdeSection } from "./FdeSection";

type PhaseFlowSectionProps = {
  id?: string;
  index: string;
  block?: PhaseBlock;
  /**
   * "flow": compact horizontal chain (homepage, architecture).
   * "timeline": vertical list with every detail point (How we work).
   */
  layout?: "flow" | "timeline";
};

function StepNumber({ n, human }: { n: number; human?: boolean }) {
  return (
    <span
      className={`tnum inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium ${
        human
          ? "bg-human/10 text-human ring-1 ring-human/30"
          : "bg-signal/10 text-signal ring-1 ring-signal/25"
      }`}
    >
      {String(n).padStart(2, "0")}
    </span>
  );
}

function HumanTag() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-human/30 bg-human/10 px-2.5 py-1 font-mono text-[0.6875rem] leading-none text-human">
      <UserCheck size={12} aria-hidden />
      A person decides
    </span>
  );
}

function DecisionChip({ text }: { text: string }) {
  return (
    <p className="mt-4 border-t border-dashed border-line pt-3 font-mono text-[0.75rem] leading-snug text-fg-muted">
      <span className="text-signal">Decision point:</span> {text}
    </p>
  );
}

function FlowCard({ phase, n, isLast }: { phase: PhaseItem; n: number; isLast: boolean }) {
  return (
    <div className="relative flex h-full min-w-0 flex-col">
      <div
        className={`flex h-full flex-col rounded-2xl border bg-bg-elevated p-5 ${
          phase.humanInLoop ? "border-human/40" : "border-line"
        }`}
      >
        <StepNumber n={n} human={phase.humanInLoop} />
        <h3 className="mt-4 text-base font-medium leading-snug tracking-[-0.01em] text-fg">
          {phase.title}
        </h3>
        {phase.summary ? (
          <p className="mt-2 text-pretty text-sm leading-relaxed text-fg-muted">{phase.summary}</p>
        ) : null}
        {phase.humanInLoop ? (
          <div className="mt-4">
            <HumanTag />
          </div>
        ) : null}
        {phase.decision ? <DecisionChip text={phase.decision} /> : null}
      </div>
      {!isLast ? (
        <>
          {/* Connector: right-pointing between columns on large screens, down on small. */}
          <span
            aria-hidden
            className="absolute -right-[0.95rem] top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg text-signal lg:flex"
          >
            <ArrowRight size={12} />
          </span>
          <span aria-hidden className="mx-auto h-4 w-px bg-line lg:hidden" />
        </>
      ) : null}
    </div>
  );
}

function TimelineItem({ phase, n, isLast }: { phase: PhaseItem; n: number; isLast: boolean }) {
  return (
    <li className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 sm:gap-x-6">
      <div className="flex flex-col items-center">
        <StepNumber n={n} human={phase.humanInLoop} />
        {!isLast ? <span aria-hidden className="mt-2 w-px flex-1 bg-line" /> : null}
      </div>
      <div className={`min-w-0 ${isLast ? "" : "pb-10"}`}>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-medium leading-snug tracking-[-0.01em] text-fg">
            {phase.title}
          </h3>
          {phase.humanInLoop ? <HumanTag /> : null}
        </div>
        {phase.summary ? (
          <p className="mt-2 max-w-2xl text-pretty text-base leading-relaxed text-fg-muted">
            {phase.summary}
          </p>
        ) : null}
        {phase.details?.length ? (
          <ul className="mt-4 grid max-w-3xl gap-2 sm:grid-cols-2">
            {phase.details.map((detail) => (
              <li
                key={detail}
                className="flex gap-2 text-[0.9375rem] leading-relaxed text-fg-muted"
              >
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                <span className="min-w-0">{detail}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {phase.decision ? (
          <div className="max-w-2xl">
            <DecisionChip text={phase.decision} />
          </div>
        ) : null}
      </div>
    </li>
  );
}

export function PhaseFlowSection({ id, index, block, layout = "flow" }: PhaseFlowSectionProps) {
  const phases = block?.phases ?? [];
  if (!phases.length) return null;

  const columns =
    phases.length >= 6
      ? "lg:grid-cols-6"
      : phases.length === 5
        ? "lg:grid-cols-5"
        : phases.length === 4
          ? "lg:grid-cols-4"
          : "lg:grid-cols-3";

  return (
    <FdeSection
      id={id}
      index={index}
      eyebrow={block?.eyebrow}
      heading={block?.heading}
      intro={block?.intro}
    >
      {layout === "timeline" ? (
        <Reveal>
          <ol className="flex flex-col">
            {phases.map((phase, i) => (
              <TimelineItem
                key={phase.title}
                phase={phase}
                n={i + 1}
                isLast={i === phases.length - 1}
              />
            ))}
          </ol>
        </Reveal>
      ) : (
        <ol className={`grid grid-cols-1 gap-0 lg:gap-6 ${columns}`}>
          {phases.map((phase, i) => (
            <Reveal as="li" key={phase.title} delay={i * 0.06} className="min-w-0">
              <FlowCard phase={phase} n={i + 1} isLast={i === phases.length - 1} />
            </Reveal>
          ))}
        </ol>
      )}

      {block?.note || block?.cta ? (
        <Reveal>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            {block?.note ? (
              <p className="inline-flex items-center gap-2 font-mono text-sm text-fg">
                <span aria-hidden className="h-2 w-2 rounded-full bg-signal" />
                {block.note}
              </p>
            ) : null}
            {block?.cta ? (
              <Link
                href={block.cta.href}
                className="group inline-flex items-center gap-2 text-sm font-medium text-signal"
              >
                {block.cta.label}
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            ) : null}
          </div>
        </Reveal>
      ) : null}
    </FdeSection>
  );
}
