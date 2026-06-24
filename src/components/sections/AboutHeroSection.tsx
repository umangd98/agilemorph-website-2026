import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/Container";
import type { CtaButton } from "@/sanity/types";

type AboutHeroSectionProps = {
  heading: string;
  tagline?: string;
  cta?: CtaButton;
};

export function AboutHeroSection({
  heading,
  tagline,
  cta,
}: AboutHeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden bg-background py-section max-sm:py-section-sm"
      aria-labelledby="about-hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/15 via-background to-primary/5"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--color-primary) 25%, transparent) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-5 inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 font-body text-xs font-bold uppercase tracking-widest text-primary">
            About AgileMorph
          </span>
          <h1
            id="about-hero-heading"
            className="mb-6 font-heading text-4xl font-extrabold text-foreground sm:text-5xl lg:text-6xl"
          >
            {heading}
          </h1>
          {tagline ? (
            <p className="mb-8 font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
              {tagline}
            </p>
          ) : null}
          {cta ? (
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-body text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all hover:bg-primary-dark sm:px-8 sm:py-4"
            >
              {cta.label}
              <ArrowRight size={16} />
            </Link>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
