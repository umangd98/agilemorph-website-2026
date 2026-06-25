import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { CalendlyBookButton } from "@/components/CalendlyBookButton";
import { Container } from "@/components/Container";
import type {
  PricingEngagementStep,
  PricingPage,
  PricingProjectTier,
  PricingRetainerTier,
} from "@/sanity/types";

function CheckIcon() {
  return (
    <span
      className="mt-0.5 flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10"
      aria-hidden
    >
      <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none">
        <polyline
          points="1.5,5 4,7.5 8.5,2.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        />
      </svg>
    </span>
  );
}

function PricingCard({
  tier,
}: {
  tier: PricingProjectTier;
}) {
  const priceDisplay: ReactNode =
    tier.priceBadge || tier.priceStrikethrough ? (
      <>
        {tier.priceStrikethrough ? (
          <span className="mr-1.5 font-body text-base font-normal text-muted-foreground/80 line-through">
            {tier.priceStrikethrough}
          </span>
        ) : null}
        {tier.priceBadge ? (
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 align-middle font-body text-xs font-semibold uppercase tracking-wide text-primary">
            {tier.priceBadge}
          </span>
        ) : (
          tier.price
        )}
      </>
    ) : (
      tier.price
    );

  return (
    <div
      className={`relative bg-card p-8 transition-colors duration-200 hover:bg-card-hover sm:p-8 ${
        tier.featured ? "z-[1] outline outline-[1.5px] outline-primary/40" : ""
      }`}
    >
      {tier.featured ? (
        <span className="absolute right-5 top-5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
          {tier.featuredLabel ?? "Most common"}
        </span>
      ) : null}

      <h3 className="font-heading text-lg font-bold text-foreground">{tier.name}</h3>
      <div className="mt-1 font-heading text-2xl font-extrabold text-primary sm:text-[1.45rem]">
        {priceDisplay}
      </div>
      {tier.limitedNote ? (
        <p className="mt-1.5 font-body text-xs italic text-muted-foreground">{tier.limitedNote}</p>
      ) : null}
      {tier.timeline ? (
        <p className={`font-body text-xs text-muted-foreground ${tier.limitedNote ? "mt-2" : "mt-1"}`}>
          {tier.timeline}
        </p>
      ) : null}
      <p className="mb-6 mt-3 font-body text-sm italic leading-relaxed text-muted-foreground">
        {tier.tagline}
      </p>

      <p className="mb-3 font-body text-[0.63rem] font-semibold uppercase tracking-widest text-muted-foreground/80">
        Deliverables
      </p>
      <ul className="mb-6 list-none space-y-0">
        {tier.deliverables.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 border-b border-border py-1.5 font-body text-sm text-muted-foreground last:border-0"
          >
            <CheckIcon />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {tier.paymentNote ? (
        <div className="rounded-lg border border-border bg-muted/50 px-4 py-3.5">
          <strong className="mb-1 block font-body text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
            {tier.paymentLabel ?? "Payment"}
          </strong>
          <p className="font-body text-xs leading-relaxed text-muted-foreground/80">{tier.paymentNote}</p>
        </div>
      ) : null}
    </div>
  );
}

function RetainerCard({ tier }: { tier: PricingRetainerTier }) {
  return (
    <div
      className={`relative bg-card p-8 transition-colors duration-200 hover:bg-card-hover ${
        tier.featured ? "z-[1] outline outline-[1.5px] outline-primary/40" : ""
      }`}
    >
      {tier.featured ? (
        <span className="absolute right-5 top-5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
          Most common
        </span>
      ) : null}

      <h3 className="font-heading text-base font-bold text-foreground">{tier.name}</h3>
      <div className="mt-1 font-heading text-3xl font-extrabold leading-none text-primary">
        {tier.price}
        <span className="ml-0.5 font-body text-base font-normal text-muted-foreground">/mo</span>
      </div>
      <p className="mt-1 font-body text-xs text-muted-foreground">{tier.hours}</p>
      <p className="mb-6 mt-3 font-body text-sm italic leading-relaxed text-muted-foreground">
        {tier.tagline}
      </p>

      <p className="mb-3 font-body text-[0.63rem] font-semibold uppercase tracking-widest text-muted-foreground/80">
        What&apos;s included
      </p>
      <ul className="list-none space-y-0">
        {tier.items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 border-b border-border py-1.5 font-body text-sm text-muted-foreground last:border-0"
          >
            <CheckIcon />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EngagementStepCard({ step }: { step: PricingEngagementStep }) {
  return (
    <div className="bg-card p-7 transition-colors duration-200 hover:bg-card-hover">
      <p className="mb-4 font-heading text-xs font-bold uppercase tracking-widest text-primary">
        {step.step}
      </p>
      <h3 className="mb-2 font-heading text-base font-bold text-foreground">{step.title}</h3>
      <p className="font-body text-sm leading-relaxed text-muted-foreground">{step.description}</p>
    </div>
  );
}

type PricingSectionProps = {
  page: PricingPage;
};

export function PricingSection({ page }: PricingSectionProps) {
  const heroLines = page.hero.heading.split("\n");
  const projectTiers = page.projectSection?.tiers ?? [];
  const retainerTiers = page.retainerSection?.tiers ?? [];
  const engagementSteps = page.engagementSection?.steps ?? [];

  return (
    <div className="bg-background text-foreground">
      <Container className="py-24 sm:py-28 lg:py-32">
        <AnimateOnScroll>
          {page.hero.eyebrow ? (
            <p className="mb-5 font-body text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {page.hero.eyebrow}
            </p>
          ) : null}
          <h1 className="mb-5 max-w-3xl font-heading text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {heroLines.map((line, index) => (
              <span key={line}>
                {line}
                {index < heroLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h1>
          {page.hero.description ? (
            <p className="max-w-xl font-body text-base leading-relaxed text-muted-foreground">
              {page.hero.description}
            </p>
          ) : null}
        </AnimateOnScroll>
      </Container>

      {projectTiers.length > 0 ? (
        <Container className="pb-16 sm:pb-20">
          <AnimateOnScroll delay={80}>
            {page.projectSection?.label ? (
              <p className="mb-9 border-b border-border pb-4 font-body text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
                {page.projectSection.label}
              </p>
            ) : null}
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
              {projectTiers.map((tier) => (
                <PricingCard key={tier.name} tier={tier} />
              ))}
            </div>
          </AnimateOnScroll>
        </Container>
      ) : null}

      {retainerTiers.length > 0 ? (
        <Container className="pb-16 sm:pb-20">
          <AnimateOnScroll delay={100}>
            {page.retainerSection?.label ? (
              <p className="mb-3 border-b border-border pb-4 font-body text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
                {page.retainerSection.label}
              </p>
            ) : null}
            {page.retainerSection?.description ? (
              <p className="mb-8 max-w-xl font-body text-sm leading-relaxed text-muted-foreground">
                {page.retainerSection.description}
              </p>
            ) : null}
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-3">
              {retainerTiers.map((tier) => (
                <RetainerCard key={tier.name} tier={tier} />
              ))}
            </div>
          </AnimateOnScroll>
        </Container>
      ) : null}

      {engagementSteps.length > 0 ? (
        <Container className="pb-16 sm:pb-20">
          <AnimateOnScroll delay={120}>
            {page.engagementSection?.label ? (
              <p className="mb-9 border-b border-border pb-4 font-body text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
                {page.engagementSection.label}
              </p>
            ) : null}
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
              {engagementSteps.map((step) => (
                <EngagementStepCard key={step.step} step={step} />
              ))}
            </div>
          </AnimateOnScroll>
        </Container>
      ) : null}

      {page.cta ? (
        <Container className="pb-24 sm:pb-28">
          <AnimateOnScroll delay={140}>
            <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-border bg-card p-8 sm:flex-row sm:items-center sm:p-12">
              <h2 className="max-w-md font-heading text-2xl font-bold leading-snug text-foreground sm:text-3xl">
                {page.cta.heading ? (
                  page.cta.heading.split("\n").map((line, index) => (
                    <span key={`${line}-${index}`}>
                      {index > 0 ? <br /> : null}
                      {page.cta?.headingAccent && line.includes(page.cta.headingAccent) ? (
                        <>
                          {line.replace(page.cta.headingAccent, "")}
                          <span className="text-primary">{page.cta.headingAccent}</span>
                        </>
                      ) : (
                        line
                      )}
                    </span>
                  ))
                ) : (
                  <>
                    Start with a free
                    <br />
                    <span className="text-primary">discovery audit.</span>
                  </>
                )}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                {page.cta.primaryCta ? (
                  <CalendlyBookButton className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-body text-sm font-semibold text-[#04140d] transition-all hover:bg-primary-dark">
                    {page.cta.primaryCta.label}
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </CalendlyBookButton>
                ) : null}
                {page.cta.secondaryCta ? (
                  <Link
                    href={page.cta.secondaryCta.href}
                    className="inline-flex items-center rounded-full border border-border px-6 py-3 font-body text-sm text-foreground transition-colors hover:border-primary/30 hover:bg-muted/50"
                  >
                    {page.cta.secondaryCta.label}
                  </Link>
                ) : null}
              </div>
            </div>
          </AnimateOnScroll>
        </Container>
      ) : null}
    </div>
  );
}
