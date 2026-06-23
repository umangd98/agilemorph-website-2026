import { Footer } from "@/components/Footer";
import { buildServiceNavLinks, getServicePages } from "@/lib/services";

export async function SiteFooter() {
  const pages = await getServicePages();
  const serviceLinks = buildServiceNavLinks(pages).map(({ label, href }) => ({
    label,
    href,
  }));

  return <Footer serviceLinks={serviceLinks} />;
}
