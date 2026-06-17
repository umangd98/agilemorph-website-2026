"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Bot,
  ChevronDown,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
import {
  PRIMARY_SERVICE_CAPABILITIES,
  PRIMARY_SERVICE_SLUG,
  serviceDisplayTitle,
  serviceHref,
  splitServicePages,
} from "@/lib/services";
import type { ServicePageListItem } from "@/sanity/types";

type ServicesSectionProps = {
  eyebrow?: string;
  heading?: string;
  pages?: ServicePageListItem[];
};

const PRIMARY_METRICS = [
  { value: "10,000+", label: "Hours of automation shipped" },
  { value: "40%+", label: "Average reduction in manual ops time" },
  { value: "24/7", label: "Systems running without you" },
] as const;

function AdditionalServiceCard({
  service,
  index,
}: {
  service: ServicePageListItem;
  index: number;
}) {
  return (
    <AnimateOnScroll delay={index * 60} className="h-full">
      <div className="hover-lift group flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-sm">
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
        ) : null}

        <h3 className="mb-2 font-heading text-lg font-bold text-foreground">
          {serviceDisplayTitle(service.title)}
        </h3>
        <p className="mb-5 flex-1 font-body text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        <Link
          href={serviceHref(service.slug)}
          className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest text-primary transition-all group-hover:gap-3"
        >
          View Service Details
          <ArrowRight size={14} />
        </Link>
      </div>
    </AnimateOnScroll>
  );
}

export function ServicesSection({
  eyebrow = "Our Expertise",
  heading = "Discover Our Services",
  pages = [],
}: ServicesSectionProps) {
  const [showAdditional, setShowAdditional] = useState(false);
  const { primary, additional } = splitServicePages(pages);
  const subServices =
    primary?.capabilities?.length ? primary.capabilities : [...PRIMARY_SERVICE_CAPABILITIES];
  const primaryHref = primary ? serviceHref(primary.slug) : serviceHref(PRIMARY_SERVICE_SLUG);

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

        {primary ? (
          <AnimateOnScroll delay={80}>
            <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
              <div className="relative grid grid-cols-1 gap-8 border-b border-border p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-11">
                <div
                  className="pointer-events-none absolute inset-0 opacity-60"
                  aria-hidden
                  style={{
                    background:
                      "radial-gradient(ellipse 70% 60% at 85% 0%, rgba(34,197,94,0.12), transparent 60%)",
                  }}
                />

                <div className="relative z-10">
                  <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary px-3.5 py-1.5 font-body text-[11px] font-bold uppercase tracking-widest text-white">
                    ★ Primary Service
                  </span>
                  <h3 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
                    {serviceDisplayTitle(primary.title)}
                  </h3>
                  <p className="max-w-xl font-body text-base leading-relaxed text-muted-foreground">
                    {primary.description}
                  </p>
                  <Link
                    href={primaryHref}
                    className="group mt-6 inline-flex items-center gap-2 font-body text-sm font-bold text-primary transition-all hover:gap-3"
                  >
                    Explore {serviceDisplayTitle(primary.title)}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <div className="relative z-10 flex flex-col justify-center gap-3.5">
                  {PRIMARY_METRICS.map((metric) => (
                    <div
                      key={metric.label}
                      className="flex items-baseline gap-3 rounded-xl border border-border bg-surface/80 px-4 py-3.5"
                    >
                      <span className="min-w-[4.5rem] font-heading text-2xl font-extrabold text-primary">
                        {metric.value}
                      </span>
                      <span className="font-body text-sm text-muted-foreground">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {subServices.length > 0 ? (
                <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
                  {subServices.map((sub) => (
                    <Link
                      key={sub.title}
                      href={primaryHref}
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
              ) : null}
            </div>
          </AnimateOnScroll>
        ) : null}

        {additional.length > 0 ? (
          <div className="mt-14">
            <div className="mb-6 flex items-center gap-4">
              <h3 className="shrink-0 font-body text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Additional Services
              </h3>
              <span className="h-px flex-1 bg-border" aria-hidden />
            </div>

            <div className="mb-6 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAdditional((open) => !open)}
                aria-expanded={showAdditional}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 font-body text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/30 hover:text-primary"
              >
                {showAdditional ? "Show less" : "Show more services"}
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${showAdditional ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            <div
              className="grid transition-[grid-template-rows] duration-500 ease-in-out"
              style={{ gridTemplateRows: showAdditional ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 gap-5 pb-2 sm:grid-cols-2 lg:grid-cols-4">
                  {additional.map((service, index) => (
                    <AdditionalServiceCard
                      key={service._id}
                      service={service}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
