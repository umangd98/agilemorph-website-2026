/**
 * Site-wide positioning copy that is not owned by a single CMS page: the
 * Forward Deployed Engineering explainer, the one-liner, footer tagline and
 * contact facts. Page copy lives in Sanity.
 */

export const COMPANY_NAME = "Agilemorph";

/** Registered legal name, used only in the copyright line. */
export const COMPANY_LEGAL_NAME = "AgileMorph Digital Accelerators";

export const CONTACT_EMAIL = "info@theagilemorph.com";

export const COMPANY_LOCATION = "Nagpur, India";

export const ONE_LINER =
  "Agilemorph is one of India's first forward deployed engineering firms. Our engineers embed with your teams, find where AI fits in your systems, workflows and processes, build it in production, and stay until it's used.";

/** Plain-English explanation. Every page that names FDE shows it in the first screen. */
export const FDE_EXPLAINER =
  "Forward Deployed Engineering means our engineers work inside your business, on your sites or alongside your teams, instead of building from a requirements document at a distance. We learn the real process, build AI into the systems you already run, measure whether people use it, and keep improving until they do.";

export const FOOTER_TAGLINE =
  "Forward Deployed Engineering, built in India. AI inside your systems, adopted by your people, owned by you.";

export const SITE_TITLE = "Agilemorph | Forward Deployed Engineering for AI";

export const SITE_DESCRIPTION =
  "Agilemorph is one of India's first forward deployed engineering firms. Our engineers embed with your teams, find where AI fits in your systems and processes, build it in production, and stay until it's used.";

export const PRIMARY_CTA = {
  label: "Book a discovery call",
  href: "/contact#book",
} as const;

export const FOUNDERS = [
  { name: "Kaustumbh Jaiswal", jobTitle: "Co-founder and CTO" },
  { name: "Umang Dhandhania", jobTitle: "Co-founder" },
] as const;
