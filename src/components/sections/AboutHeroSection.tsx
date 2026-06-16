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
      className="bg-background py-section max-sm:py-section-sm"
      aria-labelledby="about-hero-heading"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1
            id="about-hero-heading"
            className="mb-6 font-heading text-5xl font-extrabold text-foreground sm:text-6xl"
          >
            {heading}
          </h1>
          {tagline ? (
            <p className="mb-8 font-body text-lg leading-relaxed text-muted-foreground">
              {tagline}
            </p>
          ) : null}
          {cta ? (
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-body text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all hover:bg-primary-dark"
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
