"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import type { PortableTextBlock } from "@/sanity/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-sm leading-relaxed text-muted-foreground sm:text-base">
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

function useFinePointerHover() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return enabled;
}

type HeroTaglineProps = {
  value?: PortableTextBlock[];
};

export function HeroTagline({ value }: HeroTaglineProps) {
  const [expanded, setExpanded] = useState(false);
  const canHover = useFinePointerHover();

  const showExpanded = expanded;

  const handleExpand = useCallback(() => setExpanded(true), []);
  const handleCollapse = useCallback(() => setExpanded(false), []);

  if (!value?.length) return null;

  return (
    <div
      className="relative"
      onMouseEnter={canHover ? handleExpand : undefined}
      onMouseLeave={canHover ? handleCollapse : undefined}
    >
      <div
        className={`relative transition-all duration-300 ${
          showExpanded ? "" : "max-h-[3.25rem] overflow-hidden sm:max-h-[3.5rem]"
        }`}
      >
        <PortableText value={value} components={components} />
        {!showExpanded ? (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-background via-background/90 to-transparent"
            aria-hidden
          />
        ) : null}
      </div>

      {!showExpanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-2 font-body text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-dark hover:decoration-primary"
          aria-expanded={false}
        >
          Read more
        </button>
      ) : canHover ? null : (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-2 font-body text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-dark hover:decoration-primary"
          aria-expanded
        >
          Show less
        </button>
      )}
    </div>
  );
}
