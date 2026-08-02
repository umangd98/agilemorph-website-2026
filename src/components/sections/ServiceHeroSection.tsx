"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui";
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
      className="relative overflow-hidden border-b border-line pt-36 pb-20 sm:pt-40 sm:pb-24"
      aria-label={title}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          maskImage: "radial-gradient(90% 90% at 30% 20%, black, transparent)",
          WebkitMaskImage: "radial-gradient(90% 90% at 30% 20%, black, transparent)",
        }}
      >
        <svg className="h-full w-full" aria-hidden>
          <defs>
            <pattern id="service-grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M64 0H0V64" fill="none" stroke="var(--color-grid-line)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#service-grid)" />
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            {tagline ? (
              <p className="syslabel mb-5">{tagline}</p>
            ) : null}
            <h1
              className="text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-fg sm:text-5xl lg:text-6xl"
            >
              {title}
            </h1>
            {description ? (
              <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
                {description}
              </p>
            ) : null}
            {heroCta ? (
              <CtaAction
                cta={heroCta}
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3.5 font-body text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-90"
              >
                {heroCta.label}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
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
