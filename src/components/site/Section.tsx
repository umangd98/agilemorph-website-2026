import type { ReactNode } from "react";

import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  title?: ReactNode;
  intro?: ReactNode;
  tone?: "paper" | "panel";
  children?: ReactNode;
  className?: string;
};

/** A page section: a rule, a title in the left two-thirds, then content. */
export function Section({ id, title, intro, tone = "paper", children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 py-20 sm:py-28",
        tone === "panel" ? "bg-panel" : "border-t border-rule",
        className,
      )}
    >
      <Container>
        {title ? (
          <div className="mb-12 max-w-3xl sm:mb-16">
            <h2 className="type-title">{title}</h2>
            {intro ? <div className="type-lede mt-5 max-w-2xl text-ink-muted">{intro}</div> : null}
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  );
}

/** Two-column definition list: term on the left, explanation on the right. */
export function TermList({
  items,
  className,
}: {
  items: ReadonlyArray<readonly [string, string]>;
  className?: string;
}) {
  return (
    <dl className={cn("grid gap-x-12 sm:grid-cols-2", className)}>
      {items.map(([term, detail]) => (
        <div key={term} className="border-t border-rule py-6">
          <dt className="type-heading">{term}</dt>
          <dd className="mt-2 max-w-md text-ink-muted">{detail}</dd>
        </div>
      ))}
    </dl>
  );
}
