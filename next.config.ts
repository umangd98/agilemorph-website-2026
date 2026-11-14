import path from "node:path";

import type { NextConfig } from "next";

import { RETIRED_BLOG_SLUGS } from "./src/data/retired-blog-posts";

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory otherwise makes Turbopack pick the
  // wrong workspace root.
  turbopack: { root: path.resolve(__dirname) },
  async redirects() {
    // The site was rebuilt around Forward Deployed Engineering. Every retired
    // URL 301s to the closest page so links and rankings carry over.
    const WHAT_WE_BUILD = "/how-we-work#what-we-build";
    const ENGAGEMENT_MODEL = "/how-we-work#engagement-model";

    return [
      // Service pages, then the single What we build page, became a section of How we work.
      { source: "/services/ai-audit", destination: ENGAGEMENT_MODEL, statusCode: 301 },
      { source: "/what-we-build/ai-audit", destination: ENGAGEMENT_MODEL, statusCode: 301 },
      { source: "/services", destination: WHAT_WE_BUILD, statusCode: 301 },
      { source: "/services/:slug*", destination: WHAT_WE_BUILD, statusCode: 301 },
      { source: "/what-we-build", destination: WHAT_WE_BUILD, statusCode: 301 },
      { source: "/what-we-build/:slug*", destination: WHAT_WE_BUILD, statusCode: 301 },
      // Pricing became the engagement model.
      { source: "/pricing", destination: ENGAGEMENT_MODEL, statusCode: 301 },
      // CAT is an R&D product, mentioned on About; its marketing page is retired.
      { source: "/products/:path*", destination: "/about", statusCode: 301 },
      // E-commerce lead magnet and event listings that predate the repositioning.
      { source: "/resources/:path*", destination: "/", statusCode: 301 },
      { source: "/events", destination: "/about", statusCode: 301 },
      ...RETIRED_BLOG_SLUGS.map((slug) => ({
        source: `/blog/${slug}`,
        destination: "/blog",
        statusCode: 301 as const,
      })),
      // The site lives on theagilemorph.com; agilemorph.in, .dev and .biz are
      // older domains on the same deploy. /api is left out so webhooks still
      // pointed at an old host (Sanity revalidation) keep working: a 301 would
      // turn their POST into a GET.
      {
        source: "/:path((?!api/).*)",
        has: [{ type: "host", value: "^(www\\.)?agilemorph\\.(in|dev|biz)$" }],
        destination: "https://theagilemorph.com/:path",
        statusCode: 301,
      },
    ];
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@portabletext/react",
      "@sanity/image-url",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
    ],
  },
};

export default nextConfig;
