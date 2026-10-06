import { Navigation } from "@/components/marketing/Navigation";
import { getContent, getServices, primaryServices } from "@/lib/content";
import type { SettingsContent } from "@/lib/content-types";
export async function SiteNavbar() {
  const [settings, services] = await Promise.all([
    getContent<SettingsContent>("siteSettings"),
    getServices(),
  ]);
  return (
    <Navigation
      links={settings.navLinks}
      serviceLinks={primaryServices(services).map((s) => ({
        label: s.title,
        href: `/services/${s.slug.current}`,
      }))}
    />
  );
}
