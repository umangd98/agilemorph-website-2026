import Link from "next/link";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { MobileAutoCarousel } from "@/components/MobileAutoCarousel";
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

function PartnerCard({ partner, index }: { partner: PartnerItem; index: number }) {
  const content = (
    <div className="hover-lift group flex h-full min-h-[108px] flex-col items-center justify-center gap-2.5 rounded-xl border border-border bg-background px-3 py-4 text-center shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-md sm:min-h-[116px] sm:gap-3 sm:px-4 sm:py-5">
      {partner.logo ? (
        <div className="relative h-9 w-9 shrink-0 sm:h-10 sm:w-10">
          <SanityImage
            image={partner.logo}
            alt={partner.logo.alt ?? partner.name}
            fill
            sizes="40px"
            className="object-contain"
          />
        </div>
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted font-heading text-sm font-bold text-foreground sm:h-10 sm:w-10">
          {partner.name.charAt(0)}
        </div>
      )}
      <div className="min-w-0 w-full">
        <p className="font-heading text-xs font-bold leading-tight tracking-tight text-foreground sm:text-sm">
          {partner.name}
        </p>
        {partner.label ? (
          <p className="mt-1 font-body text-[9px] font-semibold uppercase leading-snug tracking-[0.12em] text-muted-foreground sm:text-[10px]">
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
  const partners = withShopifyPartner(items);

  if (!partners.length) return null;

  return (
    <section
      className="relative overflow-hidden border-y border-border bg-surface py-section-sm"
      aria-labelledby="partners-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 section-ambient-glow opacity-70"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <AnimateOnScroll className="mb-10 text-center">
          <p className="mb-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {heading}
          </p>
          <h2 id="partners-heading" className="sr-only">
            {heading}
          </h2>
        </AnimateOnScroll>

        <MobileAutoCarousel
          ariaLabel="Certified and partnered companies"
          desktopClassName="gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 sm:gap-4"
        >
          {partners.map((partner, index) => (
            <PartnerCard key={`${partner.name}-${index}`} partner={partner} index={index} />
          ))}
        </MobileAutoCarousel>
      </Container>
    </section>
  );
}
