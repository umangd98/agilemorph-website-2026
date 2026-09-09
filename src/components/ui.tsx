import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/** Consistent max-width gutter. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1180px] px-6 sm:px-8 lg:px-12",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Section header — `index / LABEL` in mono with a hairline rule to the edge,
 * a large tracked-in title, and an optional intro.
 */
export function SectionHeader({
  index,
  label,
  title,
  intro,
}: {
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <header className="mb-12 sm:mb-16">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="syslabel flex shrink-0 items-center gap-2">
            <span className="tnum text-fg-muted">{index}</span>
            <span aria-hidden className="text-fg-dim">
              /
            </span>
            <span>{label}</span>
          </span>
          <span aria-hidden className="h-px flex-1 bg-line" />
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-6 max-w-3xl text-balance text-3xl font-medium leading-[1.1] tracking-[-0.02em] text-fg sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
      </Reveal>
      {intro ? (
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
            {intro}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}

/** Monospace technology / tag chip. */
export function StackTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-bg-elevated px-2.5 py-1 font-mono text-[0.6875rem] leading-none text-fg-muted">
      {children}
    </span>
  );
}

/** Live status dot with an ambient pulse. */
export function StatusDot({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "signal-dot inline-block h-2 w-2 rounded-full bg-signal",
        className,
      )}
    />
  );
}
