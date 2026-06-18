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
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Center glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,197,94,0.10) 0%, transparent 65%)",
        }}
      />

      <Container className="relative z-10">
        <AnimateOnScroll className="mb-16 text-center">
          {eyebrow ? (
            <p className="mb-4 font-body text-xs font-bold uppercase tracking-[0.3em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id="stats-heading"
            className="font-heading text-4xl font-extrabold text-white sm:text-5xl"
          >
            {heading}
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {items.map((stat, index) => (
            <AnimateOnScroll key={`${stat.label}-${index}`} delay={index * 60}>
              <div className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/10">
                <span className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">
                  {stat.value}
                </span>
                <span className="font-body text-[10px] font-bold uppercase tracking-widest text-slate-400">
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
