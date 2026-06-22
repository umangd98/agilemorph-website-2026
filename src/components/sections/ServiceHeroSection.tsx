import { ArrowRight } from "lucide-react";

import { Container } from "@/components/Container";
import { CtaAction } from "@/components/CtaAction";
import { hasImageAsset } from "@/components/SanityImage";
import { ServiceHeroMedia } from "@/components/sections/ServiceHeroMedia";
import { urlForImage } from "@/sanity/image";
import type { CtaButton, SanityImageAsset } from "@/sanity/types";

type ServiceHeroSectionProps = {
  slug: string;
  title: string;
  tagline?: string;
  description?: string;
  heroImage?: SanityImageAsset;
  heroCta?: CtaButton;
};

export function ServiceHeroSection({
  slug,
  title,
  tagline,
  description,
  heroImage,
  heroCta,
}: ServiceHeroSectionProps) {
  const rawUrl = heroImage?.asset?.url;
  const isSvg = Boolean(rawUrl && /\.svg(\?|$)/i.test(rawUrl));
  const imageUrl = hasImageAsset(heroImage)
    ? isSvg
      ? rawUrl
      : urlForImage(heroImage).auto("format").fit("max").url()
    : undefined;

  return (
    <section className="bg-background py-section max-sm:py-section-sm" aria-labelledby="service-hero-heading">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
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
              <CtaAction
                cta={heroCta}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-body text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all hover:bg-primary-dark"
              >
                {heroCta.label}
                <ArrowRight size={16} />
              </CtaAction>
            ) : null}
          </div>
          <div className="min-w-0">
            <ServiceHeroMedia
              slug={slug}
              imageUrl={imageUrl}
              alt={heroImage?.alt ?? title}
              blurDataURL={heroImage?.lqip}
              isSvg={isSvg}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
