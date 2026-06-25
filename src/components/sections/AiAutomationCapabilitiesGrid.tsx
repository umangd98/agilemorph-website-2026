"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";
import { MobileAutoCarousel } from "@/components/MobileAutoCarousel";
import { PRIMARY_SERVICE_SLUG, resolveCapabilityHref } from "@/lib/services";
import type { CapabilityItem } from "@/sanity/types";

type CapabilityWithMeta = CapabilityItem & {
  slug?: string;
  featured?: boolean;
};

type AiAutomationCapabilitiesGridProps = {
  heading?: string;
  capabilities: readonly CapabilityItem[];
  embedded?: boolean;
  className?: string;
};

function isFeaturedCapability(capability: CapabilityWithMeta) {
  return capability.featured === true || capability.slug === PRIMARY_SERVICE_SLUG;
}

function splitCapabilities(capabilities: readonly CapabilityItem[]) {
  const items = capabilities as CapabilityWithMeta[];
  const featured = items.find(isFeaturedCapability) ?? items[0];
  const secondary = featured ? items.filter((item) => item !== featured) : items;

  return { featured, secondary };
}

function FeaturedLeadCard({
  capability,
  className = "",
}: {
  capability: CapabilityWithMeta;
  className?: string;
}) {
  return (
    <Link
      href={resolveCapabilityHref(capability)}
      className={`group flex flex-col gap-5 bg-primary/4 p-5 transition-colors duration-200 hover:bg-primary/7 sm:p-6 md:flex-row md:items-center md:justify-between md:gap-8 md:p-8 ${className}`}
    >
      <div className="flex min-w-0 items-start gap-3.5 sm:items-center sm:gap-4 md:gap-5">
        <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/12 text-xl text-primary transition-transform duration-200 group-hover:scale-105 sm:h-12 sm:w-12 sm:text-2xl md:flex">
          {capability.icon ? (
            <span aria-hidden>{capability.icon}</span>
          ) : null}
        </span>

        <div className="min-w-0">
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-xs">
            Lead service
          </p>
          <h3 className="mt-1 font-heading text-lg font-extrabold text-foreground transition-colors group-hover:text-primary sm:text-xl md:text-2xl">
            {capability.title}
          </h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
            {capability.description}
          </p>
        </div>
      </div>

      <span className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-2.5 font-body text-sm font-semibold text-primary shadow-sm transition-all duration-200 group-hover:border-primary/35 group-hover:bg-primary group-hover:text-white md:w-auto md:self-center">
        View service
        <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

function SecondaryCapabilityCard({
  capability,
  layout = "grid",
}: {
  capability: CapabilityWithMeta;
  layout?: "grid" | "carousel";
}) {
  if (layout === "carousel") {
    return (
      <Link
        href={resolveCapabilityHref(capability)}
        className="group flex h-full min-h-[156px] flex-col justify-between rounded-2xl border border-border bg-background p-5 shadow-sm transition-colors duration-200 hover:border-primary/30 active:bg-primary/5"
      >
        <div className="min-w-0">
          <h3 className="font-heading text-base font-bold text-foreground transition-colors group-hover:text-primary">
            {capability.title}
          </h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
            {capability.description}
          </p>
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
    <Link
      href={resolveCapabilityHref(capability)}
      className="group flex h-full flex-col bg-background p-6 transition-colors duration-200 hover:bg-primary/4 sm:p-7"
    >
      <h3 className="mb-2 font-heading text-base font-semibold text-foreground transition-colors group-hover:text-primary">
        {capability.title}
      </h3>
      <p className="font-body text-sm leading-relaxed text-muted-foreground">{capability.description}</p>
    </Link>
  );
}

function SpecializationsHeading({ className = "" }: { className?: string }) {
  return (
    <p
      className={`font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs ${className}`}
    >
      Specializations
    </p>
  );
}

function CapabilitiesGrid({ capabilities }: { capabilities: readonly CapabilityItem[] }) {
  const { featured, secondary } = splitCapabilities(capabilities);

  if (!featured) {
    return null;
  }

  return (
    <>
      {/* Mobile: lead card only */}
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm md:hidden">
        <FeaturedLeadCard capability={featured} />
      </div>

      {/* Mobile: specializations carousel - outside parent card */}
      {secondary.length > 0 ? (
        <div className="mt-8 md:hidden">
          <SpecializationsHeading className="mb-4" />
          <MobileAutoCarousel
            ariaLabel="AI automation specializations"
            desktopClassName="hidden"
            mobileTrackClassName="gap-3"
            mobileSlideClassName="w-full shrink-0 snap-center"
            autoMs={4500}
            mobileChildren={secondary.map((capability) => (
              <SecondaryCapabilityCard
                key={capability.title}
                capability={capability}
                layout="carousel"
              />
            ))}
          >
            {null}
          </MobileAutoCarousel>
        </div>
      ) : null}

      {/* Desktop: unified card with grid */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-background shadow-sm sm:rounded-3xl md:block">
        <FeaturedLeadCard capability={featured} className="border-b border-border" />

        <div className="border-b border-border px-8 py-3">
          <SpecializationsHeading />
        </div>

        <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {secondary.map((capability) => (
            <SecondaryCapabilityCard
              key={capability.title}
              capability={capability}
              layout="grid"
            />
          ))}
        </div>
      </div>
    </>
  );
}

export function AiAutomationCapabilitiesGrid({
  heading,
  capabilities,
  embedded = false,
  className = "bg-surface py-section max-sm:py-section-sm",
}: AiAutomationCapabilitiesGridProps) {
  if (!capabilities.length) return null;

  if (embedded) {
    return (
      <AnimateOnScroll delay={80}>
        <CapabilitiesGrid capabilities={capabilities} />
      </AnimateOnScroll>
    );
  }

  return (
    <section className={className} aria-labelledby="ai-capabilities-heading">
      <Container>
        {heading ? (
          <AnimateOnScroll className="mb-10">
            <h2
              id="ai-capabilities-heading"
              className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl"
            >
              {heading}
            </h2>
          </AnimateOnScroll>
        ) : null}

        <AnimateOnScroll delay={heading ? 80 : 0}>
          <CapabilitiesGrid capabilities={capabilities} />
        </AnimateOnScroll>
      </Container>
    </section>
  );
}
