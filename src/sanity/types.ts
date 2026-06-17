export interface SanityImageAsset {
  _type: "image";
  asset?: {
    _ref?: string;
    _id?: string;
    _type: "reference" | "sanity.imageAsset";
    url?: string;
  };
  alt?: string;
  lqip?: string;
  dimensions?: {
    width: number;
    height: number;
    aspectRatio: number;
  };
}

export interface CtaButton {
  label: string;
  href: string;
  openInNewTab?: boolean;
}

export interface Seo {
  title?: string;
  description?: string;
  ogImage?: SanityImageAsset;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  image?: SanityImageAsset;
}

export interface ProcessStep {
  title: string;
  description?: string;
  bullets?: string[];
  image?: SanityImageAsset;
}

export interface ServiceCard {
  title: string;
  description: string;
  href: string;
  icon?: SanityImageAsset;
}

export interface WhyUsItem {
  title: string;
  description: string;
  icon?: SanityImageAsset;
}

export interface CapabilityItem {
  title: string;
  description: string;
  icon?: string;
  image?: SanityImageAsset;
}

export interface TechnologyItem {
  name: string;
  logo?: SanityImageAsset;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CompanyValue {
  title: string;
  description: string;
  icon?: SanityImageAsset;
}

export interface PartnerItem {
  name: string;
  label?: string;
  url?: string;
  logo?: SanityImageAsset;
}

export interface PartnersSection {
  heading?: string;
  items?: PartnerItem[];
}

export interface IntegrationItem {
  name: string;
  url?: string;
  logo?: SanityImageAsset;
}

export interface IntegrationsSection {
  heading?: string;
  items?: IntegrationItem[];
}

export interface HomepageHero {
  badge?: string;
  heading: string;
  tagline?: string;
  ctaPrimary?: CtaButton;
  ctaSecondary?: CtaButton;
  image?: SanityImageAsset;
}

export interface Homepage {
  _id: string;
  _type: "homepage";
  hero: HomepageHero;
  process?: {
    heading?: string;
    subheading?: string;
    steps?: ProcessStep[];
  };
  services?: {
    eyebrow?: string;
    heading?: string;
  };
  whyUs?: {
    heading?: string;
    items?: WhyUsItem[];
  };
  stats?: {
    eyebrow?: string;
    heading?: string;
    items?: Stat[];
  };
  integrations?: IntegrationsSection;
  partners?: PartnersSection;
  featuredLogos?: {
    heading?: string;
    logos?: SanityImageAsset[];
  };
  testimonials?: {
    eyebrow?: string;
    heading?: string;
    items?: Testimonial[];
  };
  seo?: Seo;
}

export interface AboutPage {
  _id: string;
  _type: "aboutPage";
  hero: {
    heading: string;
    tagline?: string;
    cta?: CtaButton;
    image?: SanityImageAsset;
  };
  about?: {
    heading?: string;
    body?: string;
    promiseHeading?: string;
    promise?: string;
    image?: SanityImageAsset;
  };
  values?: CompanyValue[];
  process?: {
    heading?: string;
    subheading?: string;
    steps?: ProcessStep[];
  };
  stats?: Stat[];
  cta?: {
    heading?: string;
    description?: string;
    button?: CtaButton;
  };
  founder?: {
    eyebrow?: string;
    heading?: string;
    name?: string;
    role?: string;
    bio?: string;
    image?: SanityImageAsset;
  };
  integrations?: IntegrationsSection;
  partners?: PartnersSection;
  featuredLogos?: {
    heading?: string;
    logos?: SanityImageAsset[];
  };
  testimonials?: {
    heading?: string;
    items?: Testimonial[];
  };
  seo?: Seo;
}

export interface ServicePageListItem {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  description?: string;
  heroImage?: SanityImageAsset;
  capabilities?: CapabilityItem[];
}

export interface ServicePage {
  _id: string;
  _type: "servicePage";
  title: string;
  slug: string;
  tagline?: string;
  description?: string;
  heroImage?: SanityImageAsset;
  heroCta?: CtaButton;
  capabilitiesHeading?: string;
  capabilities?: CapabilityItem[];
  whyUsHeading?: string;
  whyUs?: WhyUsItem[];
  technologiesHeading?: string;
  technologies?: TechnologyItem[];
  cta?: {
    heading?: string;
    description?: string;
    button?: CtaButton;
  };
  seo?: Seo;
}

export interface ContactPage {
  _id: string;
  _type: "contactPage";
  hero: {
    heading: string;
    description?: string;
  };
  phone?: string;
  email?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  faqs?: FaqItem[];
  seo?: Seo;
}

export interface BlogPostSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  categories?: string[];
  author?: string;
  coverImage?: SanityImageAsset;
}

export interface BlogPost extends BlogPostSummary {
  body?: unknown[];
  seo?: Seo;
}

export interface BlogPageData {
  posts: BlogPostSummary[];
  total: number;
}

export interface ServiceSlug {
  slug: string;
}
