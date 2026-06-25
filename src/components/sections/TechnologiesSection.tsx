import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { LogoMarquee } from "@/components/LogoMarquee";
import { WhyUsInteractive } from "@/components/why-us-animations";
import type { TechnologyItem, WhyUsItem } from "@/sanity/types";

type TechnologiesSectionProps = {
  heading?: string;
  technologies?: TechnologyItem[];
};

export function TechnologiesSection({
  heading = "Technologies",
  technologies = [],
}: TechnologiesSectionProps) {
  if (!technologies.length) return null;

  return (
    <section className="overflow-x-clip bg-background py-section max-sm:py-section-sm" aria-labelledby="technologies-heading">
      <Container>
        <AnimateOnScroll className="mb-10 text-center sm:mb-12">
          <h2 id="technologies-heading" className="font-heading text-3xl font-extrabold text-foreground">
            {heading}
          </h2>
        </AnimateOnScroll>
      </Container>

      <LogoMarquee items={technologies} />
    </section>
  );
}

type ServiceWhyUsSectionProps = {
  heading?: string;
  items?: WhyUsItem[];
};

export function ServiceWhyUsSection({
  heading = "Why Choose Us",
  items = [],
}: ServiceWhyUsSectionProps) {
  if (!items.length) return null;

  return (
    <section className="bg-surface py-section max-sm:py-section-sm" aria-labelledby="service-why-us-heading">
      <Container>
        <AnimateOnScroll className="mb-10">
          <h2 id="service-why-us-heading" className="font-heading text-4xl font-extrabold text-foreground">
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
