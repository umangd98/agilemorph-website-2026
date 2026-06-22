import { Navbar } from "@/components/Navbar";
import { buildServiceNavLinks, getServicePages } from "@/lib/services";

export async function SiteNavbar() {
  const pages = await getServicePages();
  const serviceLinks = buildServiceNavLinks(pages);

  return <Navbar serviceLinks={serviceLinks} />;
}
