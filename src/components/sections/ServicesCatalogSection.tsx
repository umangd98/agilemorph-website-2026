"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";
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
}: {
  href: string;
  title: string;
  description: string;
  slug: string;
  featured?: boolean;
  delay?: number;
}) {
  const Icon = getServiceIcon(slug);

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
        className="relative overflow-hidden border-b border-border bg-surface py-section max-sm:py-section-sm"
        aria-labelledby="services-catalog-heading"
      >
        <div className="pointer-events-none absolute inset-0 section-ambient-glow" aria-hidden />
        <Container className="relative">
          <AnimateOnScroll className="mx-auto max-w-3xl text-center">
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
              AI automation is our core practice — supported by marketing, virtual assistance,
              and web development when you need the full stack.
            </p>
          </AnimateOnScroll>
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              </div>
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
