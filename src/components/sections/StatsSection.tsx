import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { MetricsGrid } from "@/components/MetricsGrid";
import type { Stat } from "@/sanity/types";

type StatsSectionProps = {
  eyebrow?: string;
  heading?: string;
  items?: Stat[];
  compact?: boolean;
};

export function StatsSection({
  eyebrow,
  heading,
  items = [],
  compact = false,
}: StatsSectionProps) {
  if (!heading && !items.length) return null;

  return (
    <section
      className={`relative overflow-hidden bg-background ${compact ? "py-12 max-sm:py-10" : "py-section max-sm:py-section-sm"}`}
      aria-labelledby="stats-heading"
    >
      <div className="stats-section-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="stats-section-glow pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />

      <Container className="relative z-10">
        <AnimateOnScroll className={`text-center ${compact ? "mb-8 sm:mb-10" : "mb-10 sm:mb-12"}`}>
          {eyebrow ? (
            <p className="mb-3 font-body text-[10px] font-bold uppercase tracking-[0.28em] text-primary sm:text-xs">
              {eyebrow}
            </p>
          ) : null}
          {heading ? (
            <h2
              id="stats-heading"
              className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl"
            >
              {heading}
            </h2>
          ) : null}
        </AnimateOnScroll>

        <MetricsGrid items={items} />
      </Container>
    </section>
  );
}
