import { cache } from "react";
import {
  Bot,
  Globe,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { AI_AUTOMATION_CAPABILITIES_FALLBACK } from "@/data/ai-automation-capabilities-fallback";

import { sanityFetch } from "@/sanity/fetch";
import { allServicePagesListQuery } from "@/sanity/queries";
import type { CapabilityItem, ServicePage, ServicePageListItem } from "@/sanity/types";

export const PRIMARY_SERVICE_SLUG = "ai-automation";

export const EXCLUDED_SERVICE_SLUGS = ["bookkeeping"] as const;

export const ADDITIONAL_SERVICE_SLUGS = [
  "digital-marketing",
  "virtual-assistance",
  "website-development",
] as const;

export type AdditionalServiceSlug = (typeof ADDITIONAL_SERVICE_SLUGS)[number];

export function isExcludedServiceSlug(slug: string) {
  return EXCLUDED_SERVICE_SLUGS.includes(slug as (typeof EXCLUDED_SERVICE_SLUGS)[number]);
}

export const AI_AUTOMATION_SUB_SLUGS = [
  "ai-agents",
  "workflow-automation",
  "crm-lead-automation",
  "mcp-ai-infrastructure",
  "messaging-automation",
  "ai-audit",
  "shopify-automation",
] as const;

export type AiAutomationSubSlug = (typeof AI_AUTOMATION_SUB_SLUGS)[number];

export function isSubServicePage(page: Pick<ServicePage, "layout" | "slug">) {
  return (
    page.layout === "subService" ||
    AI_AUTOMATION_SUB_SLUGS.includes(page.slug as AiAutomationSubSlug)
  );
}

const NAV_DESC_BY_SLUG: Record<string, string> = {
  "ai-automation": "Automate workflows with AI",
  "ai-agents": "Autonomous agents that act",
  "workflow-automation": "n8n, Make, and Zapier pipelines",
  "crm-lead-automation": "Capture and follow up on leads",
  "mcp-ai-infrastructure": "Self-hosted AI infrastructure",
  "messaging-automation": "WhatsApp, email, and chat automation",
  "ai-audit": "Find where AI pays off",
  "shopify-automation": "Orders, inventory, and store flows",
  "website-development": "High-performance web apps",
  "digital-marketing": "Grow your brand online",
  "virtual-assistance": "Dedicated remote support",
};

const SERVICE_LABEL_BY_SLUG: Record<string, string> = {
  "ai-automation": "AI Automation",
  "ai-agents": "AI Agents",
  "workflow-automation": "Workflow Automation",
  "crm-lead-automation": "CRM & Lead Automation",
  "mcp-ai-infrastructure": "MCP & AI Infrastructure",
  "messaging-automation": "Messaging Automation",
  "ai-audit": "AI Audit",
  "shopify-automation": "Shopify Automation",
  "digital-marketing": "Digital Marketing",
  "virtual-assistance": "Virtual Assistance",
  "website-development": "Website",
};

export type ServiceNavLink = {
  slug: string;
  label: string;
  href: string;
  desc: string;
};

const SERVICE_ICON_BY_SLUG: Record<string, LucideIcon> = {
  "ai-automation": Zap,
  "web-development": Globe,
  "website-development": Globe,
  "digital-marketing": TrendingUp,
  "virtual-assistance": Users,
};

export function getServiceIcon(slug: string): LucideIcon {
  return SERVICE_ICON_BY_SLUG[slug] ?? Bot;
}

export function serviceHref(slug: string) {
  return `/services/${slug}`;
}

export function capabilityHref(slug: string) {
  return serviceHref(slug);
}

export function serviceDisplayTitle(title: string) {
  return title.replace(/\s+Development$/i, "").replace(/\s+Services$/i, "");
}

export function getServiceLabel(slug: string, title: string) {
  return SERVICE_LABEL_BY_SLUG[slug] ?? serviceDisplayTitle(title);
}

export function toServiceNavLink(page: ServicePageListItem): ServiceNavLink {
  const label = getServiceLabel(page.slug, page.title);
  return {
    slug: page.slug,
    label,
    href: serviceHref(page.slug),
    desc: NAV_DESC_BY_SLUG[page.slug] ?? page.tagline ?? page.description ?? "",
  };
}

export function sortAdditionalServicePages(pages: ServicePageListItem[]) {
  return [...pages].sort((a, b) => {
    const aIndex = ADDITIONAL_SERVICE_SLUGS.indexOf(a.slug as AdditionalServiceSlug);
    const bIndex = ADDITIONAL_SERVICE_SLUGS.indexOf(b.slug as AdditionalServiceSlug);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return getServiceLabel(a.slug, a.title).localeCompare(getServiceLabel(b.slug, b.title));
  });
}

export type FooterServiceLink = {
  label: string;
  href: string;
  nested?: boolean;
};

export type FooterServiceGroups = {
  primary: FooterServiceLink | null;
  aiAutomationSubs: FooterServiceLink[];
  additional: FooterServiceLink[];
};

export function buildFooterServiceGroups(pages: ServicePageListItem[]): FooterServiceGroups {
  const pageBySlug = new Map(pages.map((page) => [page.slug, page]));

  const primaryPage =
    pages.find((page) => page.slug === PRIMARY_SERVICE_SLUG) ?? pages[0] ?? null;

  const primary = primaryPage
    ? {
        label: getServiceLabel(primaryPage.slug, primaryPage.title),
        href: serviceHref(primaryPage.slug),
      }
    : null;

  const aiAutomationSubs = AI_AUTOMATION_SUB_SLUGS.map((slug) => {
    const page = pageBySlug.get(slug);
    return {
      label: page ? getServiceLabel(page.slug, page.title) : SERVICE_LABEL_BY_SLUG[slug] ?? slug,
      href: serviceHref(slug),
    };
  });

  const { additional } = splitServicePages(pages);
  const additionalLinks = additional.map((page) => ({
    label: getServiceLabel(page.slug, page.title),
    href: serviceHref(page.slug),
  }));

  return { primary, aiAutomationSubs, additional: additionalLinks };
}

export function buildFooterServiceLinks(pages: ServicePageListItem[]): FooterServiceLink[] {
  const { primary, aiAutomationSubs, additional } = buildFooterServiceGroups(pages);
  const links: FooterServiceLink[] = [];

  if (primary) {
    links.push(primary);
  }

  for (const link of aiAutomationSubs) {
    links.push({ ...link, nested: true });
  }

  if (additional.length) {
    links.push({ label: "—", href: "#", nested: false });
  }

  for (const link of additional) {
    links.push(link);
  }

  return links;
}

export function buildServiceNavLinks(pages: ServicePageListItem[]): ServiceNavLink[] {
  const { primary, additional } = splitServicePages(pages);
  const links: ServiceNavLink[] = [];

  if (primary) {
    links.push(toServiceNavLink(primary));
  }

  for (const page of sortAdditionalServicePages(additional)) {
    links.push(toServiceNavLink(page));
  }

  return links;
}

export function sortServicePages(pages: ServicePageListItem[]) {
  return [...pages].sort((a, b) => {
    if (a.slug === PRIMARY_SERVICE_SLUG) return -1;
    if (b.slug === PRIMARY_SERVICE_SLUG) return 1;
    const aSub = AI_AUTOMATION_SUB_SLUGS.indexOf(a.slug as AiAutomationSubSlug);
    const bSub = AI_AUTOMATION_SUB_SLUGS.indexOf(b.slug as AiAutomationSubSlug);
    if (aSub !== -1 && bSub !== -1) return aSub - bSub;
    if (aSub !== -1) return -1;
    if (bSub !== -1) return 1;
    return a.title.localeCompare(b.title);
  });
}

export async function getServicePages() {
  return getServicePagesCached();
}

export const getServicePagesCached = cache(async () => {
  const pages = await sanityFetch<ServicePageListItem[]>({
    query: allServicePagesListQuery,
    tags: ["servicePage"],
  });

  return sortServicePages(
    (pages ?? []).filter((page) => !isExcludedServiceSlug(page.slug)),
  );
});

export { AI_AUTOMATION_CAPABILITIES_FALLBACK };

const MIN_AI_AUTOMATION_CAPABILITIES = 7;

function isCompleteAiAutomationCapabilities(
  capabilities: CapabilityItem[] | undefined,
): capabilities is CapabilityItem[] {
  if (!capabilities || capabilities.length < MIN_AI_AUTOMATION_CAPABILITIES) {
    return false;
  }

  return capabilities.some(
    (item) =>
      item.featured === true ||
      item.slug === PRIMARY_SERVICE_SLUG ||
      item.title.toLowerCase().includes("ai automation"),
  );
}

export function resolveAiAutomationCapabilities(
  capabilities?: CapabilityItem[],
): CapabilityItem[] {
  if (isCompleteAiAutomationCapabilities(capabilities)) {
    return capabilities;
  }

  return AI_AUTOMATION_CAPABILITIES_FALLBACK;
}

export function getPrimaryServiceCapabilities(pages: ServicePageListItem[]) {
  const primary = pages.find((page) => page.slug === PRIMARY_SERVICE_SLUG);
  return resolveAiAutomationCapabilities(primary?.capabilities);
}

export function splitServicePages(pages: ServicePageListItem[]) {
  const primary =
    pages.find((page) => page.slug === PRIMARY_SERVICE_SLUG) ?? pages[0];
  const additional = sortAdditionalServicePages(
    pages.filter(
      (page) =>
        page.slug !== primary?.slug &&
        !AI_AUTOMATION_SUB_SLUGS.includes(page.slug as AiAutomationSubSlug),
    ),
  );

  return { primary, additional };
}

export function resolveCapabilityHref(
  capability: { title: string; slug?: string },
  fallbackSlug = PRIMARY_SERVICE_SLUG,
) {
  if (capability.slug) return capabilityHref(capability.slug);

  const match = AI_AUTOMATION_CAPABILITIES_FALLBACK.find(
    (item) => item.title === capability.title,
  );
  if (match?.slug) return capabilityHref(match.slug);

  const normalizedTitle = capability.title.toLowerCase();
  if (normalizedTitle.includes("ai automation")) {
    return serviceHref(PRIMARY_SERVICE_SLUG);
  }

  const subMatch = AI_AUTOMATION_SUB_SLUGS.find((slug) =>
    normalizedTitle.includes(slug.replace(/-/g, " ")),
  );
  if (subMatch) return capabilityHref(subMatch);

  return serviceHref(fallbackSlug);
}
