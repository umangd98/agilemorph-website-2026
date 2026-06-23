"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { AiAutomationCapabilitiesGrid } from "@/components/sections/AiAutomationCapabilitiesGrid";
import {
  getServiceLabel,
  PRIMARY_SERVICE_CAPABILITIES,
  serviceHref,
  splitServicePages,
} from "@/lib/services";
import type { ServicePageListItem } from "@/sanity/types";

type ServicesSectionProps = {
  eyebrow?: string;
  heading?: string;
  pages?: ServicePageListItem[];
};

function AdditionalServiceCard({ service, compact = false }: { service: ServicePageListItem; compact?: boolean }) {
  if (compact) {
    return (
      <Link
        href={serviceHref(service.slug)}
        className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5 active:bg-primary/5"
      >
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm font-bold text-foreground transition-colors group-hover:text-primary sm:text-base">
            {getServiceLabel(service.slug, service.title)}
          </h3>
          <p className="mt-1 font-body text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {service.description}
          </p>
        </div>
        <ArrowRight
          size={16}
          className="shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden
        />
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
    </Link>
  );
}

function AdditionalServicesPanel({ services }: { services: ServicePageListItem[] }) {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const expanded = hovered || open;

  return (
    <div
      className="group/additional mt-8 border-t border-border pt-8 sm:mt-10 sm:pt-10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        className="mb-5 flex w-full cursor-pointer flex-col gap-2 text-left sm:mb-6 sm:flex-row sm:items-center sm:gap-4"
        aria-expanded={expanded}
        aria-controls="additional-services-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <div className="flex w-full items-center justify-between gap-3 sm:contents">
          <h3 className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors group-hover/additional:text-foreground sm:text-sm">
            Additional Services
          </h3>
          <span className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {!expanded ? (
              <span className="font-body text-[11px] text-muted-foreground sm:text-xs">
                <span className="[@media(hover:hover)]:hidden">Tap to expand</span>
                <span className="hidden [@media(hover:hover)]:inline">Hover to explore</span>
              </span>
            ) : (
              <span className="font-body text-[11px] text-muted-foreground sm:hidden sm:text-xs">
                Tap to collapse
              </span>
            )}
            <ChevronDown
              size={16}
              className={`text-muted-foreground transition-transform duration-300 ${
                expanded ? "rotate-180 text-primary" : ""
              }`}
              aria-hidden
            />
          </span>
        </div>
        <span className="hidden h-px flex-1 bg-border sm:block" aria-hidden />
      </button>

      <div
        id="additional-services-panel"
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          {expanded ? (
            <>
              <div className="flex flex-col gap-3 pb-1 md:hidden">
                {services.map((service) => (
                  <AdditionalServiceCard key={service._id} service={service} compact />
                ))}
              </div>
              <div className="hidden gap-5 pb-1 md:grid md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <AdditionalServiceCard key={service._id} service={service} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ServicesSection({
  eyebrow = "Our Expertise",
  heading = "Discover Our Services",
  pages = [],
}: ServicesSectionProps) {
  const { additional } = splitServicePages(pages);

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
              AI automation is the engine of everything we build. Supporting services keep the
              rest of your operation moving in the same direction.
            </p>
          </div>
        </AnimateOnScroll>

        <AiAutomationCapabilitiesGrid
          capabilities={PRIMARY_SERVICE_CAPABILITIES}
          embedded
        />

        {additional.length > 0 ? <AdditionalServicesPanel services={additional} /> : null}
      </Container>
    </section>
  );
}
