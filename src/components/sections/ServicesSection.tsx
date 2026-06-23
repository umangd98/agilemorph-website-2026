"use client";

import Link from "next/link";
import { ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { AiAutomationCapabilitiesGrid } from "@/components/sections/AiAutomationCapabilitiesGrid";
import {
  getServiceIcon,
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

function AdditionalServiceCard({ service }: { service: ServicePageListItem }) {
  const Icon = getServiceIcon(service.slug);

  return (
    <Link
      href={serviceHref(service.slug)}
      className="hover-lift group flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5 hover:shadow-md"
    >
      <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:border-primary/30 group-hover:bg-primary/15">
        <Icon size={18} aria-hidden />
      </span>

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
      className="group/additional mt-10 border-t border-border pt-10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        className="mb-6 flex w-full cursor-pointer items-center gap-4 text-left transition-colors hover:text-foreground"
        aria-expanded={expanded}
        aria-controls="additional-services-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <h3 className="shrink-0 font-body text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors group-hover/additional:text-foreground">
          Additional Services
        </h3>
        <span className="h-px flex-1 bg-border" aria-hidden />
        <span className="flex shrink-0 items-center gap-2">
          {!expanded ? (
            <>
              <span className="hidden font-body text-xs text-muted-foreground [@media(hover:hover)]:inline">
                Hover to explore
              </span>
              <span className="font-body text-xs text-muted-foreground [@media(hover:hover)]:hidden sm:hidden">
                Tap to expand
              </span>
            </>
          ) : null}
          <ChevronDown
            size={16}
            className={`text-muted-foreground transition-transform duration-300 ${
              expanded ? "rotate-180 text-primary" : ""
            }`}
            aria-hidden
          />
        </span>
      </button>

      <div
        id="additional-services-panel"
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <div className="grid grid-cols-1 gap-5 pb-1 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <AdditionalServiceCard key={service._id} service={service} />
            ))}
          </div>
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
          <div className="mb-14 text-center md:mb-16">
            {eyebrow ? (
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-body text-xs font-bold uppercase tracking-widest text-primary">
                <Sparkles size={12} />
                {eyebrow}
              </span>
            ) : null}
            <h2
              id="services-heading"
              className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl"
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
            <p className="mx-auto mt-4 max-w-2xl font-body text-base text-muted-foreground">
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
