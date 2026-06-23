import {
  AI_AUTOMATION_SUB_SLUGS,
  type AiAutomationSubSlug,
  isExcludedServiceSlug,
} from "@/lib/services";
import { sanityFetch } from "@/sanity/fetch";
import { servicePageQuery, subServicePagesListQuery } from "@/sanity/queries";
import type { ServicePage, SubServicePageSummary } from "@/sanity/types";

import fallbackPages from "@/data/sub-service-pages.json";

const FALLBACK_BY_SLUG = new Map(
  (fallbackPages as ServicePage[]).map((page) => [page.slug, page]),
);

export function isAiAutomationSubSlug(slug: string): slug is AiAutomationSubSlug {
  return AI_AUTOMATION_SUB_SLUGS.includes(slug as AiAutomationSubSlug);
}

export function getSubServiceFallbackPage(slug: string): ServicePage | null {
  if (!isAiAutomationSubSlug(slug)) return null;
  return FALLBACK_BY_SLUG.get(slug) ?? null;
}

export function getSubServiceFallbackSummaries(): SubServicePageSummary[] {
  return AI_AUTOMATION_SUB_SLUGS.map((slug) => {
    const page = FALLBACK_BY_SLUG.get(slug);
    return {
      slug,
      title: page?.title ?? slug,
    };
  });
}

export async function getServicePage(slug: string): Promise<ServicePage | null> {
  if (isExcludedServiceSlug(slug)) return null;

  const fromSanity = await sanityFetch<ServicePage | null>({
    query: servicePageQuery,
    params: { slug },
    tags: ["servicePage", `servicePage:${slug}`],
  });

  if (fromSanity) return fromSanity;

  return getSubServiceFallbackPage(slug);
}

export async function getSubServiceSiblings(): Promise<SubServicePageSummary[]> {
  const fromSanity = await sanityFetch<SubServicePageSummary[]>({
    query: subServicePagesListQuery,
    tags: ["servicePage"],
  });

  if (fromSanity?.length) return fromSanity;

  return getSubServiceFallbackSummaries();
}

export async function getAllServiceSlugs(): Promise<string[]> {
  const fromSanity = await sanityFetch<{ slug: string }[]>({
    query: `*[_type == "servicePage" && defined(slug.current)]{ "slug": slug.current }`,
    tags: ["servicePage"],
  });

  const slugs = new Set(
    (fromSanity ?? [])
      .map(({ slug }) => slug)
      .filter((slug) => !isExcludedServiceSlug(slug)),
  );

  for (const slug of AI_AUTOMATION_SUB_SLUGS) {
    slugs.add(slug);
  }

  return [...slugs];
}
