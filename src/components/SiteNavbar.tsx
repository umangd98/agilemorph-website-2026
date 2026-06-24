import { Navbar } from "@/components/Navbar";
import {
  DEFAULT_NAV_LINKS,
  getSiteSettings,
} from "@/lib/get-site-settings";
import { buildServiceNavLinks, getServicePages } from "@/lib/services";

export async function SiteNavbar() {
  const [pages, siteSettings] = await Promise.all([
    getServicePages(),
    getSiteSettings(),
  ]);
  const serviceLinks = buildServiceNavLinks(pages);
  const navLinks = siteSettings?.navLinks?.length
    ? siteSettings.navLinks
    : DEFAULT_NAV_LINKS;

  return <Navbar serviceLinks={serviceLinks} navLinks={navLinks} />;
}
