import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Retired service pages. These were live and indexed before the service
    // lineup narrowed to AI automation; 301 them so their links and rankings
    // land on the page that replaced them instead of 404ing.
    return [
      { source: "/services/bookkeeping", destination: "/what-we-build/ai-automation", statusCode: 301 },
      { source: "/services/digital-marketing", destination: "/what-we-build/ai-automation", statusCode: 301 },
      { source: "/services/virtual-assistance", destination: "/what-we-build/ai-automation", statusCode: 301 },
      { source: "/services/website-development", destination: "/what-we-build/ai-automation", statusCode: 301 },
      // Services became What we build in the Forward Deployed Engineering
      // repositioning. Same slugs, new parent path.
      { source: "/what-we-build/:slug(bookkeeping|digital-marketing|virtual-assistance|website-development)", destination: "/what-we-build/ai-automation", statusCode: 301 },
      { source: "/services", destination: "/what-we-build", statusCode: 301 },
      { source: "/services/:slug", destination: "/what-we-build/:slug", statusCode: 301 },
      // Pricing folded into the engagement model on How we work.
      { source: "/pricing", destination: "/how-we-work#engagement-model", statusCode: 301 },
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
