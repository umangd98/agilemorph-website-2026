import Link from "next/link";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
import type { PartnerItem } from "@/sanity/types";

type PartnersSectionProps = {
  heading?: string;
  items?: PartnerItem[];
};

function PartnerCard({ partner, index }: { partner: PartnerItem; index: number }) {
  const content = (
    <div className="hover-lift group flex h-full min-h-[88px] items-center gap-4 rounded-xl border border-border bg-background px-5 py-4 shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-md">
      {partner.logo ? (
        <div className="relative h-10 w-10 shrink-0">
          <SanityImage
            image={partner.logo}
            alt={partner.logo.alt ?? partner.name}
            fill
            sizes="40px"
            className="object-contain"
          />
        </div>
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted font-heading text-sm font-bold text-foreground">
          {partner.name.charAt(0)}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate font-heading text-sm font-bold tracking-tight text-foreground sm:text-base">
          {partner.name}
        </p>
        {partner.label ? (
          <p className="mt-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-[11px]">
            {partner.label}
          </p>
        ) : null}
      </div>
    </div>
  );

  return (
    <AnimateOnScroll delay={index * 60} className="h-full">
      {partner.url ? (
        <Link
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </AnimateOnScroll>
  );
}

export function PartnersSection({
  heading = "Certified & Partnered With",
  items = [],
}: PartnersSectionProps) {
  if (!items.length) return null;

  return (
    <section
      className="border-y border-border bg-surface py-section-sm"
      aria-labelledby="partners-heading"
    >
      <Container>
        <AnimateOnScroll className="mb-10 text-center">
          <p className="mb-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {heading}
          </p>
          <h2 id="partners-heading" className="sr-only">
            {heading}
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {items.map((partner, index) => (
            <PartnerCard key={`${partner.name}-${index}`} partner={partner} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
