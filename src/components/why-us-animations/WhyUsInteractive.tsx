"use client";

import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

import type { WhyUsItem } from "@/sanity/types";

import { WhyUsIcon } from "./WhyUsIcon";

type WhyUsInteractiveProps = {
  items: WhyUsItem[];
};

export function WhyUsInteractive({ items }: WhyUsInteractiveProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const pillars = useMemo(
    () =>
      items.map((item, index) => ({
        item,
        index,
        step: String(index + 1).padStart(2, "0"),
      })),
    [items],
  );

  const active = pillars[activeIndex] ?? pillars[0];

  if (!items.length || !active) return null;

  const highlights = active.item.highlights ?? [];

  const selectIndex = (index: number) => setActiveIndex(index);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <style>{`
        @keyframes why-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .why-content-swap { animation: why-fade-in 0.35s ease-out both; }
        }
      `}</style>
      <div className="border-b border-border bg-background px-4 py-4 sm:px-6">
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto pb-1 snap-x snap-mandatory sm:mx-0 sm:gap-3 sm:overflow-visible sm:pb-0">
          {pillars.map((p, i) => {
            const lit = activeIndex === i;
            return (
              <button
                key={i}
                type="button"
                className={`group flex min-h-[44px] min-w-[4.5rem] shrink-0 snap-start items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-w-0 sm:flex-1 sm:gap-3 sm:px-4 sm:py-3 ${
                  lit
                    ? "border-primary bg-primary/10 shadow-[0_4px_20px_color-mix(in_srgb,var(--color-primary)_12%,transparent)]"
                    : "border-border bg-background hover:border-primary/20 hover:bg-primary/5"
                }`}
                onClick={() => selectIndex(i)}
                aria-pressed={lit}
                aria-label={`${p.item.title}: ${p.item.description}`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-heading text-xs font-bold transition-colors duration-300 sm:h-9 sm:w-9 sm:text-sm ${
                    lit ? "bg-primary text-background" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {p.step}
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span
                    className={`block truncate font-heading text-sm font-bold ${
                      lit ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {p.item.title}
                  </span>
                </span>
                <span className="ml-auto sm:hidden">
                  <WhyUsIcon item={p.item} size="sm" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div key={activeIndex} className="why-content-swap">
          <div className="mb-3 flex items-center gap-3">
            <WhyUsIcon item={active.item} size="md" />
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Pillar {active.step}
              </p>
              <h3 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                {active.item.title}
              </h3>
            </div>
          </div>
          <p className="max-w-2xl font-body text-sm leading-relaxed text-muted-foreground sm:text-base">
            {active.item.description}
          </p>
          {highlights.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {highlights.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-body text-xs font-semibold text-primary"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>

        {pillars.length > 1 ? (
          <button
            type="button"
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2 font-body text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary sm:w-auto lg:w-auto"
            onClick={() => selectIndex((activeIndex + 1) % pillars.length)}
            aria-label="Next pillar"
          >
            Next
            <ArrowRight size={14} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
