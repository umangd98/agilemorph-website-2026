import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { MetricsGrid } from "@/components/MetricsGrid";
import type { CtaButton, Stat } from "@/sanity/types";

type AboutImpactSectionProps = {
  heading?: string;
  description?: string;
  button?: CtaButton;
  statsEyebrow?: string;
  statsHeading?: string;
  stats?: Stat[];
};

export function AboutImpactSection({
  heading,
  description,
  button,
  statsEyebrow,
  statsHeading,
  stats = [],
}: AboutImpactSectionProps) {
  if (!heading && !description && !stats.length) return null;

  return (
    <section className="bg-background py-12 max-sm:py-10" aria-labelledby="about-impact-heading">
      <Container>
        <AnimateOnScroll>
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-r from-[#0ba6a6] to-[#57cf5a] p-6 text-white shadow-lg sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-10">
              <div className="min-w-0">
                {heading ? (
                  <h2
                    id="about-impact-heading"
                    className="font-heading text-2xl font-extrabold sm:text-3xl lg:text-[2rem]"
                  >
                    {heading}
                  </h2>
                ) : null}
                {description ? (
                  <p className="mt-3 font-body text-sm leading-relaxed text-white/90 sm:text-base">
                    {description}
                  </p>
                ) : null}
                {button ? (
                  <Link
                    href={button.href}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-6 py-2.5 font-body text-sm font-bold text-foreground shadow-md transition-all hover:-translate-y-0.5"
                  >
                    {button.label}
                    <ArrowUpRight size={16} />
                  </Link>
                ) : null}
              </div>

              {stats.length ? (
                <div className="min-w-0">
                  {(statsEyebrow || statsHeading) && (
                    <div className="mb-4 text-center lg:text-left">
                      {statsEyebrow ? (
                        <p className="mb-1 font-body text-[10px] font-bold uppercase tracking-[0.28em] text-white/80 sm:text-xs">
                          {statsEyebrow}
                        </p>
                      ) : null}
                      {statsHeading ? (
                        <p className="font-heading text-lg font-extrabold text-white sm:text-xl">
                          {statsHeading}
                        </p>
                      ) : null}
                    </div>
                  )}
                  <MetricsGrid items={stats} variant="onPrimary" animate={false} />
                </div>
              ) : null}
            </div>
          </div>
        </AnimateOnScroll>
      </Container>
    </section>
  );
}
