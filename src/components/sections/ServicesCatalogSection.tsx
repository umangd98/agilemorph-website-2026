"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";
import { ECOSYSTEM_QUICK_JUMP_SERVICES } from "@/components/hero-animations/hero-ecosystem-graph";
import { MobileAutoCarousel } from "@/components/MobileAutoCarousel";
import { PageHeroBackground } from "@/components/PageHeroBackground";
import { AiAutomationCapabilitiesGrid } from "@/components/sections/AiAutomationCapabilitiesGrid";
import {
  getServiceIcon,
  getServiceLabel,
  getPrimaryServiceCapabilities,
  serviceHref,
  splitServicePages,
} from "@/lib/services";
import type { ServicePageListItem } from "@/sanity/types";

const ServicesEcosystemGraph = dynamic(
  () =>
    import("@/components/hero-animations/ServicesEcosystemGraph").then((mod) => ({
      default: mod.ServicesEcosystemGraph,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-square w-full animate-pulse rounded-2xl bg-muted/40" />
    ),
  },
);

type ServicesCatalogSectionProps = {
  pages: ServicePageListItem[];
  heroEyebrow?: string;
  heroHeading?: string;
  heroDescription?: string;
};

function ServiceCatalogCard({
  href,
  title,
  description,
  slug,
  delay = 0,
  layout = "grid",
}: {
  href: string;
  title: string;
  description: string;
  slug: string;
  delay?: number;
  layout?: "grid" | "carousel";
}) {
  const Icon = getServiceIcon(slug);

  if (layout === "carousel") {
    return (
      <Link
        href={href}
        className="group flex h-full min-h-[168px] flex-col justify-between rounded-2xl border border-border bg-background p-5 shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-primary/4 active:bg-primary/5"
      >
        <div className="flex min-w-0 gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
            <Icon size={18} aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="font-heading text-base font-bold text-foreground transition-colors group-hover:text-primary">
              {title}
            </h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        <span className="mt-4 inline-flex items-center gap-1.5 font-body text-xs font-semibold text-primary">
          Learn more
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </Link>
    );
  }

  return (
    <AnimateOnScroll delay={delay}>
      <Link
        href={href}
        className="hover-lift group flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-primary/4 hover:shadow-lg"
      >
        <span className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/30">
          <Icon size={18} aria-hidden />
        </span>
        <h3 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 font-body text-sm font-semibold text-primary">
          Learn more
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </Link>
    </AnimateOnScroll>
  );
}

function QuickJumpChips({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="mb-3 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Quick jump
      </p>
      <div className="services-mobile-chips -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {ECOSYSTEM_QUICK_JUMP_SERVICES.map((service) => (
          <Link
            key={service.slug}
            href={serviceHref(service.slug)}
            className="shrink-0 snap-start rounded-full border border-border bg-background px-3.5 py-2 font-body text-xs font-semibold text-foreground transition-colors hover:border-primary/35 hover:bg-primary/8 hover:text-primary active:bg-primary/12"
          >
            {service.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function AllServicesList() {
  return (
    <div className="mt-6 hidden lg:block">
      <p className="mb-3 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        All services
      </p>
      <div className="flex flex-wrap gap-2">
        {ECOSYSTEM_QUICK_JUMP_SERVICES.map((service) => (
          <Link
            key={service.slug}
            href={serviceHref(service.slug)}
            className="rounded-full border border-border bg-background/80 px-3 py-1.5 font-body text-xs font-medium text-foreground/90 transition-colors hover:border-primary/35 hover:bg-primary/8 hover:text-primary"
          >
            {service.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function CatalogHeroCopy({
  eyebrow = "What we do",
  heading = "Services built for modern operations",
  description = "AI automation is our core practice, with seven specializations plus marketing, virtual assistance, and web development when you need the full stack.",
}: {
  eyebrow?: string;
  heading?: string;
  description?: string;
}) {
  const headingParts = heading.includes("modern operations")
    ? heading.split("modern operations")
    : [heading];

  return (
    <>
      <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-body text-xs font-bold uppercase tracking-widest text-primary">
        <Sparkles size={12} aria-hidden />
        {eyebrow}
      </span>
      <h1
        id="services-catalog-heading"
        className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl"
      >
        {headingParts.length > 1 ? (
          <>
            {headingParts[0]}
            <span className="text-primary">modern operations</span>
            {headingParts[1]}
          </>
        ) : (
          heading
        )}
      </h1>
      <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
        {description}
      </p>
      <p className="mt-3 hidden font-body text-sm text-primary/90 lg:block">
        Tap any node in the ecosystem to explore a service.
      </p>
      <p className="mt-3 font-body text-sm text-primary/90 lg:hidden">
        Browse services below or use quick jump.
      </p>
    </>
  );
}

export function ServicesCatalogSection({
  pages,
  heroEyebrow,
  heroHeading,
  heroDescription,
}: ServicesCatalogSectionProps) {
  const { additional } = splitServicePages(pages);
  const capabilities = getPrimaryServiceCapabilities(pages);

  return (
    <>
      <section
        className="relative overflow-x-clip border-b border-border bg-surface py-section max-sm:py-section-sm"
        aria-labelledby="services-catalog-heading"
      >
        <PageHeroBackground />
        <div className="pointer-events-none absolute inset-0 section-ambient-glow" aria-hidden />
        <Container className="relative z-10">
          {/* Mobile hero: text + quick jump only */}
          <div className="lg:hidden">
            <AnimateOnScroll className="min-w-0 text-center">
              <CatalogHeroCopy
                eyebrow={heroEyebrow}
                heading={heroHeading}
                description={heroDescription}
              />
              <QuickJumpChips className="mt-6" />
            </AnimateOnScroll>
          </div>

          {/* Desktop hero: two-column with graph */}
          <div className="hidden items-center gap-10 lg:grid lg:grid-cols-[0.95fr_1.05fr] xl:gap-14">
            <AnimateOnScroll className="min-w-0 text-left">
              <CatalogHeroCopy
                eyebrow={heroEyebrow}
                heading={heroHeading}
                description={heroDescription}
              />
              <AllServicesList />
            </AnimateOnScroll>

            <AnimateOnScroll delay={80} className="min-w-0">
              <div className="mx-auto w-full xl:max-w-2xl">
                <ServicesEcosystemGraph visible />
              </div>
            </AnimateOnScroll>
          </div>
        </Container>
      </section>

      <section className="bg-background py-section max-sm:py-section-sm" aria-label="AI Automation">
        <Container>
          <AnimateOnScroll className="mb-6">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Core practice
            </p>
          </AnimateOnScroll>

          <AiAutomationCapabilitiesGrid
            capabilities={capabilities}
            embedded
          />
        </Container>
      </section>

      {additional.length > 0 ? (
        <section
          className="border-t border-border bg-surface py-section max-sm:py-section-sm"
          aria-label="General services"
        >
          <Container>
            <AnimateOnScroll className="mb-6">
              <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                General services
              </p>
              <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-muted-foreground sm:text-base">
                Supporting services that keep growth, operations, and delivery moving alongside
                your automation stack.
              </p>
            </AnimateOnScroll>

            <MobileAutoCarousel
              ariaLabel="General services"
              desktopClassName="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3"
              className="md:contents"
              mobileTrackClassName="gap-3"
              mobileSlideClassName="w-full shrink-0 snap-center"
              autoMs={4500}
              mobileChildren={additional.map((service) => (
                <ServiceCatalogCard
                  key={service._id}
                  href={serviceHref(service.slug)}
                  slug={service.slug}
                  title={getServiceLabel(service.slug, service.title)}
                  description={service.description ?? ""}
                  layout="carousel"
                />
              ))}
            >
              {additional.map((service, index) => (
                <ServiceCatalogCard
                  key={service._id}
                  href={serviceHref(service.slug)}
                  slug={service.slug}
                  title={getServiceLabel(service.slug, service.title)}
                  description={service.description ?? ""}
                  delay={80 + index * 50}
                />
              ))}
            </MobileAutoCarousel>
          </Container>
        </section>
      ) : null}
    </>
  );
}
