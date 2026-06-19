"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import type { Testimonial } from "@/sanity/types";

type TestimonialsSectionProps = {
  eyebrow?: string;
  heading?: string;
  items?: Testimonial[];
};

const AUTO_MS = 6000;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function StarRating() {
  return (
    <div className="flex items-center justify-center gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className="fill-amber-400 text-amber-400" aria-hidden />
      ))}
    </div>
  );
}

export function TestimonialsSection({
  eyebrow = "Client Feedback",
  heading = "Success Stories of Our Clients",
  items = [],
}: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycleProgress, setCycleProgress] = useState(0);
  const cycleStart = useRef(Date.now());
  const rafRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();

  const count = items.length;
  const testimonial = items[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (!count) return;
      const next = ((index % count) + count) % count;
      setActiveIndex(next);
      cycleStart.current = Date.now();
      setCycleProgress(0);
    },
    [count],
  );

  const goToPrevious = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goToNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    if (paused || reducedMotion || count <= 1) return;

    const tick = () => {
      const elapsed = Date.now() - cycleStart.current;
      const progress = Math.min(elapsed / AUTO_MS, 1);
      setCycleProgress(progress);
      if (progress >= 1) goTo(activeIndex + 1);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, reducedMotion, count, activeIndex, goTo]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goToPrevious();
      if (event.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToPrevious, goToNext]);

  if (!count || !testimonial) return null;

  const companyLabel = testimonial.company ?? testimonial.role;

  return (
    <section
      className="relative overflow-hidden bg-surface py-section max-sm:py-section-sm"
      aria-labelledby="testimonials-heading"
    >
      <style>{`
        @keyframes testimonial-enter {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .testimonial-enter { animation: testimonial-enter 0.55s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 15% 20%, rgba(34,197,94,0.08) 0%, transparent 55%), radial-gradient(ellipse 60% 45% at 85% 75%, rgba(6,182,212,0.06) 0%, transparent 50%)",
        }}
      />

      <Container className="relative">
        <AnimateOnScroll className="mb-10 text-center sm:mb-12">
          {eyebrow ? (
            <span className="mb-4 block font-body text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </span>
          ) : null}
          <h2
            id="testimonials-heading"
            className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl"
          >
            {heading}
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <div
            className="relative mx-auto max-w-4xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setPaused(false);
              }
            }}
          >
            <div
              className="relative overflow-hidden rounded-3xl border border-border bg-background shadow-xl shadow-primary/5"
              aria-live="polite"
              aria-atomic="true"
            >
              <div
                className="absolute inset-x-0 top-0 h-1 bg-border"
                aria-hidden={count <= 1}
              >
                {count > 1 && !reducedMotion ? (
                  <div
                    className="h-full bg-primary transition-[width] duration-100 ease-linear"
                    style={{ width: `${cycleProgress * 100}%` }}
                  />
                ) : null}
              </div>

              <div className="p-6 sm:p-10 lg:p-12">
                <div
                  key={`copy-${activeIndex}`}
                  className="testimonial-enter mx-auto flex max-w-2xl flex-col items-center text-center"
                >
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                  </p>

                  <div className="mt-4">
                    <StarRating />
                  </div>

                  <blockquote className="mt-4 font-body text-base leading-relaxed text-foreground sm:text-lg lg:text-xl">
                    <span className="text-primary/40" aria-hidden>
                      &ldquo;
                    </span>
                    {testimonial.quote}
                    <span className="text-primary/40" aria-hidden>
                      &rdquo;
                    </span>
                  </blockquote>

                  <footer className="mt-6 w-full border-t border-border pt-6">
                    <p className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                      {testimonial.name}
                    </p>
                    {companyLabel ? (
                      <p className="mt-1 font-body text-sm font-medium text-muted-foreground">
                        {companyLabel}
                      </p>
                    ) : null}
                  </footer>
                </div>
              </div>

              {count > 1 ? (
                <div className="border-t border-border bg-muted/40 px-4 py-4 sm:px-8">
                  <div className="flex items-center justify-center gap-4 sm:gap-6">
                    <button
                      type="button"
                      onClick={goToPrevious}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
                      aria-label="Previous testimonial"
                    >
                      <ArrowLeft size={18} />
                    </button>

                    <div
                      className="flex items-center gap-2"
                      role="tablist"
                      aria-label="Client testimonials"
                    >
                      {items.map((item, index) => {
                        const active = index === activeIndex;
                        return (
                          <button
                            key={`${item.name}-${index}`}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            aria-label={`Show testimonial from ${item.name}`}
                            onClick={() => goTo(index)}
                            className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                              active
                                ? "w-8 bg-primary"
                                : "w-2.5 bg-border hover:bg-primary/40"
                            }`}
                          />
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={goToNext}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-dark"
                      aria-label="Next testimonial"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </AnimateOnScroll>
      </Container>
    </section>
  );
}
