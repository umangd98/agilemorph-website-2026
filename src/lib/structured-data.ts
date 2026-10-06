import type { FaqItem, SocialLink } from "@/sanity/types";

/**
 * Canonical production origin. Used by metadata (metadataBase, canonical),
 * sitemap/robots, and JSON-LD structured data.
 */
export const SITE_URL = "https://theagilemorph.com";

export const ORGANIZATION_NAME = "AgileMorph";
export const ORGANIZATION_LEGAL_NAME = "AgileMorph Solutions";

const DEFAULT_SAME_AS = [
  "https://www.linkedin.com/company/agilemorph-solutions",
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
    legalName: ORGANIZATION_LEGAL_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/brand/agilemorph-logo-dark.png`,
    },
    description:
      options?.description ??
      "Software and AI engineering partner for SMBs and enterprises.",
    founder: [
      { "@type": "Person", name: "Umang Dhandhania" },
      { "@type": "Person", name: "Kaustumbh Jaiswal" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nagpur",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    areaServed: ["US", "IN", "GB", "AU"],
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
