import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui";
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
      className="relative overflow-hidden pt-36 pb-20 sm:pt-40 sm:pb-24"
      aria-label={heading}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          maskImage: "radial-gradient(80% 80% at 50% 30%, black, transparent)",
          WebkitMaskImage: "radial-gradient(80% 80% at 50% 30%, black, transparent)",
        }}
      >
        <svg className="h-full w-full" aria-hidden>
          <defs>
            <pattern id="about-grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path
                d="M64 0H0V64"
                fill="none"
                stroke="var(--color-grid-line)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-grid)" />
        </svg>
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-fg sm:text-5xl lg:text-6xl">
            {heading}
          </h1>
          {tagline ? (
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              {tagline}
            </p>
          ) : null}
          {cta ? (
            <Link
              href={cta.href}
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3.5 font-body text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-90"
            >
              {cta.label}
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
