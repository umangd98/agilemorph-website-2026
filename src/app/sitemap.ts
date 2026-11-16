import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/structured-data";
import { sanityFetch } from "@/sanity/fetch";
import { CASE_STUDIES } from "@/content/case-studies";
import { allBlogSlugsQuery } from "@/sanity/queries";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/how-we-work", changeFrequency: "monthly", priority: 0.9 },
  { path: "/case-studies", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Code-built pages carry no lastModified: the build time would claim every
  // page changed on every deploy, which teaches Google to ignore the field.
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Dynamic routes are best-effort: if Sanity is unreachable at build time,
  // still ship a valid sitemap of the static routes rather than fail the build.
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await sanityFetch<Array<{ slug: string; updatedAt?: string }>>({
      query: allBlogSlugsQuery,
      tags: ["blogPost"],
    });
    blogEntries = (posts ?? [])
      .filter((post) => Boolean(post?.slug))
      .map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined,
        changeFrequency: "monthly",
        priority: 0.6,
      }));
  } catch {
    blogEntries = [];
  }

  const caseStudyEntries: MetadataRoute.Sitemap = CASE_STUDIES.map((study) => ({
    url: `${SITE_URL}/case-studies/${study.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...caseStudyEntries, ...blogEntries];
}
