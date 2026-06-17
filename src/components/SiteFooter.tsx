import { Footer } from "@/components/Footer";
import { getServicePages, toServiceNavLink } from "@/lib/services";

export async function SiteFooter() {
  const pages = await getServicePages();
  const serviceLinks = pages.map((page) => {
    const nav = toServiceNavLink(page);
    return { label: nav.label, href: nav.href };
  });

  return <Footer serviceLinks={serviceLinks} />;
}
