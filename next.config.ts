import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Retired service pages. These were live and indexed before the service
    // lineup narrowed to AI automation; 301 them so their links and rankings
    // land on the page that replaced them instead of 404ing.
    return [
      { source: "/services/bookkeeping", destination: "/services/ai-automation", statusCode: 301 },
      { source: "/services/digital-marketing", destination: "/services/ai-automation", statusCode: 301 },
      { source: "/services/virtual-assistance", destination: "/services/ai-automation", statusCode: 301 },
      { source: "/services/website-development", destination: "/services/ai-automation", statusCode: 301 },
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
