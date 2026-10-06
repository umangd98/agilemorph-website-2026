import { cache } from "react";

import { getContent } from "@/lib/content";
import type { SettingsContent } from "@/lib/content-types";
import type { NavLink, SiteSettings, SocialLink } from "@/sanity/types";

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  return getContent<SettingsContent & SiteSettings>("siteSettings");
});

export const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Insights", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
export const DEFAULT_FOOTER_QUICK_LINKS: NavLink[] = [
  ...DEFAULT_NAV_LINKS,
  { label: "Privacy", href: "/privacy" },
];
export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/agilemorph-solutions",
    platform: "linkedin",
  },
];
