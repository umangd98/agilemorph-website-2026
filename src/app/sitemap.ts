import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/structured-data";
import { getServicePages } from "@/lib/services";
import { sanityFetch } from "@/sanity/fetch";
import { allBlogSlugsQuery } from "@/sanity/queries";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Dynamic routes are best-effort: if Sanity is unreachable at build time,
  // still ship a valid sitemap of the static routes rather than fail the build.
  let serviceEntries: MetadataRoute.Sitemap = [];
  try {
    const servicePages = await getServicePages();
    serviceEntries = servicePages.map((page) => ({
      url: `${SITE_URL}/services/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch {
    serviceEntries = [];
  }

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await sanityFetch<Array<{ slug: string }>>({
      query: allBlogSlugsQuery,
      tags: ["blogPost"],
    });
    blogEntries = (posts ?? [])
      .filter((post) => Boolean(post?.slug))
      .map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      }));
  } catch {
    blogEntries = [];
  }

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}
