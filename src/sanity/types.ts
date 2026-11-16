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

export interface Seo {
  title?: string;
  description?: string;
  ogImage?: SanityImageAsset;
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
  _updatedAt?: string;
  body?: unknown[];
  seo?: Seo;
}

export interface BlogPageData {
  posts: BlogPostSummary[];
  total: number;
}
