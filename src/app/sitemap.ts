import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/structured-data";
import { getProjects, getServices } from "@/lib/content";
import { sanityFetch } from "@/sanity/fetch";
import { allBlogSlugsQuery } from "@/sanity/queries";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects, posts] = await Promise.all([
    getServices(),
    getProjects(),
    sanityFetch<{ slug: string }[]>({
      query: allBlogSlugsQuery,
      tags: ["blogPost"],
    }),
  ]);
  const paths = [
    "/",
    "/services",
    "/work",
    "/about",
    "/pricing",
    "/contact",
    "/privacy",
    "/blog",
    ...services.map((s) => `/services/${s.slug.current}`),
    ...projects.filter((p) => p.detailed).map((p) => `/work/${p.slug.current}`),
    ...posts.map((p) => `/blog/${p.slug}`),
  ];
  return [...new Set(paths)].map((path) => ({
    url: SITE_URL + path,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
