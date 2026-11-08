import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/structured-data";
import { sanityFetch } from "@/sanity/fetch";
import { allBlogSlugsQuery, caseStudiesListQuery } from "@/sanity/queries";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/how-we-work", changeFrequency: "monthly", priority: 0.9 },
  { path: "/what-we-build", changeFrequency: "monthly", priority: 0.9 },
  { path: "/case-studies", changeFrequency: "monthly", priority: 0.8 },
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

  let caseStudyEntries: MetadataRoute.Sitemap = [];
  try {
    const studies = await sanityFetch<Array<{ slug: string }>>({
      query: caseStudiesListQuery,
      tags: ["caseStudy"],
    });
    caseStudyEntries = (studies ?? [])
      .filter((study) => Boolean(study?.slug))
      .map((study) => ({
        url: `${SITE_URL}/case-studies/${study.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      }));
  } catch {
    caseStudyEntries = [];
  }

  return [...staticEntries, ...caseStudyEntries, ...blogEntries];
}
