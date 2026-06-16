import { PortableText, type PortableTextComponents } from "@portabletext/react";

import type { SanityImageAsset } from "@/sanity/types";

type PortableTextBlock = {
  _type: string;
  style?: string;
  children?: Array<{ text?: string; marks?: string[] }>;
};

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mb-4 mt-10 font-heading text-3xl font-bold text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 font-heading text-2xl font-bold text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 mt-6 font-heading text-xl font-bold text-foreground">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-4 font-body text-base leading-relaxed text-muted-foreground">
        {children}
      </p>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="mb-2 font-body text-base leading-relaxed text-muted-foreground">
        {children}
      </li>
    ),
  },
};

type BlogPostBodyProps = {
  body?: PortableTextBlock[];
};

export function BlogPostBody({ body }: BlogPostBodyProps) {
  if (!body?.length) return null;

  return (
    <div className="prose-blog max-w-none">
      <PortableText value={body} components={components} />
    </div>
  );
}

export type { SanityImageAsset };
