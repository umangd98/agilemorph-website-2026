"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage, hasImageAsset } from "@/components/SanityImage";
import { getInitials } from "@/lib/seo";
import { urlForImage } from "@/sanity/image";
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

function isLandscapeLogo(image?: Testimonial["image"]) {
  const width = image?.dimensions?.width;
  const height = image?.dimensions?.height;
  if (width && height && width / height > 1.15) return true;
  return Boolean(image?.alt?.toLowerCase().includes("logo"));
}

function StarRating() {
  return (
    <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className="fill-amber-400 text-amber-400" aria-hidden />
      ))}
    </div>
  );
}

type TestimonialPhotoProps = {
  image?: Testimonial["image"];
  name: string;
  variant?: "hero" | "thumb";
  priority?: boolean;
  className?: string;
};

function TestimonialPhoto({
  image,
  name,
  variant = "hero",
  priority = false,
  className = "",
}: TestimonialPhotoProps) {
  const [failed, setFailed] = useState(false);
  const logoImage = isLandscapeLogo(image);
  const hero = variant === "hero";

  useEffect(() => {
    setFailed(false);
  }, [image?.asset?._ref, image?.asset?._id, image?.asset?.url]);

  const frameClass = hero
    ? logoImage
      ? "h-36 w-44 rounded-2xl sm:h-40 sm:w-48"
      : "h-36 w-36 rounded-full sm:h-44 sm:w-44"
    : logoImage
      ? "h-11 w-14 rounded-lg"
      : "h-11 w-11 rounded-full";

  if (!hasImageAsset(image) || failed) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center border-2 border-primary/25 bg-primary/10 font-heading font-bold text-primary shadow-inner ${frameClass} ${hero ? "text-2xl sm:text-3xl" : "text-xs"} ${className}`}
        aria-hidden={failed}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 overflow-hidden border-2 border-primary/20 bg-white shadow-lg shadow-primary/10 ${frameClass} ${className}`}
    >
      <SanityImage
        image={image}
        alt={image.alt ?? name}
        fill
        sizes={hero ? "(max-width: 640px) 144px, 176px" : "44px"}
        priority={priority}
        onError={() => setFailed(true)}
        className={logoImage ? "object-contain! p-2 sm:p-3" : "object-cover"}
      />
    </div>
  );
}

function preloadTestimonialImage(image?: Testimonial["image"]) {
  if (!hasImageAsset(image) || typeof window === "undefined") return;
  const img = new window.Image();
  img.src = urlForImage(image).width(320).auto("format").fit("max").url();
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
    if (!count) return;
    preloadTestimonialImage(items[activeIndex]?.image);
    preloadTestimonialImage(items[(activeIndex + 1) % count]?.image);
    preloadTestimonialImage(items[(activeIndex - 1 + count) % count]?.image);
  }, [activeIndex, count, items]);

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
            className="relative mx-auto max-w-5xl"
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

              <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12 lg:p-12">
                <div key={`photo-${activeIndex}`} className="testimonial-enter flex flex-col items-center gap-4 lg:items-start">
                  <div className="relative">
                    <div
                      className="absolute -inset-3 rounded-full bg-primary/10 blur-xl"
                      aria-hidden
                    />
                    <TestimonialPhoto
                      image={testimonial.image}
                      name={testimonial.name}
                      variant="hero"
                      priority={activeIndex === 0}
                    />
                    <div
                      className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary text-white shadow-lg"
                      aria-hidden
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                  </div>

                  <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                  </p>
                </div>

                <div key={`copy-${activeIndex}`} className="testimonial-enter flex min-w-0 flex-col text-center lg:text-left">
                  <StarRating />

                  <blockquote className="mt-4 font-body text-base leading-relaxed text-foreground sm:text-lg lg:text-xl">
                    <span className="text-primary/40" aria-hidden>
                      &ldquo;
                    </span>
                    {testimonial.quote}
                    <span className="text-primary/40" aria-hidden>
                      &rdquo;
                    </span>
                  </blockquote>

                  <footer className="mt-6 border-t border-border pt-6">
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
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div
                      className="-mx-1 flex items-center gap-2 overflow-x-auto pb-1 snap-x snap-mandatory sm:mx-0 sm:flex-wrap sm:overflow-visible sm:pb-0"
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
                            className={`flex shrink-0 snap-start items-center gap-2 rounded-full border px-2 py-1.5 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-3 ${
                              active
                                ? "border-primary bg-primary/10 shadow-sm"
                                : "border-transparent bg-background/80 hover:border-border"
                            }`}
                          >
                            <TestimonialPhoto
                              image={item.image}
                              name={item.name}
                              variant="thumb"
                              priority={index === 0}
                              className={active ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-80"}
                            />
                            <span
                              className={`hidden max-w-[8rem] truncate font-body text-xs font-semibold sm:block ${
                                active ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {item.name.split(" ")[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-center gap-3 sm:justify-end">
                      <button
                        type="button"
                        onClick={goToPrevious}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
                        aria-label="Previous testimonial"
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={goToNext}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-dark"
                        aria-label="Next testimonial"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>
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
