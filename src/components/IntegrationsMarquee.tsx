"use client";

import { LogoMarquee } from "@/components/LogoMarquee";
import type { IntegrationItem } from "@/sanity/types";

type IntegrationsMarqueeProps = {
  heading?: string;
  items?: IntegrationItem[];
};

export function IntegrationsMarquee({
  heading = "We integrate with 500+ platforms seamlessly",
  items = [],
}: IntegrationsMarqueeProps) {
  if (!items.length) return null;

  return (
    <section
      className="overflow-x-clip border-y border-border bg-background py-10 sm:py-section-sm"
      aria-label="Integrations we work with"
    >
      <div className="mb-6 px-4 text-center sm:mb-8 sm:px-6">
        <p className="mx-auto max-w-md font-body text-[10px] font-bold uppercase leading-relaxed tracking-[0.16em] text-muted-foreground sm:text-xs sm:tracking-[0.2em]">
          {heading}
        </p>
      </div>

      <LogoMarquee items={items} />
    </section>
  );
}
