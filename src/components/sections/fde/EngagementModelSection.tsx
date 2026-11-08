import { ArrowRight } from "lucide-react";

import { CtaAction } from "@/components/CtaAction";
import { Reveal } from "@/components/Reveal";
import type { EngagementBlock } from "@/sanity/types";

import { FdeSection } from "./FdeSection";

type EngagementModelSectionProps = {
  id?: string;
  index: string;
  block?: EngagementBlock;
};

/** Engagement structure by scope. Shows the shape of an engagement, never prices. */
export function EngagementModelSection({ id, index, block }: EngagementModelSectionProps) {
  const tracks = block?.tracks ?? [];
  if (!tracks.length) return null;

  return (
    <FdeSection
      id={id}
      index={index}
      eyebrow={block?.eyebrow}
      heading={block?.heading}
      intro={block?.intro}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {tracks.map((track, i) => (
          <Reveal key={track.name} delay={i * 0.08} className="min-w-0">
            <article
              className={`flex h-full flex-col rounded-2xl border p-6 sm:p-8 ${
                i === 0 ? "border-signal/30 bg-bg-elevated" : "border-line bg-bg-elevated"
              }`}
            >
              {track.audience ? <p className="syslabel">{track.audience}</p> : null}
              <h3 className="mt-3 text-2xl font-medium leading-tight tracking-[-0.02em] text-fg">
                {track.name}
              </h3>
              {track.steps?.length ? (
                <ol className="mt-6 flex flex-col gap-4">
                  {track.steps.map((step, n) => (
                    <li key={step.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
                      <span className="tnum pt-0.5 font-mono text-xs text-signal">
                        {String(n + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium leading-snug text-fg">{step.title}</p>
                        {step.description ? (
                          <p className="mt-1 text-[0.9375rem] leading-relaxed text-fg-muted">
                            {step.description}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              ) : null}
              {track.note ? (
                <p className="mt-6 border-t border-dashed border-line pt-4 font-mono text-[0.8125rem] leading-relaxed text-fg-muted">
                  {track.note}
                </p>
              ) : null}
              {track.cta ? (
                <div className="mt-auto pt-6">
                  <CtaAction
                    cta={track.cta}
                    className="group inline-flex items-center gap-2 rounded-full bg-signal px-5 py-3 font-body text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-90"
                  >
                    {track.cta.label}
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </CtaAction>
                </div>
              ) : null}
            </article>
          </Reveal>
        ))}
      </div>
    </FdeSection>
  );
}
