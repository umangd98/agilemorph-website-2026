import { Container, SectionHeader } from "@/components/ui";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { StructuredData } from "@/components/StructuredData";
import { faqPageSchema } from "@/lib/structured-data";
import {
  homepageFaq,
  HOMEPAGE_FAQ_EYEBROW,
  HOMEPAGE_FAQ_HEADING,
} from "@/data/homepage-faq";
import type { FaqItem } from "@/sanity/types";

type FaqSectionProps = {
  eyebrow?: string;
  heading?: string;
  items?: FaqItem[];
};

/**
 * Homepage FAQ. Renders visible Q&A and emits matching FAQPage JSON-LD so the
 * page is eligible for FAQ rich results and citable by AI answer engines.
 * Falls back to the curated default set when Sanity has no FAQ content.
 */
export function FaqSection({
  eyebrow = HOMEPAGE_FAQ_EYEBROW,
  heading = HOMEPAGE_FAQ_HEADING,
  items,
}: FaqSectionProps) {
  const faqItems = items?.length ? items : homepageFaq;
  if (!faqItems.length) return null;

  const schema = faqPageSchema(faqItems);

  return (
    <section
      className="scroll-mt-24 border-t border-line py-24 sm:py-32"
      aria-label={heading}
    >
      {schema ? <StructuredData data={schema} /> : null}

      <Container>
        <SectionHeader index="07" label={eyebrow} title={heading} />

        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {faqItems.map((item, index) => (
            <AnimateOnScroll key={item.question} delay={index * 40}>
              <details className="group rounded-2xl border border-line bg-bg-elevated">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium leading-snug tracking-[-0.01em] text-fg">
                  {item.question}
                  <span
                    className="shrink-0 text-xl font-normal text-signal transition-transform duration-200 group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-[0.9375rem] leading-[1.65] text-fg-muted sm:text-base">
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
