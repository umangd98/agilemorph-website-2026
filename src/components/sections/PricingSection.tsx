import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";

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

type PricingCardProps = {
  name: string;
  price: ReactNode;
  timeline?: string;
  tagline: string;
  deliverables: string[];
  paymentLabel?: string;
  paymentNote?: string;
  featured?: boolean;
  featuredLabel?: string;
  limitedNote?: string;
};

function PricingCard({
  name,
  price,
  timeline,
  tagline,
  deliverables,
  paymentLabel = "Payment",
  paymentNote,
  featured,
  featuredLabel = "Most common",
  limitedNote,
}: PricingCardProps) {
  return (
    <div
      className={`relative bg-card p-8 transition-colors duration-200 hover:bg-card-hover sm:p-8 ${
        featured ? "z-[1] outline outline-[1.5px] outline-primary/40" : ""
      }`}
    >
      {featured ? (
        <span className="absolute right-5 top-5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
          {featuredLabel}
        </span>
      ) : null}

      <h3 className="font-heading text-lg font-bold text-foreground">{name}</h3>
      <div className="mt-1 font-heading text-2xl font-extrabold text-primary sm:text-[1.45rem]">
        {price}
      </div>
      {limitedNote ? (
        <p className="mt-1.5 font-body text-xs italic text-muted-foreground">{limitedNote}</p>
      ) : null}
      {timeline ? (
        <p className={`font-body text-xs text-muted-foreground ${limitedNote ? "mt-2" : "mt-1"}`}>
          {timeline}
        </p>
      ) : null}
      <p className="mb-6 mt-3 font-body text-sm italic leading-relaxed text-muted-foreground">
        {tagline}
      </p>

      <p className="mb-3 font-body text-[0.63rem] font-semibold uppercase tracking-widest text-muted-foreground/80">
        Deliverables
      </p>
      <ul className="mb-6 list-none space-y-0">
        {deliverables.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 border-b border-border py-1.5 font-body text-sm text-muted-foreground last:border-0"
          >
            <CheckIcon />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {paymentNote ? (
        <div className="rounded-lg border border-border bg-muted/50 px-4 py-3.5">
          <strong className="mb-1 block font-body text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
            {paymentLabel}
          </strong>
          <p className="font-body text-xs leading-relaxed text-muted-foreground/80">{paymentNote}</p>
        </div>
      ) : null}
    </div>
  );
}

type RetainerCardProps = {
  name: string;
  price: string;
  hours: string;
  tagline: string;
  items: string[];
  featured?: boolean;
};

function RetainerCard({
  name,
  price,
  hours,
  tagline,
  items,
  featured,
}: RetainerCardProps) {
  return (
    <div
      className={`relative bg-card p-8 transition-colors duration-200 hover:bg-card-hover ${
        featured ? "z-[1] outline outline-[1.5px] outline-primary/40" : ""
      }`}
    >
      {featured ? (
        <span className="absolute right-5 top-5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
          Most common
        </span>
      ) : null}

      <h3 className="font-heading text-base font-bold text-foreground">{name}</h3>
      <div className="mt-1 font-heading text-3xl font-extrabold leading-none text-primary">
        {price}
        <span className="ml-0.5 font-body text-base font-normal text-muted-foreground">/mo</span>
      </div>
      <p className="mt-1 font-body text-xs text-muted-foreground">{hours}</p>
      <p className="mb-6 mt-3 font-body text-sm italic leading-relaxed text-muted-foreground">
        {tagline}
      </p>

      <p className="mb-3 font-body text-[0.63rem] font-semibold uppercase tracking-widest text-muted-foreground/80">
        What&apos;s included
      </p>
      <ul className="list-none space-y-0">
        {items.map((item) => (
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

const PROJECT_TIERS: (Omit<PricingCardProps, "price"> & { price: ReactNode })[] = [
  {
    name: "Discovery audit",
    price: (
      <>
        <span className="mr-1.5 font-body text-base font-normal text-muted-foreground/80 line-through">
          $500
        </span>
        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 align-middle font-body text-xs font-semibold uppercase tracking-wide text-primary">
          Free
        </span>
      </>
    ),
    limitedNote: "Limited time — book before spots fill.",
    timeline: "1–2 weeks",
    tagline: "Understand exactly what to build before committing to the build.",
    deliverables: [
      "Current-state workflow map",
      "Prioritized bottleneck analysis",
      "Recommended automation architecture",
      "Written scope for the build phase",
      "60-min walkthrough session with the founder",
    ],
    paymentNote:
      "Free for a limited time. Normally $500, credited toward your build invoice if you proceed.",
  },
  {
    name: "Single workflow",
    price: "$3K – $8K",
    timeline: "2–6 weeks",
    tagline: "One focused automation — scoped, built, and handed over production-ready.",
    deliverables: [
      "Workflow architecture document",
      "Production build in n8n, Make, or Zapier",
      "Integrations with your existing tools and CRM",
      "Error handling, monitoring, and retry logic",
      "Operator runbook and 30-day post-launch support",
    ],
    paymentNote: "50% at kickoff, 50% at production launch.",
  },
  {
    name: "Connected systems build",
    price: "$8K – $20K",
    timeline: "4–10 weeks",
    tagline: "Multiple workflows operating as one cohesive system across your stack.",
    featured: true,
    deliverables: [
      "Full operational architecture and data model",
      "3–8 workflows sharing a common data layer",
      "CRM integration and contact data design",
      "Custom API integrations and webhook handlers",
      "Observability, alerting, and error management",
      "60 days post-launch support",
    ],
    paymentNote: "40% at kickoff, 30% at mid-build review, 30% at launch.",
  },
  {
    name: "AI platform build",
    price: "$20K+",
    timeline: "2–5 months",
    tagline: "Custom AI infrastructure — agents, internal tools, or a full operations rebuild.",
    deliverables: [
      "Custom LLM agents built on Claude or GPT-4",
      "MCP server setup and AI tool infrastructure",
      "Full-stack development — Django, FastAPI, React",
      "Cloud deployment on AWS or DigitalOcean",
      "10+ connected workflows across teams",
      "90-day post-launch support and optimization",
    ],
    paymentNote:
      "Milestone-based. Typically 3–4 payment gates tied to delivery checkpoints.",
  },
];

const RETAINER_TIERS: RetainerCardProps[] = [
  {
    name: "Maintain",
    price: "$2K",
    hours: "~8 hrs/month",
    tagline: "Your automations stay healthy and your team stays unblocked.",
    items: [
      "Workflow monitoring and uptime checks",
      "Credential rotations and API updates",
      "Monthly health-check report",
      "Up to 2 small enhancements per month",
    ],
  },
  {
    name: "Iterate",
    price: "$5K",
    hours: "~20 hrs/month",
    tagline: "Active improvement across your stack each month, not just upkeep.",
    featured: true,
    items: [
      "Everything in Maintain",
      "Quarterly ops review and roadmap session",
      "2–4 new workflows delivered per month",
      "Direct Slack or email channel with the team",
      "Same-business-day response on production issues",
    ],
  },
  {
    name: "Embed",
    price: "$10K",
    hours: "~40 hrs/month",
    tagline: "AgileMorph operates as part of your team, not alongside it.",
    items: [
      "Everything in Iterate",
      "Weekly working sessions with the team",
      "Continuous workflow delivery capacity",
      "CRM and tooling implementation included",
      "On-call coverage for business-critical workflows",
    ],
  },
];

const HOW_STEPS = [
  {
    step: "Step 01",
    title: "Discovery first",
    description:
      "Every engagement starts with a paid audit. We map your current operations, identify the highest-leverage automation opportunities, and produce a written scope. You know exactly what you're getting before any build begins.",
  },
  {
    step: "Step 02",
    title: "Fixed scope, defined delivery",
    description:
      "The scope document from discovery becomes the contract. Deliverables, timelines, and payment milestones are agreed upfront. There are no change orders for work that falls within the original scope.",
  },
  {
    step: "Step 03",
    title: "Handed over, not dependent",
    description:
      "Every build includes full documentation and a runbook your team can operate. The goal is that you understand what we've built. Ongoing support is an option, not a requirement for the system to function.",
  },
];

export function PricingSection() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <Container className="py-24 sm:py-28 lg:py-32">
        <AnimateOnScroll>
          <p className="mb-5 font-body text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Pricing
          </p>
          <h1 className="mb-5 max-w-3xl font-heading text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Straightforward engagements.
            <br />
            Predictable outcomes.
          </h1>
          <p className="max-w-xl font-body text-base leading-relaxed text-muted-foreground">
            Every engagement begins with a discovery audit. From there, you choose a fixed-scope
            project or an ongoing retainer — both structured around delivery, not hours.
          </p>
        </AnimateOnScroll>
      </Container>

      {/* Project pricing */}
      <Container className="pb-16 sm:pb-20">
        <AnimateOnScroll delay={80}>
          <p className="mb-9 border-b border-border pb-4 font-body text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
            Project pricing — four fixed-scope tiers
          </p>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
            {PROJECT_TIERS.map((tier) => (
              <PricingCard key={tier.name} {...tier} />
            ))}
          </div>
        </AnimateOnScroll>
      </Container>

      {/* Retainer pricing */}
      <Container className="pb-16 sm:pb-20">
        <AnimateOnScroll delay={100}>
          <p className="mb-3 border-b border-border pb-4 font-body text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
            Retainer pricing — three monthly tiers
          </p>
          <p className="mb-8 max-w-xl font-body text-sm leading-relaxed text-muted-foreground">
            Month-to-month engagements structured around output, not seat time. Each tier reflects a
            different level of operational involvement.
          </p>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-3">
            {RETAINER_TIERS.map((tier) => (
              <RetainerCard key={tier.name} {...tier} />
            ))}
          </div>
        </AnimateOnScroll>
      </Container>

      {/* How engagements work */}
      <Container className="pb-16 sm:pb-20">
        <AnimateOnScroll delay={120}>
          <p className="mb-9 border-b border-border pb-4 font-body text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
            How engagements work
          </p>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
            {HOW_STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-card p-7 transition-colors duration-200 hover:bg-card-hover"
              >
                <p className="mb-4 font-heading text-xs font-bold uppercase tracking-widest text-primary">
                  {item.step}
                </p>
                <h3 className="mb-2 font-heading text-base font-bold text-foreground">{item.title}</h3>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </Container>

      {/* CTA band */}
      <Container className="pb-24 sm:pb-28">
        <AnimateOnScroll delay={140}>
          <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-border bg-card p-8 sm:flex-row sm:items-center sm:p-12">
            <h2 className="max-w-md font-heading text-2xl font-bold leading-snug text-foreground sm:text-3xl">
              Start with a free
              <br />
              <span className="text-primary">discovery audit.</span>
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-body text-sm font-semibold text-[#04140d] transition-all hover:bg-primary-dark"
              >
                Book a discovery call
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/services/ai-automation"
                className="inline-flex items-center rounded-full border border-border px-6 py-3 font-body text-sm text-foreground transition-colors hover:border-primary/30 hover:bg-muted/50"
              >
                See what we build
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </Container>
    </div>
  );
}
