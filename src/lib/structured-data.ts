import { COMPANY, FOUNDERS, ONE_LINER } from "@/content/site";

type FaqItem = { question: string; answer: string };

/**
 * Canonical production origin. Used by metadata (metadataBase, canonical),
 * sitemap/robots, and JSON-LD structured data.
 */
export const SITE_URL = "https://theagilemorph.com";

export const ORGANIZATION_NAME = "Agilemorph";

const ALTERNATE_NAMES = ["AgileMorph", "AgileMorph Solutions", "AgileMorph Digital Accelerators"];

/** Third-party profiles of the same firm, listed in sameAs but not in the site's social links. */
const DIRECTORY_PROFILES = [
  "https://www.upwork.com/agencies/agilemorph/",
  "https://clutch.co/profile/agilemorph-solutions",
];

/** Minimal JSON-LD node shape. */
type JsonLdNode = Record<string, unknown>;

/**
 * Organization schema. Establishes the brand entity for Google's Knowledge
 * Graph: name, logo, socials (sameAs), founder, and area served.
 */
export function organizationSchema(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: ORGANIZATION_NAME,
    // Every spelling the firm trades under, so search and AI engines merge
    // the old directory profiles into this one entity.
    alternateName: ALTERNATE_NAMES,
    legalName: COMPANY.legalName,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/brand/agilemorph-logo-dark.png`,
    },
    description: ONE_LINER,
    email: COMPANY.email,
    founder: FOUNDERS.map((founder) => ({
      "@type": "Person",
      name: founder.name,
      jobTitle: founder.role,
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nagpur",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    sameAs: [...COMPANY.social.map((item) => item.href), ...DIRECTORY_PROFILES],
  };
}

/**
 * WebSite schema. Ties the domain to the organization as its publisher.
 */
export function websiteSchema(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORGANIZATION_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * FAQPage schema built from the rendered FAQ items. Only emit this when the
 * same questions and answers are visible on the page (Google requirement).
 */
export function faqPageSchema(items: FaqItem[], path = "/"): JsonLdNode | null {
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
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: entities,
  };
}

function absoluteUrl(path: string) {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** BreadcrumbList for a trail like Home > Blog > Post. The last item is the current page. */
export function breadcrumbSchema(trail: Array<{ name: string; path: string }>): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** BlogPosting for a blog post, with its author as a Person and the firm as publisher. */
export function blogPostingSchema(post: {
  slug: string;
  title: string;
  description?: string;
  image: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
}): JsonLdNode {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const founder = FOUNDERS.find((person) => person.name === post.author);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    image: post.image.startsWith("http") ? post.image : `${SITE_URL}${post.image}`,
    url,
    mainEntityOfPage: url,
    datePublished: post.publishedAt,
    // A post can be scheduled after its last edit, so never report a
    // modified date earlier than the published one.
    dateModified: [post.updatedAt, post.publishedAt].filter(Boolean).sort().at(-1),
    inLanguage: "en",
    author: post.author
      ? {
          "@type": "Person",
          name: post.author,
          ...(founder ? { jobTitle: founder.role, url: `${SITE_URL}/about`, worksFor: { "@id": `${SITE_URL}/#organization` } } : {}),
        }
      : { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
