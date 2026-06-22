"use client";

import Link from "next/link";
import { Bot } from "lucide-react";

import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";
import { resolveCapabilityHref } from "@/lib/services";
import type { CapabilityItem } from "@/sanity/types";

type AiAutomationCapabilitiesGridProps = {
  heading?: string;
  capabilities: readonly CapabilityItem[];
  /** When true, renders only the grid (for use inside an existing section/container). */
  embedded?: boolean;
  className?: string;
};

function getOrphanSpanClasses(index: number, total: number) {
  const isLast = index === total - 1;
  if (!isLast) return "";

  const classes: string[] = [];

  if (total % 2 === 1) {
    classes.push(
      "sm:col-span-2 sm:flex-row sm:items-start sm:gap-6",
      "[&>span:first-child]:sm:mb-0",
    );
  }

  if (total % 3 === 1) {
    classes.push(
      "lg:col-span-3 lg:flex-row lg:items-start lg:gap-6",
      "[&>span:first-child]:lg:mb-0",
      "xl:col-span-1 xl:flex-col xl:items-stretch xl:gap-0",
      "[&>span:first-child]:xl:mb-4",
    );
  }

  return classes.join(" ");
}

function CapabilitiesGrid({ capabilities }: { capabilities: readonly CapabilityItem[] }) {
  const total = capabilities.length;

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {capabilities.map((sub, index) => (
          <Link
            key={sub.title}
            href={resolveCapabilityHref(sub)}
            className={`hover-lift group flex flex-col bg-background p-7 transition-colors duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md ${getOrphanSpanClasses(index, total)}`}
          >
            <span className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:border-primary/30 group-hover:bg-primary/15">
              {sub.icon ? (
                <span className="text-lg leading-none" aria-hidden>
                  {sub.icon}
                </span>
              ) : (
                <Bot size={18} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="mb-2 font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                {sub.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground">{sub.description}</p>
            </div>
          </Link>
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
