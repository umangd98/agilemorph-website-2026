import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";
import type { ProcessStep } from "@/sanity/types";

type SubServiceProcessSectionProps = {
  steps?: ProcessStep[];
};

export function SubServiceProcessSection({ steps = [] }: SubServiceProcessSectionProps) {
  if (!steps.length) return null;

  return (
    <section className="bg-background py-section max-sm:py-section-sm" aria-labelledby="sub-process-heading">
      <Container>
        <AnimateOnScroll className="mb-10 text-center">
          <h2 id="sub-process-heading" className="sub-service-section-title">
            How we <span className="text-gradient">work</span>
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <AnimateOnScroll key={step.title} delay={index * 50}>
              <article className="h-full rounded-2xl border border-border bg-surface p-5 sm:p-6">
                <p className="font-heading text-2xl font-extrabold tracking-tight text-primary/35 sm:text-3xl">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-heading text-base font-semibold tracking-[-0.01em] text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 font-body text-[0.9375rem] leading-[1.65] text-muted-foreground">
                  {step.description}
                </p>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
