import { cache } from "react";

import { pricingPageFallback } from "@/data/pricing-page-fallback";
import { sanityFetch } from "@/sanity/fetch";
import { pricingPageQuery } from "@/sanity/queries";
import type { PricingPage } from "@/sanity/types";

export const getPricingPage = cache(async (): Promise<PricingPage> => {
  const page = await sanityFetch<PricingPage | null>({
    query: pricingPageQuery,
    tags: ["pricingPage"],
  });

  return page ?? pricingPageFallback;
});
