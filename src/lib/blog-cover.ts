export type CoverKind = "manufacturing" | "agency" | "automation";

export type CoverFormat = "landscape" | "square";

export type CoverTheme = {
  kind: CoverKind;
  label: string;
};

const MANUFACTURING =
  /manufactur|production|procurement|\boee\b|\berp\b|\bmes\b|scrap|rework|downtime|maintenance|factory|plant|pricing-drift|contract-compliance|revenue-leakage|month-end|paper-registers/;

const AGENCY =
  /agenc|client|marketing|\blead|outreach|prospect|enrichment|\bseo\b|ga4|gsc|google-business|\bcms\b|white-label|visibility-audit|content-approval|report-summary|newsletter/;

const LABELS: Record<CoverKind, string> = {
  manufacturing: "Manufacturing",
  agency: "Agency Operations",
  automation: "AI Automation",
};

function kindFrom(text: string): CoverKind | null {
  // Explicit cluster words decide first. The broad lists overlap: an agency
  // article about "content production" also matches the manufacturing list.
  if (/manufactur/.test(text)) return "manufacturing";
  if (/agenc/.test(text)) return "agency";

  const manufacturing = MANUFACTURING.test(text);
  const agency = AGENCY.test(text);
  if (manufacturing && !agency) return "manufacturing";
  if (agency && !manufacturing) return "agency";
  return null;
}

/**
 * Picks the cover motif so posts published by the content routine get an
 * on-theme cover without anyone tagging them. The slug is checked before the
 * title because slugs come from the planned queue and titles are free text.
 */
export function coverThemeFor(slug: string, title: string): CoverTheme {
  const kind = kindFrom(slug.toLowerCase()) ?? kindFrom(title.toLowerCase()) ?? "automation";
  return { kind, label: LABELS[kind] };
}

/**
 * Long "Topic: Angle" titles read better as a large headline over a quieter
 * subline than as four lines of equally heavy type.
 */
export function splitCoverTitle(title: string): {
  headline: string;
  subline?: string;
} {
  const colon = title.indexOf(": ");
  if (colon > 0 && title.length > 52) {
    return {
      headline: title.slice(0, colon).trim(),
      subline: title.slice(colon + 2).trim(),
    };
  }
  return { headline: title.trim() };
}

export function coverHeadlineSize(
  headline: string,
  format: CoverFormat = "landscape",
): number {
  const sizes =
    format === "square" ? ([84, 72, 62, 54] as const) : ([64, 54, 46, 40] as const);
  if (headline.length <= 34) return sizes[0];
  if (headline.length <= 56) return sizes[1];
  if (headline.length <= 80) return sizes[2];
  return sizes[3];
}

/**
 * Landscape (1200x630) is the share-image shape and suits 16:9 cards. Square
 * exists for the featured blog card, whose image column is close to 1:1 on
 * desktop and would otherwise crop the title.
 */
export function coverUrl(slug: string, format: CoverFormat = "landscape"): string {
  return format === "square" ? `/blog/${slug}/cover/square` : `/blog/${slug}/cover`;
}
