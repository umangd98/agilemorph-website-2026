import { Navbar } from "@/components/Navbar";
import { buildServiceNavGroups, getServicePages } from "@/lib/services";

export async function SiteNavbar() {
  const pages = await getServicePages();

  return <Navbar serviceGroups={buildServiceNavGroups(pages)} />;
}
