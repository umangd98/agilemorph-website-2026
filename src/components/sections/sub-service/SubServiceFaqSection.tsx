import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";
import type { FaqItem } from "@/sanity/types";

type SubServiceFaqSectionProps = {
  faq?: FaqItem[];
};

export function SubServiceFaqSection({ faq = [] }: SubServiceFaqSectionProps) {
  if (!faq.length) return null;

  return (
    <section className="bg-surface py-section max-sm:py-section-sm" aria-labelledby="sub-faq-heading">
      <Container>
        <AnimateOnScroll className="mb-10 text-center">
          <h2 id="sub-faq-heading" className="sub-service-section-title">
            Questions
          </h2>
        </AnimateOnScroll>

        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {faq.map((item, index) => (
            <AnimateOnScroll key={item.question} delay={index * 40}>
              <details className="sub-service-faq group rounded-2xl border border-border bg-background">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-heading text-[0.9375rem] font-semibold leading-snug tracking-[-0.01em] text-foreground sm:text-base">
                  {item.question}
                  <span className="sub-service-faq-icon text-xl font-normal text-primary" aria-hidden>
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 font-body text-[0.9375rem] leading-[1.65] text-muted-foreground sm:text-base">
                  {item.answer}
                </div>
              </details>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
