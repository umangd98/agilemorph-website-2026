"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
import type { ProcessStep } from "@/sanity/types";

type ProcessSectionProps = {
  heading?: string;
  subheading?: string;
  steps?: ProcessStep[];
};

function useFinePointerHover() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return enabled;
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

type ProcessStepCardProps = {
  step: ProcessStep;
  index: number;
  total: number;
  isOpen: boolean;
  isDimmed: boolean;
  canHover: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onSelect: () => void;
};

function ProcessStepCard({
  step,
  index,
  total,
  isOpen,
  isDimmed,
  canHover,
  onHoverStart,
  onHoverEnd,
  onSelect,
}: ProcessStepCardProps) {
  return (
    <article
      className={`relative transition-[opacity,transform] duration-500 ease-out ${
        isDimmed ? "opacity-55 lg:scale-[0.98]" : "opacity-100 lg:scale-100"
      } ${isOpen ? "z-20" : "z-10"}`}
      onMouseEnter={canHover ? onHoverStart : undefined}
      onMouseLeave={canHover ? onHoverEnd : undefined}
    >
      <div className="mb-5 flex flex-col items-center">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full font-heading text-sm font-extrabold transition-all duration-500 ${
            isOpen
              ? "scale-110 bg-primary text-white shadow-lg shadow-primary/30"
              : "bg-primary/10 text-primary ring-1 ring-primary/20"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        <div
          className={`mt-3 h-6 w-px transition-colors duration-300 ${
            isOpen ? "bg-primary/50" : "bg-border"
          }`}
          aria-hidden
        />
      </div>

      <button
        type="button"
        onClick={onSelect}
        aria-expanded={isOpen}
        aria-controls={`process-step-panel-${index}`}
        className={`group relative w-full overflow-hidden rounded-2xl border bg-background text-left shadow-sm transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 motion-reduce:transition-none ${
          isOpen
            ? "border-primary/30 shadow-xl shadow-primary/8"
            : "border-border hover:border-primary/20 hover:shadow-md"
        }`}
      >
        <span
          className={`absolute inset-y-0 left-0 w-1 bg-primary transition-transform duration-500 ease-out motion-reduce:transition-none ${
            isOpen ? "scale-y-100" : "scale-y-0"
          }`}
          aria-hidden
        />

        <div className="relative h-48 overflow-hidden bg-linear-to-br from-primary/6 via-background to-surface sm:h-52">
          {step.image ? (
            <SanityImage
              image={step.image}
              alt={step.image.alt ?? step.title}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className={`object-contain p-5 transition-transform duration-700 ease-out motion-reduce:transition-none ${
                isOpen ? "scale-[1.04]" : "group-hover:scale-[1.02]"
              }`}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 opacity-40">
              <svg className="h-14 w-14 text-primary" viewBox="0 0 64 64" fill="none" aria-hidden>
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
                <path
                  d="M20 32l8 8 16-16"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-background to-transparent transition-opacity duration-500 ${
              isOpen ? "opacity-100" : "opacity-80"
            }`}
            aria-hidden
          />
        </div>

        <div className="border-t border-border/60 px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="sr-only">
                Step {index + 1} of {total}
              </p>
              <h3
                className={`font-heading text-base font-bold leading-snug transition-colors duration-300 sm:text-lg ${
                  isOpen ? "text-primary" : "text-foreground"
                }`}
              >
                {step.title}
              </h3>
            </div>

            <span
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-out motion-reduce:transition-none ${
                isOpen
                  ? "rotate-180 border-primary/25 bg-primary/10 text-primary"
                  : "border-border bg-surface text-muted-foreground group-hover:border-primary/20 group-hover:text-primary"
              }`}
              aria-hidden
            >
              <ChevronDown size={15} strokeWidth={2.25} />
            </span>
          </div>

          <div
            id={`process-step-panel-${index}`}
            className="grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none"
            style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <div
                className={`transition-opacity duration-500 ease-out motion-reduce:transition-none ${
                  isOpen ? "pt-4 opacity-100 delay-100" : "opacity-0"
                }`}
              >
                {step.description ? (
                  <p className="mb-4 font-body text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                ) : null}

                {step.bullets?.length ? (
                  <ul className="space-y-3 rounded-xl bg-surface/80 p-4">
                    {step.bullets.map((bullet) => {
                      const [bold, ...rest] = bullet.split(": ");
                      return (
                        <li
                          key={bullet}
                          className="flex items-start gap-2.5 font-body text-sm leading-relaxed text-muted-foreground"
                        >
                          <CheckIcon />
                          <span>
                            {rest.length > 0 ? (
                              <>
                                <strong className="font-semibold text-foreground">{bold}:</strong>{" "}
                                {rest.join(": ")}
                              </>
                            ) : (
                              bullet
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </button>
    </article>
  );
}

export function ProcessSection({
  heading = "The Way We Work",
  subheading = "We empower businesses to thrive with innovative digital solutions.",
  steps = [],
}: ProcessSectionProps) {
  const canHover = useFinePointerHover();
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const activeIndex = pinnedIndex ?? (canHover ? previewIndex : null);

  const handleSelect = useCallback((index: number) => {
    setPinnedIndex((current) => (current === index ? null : index));
    setPreviewIndex(null);
  }, []);

  const handleHoverStart = useCallback((index: number) => {
    if (pinnedIndex === null) {
      setPreviewIndex(index);
    }
  }, [pinnedIndex]);

  const handleHoverEnd = useCallback(() => {
    setPreviewIndex(null);
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-surface py-section max-sm:py-section-sm"
      aria-labelledby="process-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 section-ambient-glow"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <AnimateOnScroll className="mb-16 text-center md:mb-20">
          <span className="mb-4 block font-body text-xs font-bold uppercase tracking-widest text-primary">
            Our Process
          </span>
          <h2
            id="process-heading"
            className="mb-4 font-heading text-4xl font-extrabold text-foreground sm:text-5xl"
          >
            {heading}
          </h2>
          {subheading ? (
            <p className="mx-auto max-w-xl font-body text-lg text-muted-foreground">{subheading}</p>
          ) : null}
        </AnimateOnScroll>

        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start lg:gap-6 xl:gap-8">
          <div
            className="pointer-events-none absolute left-[16.7%] top-6 hidden h-px w-[66.6%] bg-linear-to-r from-transparent via-primary/35 to-transparent lg:block"
            aria-hidden
          />

          {steps.map((step, index) => {
            const isOpen = activeIndex === index;
            const isDimmed = activeIndex !== null && activeIndex !== index;

            return (
              <AnimateOnScroll key={`${step.title}-${index}`} delay={index * 100}>
                <ProcessStepCard
                  step={step}
                  index={index}
                  total={steps.length}
                  isOpen={isOpen}
                  isDimmed={isDimmed}
                  canHover={canHover}
                  onHoverStart={() => handleHoverStart(index)}
                  onHoverEnd={handleHoverEnd}
                  onSelect={() => handleSelect(index)}
                />
              </AnimateOnScroll>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
