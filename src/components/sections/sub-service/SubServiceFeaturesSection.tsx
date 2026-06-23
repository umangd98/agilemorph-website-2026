import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";
import type { CapabilityItem } from "@/sanity/types";

type SubServiceFeaturesSectionProps = {
  heading?: string;
  capabilities?: CapabilityItem[];
};

export function SubServiceFeaturesSection({
  heading = "What's included",
  capabilities = [],
}: SubServiceFeaturesSectionProps) {
  if (!capabilities.length) return null;

  return (
    <section className="bg-surface py-section max-sm:py-section-sm" aria-labelledby="sub-features-heading">
      <Container>
        <AnimateOnScroll className="mb-10 text-center">
          <h2 id="sub-features-heading" className="sub-service-section-title">
            What&apos;s <span className="text-gradient">included</span>
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {capabilities.map((item, index) => (
            <AnimateOnScroll key={`${item.title}-${index}`} delay={index * 60}>
              <article className="hover-lift h-full rounded-2xl border border-border bg-background p-6 shadow-sm">
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
