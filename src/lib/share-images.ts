import { CASE_STUDIES } from "@/content/case-studies";

export type ShareCard = { eyebrow: string; headline: string };

/**
 * Social share cards for pages that aren't blog posts. Each one is served at
 * /share/<key>: a path rather than a query string, because Netlify's CDN keys
 * its cache on the path alone.
 */
export const SHARE_CARDS: Record<string, ShareCard> = {
  home: { eyebrow: "Forward Deployed Engineering", headline: "AI, built into the systems you already run, that gets used." },
  "how-we-work": { eyebrow: "How we work", headline: "Find it, build it, ship it, get it used, make it better." },
  about: { eyebrow: "About Agilemorph", headline: "Engineers who work inside your business, not at a distance." },
  "case-studies": { eyebrow: "Case studies", headline: "Engineers embedded with the team, building AI people use." },
  contact: { eyebrow: "Book a discovery call", headline: "Let's find where AI fits in your business." },
  blog: { eyebrow: "Blog", headline: "Notes from the work: where AI fits and how it gets used." },
  ...Object.fromEntries(
    CASE_STUDIES.map((study) => [`case-${study.slug}`, { eyebrow: "Case study", headline: study.client }]),
  ),
};

export const shareImageUrl = (key: keyof typeof SHARE_CARDS & string) => `/share/${key}`;
