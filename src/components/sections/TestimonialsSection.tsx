"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
import { getInitials } from "@/lib/seo";
import type { Testimonial } from "@/sanity/types";

type TestimonialsSectionProps = {
  eyebrow?: string;
  heading?: string;
  items?: Testimonial[];
};

function QuoteBadge() {
  return (
    <div
      className="absolute -right-1 -top-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-surface shadow-sm"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-foreground" fill="currentColor">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
    </div>
  );
}

export function TestimonialsSection({
  eyebrow = "Client Feedback",
  heading = "Success Stories of Our Clients",
  items = [],
}: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items.length) return null;

  const testimonial = items[activeIndex];
  const companyLabel = testimonial.company ?? testimonial.role;

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? items.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current === items.length - 1 ? 0 : current + 1));
  };

  return (
    <section
      className="bg-surface py-section max-sm:py-section-sm"
      aria-labelledby="testimonials-heading"
    >
      <Container>
        <AnimateOnScroll className="mb-12 text-center">
          {eyebrow ? (
            <span className="mb-4 block font-body text-xs font-bold uppercase tracking-widest text-primary">
              {eyebrow}
            </span>
          ) : null}
          <h2
            id="testimonials-heading"
            className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl"
          >
            {heading}
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <article
            className="relative mx-auto max-w-4xl rounded-3xl border border-border bg-background p-8 shadow-sm sm:p-12"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-12">
              <div className="relative shrink-0">
                {testimonial.image ? (
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-primary/20 sm:h-40 sm:w-40">
                    <SanityImage
                      image={testimonial.image}
                      alt={testimonial.image.alt ?? testimonial.name}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/10 font-heading text-2xl font-bold text-primary sm:h-40 sm:w-40">
                    {getInitials(testimonial.name)}
                  </div>
                )}
                <QuoteBadge />
              </div>

              <div className="flex flex-1 flex-col text-center sm:text-left">
                <blockquote className="mb-8 font-body text-base italic leading-relaxed text-muted-foreground sm:text-lg">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div>
                  <p className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                    {testimonial.name}
                  </p>
                  {companyLabel ? (
                    <p className="mt-1 font-body text-sm font-medium text-muted-foreground">
                      {companyLabel}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {items.length > 1 ? (
              <div className="mt-10 flex items-center justify-center gap-4 sm:justify-end">
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
                  aria-label="Next testimonial"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            ) : null}
          </article>

          {items.length > 1 ? (
            <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Testimonials">
              {items.map((item, index) => (
                <button
                  key={`${item.name}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`Show testimonial from ${item.name}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-border hover:bg-primary/40"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </AnimateOnScroll>
      </Container>
    </section>
  );
}
