import { Footer } from "@/components/Footer";
import {
  DEFAULT_FOOTER_QUICK_LINKS,
  DEFAULT_SOCIAL_LINKS,
  getSiteSettings,
} from "@/lib/get-site-settings";

export async function SiteFooter() {
  const siteSettings = await getSiteSettings();

  return (
    <Footer
      quickLinks={
        siteSettings?.footerQuickLinks?.length
          ? siteSettings.footerQuickLinks
          : DEFAULT_FOOTER_QUICK_LINKS
      }
      socialLinks={
        siteSettings?.socialLinks?.length ? siteSettings.socialLinks : DEFAULT_SOCIAL_LINKS
      }
      newsletterHeading={siteSettings?.newsletterHeading}
      newsletterDescription={siteSettings?.newsletterDescription}
    />
  );
}
