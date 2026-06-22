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

function CapabilitiesGrid({ capabilities }: { capabilities: readonly CapabilityItem[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((sub) => (
          <Link
            key={sub.title}
            href={resolveCapabilityHref(sub)}
            className="hover-lift group flex flex-col bg-background p-7 transition-colors duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md"
          >
            <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:border-primary/30 group-hover:bg-primary/15">
              {sub.icon ? (
                <span className="text-lg leading-none" aria-hidden>
                  {sub.icon}
                </span>
              ) : (
                <Bot size={18} />
              )}
            </span>
            <h3 className="mb-2 font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
              {sub.title}
            </h3>
            <p className="flex-1 font-body text-sm text-muted-foreground">{sub.description}</p>
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
