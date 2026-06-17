import { Navbar } from "@/components/Navbar";
import { getServicePages, toServiceNavLink } from "@/lib/services";

export async function SiteNavbar() {
  const pages = await getServicePages();
  const serviceLinks = pages.map(toServiceNavLink);

  return <Navbar serviceLinks={serviceLinks} />;
}
