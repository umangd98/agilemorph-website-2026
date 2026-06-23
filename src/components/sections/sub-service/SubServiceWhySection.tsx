import { Check } from "lucide-react";

import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";
import { SubServiceHighlightedHeading } from "@/components/sections/sub-service/sub-service-typography";

type SubServiceWhySectionProps = {
  whyTitle?: string;
  whyHighlight?: string;
  whyText?: string;
  checks?: string[];
};

export function SubServiceWhySection({
  whyTitle,
  whyHighlight,
  whyText,
  checks = [],
}: SubServiceWhySectionProps) {
  if (!whyTitle && !whyText && !checks.length) return null;

  return (
    <section className="bg-background py-section max-sm:py-section-sm" aria-labelledby="sub-why-heading">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <AnimateOnScroll>
            {whyTitle ? (
              <SubServiceHighlightedHeading
                id="sub-why-heading"
                title={whyTitle}
                highlight={whyHighlight}
              />
            ) : null}
            {whyText ? <p className="sub-service-body mt-5">{whyText}</p> : null}
          </AnimateOnScroll>

          {checks.length > 0 ? (
            <ul className="space-y-3.5">
              {checks.map((item, index) => (
                <AnimateOnScroll key={item} delay={60 + index * 70}>
                  <li className="flex gap-3.5 font-body text-[0.9375rem] leading-[1.6] text-foreground/90 sm:text-base">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-primary/15 bg-primary/8 text-primary"
                      aria-hidden
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                    <span>{item}</span>
                  </li>
                </AnimateOnScroll>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
