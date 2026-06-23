"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";
import { ServicesEcosystemGraph } from "@/components/hero-animations/ServicesEcosystemGraph";
import { ECOSYSTEM_QUICK_JUMP_SERVICES } from "@/components/hero-animations/hero-ecosystem-graph";
import { MobileAutoCarousel } from "@/components/MobileAutoCarousel";
import { PageHeroBackground } from "@/components/PageHeroBackground";
import {
  getServiceIcon,
  getServiceLabel,
  PRIMARY_SERVICE_CAPABILITIES,
  PRIMARY_SERVICE_SLUG,
  resolveCapabilityHref,
  serviceHref,
  splitServicePages,
} from "@/lib/services";
import type { ServicePageListItem } from "@/sanity/types";

type ServicesCatalogSectionProps = {
  pages: ServicePageListItem[];
};

function ServiceCatalogCard({
  href,
  title,
  description,
  slug,
  featured = false,
  delay = 0,
  layout = "grid",
}: {
  href: string;
  title: string;
  description: string;
  slug: string;
  featured?: boolean;
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
        className={`hover-lift group flex h-full flex-col rounded-2xl border bg-background shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg ${
          featured
            ? "border-primary/25 bg-primary/4 p-7 sm:p-8 md:flex-row md:items-center md:justify-between md:gap-8"
            : "border-border p-6 hover:bg-primary/4"
        }`}
      >
        <div className={`flex min-w-0 gap-4 ${featured ? "md:flex-1 md:items-start" : "flex-col"}`}>
          <span
            className={`flex shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/30 ${
              featured ? "h-12 w-12" : "mb-4 h-10 w-10"
            }`}
          >
            <Icon size={featured ? 22 : 18} aria-hidden />
          </span>
          <div className="min-w-0">
            <h3
              className={`font-heading font-bold text-foreground transition-colors group-hover:text-primary ${
                featured ? "text-2xl sm:text-3xl" : "text-lg"
              }`}
            >
              {title}
            </h3>
            <p
              className={`mt-2 font-body leading-relaxed text-muted-foreground ${
                featured ? "text-sm sm:text-base" : "text-sm"
              }`}
            >
              {description}
            </p>
          </div>
        </div>

        <span
          className={`mt-5 inline-flex items-center gap-2 font-body text-sm font-semibold text-primary ${
            featured ? "md:mt-0 md:shrink-0" : ""
          }`}
        >
          {featured ? "Explore service" : "Learn more"}
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

function AllServicesList() {
  return (
    <div className="mt-6">
      <p className="mb-3 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:text-left">
        All services
      </p>
      <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
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

function QuickJumpChips() {
  return (
    <div className="mt-5 lg:hidden">
      <p className="mb-3 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Quick jump
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ECOSYSTEM_QUICK_JUMP_SERVICES.map((service) => (
          <Link
            key={service.slug}
            href={serviceHref(service.slug)}
            className="shrink-0 rounded-full border border-border bg-background px-3.5 py-2 font-body text-xs font-semibold text-foreground transition-colors hover:border-primary/35 hover:bg-primary/8 hover:text-primary active:bg-primary/12"
          >
            {service.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ServicesCatalogSection({ pages }: ServicesCatalogSectionProps) {
  const { primary: primaryPage, additional } = splitServicePages(pages);
  const primaryCapability = PRIMARY_SERVICE_CAPABILITIES.find(
    (item) => item.slug === PRIMARY_SERVICE_SLUG,
  );
  const aiSpecializations = PRIMARY_SERVICE_CAPABILITIES.slice(1);

  const primaryTitle = getServiceLabel(
    PRIMARY_SERVICE_SLUG,
    primaryPage?.title ?? primaryCapability?.title ?? "AI Automation",
  );
  const primaryDescription =
    primaryPage?.description ??
    primaryCapability?.description ??
    "End-to-end AI workflows, agents, and integrations.";

  return (
    <>
      <section
        className="relative overflow-x-clip border-b border-border bg-surface py-section max-sm:py-section-sm"
        aria-labelledby="services-catalog-heading"
      >
        <PageHeroBackground />
        <div className="pointer-events-none absolute inset-0 section-ambient-glow" aria-hidden />
        <Container className="relative z-10">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 xl:gap-14">
            <AnimateOnScroll className="min-w-0 text-center lg:text-left">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-body text-xs font-bold uppercase tracking-widest text-primary">
                <Sparkles size={12} aria-hidden />
                What we do
              </span>
              <h1
                id="services-catalog-heading"
                className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl"
              >
                Services built for{" "}
                <span className="text-primary">modern operations</span>
              </h1>
              <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
                AI automation is our core practice — with seven specializations plus
                marketing, virtual assistance, and web development when you need the full
                stack.
              </p>
              <p className="mt-3 font-body text-sm text-primary/90">
                Tap any node in the ecosystem to explore a service.
              </p>
              <AllServicesList />
            </AnimateOnScroll>

            <AnimateOnScroll delay={80} className="min-w-0">
              <div className="mx-auto w-full max-w-lg lg:max-w-none xl:max-w-2xl">
                <ServicesEcosystemGraph visible />
                <QuickJumpChips />
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

          <ServiceCatalogCard
            href={serviceHref(PRIMARY_SERVICE_SLUG)}
            slug={PRIMARY_SERVICE_SLUG}
            title={primaryTitle}
            description={primaryDescription}
            featured
            delay={60}
          />

          {aiSpecializations.length > 0 ? (
            <div className="mt-12 sm:mt-14">
              <AnimateOnScroll className="mb-6">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  AI automation specializations
                </p>
              </AnimateOnScroll>

              <MobileAutoCarousel
                ariaLabel="AI automation specializations"
                desktopClassName="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3"
                className="md:contents"
                mobileTrackClassName="gap-0"
                mobileSlideClassName="w-full shrink-0 snap-center"
                autoMs={4500}
                mobileChildren={aiSpecializations.map((capability) => (
                  <ServiceCatalogCard
                    key={capability.slug}
                    href={resolveCapabilityHref(capability)}
                    slug={capability.slug}
                    title={capability.title}
                    description={capability.description}
                    layout="carousel"
                  />
                ))}
              >
                {aiSpecializations.map((capability, index) => (
                  <ServiceCatalogCard
                    key={capability.slug}
                    href={resolveCapabilityHref(capability)}
                    slug={capability.slug}
                    title={capability.title}
                    description={capability.description}
                    delay={80 + index * 50}
                  />
                ))}
              </MobileAutoCarousel>
            </div>
          ) : null}
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
              mobileTrackClassName="gap-0"
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
