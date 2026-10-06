import { Navigation } from "@/components/marketing/Navigation";
import type { NavLink } from "@/sanity/types";
import type { ServiceNavGroups } from "@/lib/services";
/** Compatibility export for older composed pages. */
export function Navbar({
  navLinks = [],
}: {
  navLinks?: NavLink[];
  serviceGroups?: ServiceNavGroups;
}) {
  return <Navigation links={navLinks} />;
}
