import { sanityFetch } from "@/sanity/fetch";
import { allServicePagesListQuery } from "@/sanity/queries";
import type { ServicePageListItem } from "@/sanity/types";

export const PRIMARY_SERVICE_SLUG = "ai-automation";

export const AI_AUTOMATION_SUB_SLUGS = [
  "ai-agents",
  "workflow-automation",
  "crm-lead-automation",
  "mcp-ai-infrastructure",
  "messaging-automation",
  "ai-audit",
] as const;

export type AiAutomationSubSlug = (typeof AI_AUTOMATION_SUB_SLUGS)[number];

export const PRIMARY_SERVICE_CAPABILITIES = [
  {
    title: "AI Agents",
    slug: "ai-agents",
    description:
      "Autonomous agents that classify, decide, and act across your tools.",
    icon: "⬡",
  },
  {
    title: "Workflow Automation",
    slug: "workflow-automation",
    description: "n8n, Make, and Zapier pipelines that eliminate repetitive work.",
    icon: "⟳",
  },
  {
    title: "CRM & Lead Automation",
    slug: "crm-lead-automation",
    description: "Capture, enrich, route, and follow up on every lead automatically.",
    icon: "◎",
  },
  {
    title: "MCP & AI Infrastructure",
    slug: "mcp-ai-infrastructure",
    description: "Self-hosted pipelines, MCP servers, and production-grade deployments.",
    icon: "⧉",
  },
  {
    title: "Messaging Automation",
    slug: "messaging-automation",
    description: "WhatsApp, email, and chat automations that respond and convert.",
    icon: "✉",
  },
  {
    title: "AI Audit",
    slug: "ai-audit",
    description:
      "A fixed-scope review that maps where AI saves you the most time and money.",
    icon: "◷",
  },
] as const;

const NAV_DESC_BY_SLUG: Record<string, string> = {
  "ai-automation": "Automate workflows with AI",
  "ai-agents": "Autonomous agents that act",
  "workflow-automation": "n8n, Make, and Zapier pipelines",
  "crm-lead-automation": "Capture and follow up on leads",
  "mcp-ai-infrastructure": "Self-hosted AI infrastructure",
  "messaging-automation": "WhatsApp, email, and chat automation",
  "ai-audit": "Find where AI pays off",
  "website-development": "High-performance web apps",
  "digital-marketing": "Grow your brand online",
  "virtual-assistance": "Dedicated remote support",
  bookkeeping: "Accurate financial records",
};

export type ServiceNavLink = {
  slug: string;
  label: string;
  href: string;
  desc: string;
};

export function serviceHref(slug: string) {
  return `/services/${slug}`;
}

export function capabilityHref(slug: string) {
  return serviceHref(slug);
}

export function serviceDisplayTitle(title: string) {
  return title
    .replace(/\s+Development$/i, "")
    .replace(/\s+Services$/i, "")
    .replace(/^Book keeping/i, "Bookkeeping");
}

export function toServiceNavLink(page: ServicePageListItem): ServiceNavLink {
  const label = serviceDisplayTitle(page.title);
  return {
    slug: page.slug,
    label,
    href: serviceHref(page.slug),
    desc: NAV_DESC_BY_SLUG[page.slug] ?? page.tagline ?? page.description ?? "",
  };
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
  const pages = await sanityFetch<ServicePageListItem[]>({
    query: allServicePagesListQuery,
    tags: ["servicePage"],
  });

  return sortServicePages(pages ?? []);
}

export function splitServicePages(pages: ServicePageListItem[]) {
  const primary =
    pages.find((page) => page.slug === PRIMARY_SERVICE_SLUG) ?? pages[0];
  const additional = pages.filter(
    (page) =>
      page.slug !== primary?.slug &&
      !AI_AUTOMATION_SUB_SLUGS.includes(page.slug as AiAutomationSubSlug),
  );

  return { primary, additional };
}

export function resolveCapabilityHref(
  capability: { title: string; slug?: string },
  fallbackSlug = PRIMARY_SERVICE_SLUG,
) {
  if (capability.slug) return capabilityHref(capability.slug);

  const match = PRIMARY_SERVICE_CAPABILITIES.find(
    (item) => item.title === capability.title,
  );
  if (match) return capabilityHref(match.slug);

  return serviceHref(fallbackSlug);
}
