"use client";

import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { MobileAutoCarousel } from "@/components/MobileAutoCarousel";
import type { WhyUsItem } from "@/sanity/types";

import { getWhyUsAnim } from "./registry";
import { WhyUsIcon } from "./WhyUsIcon";

type WhyUsInteractiveProps = {
  items: WhyUsItem[];
};

const AUTO_CYCLE_MS = 4500;

type PillarData = {
  item: WhyUsItem;
  step: string;
};

function WhyUsMobileSlide({ pillar }: { pillar: PillarData }) {
  return (
    <div className="border-border bg-surface flex h-full min-h-[168px] flex-col rounded-2xl border p-5 shadow-sm">
      <span className="bg-primary font-heading text-background shadow-primary/25 mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold shadow-md">
        {pillar.step}
      </span>
      <h3 className="font-heading text-foreground text-lg leading-snug font-bold">
        {pillar.item.title}
      </h3>
      <p className="font-body text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
        {pillar.item.description}
      </p>
    </div>
  );
}

function WhyUsPillar({
  pillar,
  index,
  isActive,
  onActivate,
  onPause,
}: {
  pillar: PillarData;
  index: number;
  isActive: boolean;
  onActivate: (index: number) => void;
  onPause: () => void;
}) {
  const Anim = getWhyUsAnim(pillar.item.animationType);

  return (
    <button
      type="button"
      onClick={() => {
        onPause();
        onActivate(index);
      }}
      onMouseEnter={() => {
        onPause();
        onActivate(index);
      }}
      onFocus={() => {
        onPause();
        onActivate(index);
      }}
      aria-pressed={isActive}
      className={`group focus-visible:ring-primary/40 relative flex h-full w-full items-center gap-4 overflow-hidden rounded-2xl border px-4 py-4 text-left shadow-sm transition-all duration-500 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none sm:px-5 sm:py-5 ${
        isActive
          ? "border-primary/35 bg-primary/5 shadow-primary/10 z-10 translate-x-1 shadow-lg"
          : "border-border bg-surface hover:border-primary/20 hover:bg-primary/3 hover:translate-x-0.5"
      }`}
    >
      <span
        className={`font-heading relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all duration-500 ${
          isActive
            ? "bg-primary text-background shadow-primary/30 scale-110 shadow-md"
            : "bg-primary/10 text-primary group-hover:bg-primary/15"
        }`}
      >
        {pillar.step}
        {isActive ? (
          <span
            className="bg-primary/30 absolute inset-0 animate-ping rounded-xl motion-reduce:animate-none"
            aria-hidden
          />
        ) : null}
      </span>

      <div className="relative z-10 min-w-0 flex-1">
        <h3
          className={`font-heading text-base leading-snug font-bold transition-colors duration-300 ${
            isActive ? "text-foreground" : "text-foreground/90"
          }`}
        >
          {pillar.item.title}
        </h3>
        <p
          className={`font-body mt-1 text-sm leading-relaxed transition-all duration-500 ${
            isActive
              ? "text-muted-foreground"
              : "text-muted-foreground/80 line-clamp-2 md:line-clamp-none"
          }`}
        >
          {pillar.item.description}
        </p>
      </div>

      <div className="relative z-10 hidden h-[4.5rem] w-[6.5rem] shrink-0 items-center justify-center md:flex">
        {isActive ? (
          <div className="border-primary/25 bg-background h-full w-full overflow-hidden rounded-xl border shadow-inner">
            <div className="h-full w-full origin-top-left scale-[0.42]">
              {createElement(Anim, {
                active: true,
                title: pillar.item.title,
                labels: pillar.item.animationLabels,
                highlights: pillar.item.highlights,
              })}
            </div>
          </div>
        ) : (
          <WhyUsIcon
            item={pillar.item}
            size="sm"
            className="opacity-35 transition-opacity group-hover:opacity-55"
          />
        )}
      </div>

      <span
        className={`bg-primary pointer-events-none absolute inset-y-0 left-0 w-1 rounded-l-2xl transition-opacity duration-500 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />
    </button>
  );
}

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
      className="relative h-full"
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div className="hidden h-full md:block">
        <div
          className="from-primary/50 via-primary/20 to-primary/50 pointer-events-none absolute top-8 bottom-8 left-5 w-px bg-gradient-to-b"
          aria-hidden
        />

        <div className="relative flex h-full min-h-0 flex-col gap-3">
          {pillars.map((pillar, index) => (
            <div key={pillar.item.title} className="flex min-h-0 flex-1">
              <WhyUsPillar
                pillar={pillar}
                index={index}
                isActive={index === activeIndex}
                onActivate={setActiveIndex}
                onPause={pauseAutoCycle}
              />
            </div>
          ))}
        </div>
      </div>

      <MobileAutoCarousel
        ariaLabel="Why choose AgileMorph"
        desktopClassName="hidden"
        mobileTrackClassName="px-0.5"
        mobileSlideClassName="w-full shrink-0 snap-center px-0.5"
        autoMs={AUTO_CYCLE_MS}
        mobileChildren={pillars.map((pillar) => (
          <WhyUsMobileSlide key={pillar.item.title} pillar={pillar} />
        ))}
      >
        {null}
      </MobileAutoCarousel>
    </div>
  );
}
