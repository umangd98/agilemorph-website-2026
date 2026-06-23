"use client";

import { ChevronRight } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";

import { parseFlowStepItems } from "@/components/sections/sub-service/sub-service-typography";
import type { FlowStep } from "@/sanity/types";

type SubServiceFlowVisualProps = {
  pageKey: string;
  flow: FlowStep[];
};

export function SubServiceFlowVisual({ pageKey, flow }: SubServiceFlowVisualProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !flow.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-flow-node]"));
    const labelCards = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll("[data-flow-label-card]"),
    );
    const chips = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-flow-chip]"));
    const arrows = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-flow-arrow]"));
    const pulses = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-flow-pulse]"));
    const footer = root.querySelector<HTMLElement>("[data-flow-footer]");

    const showAll = () => {
      gsap.set([...nodes, ...arrows, footer, ...chips], { opacity: 1, y: 0, clearProps: "transform" });
      gsap.set(pulses, { scaleX: 1, scaleY: 1 });
    };

    if (reduced) {
      showAll();
      return;
    }

    gsap.set([...nodes, ...arrows, footer], { opacity: 0, y: 12 });
    gsap.set(chips, { opacity: 0, y: 8 });
    gsap.set(pulses, { scaleX: 0, scaleY: 0 });

    const intro = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: showAll,
    });

    flow.forEach((_, index) => {
      const offset = index * 0.22;
      const node = nodes[index];
      if (node) {
        intro.to(node, { opacity: 1, y: 0, duration: 0.5 }, offset);
      }
      const stepChips = chips.filter(
        (chip) => chip.dataset.flowStep === String(index),
      );
      if (stepChips.length) {
        intro.to(stepChips, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 }, offset + 0.12);
      }
      if (arrows[index]) {
        intro.to(arrows[index], { opacity: 1, y: 0, duration: 0.35 }, offset + 0.18);
      }
      if (pulses[index]) {
        const isVertical = pulses[index].dataset.flowOrientation === "vertical";
        intro.to(
          pulses[index],
          isVertical
            ? { scaleY: 1, duration: 0.55, ease: "power2.inOut" }
            : { scaleX: 1, duration: 0.55, ease: "power2.inOut" },
          offset + 0.22,
        );
      }
    });

    if (footer) {
      intro.to(footer, { opacity: 1, y: 0, duration: 0.45 }, flow.length * 0.22 + 0.1);
    }

    const cycle = gsap.timeline({ repeat: -1, delay: 1.6 });
    labelCards.forEach((card, index) => {
      const start = index * 0.9;
      cycle.call(() => card.classList.add("sub-service-flow-node-active"), undefined, start);
      cycle.call(() => card.classList.remove("sub-service-flow-node-active"), undefined, start + 0.6);
    });

    const dots = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-flow-dot]"));
    const dotTweens = dots.map((dot, index) =>
      gsap.to(dot, {
        x: 12,
        opacity: 0.25,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.35,
      }),
    );

    return () => {
      intro.kill();
      cycle.kill();
      dotTweens.forEach((tween) => tween.kill());
      labelCards.forEach((card) => card.classList.remove("sub-service-flow-node-active"));
      showAll();
    };
  }, [pageKey, flow]);

  if (!flow.length) return null;

  return (
    <div
      key={pageKey}
      ref={rootRef}
      className="sub-service-flow-card rounded-2xl border border-border/80 bg-surface/90 p-4 shadow-sm backdrop-blur-sm sm:p-5"
    >
      <div className="relative z-1 flex flex-col gap-4 sm:flex-row sm:items-start">
        {flow.map((step, index) => {
          const items = parseFlowStepItems(step.text);

          return (
            <Fragment key={`${step.label}-${index}`}>
              <div data-flow-node className="flex min-w-0 flex-1 flex-col gap-2">
                <div
                  data-flow-label-card
                  className="sub-service-flow-label-card rounded-xl border border-border bg-background px-3 py-3 text-center"
                >
                  <p className="sub-service-flow-label">{step.label}</p>
                </div>
                <ul className="flex flex-wrap justify-center gap-1.5 px-0.5">
                  {items.map((item) => (
                    <li key={item}>
                      <span
                        data-flow-chip
                        data-flow-step={index}
                        className="sub-service-flow-chip"
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {index < flow.length - 1 ? (
                <div
                  data-flow-arrow
                  className="sub-service-flow-arrow flex shrink-0 items-center justify-center self-center px-0.5 text-primary sm:mt-5 sm:w-7"
                  aria-hidden
                >
                  <span className="hidden sm:flex sm:flex-col sm:items-center sm:gap-1">
                    <span className="relative block h-px w-5 overflow-hidden rounded-full bg-primary/15">
                      <span
                        data-flow-pulse
                        data-flow-orientation="horizontal"
                        className="absolute inset-y-0 left-0 w-full origin-left bg-primary/60"
                      />
                      <span
                        data-flow-dot
                        className="absolute -top-[3px] left-0 h-1.5 w-1.5 rounded-full bg-primary"
                      />
                    </span>
                    <ChevronRight size={14} strokeWidth={2.5} className="opacity-70" />
                  </span>
                  <span className="flex flex-col items-center gap-1 py-0.5 sm:hidden">
                    <ChevronRight size={16} className="rotate-90 opacity-70" strokeWidth={2.5} />
                    <span className="relative block h-4 w-px overflow-hidden rounded-full bg-primary/15">
                      <span
                        data-flow-pulse
                        data-flow-orientation="vertical"
                        className="absolute inset-x-0 top-0 h-full w-full origin-top bg-primary/60"
                      />
                    </span>
                  </span>
                </div>
              ) : null}
            </Fragment>
          );
        })}
      </div>

      <p
        data-flow-footer
        className="relative z-1 mt-5 border-t border-border/70 pt-3.5 text-center font-body text-xs leading-relaxed text-muted-foreground sm:text-left sm:text-[0.8125rem]"
      >
        Live, automated, monitored — running while you sleep.
      </p>
    </div>
  );
}
