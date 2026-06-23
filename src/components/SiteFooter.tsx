import { Footer } from "@/components/Footer";
import { buildFooterServiceGroups, getServicePages } from "@/lib/services";

export async function SiteFooter() {
  const pages = await getServicePages();
  const serviceGroups = buildFooterServiceGroups(pages);

  return <Footer serviceGroups={serviceGroups} />;
}
