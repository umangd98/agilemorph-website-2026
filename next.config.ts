import type { NextConfig } from "next";

import { RETIRED_BLOG_SLUGS } from "./src/data/retired-blog-posts";

const nextConfig: NextConfig = {
  async redirects() {
    // The Forward Deployed Engineering rebuild collapsed every service page
    // into one What we build page and retired pages that no longer fit. Each
    // old URL 301s to the closest page so links and rankings carry over.
    const capability: Record<string, string> = {
      "ai-agents": "/what-we-build#agents",
      "messaging-automation": "/what-we-build#field-capture",
      "workflow-automation": "/what-we-build#workflows",
      "crm-lead-automation": "/what-we-build#workflows",
      "shopify-automation": "/what-we-build#workflows",
      "custom-ai-engineering": "/what-we-build#documents",
      "mcp-ai-infrastructure": "/what-we-build#infrastructure",
      "ai-audit": "/how-we-work#engagement-model",
    };
    const capabilityRedirects = Object.entries(capability).flatMap(([slug, destination]) => [
      { source: `/services/${slug}`, destination, statusCode: 301 as const },
      { source: `/what-we-build/${slug}`, destination, statusCode: 301 as const },
    ]);

    return [
      ...capabilityRedirects,
      // Everything else under the old paths (the AI Automation hub and the
      // long-retired bookkeeping, marketing, assistant and web pages).
      { source: "/services", destination: "/what-we-build", statusCode: 301 },
      { source: "/services/:slug", destination: "/what-we-build", statusCode: 301 },
      { source: "/what-we-build/:slug", destination: "/what-we-build", statusCode: 301 },
      // Pricing folded into the engagement model on How we work.
      { source: "/pricing", destination: "/how-we-work#engagement-model", statusCode: 301 },
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
      "gsap",
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
