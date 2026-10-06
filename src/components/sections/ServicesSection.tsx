"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container, SectionHeader } from "@/components/ui";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { MobileAutoCarousel } from "@/components/MobileAutoCarousel";
import { AiAutomationCapabilitiesGrid } from "@/components/sections/AiAutomationCapabilitiesGrid";
import {
  getServiceLabel,
  getPrimaryServiceCapabilities,
  serviceHref,
  splitServicePages,
} from "@/lib/services";
import type { ServicePageListItem } from "@/sanity/types";

type ServicesSectionProps = {
  eyebrow?: string;
  heading?: string;
  pages?: ServicePageListItem[];
};

function GeneralServiceCard({
  service,
  layout = "grid",
}: {
  service: ServicePageListItem;
  layout?: "grid" | "carousel";
}) {
  if (layout === "carousel") {
    return (
      <Link
        href={serviceHref(service.slug)}
        className="group border-line bg-bg-elevated hover:bg-bg-raised flex h-full min-h-[148px] flex-col justify-between rounded-xl border p-5 transition-colors duration-200"
      >
        <div className="min-w-0">
          <h3 className="text-fg text-base leading-snug font-medium tracking-[-0.01em]">
            {getServiceLabel(service.slug, service.title)}
          </h3>
          <p className="text-fg-muted mt-2 text-sm leading-relaxed text-pretty">
            {service.description}
          </p>
        </div>
        <span className="font-body text-fg group-hover:text-signal mt-4 inline-flex items-center gap-1.5 text-xs font-medium transition-colors">
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
      href={serviceHref(service.slug)}
      className="group border-line bg-bg-elevated hover:bg-bg-raised flex h-full flex-col rounded-xl border p-6 transition-colors duration-300"
    >
      <h3 className="text-fg mb-2 text-lg leading-snug font-medium tracking-[-0.01em]">
        {getServiceLabel(service.slug, service.title)}
      </h3>
      <p className="text-fg-muted flex-1 text-sm leading-relaxed text-pretty">
        {service.description}
      </p>
      <span className="font-body text-fg group-hover:text-signal mt-4 inline-flex items-center gap-1.5 text-xs font-medium transition-colors">
        Learn more
        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}

function GeneralServicesSection({
  services,
}: {
  services: ServicePageListItem[];
}) {
  if (!services.length) return null;

  return (
    <div className="mt-10 sm:mt-12">
      <AnimateOnScroll>
        <div className="mb-5 sm:mb-6">
          <p className="font-body text-muted-foreground text-[10px] font-semibold tracking-[0.14em] uppercase sm:text-xs">
            General Services
          </p>
          <p className="font-body text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed sm:text-base">
            Beyond AI automation, we help you grow, operate, and ship with
            dedicated supporting services.
          </p>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll delay={80}>
        <MobileAutoCarousel
          ariaLabel="General Services"
          desktopClassName="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3"
          className="md:contents"
          mobileTrackClassName="gap-0"
          mobileSlideClassName="w-full shrink-0 snap-center"
          autoMs={4500}
          mobileChildren={services.map((service) => (
            <GeneralServiceCard
              key={service._id}
              service={service}
              layout="carousel"
            />
          ))}
        >
          {services.map((service) => (
            <GeneralServiceCard
              key={service._id}
              service={service}
              layout="grid"
            />
          ))}
        </MobileAutoCarousel>
      </AnimateOnScroll>
    </div>
  );
}

export function ServicesSection({
  eyebrow = "Our Expertise",
  heading = "Discover Our Services",
  pages = [],
}: ServicesSectionProps) {
  const { additional } = splitServicePages(pages);
  const capabilities = getPrimaryServiceCapabilities(pages);

  return (
    <section
      className="border-line scroll-mt-24 border-t py-24 sm:py-32"
      aria-label={heading}
    >
      <Container>
        <SectionHeader
          index="03"
          label={eyebrow}
          title={heading}
          intro="Software and AI engineering across products, data platforms, workflows, and integrations."
        />

        <AiAutomationCapabilitiesGrid capabilities={capabilities} embedded />

        {additional.length > 0 ? (
          <GeneralServicesSection services={additional} />
        ) : null}
      </Container>
    </section>
  );
}
