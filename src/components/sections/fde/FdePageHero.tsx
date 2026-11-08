import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import { Container } from "@/components/ui";
import { CtaAction } from "@/components/CtaAction";
import type { CtaButton } from "@/sanity/types";

type FdePageHeroProps = {
  eyebrow?: string;
  heading: string;
  description?: string;
  ctaPrimary?: CtaButton;
  ctaSecondary?: CtaButton;
  /** Extra first-screen content under the buttons, e.g. the FDE explainer. */
  children?: ReactNode;
  align?: "left" | "center";
};

/** Inner-page hero on the shared grid backdrop. */
export function FdePageHero({
  eyebrow,
  heading,
  description,
  ctaPrimary,
  ctaSecondary,
  children,
  align = "center",
}: FdePageHeroProps) {
  const centered = align === "center";

  return (
    <section
      className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-16"
      aria-labelledby="page-hero-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          maskImage: "radial-gradient(80% 80% at 50% 30%, black, transparent)",
          WebkitMaskImage: "radial-gradient(80% 80% at 50% 30%, black, transparent)",
        }}
      >
        <svg className="h-full w-full" aria-hidden>
          <defs>
            <pattern id="fde-page-grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M64 0H0V64" fill="none" stroke="var(--color-grid-line)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fde-page-grid)" />
        </svg>
      </div>

      <Container className="relative z-10">
        <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
          {eyebrow ? <p className="syslabel text-signal">{eyebrow}</p> : null}
          <h1
            id="page-hero-heading"
            className="mt-4 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-fg sm:text-5xl lg:text-6xl"
          >
            {heading}
          </h1>
          {description ? (
            <p
              className={`mt-6 max-w-2xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg ${
                centered ? "mx-auto" : ""
              }`}
            >
              {description}
            </p>
          ) : null}
          {ctaPrimary || ctaSecondary ? (
            <div
              className={`mt-9 flex flex-col gap-3 sm:flex-row ${
                centered ? "items-center justify-center" : "items-start"
              }`}
            >
              {ctaPrimary ? (
                <CtaAction
                  cta={ctaPrimary}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3.5 font-body text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-90"
                >
                  {ctaPrimary.label}
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </CtaAction>
              ) : null}
              {ctaSecondary ? (
                <Link
                  href={ctaSecondary.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3.5 font-body text-sm font-medium text-fg transition-colors duration-200 hover:border-line-strong hover:bg-bg-elevated"
                >
                  {ctaSecondary.label}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
        {children ? <div className="mt-10">{children}</div> : null}
      </Container>
    </section>
  );
}
