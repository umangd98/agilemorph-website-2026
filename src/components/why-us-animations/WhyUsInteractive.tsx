"use client";

import { Award, ArrowRight, Handshake, Lightbulb, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

import type { WhyUsItem } from "@/sanity/types";

import { ExpertiseAnim } from "./ExpertiseAnim";
import { InnovationAnim } from "./InnovationAnim";
import { PartnershipAnim } from "./PartnershipAnim";
import { ProfessionalismAnim } from "./ProfessionalismAnim";

const CYCLE_MS = 5000;

const FALLBACK_ICONS: LucideIcon[] = [Lightbulb, ShieldCheck, Award, Handshake];

const PILLAR_ANIMS: ComponentType<{ active?: boolean }>[] = [
  InnovationAnim,
  ProfessionalismAnim,
  ExpertiseAnim,
  PartnershipAnim,
];

const PILLAR_CHIPS: [string, string][] = [
  ["Future-ready", "Bold ideas"],
  ["Trusted delivery", "On every project"],
  ["Deep domain knowledge", "Tailored solutions"],
  ["Long-term partnership", "Aligned goals"],
];

type WhyUsInteractiveProps = {
  items: WhyUsItem[];
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function WhyUsInteractive({ items }: WhyUsInteractiveProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [cycleProgress, setCycleProgress] = useState(0);
  const cycleStart = useRef(Date.now());
  const rafRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();

  const pillars = useMemo(
    () =>
      items.map((item, index) => ({
        item,
        index,
        Icon: FALLBACK_ICONS[index % FALLBACK_ICONS.length]!,
        chips: PILLAR_CHIPS[index % PILLAR_CHIPS.length]!,
        Anim: PILLAR_ANIMS[index % PILLAR_ANIMS.length]!,
        step: String(index + 1).padStart(2, "0"),
      })),
    [items],
  );

  const active = pillars[activeIndex] ?? pillars[0];
  const ActiveAnim = active?.Anim ?? InnovationAnim;

  const advanceCycle = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
    cycleStart.current = Date.now();
    setCycleProgress(0);
  }, [items.length]);

  useEffect(() => {
    if (hovering || reducedMotion || items.length <= 1) return;

    const tick = () => {
      const elapsed = Date.now() - cycleStart.current;
      const progress = Math.min(elapsed / CYCLE_MS, 1);
      setCycleProgress(progress);
      if (progress >= 1) advanceCycle();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hovering, activeIndex, advanceCycle, reducedMotion, items.length]);

  const selectIndex = (index: number) => {
    setActiveIndex(index);
    cycleStart.current = Date.now();
    setCycleProgress(0);
  };

  if (!items.length || !active) return null;

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <style>{`
        @keyframes why-stage-in {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes why-detail-in {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .why-stage-swap { animation: why-stage-in 0.45s cubic-bezier(.22,1,.36,1) both; }
        .why-detail-swap { animation: why-detail-in 0.4s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      {/* Step progress rail */}
      <div className="border-b border-border bg-background px-4 py-4 sm:px-6">
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto pb-1 snap-x snap-mandatory sm:mx-0 sm:gap-3 sm:overflow-visible sm:pb-0">
          {pillars.map((p, i) => {
            const lit = activeIndex === i;
            const done = i < activeIndex;
            return (
              <div key={i} className="flex shrink-0 snap-start items-center gap-2 sm:min-w-0 sm:flex-1 sm:gap-3">
                <button
                  type="button"
                  className="group flex min-h-[44px] min-w-[4.5rem] items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-w-0 sm:flex-1 sm:gap-3 sm:px-4 sm:py-3"
                  style={{
                    borderColor: lit ? "#22c55e" : "var(--color-border)",
                    background: lit ? "rgba(34,197,94,0.08)" : "var(--color-background)",
                    boxShadow: lit ? "0 4px 20px rgba(34,197,94,0.12)" : undefined,
                  }}
                  onMouseEnter={() => {
                    setHovering(true);
                    selectIndex(i);
                  }}
                  onMouseLeave={() => setHovering(false)}
                  onFocus={() => {
                    setHovering(true);
                    selectIndex(i);
                  }}
                  onBlur={() => setHovering(false)}
                  onClick={() => selectIndex(i)}
                  aria-pressed={lit}
                  aria-label={`${p.item.title}: ${p.item.description}`}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-heading text-xs font-bold transition-colors duration-300 sm:h-9 sm:w-9 sm:text-sm"
                    style={{
                      background: lit || done ? "#22c55e" : "var(--color-muted)",
                      color: lit || done ? "#fff" : "var(--color-muted-foreground)",
                    }}
                  >
                    {p.step}
                  </span>
                  <span className="min-w-0 hidden sm:block">
                    <span
                      className="block truncate font-heading text-sm font-bold"
                      style={{ color: lit ? "var(--color-foreground)" : "var(--color-muted-foreground)" }}
                    >
                      {p.item.title}
                    </span>
                  </span>
                  <p.Icon
                    className="ml-auto h-4 w-4 shrink-0 sm:hidden"
                    style={{ color: lit ? "#22c55e" : "#94a3b8" }}
                    strokeWidth={1.75}
                  />
                </button>
                {i < pillars.length - 1 && (
                  <div className="relative hidden h-0.5 w-6 shrink-0 overflow-hidden rounded-full bg-border sm:block lg:w-10">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500"
                      style={{
                        width: i < activeIndex ? "100%" : i === activeIndex ? `${cycleProgress * 100}%` : "0%",
                      }}
                      aria-hidden
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Animation stage */}
      <div className="relative border-b border-border bg-background p-5 sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(34,197,94,0.07) 0%, transparent 70%)",
          }}
        />
        <div key={activeIndex} className="why-stage-swap relative mx-auto flex min-h-[180px] w-full max-w-2xl aspect-[16/10] max-h-48 sm:max-h-56 lg:max-h-72">
          <div className="h-full w-full">
            <ActiveAnim active />
          </div>
        </div>
      </div>

      {/* Detail panel */}
      <div className="grid grid-cols-1 gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div key={activeIndex} className="why-detail-swap">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <active.Icon size={22} strokeWidth={1.75} />
            </div>
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
          <div className="mt-4 flex flex-wrap gap-2">
            {active.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-body text-xs font-semibold text-primary"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <button
            type="button"
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2 font-body text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary sm:w-auto lg:w-auto"
            onClick={() => selectIndex((activeIndex + 1) % pillars.length)}
            aria-label="Next pillar"
          >
            Next
            <ArrowRight size={14} />
          </button>
          {!hovering && !reducedMotion && items.length > 1 && (
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-border lg:w-32 lg:flex-none">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-100"
                style={{ width: `${cycleProgress * 100}%` }}
                aria-hidden
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
