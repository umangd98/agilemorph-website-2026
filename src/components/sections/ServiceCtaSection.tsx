import { ArrowRight } from "lucide-react";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { CtaAction } from "@/components/CtaAction";
import type { CtaButton } from "@/sanity/types";

type ServiceCtaSectionProps = {
  heading?: string;
  description?: string;
  button?: CtaButton;
};

export function ServiceCtaSection({
  heading,
  description,
  button,
}: ServiceCtaSectionProps) {
  if (!heading && !description) return null;

  return (
    <section className="bg-background py-section max-sm:py-section-sm" aria-labelledby="service-cta-heading">
      <Container>
        <AnimateOnScroll className="rounded-3xl bg-foreground px-8 py-12 text-center text-background sm:px-12">
          {heading ? (
            <h2 id="service-cta-heading" className="mb-4 font-heading text-3xl font-extrabold sm:text-4xl">
              {heading}
            </h2>
          ) : null}
          {description ? (
            <p className="mx-auto mb-8 max-w-2xl font-body text-base leading-relaxed opacity-80">
              {description}
            </p>
          ) : null}
          {button ? (
            <CtaAction
              cta={button}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-body text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all hover:bg-primary-dark"
            >
              {button.label}
              <ArrowRight size={16} />
            </CtaAction>
          ) : null}
        </AnimateOnScroll>
      </Container>
    </section>
  );
}
