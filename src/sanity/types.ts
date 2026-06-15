export interface SanityImageAsset {
  _type: "image";
  asset?: {
    _ref: string;
    _type: "reference";
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

export interface HeroSection {
  heading: string;
  subheading?: string;
  cta?: CtaButton;
  image?: SanityImageAsset;
}

export interface ContentSection {
  _key: string;
  eyebrow?: string;
  heading: string;
  body?: string;
  image?: SanityImageAsset;
  cta?: CtaButton;
}

export interface Homepage {
  _id: string;
  _type: "homepage";
  hero: HeroSection;
  sections?: ContentSection[];
  seo?: Seo;
}
