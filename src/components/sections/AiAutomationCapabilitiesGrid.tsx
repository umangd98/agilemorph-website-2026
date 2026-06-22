"use client";

import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";

import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";
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

function CapabilityIcon({ capability }: { capability: CapabilityWithMeta }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-lg text-primary transition-colors duration-200 group-hover:border-primary/30 group-hover:bg-primary/15">
      {capability.icon ? (
        <span className="leading-none" aria-hidden>
          {capability.icon}
        </span>
      ) : (
        <Bot size={18} />
      )}
    </span>
  );
}

function FeaturedLeadCard({ capability }: { capability: CapabilityWithMeta }) {
  return (
    <Link
      href={resolveCapabilityHref(capability)}
      className="group flex flex-col gap-5 border-b border-border bg-primary/4 p-6 transition-colors duration-200 hover:bg-primary/7 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-8"
    >
      <div className="flex min-w-0 items-start gap-4 sm:items-center sm:gap-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/12 text-2xl text-primary transition-transform duration-200 group-hover:scale-105">
          {capability.icon ? (
            <span aria-hidden>{capability.icon}</span>
          ) : (
            <Bot size={22} />
          )}
        </span>

        <div className="min-w-0">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Lead service
          </p>
          <h3 className="mt-1 font-heading text-xl font-extrabold text-foreground transition-colors group-hover:text-primary sm:text-2xl">
            {capability.title}
          </h3>
          <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-muted-foreground sm:text-base">
            {capability.description}
          </p>
        </div>
      </div>

      <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-primary/20 bg-background px-4 py-2 font-body text-sm font-semibold text-primary shadow-sm transition-all duration-200 group-hover:border-primary/35 group-hover:bg-primary group-hover:text-white sm:self-center">
        View service
        <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

function SecondaryCapabilityCard({ capability }: { capability: CapabilityWithMeta }) {
  return (
    <Link
      href={resolveCapabilityHref(capability)}
      className="group flex h-full flex-col bg-background p-6 transition-colors duration-200 hover:bg-primary/4 sm:p-7"
    >
      <CapabilityIcon capability={capability} />
      <h3 className="mb-2 mt-4 font-heading text-base font-semibold text-foreground transition-colors group-hover:text-primary">
        {capability.title}
      </h3>
      <p className="font-body text-sm leading-relaxed text-muted-foreground">{capability.description}</p>
    </Link>
  );
}

function CapabilitiesGrid({ capabilities }: { capabilities: readonly CapabilityItem[] }) {
  const { featured, secondary } = splitCapabilities(capabilities);

  if (!featured) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
      <FeaturedLeadCard capability={featured} />

      <div className="border-b border-border px-6 py-3 sm:px-8">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Specializations
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {secondary.map((capability) => (
          <SecondaryCapabilityCard key={capability.title} capability={capability} />
        ))}
      </div>
    </div>
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
