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
      className="border-primary/20 bg-primary/10 mt-0.5 flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-md border"
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

function PricingCard({ tier }: { tier: PricingProjectTier }) {
  const priceDisplay: ReactNode =
    tier.priceBadge || tier.priceStrikethrough ? (
      <>
        {tier.priceStrikethrough ? (
          <span className="font-body text-muted-foreground/80 mr-1.5 text-base font-normal line-through">
            {tier.priceStrikethrough}
          </span>
        ) : null}
        {tier.priceBadge ? (
          <span className="border-primary/30 bg-primary/10 font-body text-primary inline-flex items-center rounded-full border px-2.5 py-0.5 align-middle text-xs font-semibold tracking-wide uppercase">
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
      className={`bg-card hover:bg-card-hover relative p-8 transition-colors duration-200 sm:p-8 ${
        tier.featured ? "outline-primary/40 z-[1] outline outline-[1.5px]" : ""
      }`}
    >
      {tier.featured ? (
        <span className="border-primary/20 bg-primary/10 font-body text-primary absolute top-5 right-5 rounded-full border px-3 py-1 text-[0.65rem] font-semibold tracking-wider uppercase">
          {tier.featuredLabel ?? "Most common"}
        </span>
      ) : null}

      <h3 className="font-heading text-foreground text-lg font-bold">
        {tier.name}
      </h3>
      <div className="font-heading text-primary mt-1 text-2xl font-extrabold sm:text-[1.45rem]">
        {priceDisplay}
      </div>
      {tier.limitedNote ? (
        <p className="font-body text-muted-foreground mt-1.5 text-xs italic">
          {tier.limitedNote}
        </p>
      ) : null}
      {tier.timeline ? (
        <p
          className={`font-body text-muted-foreground text-xs ${tier.limitedNote ? "mt-2" : "mt-1"}`}
        >
          {tier.timeline}
        </p>
      ) : null}
      <p className="font-body text-muted-foreground mt-3 mb-6 text-sm leading-relaxed italic">
        {tier.tagline}
      </p>

      <p className="font-body text-muted-foreground/80 mb-3 text-[0.63rem] font-semibold tracking-widest uppercase">
        Deliverables
      </p>
      <ul className="mb-6 list-none space-y-0">
        {tier.deliverables.map((item) => (
          <li
            key={item}
            className="border-border font-body text-muted-foreground flex items-start gap-2.5 border-b py-1.5 text-sm last:border-0"
          >
            <CheckIcon />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {tier.paymentNote ? (
        <div className="border-border bg-muted/50 rounded-lg border px-4 py-3.5">
          <strong className="font-body text-muted-foreground mb-1 block text-[0.7rem] font-medium tracking-wider uppercase">
            {tier.paymentLabel ?? "Payment"}
          </strong>
          <p className="font-body text-muted-foreground/80 text-xs leading-relaxed">
            {tier.paymentNote}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function RetainerCard({ tier }: { tier: PricingRetainerTier }) {
  return (
    <div
      className={`bg-card hover:bg-card-hover relative p-8 transition-colors duration-200 ${
        tier.featured ? "outline-primary/40 z-[1] outline outline-[1.5px]" : ""
      }`}
    >
      {tier.featured ? (
        <span className="border-primary/20 bg-primary/10 font-body text-primary absolute top-5 right-5 rounded-full border px-3 py-1 text-[0.65rem] font-semibold tracking-wider uppercase">
          Most common
        </span>
      ) : null}

      <h3 className="font-heading text-foreground text-base font-bold">
        {tier.name}
      </h3>
      <div className="font-heading text-primary mt-1 text-3xl leading-none font-extrabold">
        {tier.price}
        <span className="font-body text-muted-foreground ml-0.5 text-base font-normal">
          /mo
        </span>
      </div>
      <p className="font-body text-muted-foreground mt-1 text-xs">
        {tier.hours}
      </p>
      <p className="font-body text-muted-foreground mt-3 mb-6 text-sm leading-relaxed italic">
        {tier.tagline}
      </p>

      <p className="font-body text-muted-foreground/80 mb-3 text-[0.63rem] font-semibold tracking-widest uppercase">
        What&apos;s included
      </p>
      <ul className="list-none space-y-0">
        {tier.items.map((item) => (
          <li
            key={item}
            className="border-border font-body text-muted-foreground flex items-start gap-2.5 border-b py-1.5 text-sm last:border-0"
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
    <div className="bg-card hover:bg-card-hover p-7 transition-colors duration-200">
      <p className="font-heading text-primary mb-4 text-xs font-bold tracking-widest uppercase">
        {step.step}
      </p>
      <h3 className="font-heading text-foreground mb-2 text-base font-bold">
        {step.title}
      </h3>
      <p className="font-body text-muted-foreground text-sm leading-relaxed">
        {step.description}
      </p>
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
            <p className="font-body text-primary mb-5 text-xs font-semibold tracking-[0.14em] uppercase">
              {page.hero.eyebrow}
            </p>
          ) : null}
          <h1 className="font-heading mb-5 max-w-3xl text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {heroLines.map((line, index) => (
              <span key={line}>
                {line}
                {index < heroLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h1>
          {page.hero.description ? (
            <p className="font-body text-muted-foreground max-w-xl text-base leading-relaxed">
              {page.hero.description}
            </p>
          ) : null}
        </AnimateOnScroll>
      </Container>

      {projectTiers.length > 0 ? (
        <Container className="pb-16 sm:pb-20">
          <AnimateOnScroll delay={80}>
            {page.projectSection?.label ? (
              <p className="border-border font-body text-muted-foreground/80 mb-9 border-b pb-4 text-[0.68rem] font-medium tracking-[0.14em] uppercase">
                {page.projectSection.label}
              </p>
            ) : null}
            <div className="border-border bg-border grid grid-cols-1 gap-px overflow-hidden rounded-2xl border md:grid-cols-2">
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
              <p className="border-border font-body text-muted-foreground/80 mb-3 border-b pb-4 text-[0.68rem] font-medium tracking-[0.14em] uppercase">
                {page.retainerSection.label}
              </p>
            ) : null}
            {page.retainerSection?.description ? (
              <p className="font-body text-muted-foreground mb-8 max-w-xl text-sm leading-relaxed">
                {page.retainerSection.description}
              </p>
            ) : null}
            <div className="border-border bg-border grid grid-cols-1 gap-px overflow-hidden rounded-2xl border lg:grid-cols-3">
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
              <p className="border-border font-body text-muted-foreground/80 mb-9 border-b pb-4 text-[0.68rem] font-medium tracking-[0.14em] uppercase">
                {page.engagementSection.label}
              </p>
            ) : null}
            <div className="border-border bg-border grid grid-cols-1 gap-px overflow-hidden rounded-2xl border md:grid-cols-3">
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
            <div className="border-border bg-card flex flex-col items-start justify-between gap-8 rounded-2xl border p-8 sm:flex-row sm:items-center sm:p-12">
              <h2 className="font-heading text-foreground max-w-md text-2xl leading-snug font-bold sm:text-3xl">
                {page.cta.heading ? (
                  page.cta.heading.split("\n").map((line, index) => (
                    <span key={`${line}-${index}`}>
                      {index > 0 ? <br /> : null}
                      {page.cta?.headingAccent &&
                      line.includes(page.cta.headingAccent) ? (
                        <>
                          {line.replace(page.cta.headingAccent, "")}
                          <span className="text-primary">
                            {page.cta.headingAccent}
                          </span>
                        </>
                      ) : (
                        line
                      )}
                    </span>
                  ))
                ) : (
                  <>
                    Start With A
                    <br />
                    <span className="text-primary">project conversation.</span>
                  </>
                )}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                {page.cta.primaryCta ? (
                  <CalendlyBookButton className="group bg-signal font-body inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#04140d] transition-all hover:opacity-90">
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
                    className="border-border font-body text-foreground hover:border-primary/30 hover:bg-muted/50 inline-flex items-center rounded-full border px-6 py-3 text-sm transition-colors"
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
