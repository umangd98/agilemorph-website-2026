import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import type { PortableTextBlock } from "@/sanity/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-[1.08rem] leading-relaxed text-muted-foreground">
        {children}
      </p>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const isExternal = href.startsWith("http");

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-dark hover:decoration-primary"
          >
            {children}
          </a>
        );
      }

      return (
        <Link
          href={href}
          className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-dark hover:decoration-primary"
        >
          {children}
        </Link>
      );
    },
  },
};

type HeroTaglineProps = {
  value?: PortableTextBlock[];
};

export function HeroTagline({ value }: HeroTaglineProps) {
  if (!value?.length) return null;

  return <PortableText value={value} components={components} />;
}
