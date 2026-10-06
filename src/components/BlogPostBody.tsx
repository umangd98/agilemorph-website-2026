import { BlogDiagram } from "./BlogDiagram";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import type { SanityImageAsset } from "@/sanity/types";

type PortableTextBlock = {
  _type: string;
  style?: string;
  children?: Array<{ text?: string; marks?: string[] }>;
};

const components: PortableTextComponents = {
  types: { diagram: BlogDiagram },
  block: {
    h2: ({ children }) => (
      <h2 className="font-heading text-foreground mt-10 mb-4 text-3xl font-bold">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading text-foreground mt-8 mb-3 text-2xl font-bold">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-heading text-foreground mt-6 mb-2 text-xl font-bold">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="font-body text-muted-foreground mb-4 text-base leading-relaxed">
        {children}
      </p>
    ),
  },
  listItem: {
    number: ({ children }) => (
      <li className="font-body text-muted-foreground mb-2 text-base leading-relaxed">
        {children}
      </li>
    ),
    bullet: ({ children }) => (
      <li className="font-body text-muted-foreground mb-2 text-base leading-relaxed">
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
