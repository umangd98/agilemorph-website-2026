"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/Container";
import { PageHeroBackground } from "@/components/PageHeroBackground";
import { CtaAction } from "@/components/CtaAction";
import { hasImageAsset } from "@/components/SanityImage";
import { ServiceHeroMedia } from "@/components/sections/ServiceHeroMedia";
import {
  AI_AUTOMATION_SUB_SLUGS,
  getServiceLabel,
  serviceHref,
} from "@/lib/services";
import { urlForImage } from "@/sanity/image";
import type { CtaButton, SanityImageAsset } from "@/sanity/types";

const AiAutomationHeroVisual = dynamic(
  () =>
    import("@/components/hero-animations/AiAutomationHeroVisual").then((mod) => ({
      default: mod.AiAutomationHeroVisual,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[4/3] w-full animate-pulse rounded-3xl bg-muted/60" />
    ),
  },
);

type ServiceHeroSectionProps = {
  slug: string;
  title: string;
  tagline?: string;
  description?: string;
  heroImage?: SanityImageAsset;
  heroCta?: CtaButton;
  useEcosystemVisual?: boolean;
};

function ServiceHeroMobileChips() {
  return (
    <div className="mt-8 lg:hidden">
      <p className="mb-3 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Explore specializations
      </p>
      <div className="services-mobile-chips -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {AI_AUTOMATION_SUB_SLUGS.map((subSlug) => (
          <Link
            key={subSlug}
            href={serviceHref(subSlug)}
            className="shrink-0 snap-start rounded-full border border-border bg-background px-3.5 py-2 font-body text-xs font-semibold text-foreground transition-colors hover:border-primary/35 hover:bg-primary/8 hover:text-primary active:bg-primary/12"
          >
            {getServiceLabel(subSlug, subSlug)}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ServiceHeroSection({
  slug,
  title,
  tagline,
  description,
  heroImage,
  heroCta,
  useEcosystemVisual = false,
}: ServiceHeroSectionProps) {
  const rawUrl = heroImage?.asset?.url;
  const isSvg = Boolean(rawUrl && /\.svg(\?|$)/i.test(rawUrl));
  const imageUrl = hasImageAsset(heroImage)
    ? isSvg
      ? rawUrl
      : urlForImage(heroImage).auto("format").fit("max").url()
    : undefined;

  return (
    <section
      className="relative bg-background py-section max-sm:py-section-sm"
      aria-labelledby="service-hero-heading"
    >
      <PageHeroBackground />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            {tagline ? (
              <p className="mb-4 font-body text-xs font-bold uppercase tracking-widest text-primary">
                {tagline}
              </p>
            ) : null}
            <h1
              id="service-hero-heading"
              className="mb-6 font-heading text-4xl font-extrabold text-foreground sm:text-5xl lg:text-6xl"
            >
              {title}
            </h1>
            {description ? (
              <p className="mb-8 max-w-2xl font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
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
            {useEcosystemVisual ? <ServiceHeroMobileChips /> : null}
          </div>
          <div className={`min-w-0 ${useEcosystemVisual ? "hidden lg:block" : ""}`}>
            {useEcosystemVisual ? (
              <AiAutomationHeroVisual compact />
            ) : (
              <ServiceHeroMedia
                slug={slug}
                imageUrl={imageUrl}
                alt={heroImage?.alt ?? title}
                blurDataURL={heroImage?.lqip}
                isSvg={isSvg}
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
