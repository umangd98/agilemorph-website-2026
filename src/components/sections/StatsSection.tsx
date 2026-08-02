import { Container, SectionHeader } from "@/components/ui";
import { MetricsGrid } from "@/components/MetricsGrid";
import type { Stat } from "@/sanity/types";

type StatsSectionProps = {
  eyebrow?: string;
  heading?: string;
  items?: Stat[];
  compact?: boolean;
};

export function StatsSection({
  eyebrow = "By the numbers",
  heading,
  items = [],
  compact = false,
}: StatsSectionProps) {
  if (!heading && !items.length) return null;

  return (
    <section
      className={`scroll-mt-24 border-t border-line ${compact ? "py-16" : "py-24 sm:py-32"}`}
      aria-labelledby="stats-heading"
    >
      <Container>
        {heading ? (
          <SectionHeader index="04" label={eyebrow} title={heading} />
        ) : null}
        <MetricsGrid items={items} />
      </Container>
    </section>
  );
}
