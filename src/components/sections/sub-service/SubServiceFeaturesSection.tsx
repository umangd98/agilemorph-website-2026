import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";
import type { CapabilityItem } from "@/sanity/types";

type SubServiceFeaturesSectionProps = {
  heading?: string;
  capabilities?: CapabilityItem[];
};

function splitHeadingForGradient(heading: string) {
  const words = heading.trim().split(/\s+/);
  const highlight = words.pop() ?? heading;
  const before = words.join(" ");
  return { before, highlight };
}

export function SubServiceFeaturesSection({
  heading = "What's Included",
  capabilities = [],
}: SubServiceFeaturesSectionProps) {
  if (!capabilities.length) return null;

  const { before, highlight } = splitHeadingForGradient(heading);

  return (
    <section className="bg-surface py-section max-sm:py-section-sm" aria-labelledby="sub-features-heading">
      <Container>
        <AnimateOnScroll className="mb-10 text-center">
          <h2 id="sub-features-heading" className="sub-service-section-title">
            {before ? `${before} ` : null}
            <span className="text-gradient">{highlight}</span>
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {capabilities.map((item, index) => (
            <AnimateOnScroll key={`${item.title}-${index}`} delay={index * 60}>
              <article className="hover-lift h-full rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
                {item.icon ? (
                  <span
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/8 text-lg text-primary"
                    aria-hidden
                  >
                    {item.icon}
                  </span>
                ) : null}
                <h3 className="font-heading text-lg font-semibold tracking-[-0.01em] text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2.5 font-body text-[0.9375rem] leading-[1.65] text-muted-foreground">
                  {item.description}
                </p>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
