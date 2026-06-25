import type { Stat } from "@/sanity/types";

/** Fallback metrics when Sanity stats are missing or stale. */
export const SITE_METRICS_ITEMS: Stat[] = [
  { value: "180+", label: "Projects Delivered" },
  { value: "100+", label: "Clients Across 4 Continents" },
  { value: "500K+", label: "Hours Saved via Automation" },
  { value: "98%", label: "Client Retention Rate" },
  { value: "15+", label: "AI Agents Built and Deployed" },
  { value: "4+", label: "Years Building AI Systems" },
];

export const SITE_METRICS_SECTION = {
  eyebrow: "Metrics That Matter",
  heading: "Enjoy Tangible Results",
  items: SITE_METRICS_ITEMS,
};

export function resolveStatsSection(
  stats?: {
    eyebrow?: string;
    heading?: string;
    items?: Stat[];
  } | Stat[] | null,
) {
  if (Array.isArray(stats)) {
    return {
      eyebrow: SITE_METRICS_SECTION.eyebrow,
      heading: SITE_METRICS_SECTION.heading,
      items: stats.length ? stats : SITE_METRICS_ITEMS,
    };
  }

  const items = stats?.items?.length ? stats.items : SITE_METRICS_ITEMS;

  return {
    eyebrow: stats?.eyebrow ?? SITE_METRICS_SECTION.eyebrow,
    heading: stats?.heading ?? SITE_METRICS_SECTION.heading,
    items,
  };
}
