import Link from "next/link";

import { Container } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { SanityImage } from "@/components/SanityImage";
import type { PartnerItem } from "@/sanity/types";

type PartnersSectionProps = {
  heading?: string;
  items?: PartnerItem[];
};

function PartnerCell({ partner }: { partner: PartnerItem }) {
  const inner = (
    <div className="group bg-bg-elevated hover:bg-bg-raised flex h-full min-h-[7rem] flex-col items-center justify-center gap-2.5 px-4 py-8 text-center transition-colors duration-300">
      {partner.logo ? (
        <div className="relative h-9 w-9 shrink-0">
          <SanityImage
            image={partner.logo}
            alt={partner.logo.alt ?? partner.name}
            fill
            sizes="40px"
            className="object-contain"
          />
        </div>
      ) : (
        <div className="border-line text-fg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-mono text-sm">
          {partner.name.charAt(0)}
        </div>
      )}
      <span className="text-fg text-sm leading-tight font-medium">
        {partner.name}
      </span>
      {partner.label ? (
        <span className="text-fg-dim font-mono text-[0.625rem] tracking-[0.14em] uppercase">
          {partner.label}
        </span>
      ) : null}
    </div>
  );

  return (
    <RevealItem className="h-full">
      {partner.url ? (
        <Link
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
        >
          {inner}
        </Link>
      ) : (
        inner
      )}
    </RevealItem>
  );
}

export function PartnersSection({
  heading = "Certified & partnered with",
  items = [],
}: PartnersSectionProps) {
  const partners = items;
  if (!partners.length) return null;

  return (
    <section
      className="border-line scroll-mt-24 border-t py-20 sm:py-24"
      aria-labelledby="partners-heading"
    >
      <Container>
        <Reveal>
          <div className="mb-10 flex items-center gap-4">
            <span className="syslabel shrink-0">{heading}</span>
            <span aria-hidden className="bg-line h-px flex-1" />
          </div>
        </Reveal>
        <h2 id="partners-heading" className="sr-only">
          {heading}
        </h2>

        <RevealGroup className="border-line bg-line grid grid-cols-2 gap-px overflow-hidden rounded-xl border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {partners.map((partner, index) => (
            <PartnerCell key={`${partner.name}-${index}`} partner={partner} />
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
