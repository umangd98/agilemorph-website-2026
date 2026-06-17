import { sanityFetch } from "@/sanity/fetch";
import { allServicePagesListQuery } from "@/sanity/queries";
import type { ServicePageListItem } from "@/sanity/types";

export const PRIMARY_SERVICE_SLUG = "ai-automation";

const NAV_DESC_BY_SLUG: Record<string, string> = {
  "ai-automation": "Automate workflows with AI",
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

export function serviceDisplayTitle(title: string) {
  return title
    .replace(/\s+Development$/i, "")
    .replace(/\s+Services$/i, "")
    .replace(/^Book keeping/i, "Book Keeping");
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
  const additional = pages.filter((page) => page.slug !== primary?.slug);

  return { primary, additional };
}
