import type {
  ContactPage,
  FaqItem,
  HomepageHero,
  IntegrationItem,
  NavLink,
  SanityImageAsset,
  Seo,
  SocialLink,
  Testimonial,
} from "@/sanity/types";
export type ContentDocument = {
  _id: string;
  _type: string;
  contentVersion: number;
  seo?: Seo;
};
export type ProjectRef = { _ref: string };
export type Project = ContentDocument & {
  slug: { current: string };
  title: string;
  client: string;
  summary: string;
  category: "company" | "previous";
  status: "delivered" | "in-progress" | "scoped" | "active";
  attribution: string;
  services: string[];
  detailed: boolean;
  problem?: string;
  contribution?: string;
  solution?: string[];
  outcome?: string;
  workflow?: string[];
  stack?: string[];
  results?: { value: string; label: string }[];
  visuals?: SanityImageAsset[];
};
export type Service = ContentDocument & {
  slug: { current: string };
  title: string;
  headlineText: string;
  description: string;
  primary: boolean;
  parentService?: string;
  deliverables: string[];
  safeguards: string[];
  featuredProjects: ProjectRef[];
  faq: FaqItem[];
};
export type Feedback = Testimonial & {
  relationship?: "client" | "professional";
  sourceUrl?: string;
  caseStudy?: ProjectRef;
  rating?: number;
};
export type Leader = {
  name: string;
  role: string;
  bio: string;
  focus?: string;
  portrait?: string;
  image?: SanityImageAsset;
  profileUrl?: string;
  projectSlugs?: string[];
};
export type HomeContent = ContentDocument & {
  hero: HomepageHero & { audience: string };
  featuredProjects: ProjectRef[];
  audiences: {
    title: string;
    description: string;
    service: string;
    project: ProjectRef;
  }[];
  faq: FaqItem[];
  process: { title: string; description: string }[];
  testimonials: { items: Feedback[] };
  technologies?: IntegrationItem[];
};
export type AboutContent = ContentDocument & {
  heading: string;
  introduction: string;
  body: string;
  founderProduct: string;
  teamLeads: { heading: string; members: Leader[] };
  endorsements: Feedback[];
};
export type Engagement = {
  title: string;
  label: string;
  description: string;
  deliverables: string[];
};
export type PricingContent = ContentDocument & {
  heading: string;
  description: string;
  engagements: Engagement[];
  costDrivers: string[];
  costNote: string;
};
export type SettingsContent = ContentDocument & {
  siteTitle: string;
  siteDescription: string;
  navLinks: NavLink[];
  footerQuickLinks: NavLink[];
  socialLinks: SocialLink[];
  credentials: {
    name: string;
    label: string;
    category: string;
    url?: string;
  }[];
};
export type ContactContent = ContentDocument & ContactPage;
