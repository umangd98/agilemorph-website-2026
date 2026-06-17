"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Bot,
  ChevronDown,
  ClipboardCheck,
  Layers,
  MessageSquare,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
import type { ServiceCard } from "@/sanity/types";

type ServicesSectionProps = {
  eyebrow?: string;
  heading?: string;
  cards?: ServiceCard[];
};

const PRIMARY_SERVICE_HREF = "/services/ai-automation";

const AI_SUB_SERVICES = [
  {
    title: "AI Agents",
    description: "Autonomous agents that classify, decide, and act across your tools.",
    href: PRIMARY_SERVICE_HREF,
    icon: Bot,
  },
  {
    title: "Workflow Automation",
    description: "n8n, Make, and Zapier pipelines that eliminate repetitive work.",
    href: PRIMARY_SERVICE_HREF,
    icon: RefreshCw,
  },
  {
    title: "CRM & Lead Automation",
    description: "Capture, enrich, route, and follow up on every lead automatically.",
    href: PRIMARY_SERVICE_HREF,
    icon: Target,
  },
  {
    title: "MCP & AI Infrastructure",
    description: "Self-hosted pipelines, MCP servers, and production-grade deployments.",
    href: PRIMARY_SERVICE_HREF,
    icon: Layers,
  },
  {
    title: "Messaging Automation",
    description: "WhatsApp, email, and chat automations that respond and convert.",
    href: PRIMARY_SERVICE_HREF,
    icon: MessageSquare,
  },
  {
    title: "AI Audit",
    description: "A fixed-scope review that maps where AI saves you the most time and money.",
    href: PRIMARY_SERVICE_HREF,
    icon: ClipboardCheck,
  },
] as const;

const PRIMARY_METRICS = [
  { value: "10,000+", label: "Hours of automation shipped" },
  { value: "40%+", label: "Average reduction in manual ops time" },
  { value: "24/7", label: "Systems running without you" },
] as const;

function AdditionalServiceCard({
  service,
  index,
}: {
  service: ServiceCard;
  index: number;
}) {
  return (
    <AnimateOnScroll delay={index * 60} className="h-full">
      <div className="hover-lift group flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-sm">
        {service.icon ? (
          <div className="relative mb-5 h-10 w-10 transition-transform duration-300 group-hover:scale-110">
            <SanityImage
              image={service.icon}
              alt={service.icon.alt ?? service.title}
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
          </div>
        ) : null}

        <h3 className="mb-2 font-heading text-lg font-bold text-foreground">
          {service.title}
        </h3>
        <p className="mb-5 flex-1 font-body text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        <Link
          href={service.href}
          className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest text-primary transition-all group-hover:gap-3"
        >
          View Service Details
          <ArrowRight size={14} />
        </Link>
      </div>
    </AnimateOnScroll>
  );
}

export function ServicesSection({
  eyebrow = "Our Expertise",
  heading = "Discover Our Services",
  cards = [],
}: ServicesSectionProps) {
  const [showAdditional, setShowAdditional] = useState(false);

  const additionalCards = cards.filter(
    (card) => !card.href?.includes("ai-automation"),
  );

  const primaryCard =
    cards.find((card) => card.href?.includes("ai-automation")) ?? cards[0];

  return (
    <section
      className="bg-surface py-section max-sm:py-section-sm"
      aria-labelledby="services-heading"
    >
      <Container>
        <AnimateOnScroll>
          <div className="mb-14 text-center md:mb-16">
            {eyebrow ? (
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-body text-xs font-bold uppercase tracking-widest text-primary">
                <Sparkles size={12} />
                {eyebrow}
              </span>
            ) : null}
            <h2
              id="services-heading"
              className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl"
            >
              {heading.split(" ").map((word, i, arr) => {
                const isLast = i === arr.length - 1;
                return isLast ? (
                  <span key={word} className="text-primary">
                    {word}
                  </span>
                ) : (
                  <span key={word}>{word} </span>
                );
              })}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-base text-muted-foreground">
              AI automation is the engine of everything we build. Supporting services keep the
              rest of your operation moving in the same direction.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Primary AI Automation card */}
        <AnimateOnScroll delay={80}>
          <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
            <div className="relative grid grid-cols-1 gap-8 border-b border-border p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-11">
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                aria-hidden
                style={{
                  background:
                    "radial-gradient(ellipse 70% 60% at 85% 0%, rgba(34,197,94,0.12), transparent 60%)",
                }}
              />

              <div className="relative z-10">
                <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary px-3.5 py-1.5 font-body text-[11px] font-bold uppercase tracking-widest text-white">
                  ★ Primary Service
                </span>
                <h3 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
                  {primaryCard?.title ?? "AI Automation"}
                </h3>
                <p className="max-w-xl font-body text-base leading-relaxed text-muted-foreground">
                  {primaryCard?.description ??
                    "We design, build, and run AI systems that remove manual work from your business. Agents that act, workflows that never sleep, and infrastructure built to scale."}
                </p>
                <Link
                  href={PRIMARY_SERVICE_HREF}
                  className="group mt-6 inline-flex items-center gap-2 font-body text-sm font-bold text-primary transition-all hover:gap-3"
                >
                  Explore AI Automation
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="relative z-10 flex flex-col justify-center gap-3.5">
                {PRIMARY_METRICS.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-baseline gap-3 rounded-xl border border-border bg-surface/80 px-4 py-3.5"
                  >
                    <span className="min-w-[4.5rem] font-heading text-2xl font-extrabold text-primary">
                      {metric.value}
                    </span>
                    <span className="font-body text-sm text-muted-foreground">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
              {AI_SUB_SERVICES.map((sub) => {
                const Icon = sub.icon;
                return (
                  <Link
                    key={sub.title}
                    href={sub.href}
                    className="group flex flex-col bg-background p-7 transition-colors duration-200 hover:bg-primary/5"
                  >
                    <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition-colors group-hover:border-primary/30 group-hover:bg-primary/15">
                      <Icon size={18} />
                    </span>
                    <h4 className="mb-2 font-heading text-lg font-semibold text-foreground">
                      {sub.title}
                    </h4>
                    <p className="mb-4 flex-1 font-body text-sm text-muted-foreground">
                      {sub.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-primary opacity-90 transition-all group-hover:gap-2.5 group-hover:opacity-100">
                      Explore
                      <ArrowRight size={14} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </AnimateOnScroll>

        {/* Additional services — collapsed by default */}
        {additionalCards.length > 0 ? (
          <div className="mt-14">
            <div className="mb-6 flex items-center gap-4">
              <h3 className="shrink-0 font-body text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Additional Services
              </h3>
              <span className="h-px flex-1 bg-border" aria-hidden />
            </div>

            <div className="mb-6 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAdditional((open) => !open)}
                aria-expanded={showAdditional}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 font-body text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/30 hover:text-primary"
              >
                {showAdditional ? "Show less" : "Show more services"}
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${showAdditional ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            <div
              className="grid transition-[grid-template-rows] duration-500 ease-in-out"
              style={{ gridTemplateRows: showAdditional ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 gap-5 pb-2 sm:grid-cols-2 lg:grid-cols-4">
                  {additionalCards.map((service, index) => (
                    <AdditionalServiceCard
                      key={`${service.title}-${index}`}
                      service={service}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
