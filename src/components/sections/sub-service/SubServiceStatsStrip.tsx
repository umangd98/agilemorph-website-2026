import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";
import { isCompactStatValue } from "@/components/sections/sub-service/sub-service-typography";
import type { StatItem } from "@/sanity/types";

type SubServiceStatsStripProps = {
  stats?: StatItem[];
};

export function SubServiceStatsStrip({ stats = [] }: SubServiceStatsStripProps) {
  if (!stats.length) return null;

  return (
    <section className="border-y border-border bg-surface py-8 sm:py-10" aria-label="Key metrics">
      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-8">
          {stats.map((stat, index) => {
            const compact = isCompactStatValue(stat.value);

            return (
              <AnimateOnScroll key={`${stat.value}-${stat.label}`} delay={index * 70}>
                <div className="text-center sm:text-left">
                  <p
                    className={`sub-service-stat-value ${compact ? "sub-service-stat-value-md" : "sub-service-stat-value-lg"}`}
                  >
                    {stat.value}
                  </p>
                  <p className="sub-service-stat-label mt-1.5">{stat.label}</p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
