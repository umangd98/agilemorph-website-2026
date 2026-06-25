import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import type { Stat } from "@/sanity/types";

type StatsSectionProps = {
  eyebrow?: string;
  heading?: string;
  items?: Stat[];
};

export function StatsSection({
  eyebrow = "Metrics That Matter",
  heading = "Enjoy Tangible Results",
  items = [],
}: StatsSectionProps) {
  return (
    <section
      className="relative overflow-hidden bg-footer py-section max-sm:py-section-sm"
      aria-labelledby="stats-heading"
    >
      <div className="stats-section-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="stats-section-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <Container className="relative z-10">
        <AnimateOnScroll className="mb-16 text-center">
          {eyebrow ? (
            <p className="mb-4 font-body text-xs font-bold uppercase tracking-[0.3em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id="stats-heading"
            className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl"
          >
            {heading}
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-2 items-stretch gap-4 md:grid-cols-3 lg:grid-cols-6">
          {items.map((stat, index) => (
            <AnimateOnScroll
              key={`${stat.label}-${index}`}
              delay={index * 60}
              className="h-full"
            >
              <div className="group flex h-full min-h-[8.5rem] flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/50 p-5 text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 sm:min-h-[9rem]">
                <span className="font-heading text-3xl font-extrabold leading-none text-primary sm:text-4xl">
                  {stat.value}
                </span>
                <span className="max-w-[10.5rem] font-body text-xs font-semibold leading-snug text-muted-foreground sm:max-w-[11.5rem] sm:text-sm">
                  {stat.label}
                </span>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
