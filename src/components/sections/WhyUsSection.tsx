import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { WhyUsInteractive } from "@/components/why-us-animations";
import type { WhyUsItem } from "@/sanity/types";

type WhyUsSectionProps = {
  heading?: string;
  items?: WhyUsItem[];
};

export function WhyUsSection({
  heading = "Why AgileMorph is Your Ideal Partner?",
  items = [],
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
          <WhyUsInteractive items={items} />
        </AnimateOnScroll>
      </Container>
    </section>
  );
}
