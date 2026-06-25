/** Canonical site metrics used on homepage, about page, and Sanity patches. */
export const SITE_METRICS = {
  eyebrow: "Metrics That Matter",
  heading: "Enjoy Tangible Results",
  items: [
    { value: "180+", label: "Projects Delivered" },
    { value: "100+", label: "Clients Across 4 Continents" },
    { value: "500K+", label: "Hours Saved via Automation" },
    { value: "98%", label: "Client Retention Rate" },
    { value: "15+", label: "AI Agents Built and Deployed" },
    { value: "4+", label: "Years Building AI Systems" },
  ],
};

export function buildStatsSection() {
  return {
    eyebrow: SITE_METRICS.eyebrow,
    heading: SITE_METRICS.heading,
    items: SITE_METRICS.items.map((item) => ({ _type: "stat", ...item })),
  };
}
