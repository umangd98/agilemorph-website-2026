"use client";

import Link from "next/link";
import { ArrowRight, Bot, Sparkles } from "lucide-react";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
import {
  PRIMARY_SERVICE_CAPABILITIES,
  resolveCapabilityHref,
  serviceDisplayTitle,
  serviceHref,
  splitServicePages,
} from "@/lib/services";
import type { CapabilityItem, ServicePageListItem } from "@/sanity/types";

type ServicesSectionProps = {
  eyebrow?: string;
  heading?: string;
  pages?: ServicePageListItem[];
};

function AdditionalServiceCard({
  service,
  index,
}: {
  service: ServicePageListItem;
  index: number;
}) {
  return (
    <AnimateOnScroll delay={index * 60} className="h-full">
      <Link
        href={serviceHref(service.slug)}
        className="hover-lift group flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-sm transition-colors hover:border-primary/20"
      >
        {service.heroImage ? (
          <div className="relative mb-5 h-10 w-10 transition-transform duration-300 group-hover:scale-110">
            <SanityImage
              image={service.heroImage}
              alt={service.heroImage.alt ?? service.title}
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
          </div>
        ) : (
          <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-muted-foreground">
            <Bot size={18} />
          </span>
        )}

        <h3 className="mb-2 font-heading text-lg font-bold text-foreground">
          {serviceDisplayTitle(service.title)}
        </h3>
        <p className="mb-5 flex-1 font-body text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        <span className="inline-flex items-center gap-2 font-body text-sm font-semibold text-primary transition-all group-hover:gap-3">
          Explore
          <ArrowRight size={14} />
        </span>
      </Link>
    </AnimateOnScroll>
  );
}

function AiAutomationGrid({
  capabilities,
}: {
  capabilities: readonly CapabilityItem[];
}) {
  if (!capabilities.length) return null;

  return (
    <AnimateOnScroll delay={80}>
      <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((sub) => (
            <Link
              key={sub.title}
              href={resolveCapabilityHref(sub)}
              className="group flex flex-col bg-background p-7 transition-colors duration-200 hover:bg-primary/5"
            >
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition-colors group-hover:border-primary/30 group-hover:bg-primary/15">
                {sub.icon ? (
                  <span className="text-lg leading-none" aria-hidden>
                    {sub.icon}
                  </span>
                ) : (
                  <Bot size={18} />
                )}
              </span>
              <h4 className="mb-2 font-heading text-lg font-semibold text-foreground">
                {sub.title}
              </h4>
              <p className="mb-4 flex-1 font-body text-sm text-muted-foreground">
                {sub.description}
              </p>
              <span className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-primary opacity-90 transition-all group-hover:gap-2.5 group-hover:opacity-100">
                Explore
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </AnimateOnScroll>
  );
}

export function ServicesSection({
  eyebrow = "What We Do",
  heading = "Discover Our Services",
  pages = [],
}: ServicesSectionProps) {
  const { additional } = splitServicePages(pages);
  const subServices: CapabilityItem[] = [...PRIMARY_SERVICE_CAPABILITIES];

  return (
    <section
      className="bg-surface py-section max-sm:py-section-sm"
      aria-labelledby="services-heading"
    >
      <Container>
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

        <AiAutomationGrid capabilities={subServices} />

        {additional.length > 0 ? (
          <div className="mt-14">
            <div className="mb-6 flex items-center gap-4">
              <h3 className="shrink-0 font-body text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Additional Services
              </h3>
              <span className="h-px flex-1 bg-border" aria-hidden />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {additional.map((service, index) => (
                <AdditionalServiceCard key={service._id} service={service} index={index} />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
