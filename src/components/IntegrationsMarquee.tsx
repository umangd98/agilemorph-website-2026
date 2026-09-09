"use client";

import { LogoMarquee } from "@/components/LogoMarquee";
import type { IntegrationItem } from "@/sanity/types";

type IntegrationsMarqueeProps = {
  heading?: string;
  items?: IntegrationItem[];
};

export function IntegrationsMarquee({
  heading = "We Integrate With 500+ Platforms Seamlessly",
  items = [],
}: IntegrationsMarqueeProps) {
  if (!items.length) return null;

  return (
    <section
      className="overflow-x-clip border-t border-line py-16 sm:py-20"
      aria-label="Integrations we work with"
    >
      <div className="mb-8 px-4 text-center sm:px-6">
        <p className="syslabel mx-auto max-w-md leading-relaxed">{heading}</p>
      </div>

      <LogoMarquee items={items} />
    </section>
  );
}
