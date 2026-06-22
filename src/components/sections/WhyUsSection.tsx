import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { EfficiencyCalculator } from "@/components/sections/EfficiencyCalculator";
import { WhyUsInteractive } from "@/components/why-us-animations";
import type { EfficiencyCalculatorContent, WhyUsItem } from "@/sanity/types";

type WhyUsSectionProps = {
  heading?: string;
  items?: WhyUsItem[];
  efficiencyCalculator?: EfficiencyCalculatorContent;
};

export function WhyUsSection({
  heading = "Why AgileMorph is Your Ideal Partner?",
  items = [],
  efficiencyCalculator,
}: WhyUsSectionProps) {
  if (!items.length) return null;

  return (
    <section
      className="relative overflow-hidden bg-background py-section max-sm:py-section-sm"
      aria-labelledby="why-us-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 section-ambient-glow"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <AnimateOnScroll className="mb-10">
          <h2
            id="why-us-heading"
            className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl"
          >
            {heading}
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll delay={120}>
          <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-6">
            <WhyUsInteractive items={items} />
            <EfficiencyCalculator
              content={efficiencyCalculator}
              className="h-full min-h-[28rem] lg:min-h-0"
              variant="prominent"
            />
          </div>
        </AnimateOnScroll>
      </Container>
    </section>
  );
}
