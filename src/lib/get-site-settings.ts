import { cache } from "react";

import { sanityFetch } from "@/sanity/fetch";
import { siteSettingsQuery } from "@/sanity/queries";
import type { NavLink, SiteSettings, SocialLink } from "@/sanity/types";

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  return sanityFetch<SiteSettings | null>({
    query: siteSettingsQuery,
    tags: ["siteSettings"],
  });
});

export const DEFAULT_FOOTER_QUICK_LINKS: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/agilemorph/",
    platform: "linkedin",
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/agilemorph/",
    platform: "instagram",
  },
  {
    label: "Facebook",
    url: "https://www.facebook.com/agilemorph",
    platform: "facebook",
  },
];
