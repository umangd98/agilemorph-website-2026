import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
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
    <section className="bg-background py-section max-sm:py-section-sm" aria-labelledby="technologies-heading">
      <Container>
        <AnimateOnScroll className="mb-10 text-center">
          <h2 id="technologies-heading" className="font-heading text-3xl font-extrabold text-foreground">
            {heading}
          </h2>
        </AnimateOnScroll>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {technologies.map((tech, index) => (
            <AnimateOnScroll key={`${tech.name}-${index}`} delay={index * 30}>
              <div className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-4 py-2">
                {tech.logo ? (
                  <div className="relative h-5 w-5">
                    <SanityImage
                      image={tech.logo}
                      alt={tech.logo.alt ?? tech.name}
                      fill
                      sizes="20px"
                      className="object-contain"
                    />
                  </div>
                ) : null}
                <span className="font-body text-sm font-medium text-foreground">
                  {tech.name}
                </span>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
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
