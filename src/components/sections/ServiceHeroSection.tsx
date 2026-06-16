import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/Container";
import { SanityImage } from "@/components/SanityImage";
import type { CtaButton, SanityImageAsset } from "@/sanity/types";

type ServiceHeroSectionProps = {
  title: string;
  tagline?: string;
  description?: string;
  heroImage?: SanityImageAsset;
  heroCta?: CtaButton;
};

export function ServiceHeroSection({
  title,
  tagline,
  description,
  heroImage,
  heroCta,
}: ServiceHeroSectionProps) {
  return (
    <section className="bg-background py-section max-sm:py-section-sm" aria-labelledby="service-hero-heading">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            {tagline ? (
              <p className="mb-4 font-body text-xs font-bold uppercase tracking-widest text-primary">
                {tagline}
              </p>
            ) : null}
            <h1
              id="service-hero-heading"
              className="mb-6 font-heading text-5xl font-extrabold text-foreground sm:text-6xl"
            >
              {title}
            </h1>
            {description ? (
              <p className="mb-8 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
            {heroCta ? (
              <Link
                href={heroCta.href}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-body text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all hover:bg-primary-dark"
              >
                {heroCta.label}
                <ArrowRight size={16} />
              </Link>
            ) : null}
          </div>
          {heroImage ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-surface">
              <SanityImage
                image={heroImage}
                alt={heroImage.alt ?? title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
