import type { PricingPage } from "@/sanity/types";
/** Compatibility fallback for retired layouts. Current pages use reviewed shared engagements. */
export const pricingPageFallback: PricingPage = {
  _id: "pricingPage",
  _type: "pricingPage",
  hero: {
    eyebrow: "Engagements & pricing",
    heading: "Work scoped to your business.",
    description:
      "A free 15-minute introduction. Audits, implementation, and partnerships are quoted to scope.",
  },
  projectSection: { label: "Scoped implementation", tiers: [] },
  retainerSection: {
    label: "Ongoing technical partnerships",
    description: "Capacity and coverage agreed for the engagement.",
    tiers: [],
  },
  engagementSection: { label: "How we work", steps: [] },
  cta: {
    heading: "Discuss your project.",
    primaryCta: { label: "Discuss your project", href: "/contact#book" },
  },
};
