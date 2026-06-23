import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";
import { CtaAction } from "@/components/CtaAction";
import { serviceHref } from "@/lib/services";
import type { CtaButton, SubServicePageSummary } from "@/sanity/types";

type SubServiceFinalCtaProps = {
  cta?: {
    heading?: string;
    description?: string;
    button?: CtaButton;
  };
  siblings: SubServicePageSummary[];
  currentSlug: string;
};

export function SubServiceFinalCta({ cta, siblings, currentSlug }: SubServiceFinalCtaProps) {
  const otherServices = siblings.filter((item) => item.slug !== currentSlug);

  return (
    <section className="bg-background pb-section max-sm:pb-section-sm" aria-labelledby="sub-final-cta-heading">
      <Container>
        <AnimateOnScroll>
          <div className="rounded-3xl border border-border bg-surface px-6 py-12 text-center sm:px-10 sm:py-14">
            <h2 id="sub-final-cta-heading" className="sub-service-section-title">
              Ready to <span className="text-gradient">automate this?</span>
            </h2>
            {cta?.description ? (
              <p className="sub-service-body mx-auto mt-4 max-w-xl">{cta.description}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {cta?.button ? (
                <CtaAction
                  cta={cta.button}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-body text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
                >
                  {cta.button.label}
                  <ArrowRight size={16} aria-hidden />
                </CtaAction>
              ) : null}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 font-body text-sm font-semibold text-foreground transition-colors hover:border-primary/35 hover:text-primary"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </AnimateOnScroll>

        {otherServices.length > 0 ? (
          <nav
            aria-label="Other AI automation services"
            className="mt-8 flex flex-wrap justify-center gap-2"
          >
            {otherServices.map((item, index) => (
              <AnimateOnScroll key={item.slug} delay={index * 35}>
                <Link
                  href={serviceHref(item.slug)}
                  className="inline-block rounded-full border border-border bg-background px-4 py-2 font-body text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
                >
                  {item.title}
                </Link>
              </AnimateOnScroll>
            ))}
          </nav>
        ) : null}
      </Container>
    </section>
  );
}
