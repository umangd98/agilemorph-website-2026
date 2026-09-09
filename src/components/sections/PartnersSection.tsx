import Link from "next/link";

import { Container } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { SanityImage } from "@/components/SanityImage";
import type { PartnerItem } from "@/sanity/types";

const SHOPIFY_PARTNER: PartnerItem = {
  name: "Shopify",
  label: "PARTNER",
  url: "https://www.shopify.com/partners",
  logo: {
    _type: "image",
    alt: "Shopify logo",
    asset: {
      _type: "sanity.imageAsset",
      url: "https://cdn.simpleicons.org/shopify/96BF48",
    },
  },
};

function withShopifyPartner(items: PartnerItem[]): PartnerItem[] {
  if (items.some((item) => item.name.toLowerCase() === "shopify")) {
    return items;
  }
  return [...items, SHOPIFY_PARTNER];
}

type PartnersSectionProps = {
  heading?: string;
  items?: PartnerItem[];
};

function PartnerCell({ partner }: { partner: PartnerItem }) {
  const inner = (
    <div className="group flex h-full min-h-[7rem] flex-col items-center justify-center gap-2.5 bg-bg-elevated px-4 py-8 text-center transition-colors duration-300 hover:bg-bg-raised">
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
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line font-mono text-sm text-fg-muted">
          {partner.name.charAt(0)}
        </div>
      )}
      <span className="text-sm font-medium leading-tight text-fg">{partner.name}</span>
      {partner.label ? (
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-dim">
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
  const partners = withShopifyPartner(items);
  if (!partners.length) return null;

  return (
    <section
      className="scroll-mt-24 border-t border-line py-20 sm:py-24"
      aria-labelledby="partners-heading"
    >
      <Container>
        <Reveal>
          <div className="mb-10 flex items-center gap-4">
            <span className="syslabel shrink-0">{heading}</span>
            <span aria-hidden className="h-px flex-1 bg-line" />
          </div>
        </Reveal>
        <h2 id="partners-heading" className="sr-only">
          {heading}
        </h2>

        <RevealGroup className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {partners.map((partner, index) => (
            <PartnerCell key={`${partner.name}-${index}`} partner={partner} />
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
