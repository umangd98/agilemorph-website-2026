import { ArrowRight } from "lucide-react";

import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";
import { CtaAction } from "@/components/CtaAction";
import type { CtaButton, ServicePricing } from "@/sanity/types";

type SubServicePricingSectionProps = {
  pricing?: ServicePricing;
  cta?: CtaButton;
};

export function SubServicePricingSection({ pricing, cta }: SubServicePricingSectionProps) {
  if (!pricing?.headline && !pricing?.detail) return null;

  return (
    <section className="bg-background py-section max-sm:py-section-sm" aria-labelledby="sub-pricing-heading">
      <Container>
        <AnimateOnScroll>
          <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-border bg-surface p-8 sm:p-10 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 id="sub-pricing-heading" className="sub-service-section-title text-2xl sm:text-[1.75rem]">
                Investment
              </h2>
              {pricing.detail ? (
                <p className="sub-service-body mt-4 max-w-2xl">{pricing.detail}</p>
              ) : null}
              {pricing.headline ? (
                <p className="mt-4 font-body text-sm font-semibold leading-relaxed text-primary">
                  {pricing.headline}
                </p>
              ) : null}
            </div>
            {cta ? (
              <CtaAction
                cta={cta}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-body text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark"
              >
                Get a Fixed Quote
                <ArrowRight size={16} aria-hidden />
              </CtaAction>
            ) : null}
          </div>
        </AnimateOnScroll>
      </Container>
    </section>
  );
}
