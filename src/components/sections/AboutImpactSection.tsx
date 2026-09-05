import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
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
    <section className="scroll-mt-24 border-t border-line py-24 sm:py-32" aria-label={heading}>
      <Container>
        <Reveal>
          <div className="rounded-xl border border-line bg-bg-elevated p-8 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center">
              <div className="min-w-0">
                {heading ? (
                  <h2 className="text-balance text-2xl font-medium leading-[1.1] tracking-[-0.02em] text-fg sm:text-3xl lg:text-[2rem]">
                    {heading}
                  </h2>
                ) : null}
                {description ? (
                  <p className="mt-4 text-pretty text-sm leading-relaxed text-fg-muted sm:text-base">
                    {description}
                  </p>
                ) : null}
                {button ? (
                  <Link
                    href={button.href}
                    className="group mt-7 inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90"
                  >
                    {button.label}
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                ) : null}
              </div>

              {stats.length ? (
                <div className="min-w-0">
                  {statsEyebrow || statsHeading ? (
                    <div className="mb-5">
                      {statsEyebrow ? (
                        <p className="syslabel mb-2">{statsEyebrow}</p>
                      ) : null}
                      {statsHeading ? (
                        <p className="text-lg font-medium text-fg">{statsHeading}</p>
                      ) : null}
                    </div>
                  ) : null}
                  <MetricsGrid items={stats} animate={false} />
                </div>
              ) : null}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
