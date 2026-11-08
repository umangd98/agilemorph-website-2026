import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { Reveal } from "@/components/Reveal";
import type { CardGridBlock, TextCard } from "@/sanity/types";

import { FdeSection } from "./FdeSection";

type CardTone = "default" | "symptom";

type CardGridSectionProps = {
  id?: string;
  index: string;
  block?: CardGridBlock;
  /** "symptom" marks each card as a problem with the "before" red accent. */
  tone?: CardTone;
  columns?: 2 | 3 | 4 | 5;
  /** Rendered between the cards and the closing line. */
  children?: ReactNode;
};

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-5",
} as const;

function CardBody({ item, index, tone }: { item: TextCard; index: number; tone: CardTone }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span
          className={`tnum font-mono text-xs ${tone === "symptom" ? "text-fail" : "text-signal"}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {item.href ? (
          <ArrowUpRight
            size={16}
            className="text-fg-dim transition-colors duration-200 group-hover:text-signal"
            aria-hidden
          />
        ) : null}
      </div>
      <h3 className="mt-4 text-lg font-medium leading-snug tracking-[-0.01em] text-fg">
        {item.title}
      </h3>
      {item.description ? (
        <p className="mt-2 text-pretty text-[0.9375rem] leading-relaxed text-fg-muted">
          {item.description}
        </p>
      ) : null}
    </>
  );
}

export function CardGridSection({
  id,
  index,
  block,
  tone = "default",
  columns = 3,
  children,
}: CardGridSectionProps) {
  const items = block?.items ?? [];
  if (!block?.heading && !items.length) return null;

  const cardClass = `group flex h-full flex-col rounded-2xl border bg-bg-elevated p-6 transition-colors duration-200 ${
    tone === "symptom"
      ? "border-line border-l-2 border-l-fail/70"
      : "border-line hover:border-line-strong"
  }`;

  return (
    <FdeSection
      id={id}
      index={index}
      eyebrow={block?.eyebrow}
      heading={block?.heading}
      intro={block?.intro}
    >
      {items.length ? (
        <ul className={`grid grid-cols-1 gap-4 ${columnClasses[columns]}`}>
          {items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 0.05} className="min-w-0">
              {item.href ? (
                <Link href={item.href} className={`${cardClass} hover:border-signal/40`}>
                  <CardBody item={item} index={i} tone={tone} />
                </Link>
              ) : (
                <div className={cardClass}>
                  <CardBody item={item} index={i} tone={tone} />
                </div>
              )}
            </Reveal>
          ))}
        </ul>
      ) : null}

      {children}

      {block?.closing ? (
        <Reveal>
          <p className="mt-10 max-w-3xl text-pretty text-lg font-medium leading-snug tracking-[-0.01em] text-fg sm:text-xl">
            {block.closing}
          </p>
        </Reveal>
      ) : null}
    </FdeSection>
  );
}
