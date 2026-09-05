"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/ui";
import { ECOSYSTEM_QUICK_JUMP_SERVICES } from "@/components/hero-animations/hero-ecosystem-graph";
import { MobileAutoCarousel } from "@/components/MobileAutoCarousel";
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
        className="group flex h-full min-h-[168px] flex-col justify-between rounded-xl border border-line bg-bg-elevated p-5 transition-colors duration-300 hover:bg-bg-raised"
      >
        <div className="flex min-w-0 gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-bg-raised text-signal">
            <Icon size={18} aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-medium leading-snug text-fg">
              {title}
            </h3>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-fg-muted">
              {description}
            </p>
          </div>
        </div>
        <span className="mt-4 inline-flex items-center gap-1.5 font-body text-xs font-medium text-fg transition-colors group-hover:text-signal">
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
        className="hover-lift group flex h-full flex-col rounded-xl border border-line bg-bg-elevated p-6 transition-colors duration-300 hover:bg-bg-raised"
      >
        <span className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-bg-raised text-signal">
          <Icon size={18} aria-hidden />
        </span>
        <h3 className="text-lg font-medium leading-snug text-fg">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-fg-muted">
          {description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 font-body text-sm font-medium text-fg transition-colors group-hover:text-signal">
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
      <p className="syslabel mb-3">
        Quick jump
      </p>
      <div className="services-mobile-chips -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {ECOSYSTEM_QUICK_JUMP_SERVICES.map((service) => (
          <Link
            key={service.slug}
            href={serviceHref(service.slug)}
            className="shrink-0 snap-start rounded-full border border-line bg-bg-elevated px-3.5 py-2 font-mono text-xs text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
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
      <p className="syslabel mb-3">
        All services
      </p>
      <div className="flex flex-wrap gap-2">
        {ECOSYSTEM_QUICK_JUMP_SERVICES.map((service) => (
          <Link
            key={service.slug}
            href={serviceHref(service.slug)}
            className="rounded-full border border-line bg-bg-elevated px-3 py-1.5 font-mono text-xs text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            {service.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function CatalogHeroCopy({
  eyebrow = "What We Do",
  heading = "Services Built For Modern Operations",
  description = "AI automation is the whole practice, split into seven specializations so you can start where the hours are actually going.",
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
      <span className="syslabel mb-4 inline-flex items-center gap-2">
        <Sparkles size={12} aria-hidden />
        {eyebrow}
      </span>
      <h1
        id="services-catalog-heading"
        className="text-balance text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-fg sm:text-4xl lg:text-5xl"
      >
        {headingParts.length > 1 ? (
          <>
            {headingParts[0]}
            <span className="text-signal">modern operations</span>
            {headingParts[1]}
          </>
        ) : (
          heading
        )}
      </h1>
      <p className="mt-5 text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
        {description}
      </p>
      <p className="mt-3 hidden font-mono text-sm text-fg-dim lg:block">
        Tap any node in the ecosystem to explore a service.
      </p>
      <p className="mt-3 font-mono text-sm text-fg-dim lg:hidden">
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
        className="relative overflow-x-clip border-b border-line pt-36 pb-20 sm:pt-40 sm:pb-24"
        aria-labelledby="services-catalog-heading"
      >
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

      <section className="border-t border-line py-24 sm:py-32" aria-label="AI Automation">
        <Container>
          <AnimateOnScroll className="mb-6">
            <p className="syslabel text-signal">
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
          className="border-t border-line py-24 sm:py-32"
          aria-label="General Services"
        >
          <Container>
            <AnimateOnScroll className="mb-6">
              <p className="syslabel">
                General Services
              </p>
              <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-fg-muted sm:text-base">
                Supporting services that keep growth, operations, and delivery moving alongside
                your automation stack.
              </p>
            </AnimateOnScroll>

            <MobileAutoCarousel
              ariaLabel="General Services"
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
