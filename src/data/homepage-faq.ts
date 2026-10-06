import reviewed from "./reviewed-content.json";
import type { FaqItem } from "@/sanity/types";
export const HOMEPAGE_FAQ_HEADING = "Frequently asked questions";
export const HOMEPAGE_FAQ_EYEBROW = "Before we talk";
export const homepageFaq: FaqItem[] = reviewed.find(
  (d) => d._id === "homepage",
)!.faq!;
