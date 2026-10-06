"use client";

import { LogoMarquee } from "@/components/LogoMarquee";
import type { IntegrationItem } from "@/sanity/types";

type IntegrationsMarqueeProps = {
  heading?: string;
  items?: IntegrationItem[];
};

export function IntegrationsMarquee({
  heading = "Tools we connect in client workflows",
  items = [],
}: IntegrationsMarqueeProps) {
  if (!items.length) return null;

  return (
    <section
      className="border-line overflow-x-clip border-t py-16 sm:py-20"
      aria-label="Integrations we work with"
    >
      <div className="mb-8 px-4 text-center sm:px-6">
        <p className="syslabel mx-auto max-w-md leading-relaxed">{heading}</p>
      </div>

      <LogoMarquee items={items} />
    </section>
  );
}
