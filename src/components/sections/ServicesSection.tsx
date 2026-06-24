"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Container } from "@/components/Container";
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
        className="group flex h-full min-h-[148px] flex-col justify-between rounded-2xl border border-border bg-background p-5 shadow-sm transition-colors duration-200 hover:border-primary/30 active:bg-primary/5"
      >
        <div className="min-w-0">
          <h3 className="font-heading text-base font-bold text-foreground transition-colors group-hover:text-primary">
            {getServiceLabel(service.slug, service.title)}
          </h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
            {service.description}
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
      href={serviceHref(service.slug)}
      className="hover-lift group flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5 hover:shadow-md"
    >
      <h3 className="mb-2 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
        {getServiceLabel(service.slug, service.title)}
      </h3>
      <p className="flex-1 font-body text-sm leading-relaxed text-muted-foreground">
        {service.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 font-body text-xs font-semibold text-primary">
        Learn more
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

function GeneralServicesSection({ services }: { services: ServicePageListItem[] }) {
  if (!services.length) return null;

  return (
    <div className="mt-10 sm:mt-12">
      <AnimateOnScroll>
        <div className="mb-5 sm:mb-6">
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
            General Services
          </p>
          <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-muted-foreground sm:text-base">
            Beyond AI automation, we help you grow, operate, and ship with dedicated supporting
            services.
          </p>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll delay={80}>
        <MobileAutoCarousel
          ariaLabel="General services"
          desktopClassName="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3"
          className="md:contents"
          mobileTrackClassName="gap-0"
          mobileSlideClassName="w-full shrink-0 snap-center"
          autoMs={4500}
          mobileChildren={services.map((service) => (
            <GeneralServiceCard key={service._id} service={service} layout="carousel" />
          ))}
        >
          {services.map((service) => (
            <GeneralServiceCard key={service._id} service={service} layout="grid" />
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
      className="relative overflow-hidden bg-surface py-section max-sm:py-section-sm"
      aria-labelledby="services-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 section-ambient-glow"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <AnimateOnScroll>
          <div className="mb-10 text-center sm:mb-14 md:mb-16">
            {eyebrow ? (
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 font-body text-[10px] font-bold uppercase tracking-widest text-primary sm:mb-4 sm:px-4 sm:text-xs">
                <Sparkles size={12} />
                {eyebrow}
              </span>
            ) : null}
            <h2
              id="services-heading"
              className="font-heading text-[1.75rem] font-extrabold leading-tight text-foreground sm:text-4xl md:text-5xl"
            >
              {heading.split(" ").map((word, i, arr) => {
                const isLast = i === arr.length - 1;
                return isLast ? (
                  <span key={word} className="text-primary">
                    {word}
                  </span>
                ) : (
                  <span key={word}>{word} </span>
                );
              })}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl px-2 font-body text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:px-0 sm:text-base">
              AI automation is our core practice — plus digital marketing, virtual assistance, and
              web development to keep your whole operation moving forward.
            </p>
          </div>
        </AnimateOnScroll>

        <AiAutomationCapabilitiesGrid
          capabilities={capabilities}
          embedded
        />

        {additional.length > 0 ? <GeneralServicesSection services={additional} /> : null}
      </Container>
    </section>
  );
}
