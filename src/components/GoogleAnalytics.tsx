"use client";

import { GoogleAnalytics as GoogleTag } from "@next/third-parties/google";
import { usePathname } from "next/navigation";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * GA4 via gtag.js. NEXT_PUBLIC_GA_MEASUREMENT_ID is inlined at build time, so
 * set it in Netlify and redeploy; without it nothing loads. The embedded
 * Sanity Studio is not tracked.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();

  if (!GA_MEASUREMENT_ID || pathname?.startsWith("/studio")) return null;

  return <GoogleTag gaId={GA_MEASUREMENT_ID} />;
}
