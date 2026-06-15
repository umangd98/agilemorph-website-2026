import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const STATS = [
  { value: "100+", label: "Successful Projects" },
  { value: "50+", label: "Satisfied Clients" },
  { value: "3+", label: "Years of Experience" },
  { value: "5+", label: "Countries Represented" },
  { value: "10k+", label: "Hours of Dedication" },
  { value: "100k+", label: "Cups of Coffee" },
] as const;

export function StatsSection() {
  return (
    <section
      className="relative overflow-hidden bg-surface py-section max-sm:py-section-sm"
      aria-labelledby="stats-heading"
    >
      {/* Subtle radial backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at center, rgba(34,197,94,0.04) 0%, transparent 70%)",
        }}
      />

      <Container className="relative z-10">
        <AnimateOnScroll className="text-center mb-16">
          <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4">
            Metrics That Matter
          </p>
          <h2
            id="stats-heading"
            className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl uppercase"
          >
            Enjoy Tangible Results
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {STATS.map((stat, i) => (
            <AnimateOnScroll key={stat.label} delay={i * 60}>
              <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-5 text-center shadow-sm transition-colors hover:border-primary/30">
                <span className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">
                  {stat.value}
                </span>
                <span className="font-body text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
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
