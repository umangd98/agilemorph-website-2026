"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { WhyUsItem } from "@/sanity/types";

import { getWhyUsAnim } from "./registry";
import { WhyUsIcon } from "./WhyUsIcon";

type WhyUsInteractiveProps = {
  items: WhyUsItem[];
};

const AUTO_CYCLE_MS = 4500;

export function WhyUsInteractive({ items }: WhyUsInteractiveProps) {
  const pillars = useMemo(
    () =>
      items.map((item, index) => ({
        item,
        step: String(index + 1).padStart(2, "0"),
      })),
    [items],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const pausedRef = useRef(false);

  const pauseAutoCycle = useCallback(() => {
    pausedRef.current = true;
  }, []);

  useEffect(() => {
    if (pillars.length <= 1) return;

    const timer = window.setInterval(() => {
      if (pausedRef.current) return;
      setActiveIndex((current) => (current + 1) % pillars.length);
    }, AUTO_CYCLE_MS);

    return () => window.clearInterval(timer);
  }, [pillars.length]);

  if (!items.length) return null;

  return (
    <div
      className="relative flex h-full flex-col gap-2.5"
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div
        className="pointer-events-none absolute left-5 top-8 bottom-8 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-primary/50"
        aria-hidden
      />

      {pillars.map((pillar, index) => {
        const isActive = index === activeIndex;
        const Anim = getWhyUsAnim(pillar.item.animationType);

        return (
          <button
            key={pillar.item.title}
            type="button"
            onClick={() => {
              pauseAutoCycle();
              setActiveIndex(index);
            }}
            onMouseEnter={() => {
              pauseAutoCycle();
              setActiveIndex(index);
            }}
            onFocus={() => {
              pauseAutoCycle();
              setActiveIndex(index);
            }}
            aria-pressed={isActive}
            className={`group relative flex flex-1 items-center gap-4 overflow-hidden rounded-2xl border px-4 py-3 text-left shadow-sm transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 motion-reduce:transition-none sm:px-5 ${
              isActive
                ? "z-10 translate-x-1 border-primary/35 bg-primary/5 shadow-lg shadow-primary/10"
                : "border-border bg-surface hover:border-primary/20 hover:bg-primary/3 hover:translate-x-0.5"
            }`}
          >
            <span
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-heading text-sm font-bold transition-all duration-500 ${
                isActive
                  ? "scale-110 bg-primary text-background shadow-md shadow-primary/30"
                  : "bg-primary/10 text-primary group-hover:bg-primary/15"
              }`}
            >
              {pillar.step}
              {isActive ? (
                <span
                  className="absolute inset-0 animate-ping rounded-xl bg-primary/30 motion-reduce:animate-none"
                  aria-hidden
                />
              ) : null}
            </span>

            <div className="relative z-10 min-w-0 flex-1">
              <h3
                className={`font-heading text-base font-bold leading-snug transition-colors duration-300 ${
                  isActive ? "text-foreground" : "text-foreground/90"
                }`}
              >
                {pillar.item.title}
              </h3>
              <p
                className={`mt-1 font-body text-sm leading-relaxed transition-all duration-500 ${
                  isActive ? "text-muted-foreground" : "text-muted-foreground/80 line-clamp-2"
                }`}
              >
                {pillar.item.description}
              </p>
            </div>

            <div className="relative z-10 hidden shrink-0 sm:block">
              {isActive ? (
                <div className="h-[4.5rem] w-[6.5rem] overflow-hidden rounded-xl border border-primary/25 bg-background shadow-inner">
                  <div className="h-full w-full origin-top-left scale-[0.42]">
                    <Anim
                      active
                      title={pillar.item.title}
                      labels={pillar.item.animationLabels}
                      highlights={pillar.item.highlights}
                    />
                  </div>
                </div>
              ) : (
                <WhyUsIcon item={pillar.item} size="sm" className="opacity-35 transition-opacity group-hover:opacity-55" />
              )}
            </div>

            <span
              className={`pointer-events-none absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-primary transition-opacity duration-500 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}
