import { CONTACT_EMAIL, FOUNDERS, ONE_LINER } from "@/data/positioning";
import type { FaqItem, SocialLink } from "@/sanity/types";

/**
 * Canonical production origin. Used by metadata (metadataBase, canonical),
 * sitemap/robots, and JSON-LD structured data.
 */
export const SITE_URL = "https://theagilemorph.com";

export const ORGANIZATION_NAME = "Agilemorph";

const DEFAULT_SAME_AS = [
  "https://www.linkedin.com/company/agilemorph/",
  "https://www.instagram.com/agilemorph/",
  "https://www.facebook.com/agilemorph",
];

/** Minimal JSON-LD node shape. */
type JsonLdNode = Record<string, unknown>;

function socialUrls(socialLinks?: SocialLink[]): string[] {
  const urls = (socialLinks ?? [])
    .map((link) => link.url)
    .filter((url): url is string => Boolean(url));
  return urls.length ? urls : DEFAULT_SAME_AS;
}

/**
 * Organization schema. Establishes the brand entity for Google's Knowledge
 * Graph: name, logo, socials (sameAs), founder, and area served.
 */
export function organizationSchema(options?: {
  description?: string;
  socialLinks?: SocialLink[];
}): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: ORGANIZATION_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/brand/agilemorph-logo-dark.png`,
    },
    description: options?.description ?? ONE_LINER,
    email: CONTACT_EMAIL,
    founder: FOUNDERS.map((founder) => ({
      "@type": "Person",
      name: founder.name,
      jobTitle: founder.jobTitle,
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nagpur",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    areaServed: ["India", "United States", "Africa"],
    sameAs: socialUrls(options?.socialLinks),
  };
}

/**
 * WebSite schema. Ties the domain to the organization as its publisher.
 */
export function websiteSchema(options?: { name?: string }): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: options?.name ?? ORGANIZATION_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * FAQPage schema built from the rendered FAQ items. Only emit this when the
 * same questions and answers are visible on the page (Google requirement).
 */
export function faqPageSchema(items: FaqItem[]): JsonLdNode | null {
  const entities = items
    .filter((item) => item.question && item.answer)
    .map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }));

  if (!entities.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: entities,
  };
}
