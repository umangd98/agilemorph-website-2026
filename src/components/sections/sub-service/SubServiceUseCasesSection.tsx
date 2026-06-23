import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";
import type { UseCaseItem } from "@/sanity/types";

type SubServiceUseCasesSectionProps = {
  useCases?: UseCaseItem[];
};

export function SubServiceUseCasesSection({ useCases = [] }: SubServiceUseCasesSectionProps) {
  if (!useCases.length) return null;

  return (
    <section className="bg-surface py-section max-sm:py-section-sm" aria-labelledby="sub-usecases-heading">
      <Container>
        <AnimateOnScroll className="mb-10 text-center">
          <h2 id="sub-usecases-heading" className="sub-service-section-title">
            Common <span className="text-gradient">use cases</span>
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {useCases.map((item, index) => (
            <AnimateOnScroll key={item.title} delay={index * 50}>
              <article className="rounded-r-xl border-l-2 border-primary bg-background/80 px-5 py-4">
                <h3 className="font-heading text-base font-semibold tracking-[-0.01em] text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 font-body text-[0.9375rem] leading-[1.65] text-muted-foreground">
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
