"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CtaAction } from "@/components/CtaAction";
import { SubServiceHeadline } from "@/components/sections/sub-service/sub-service-typography";
import type { CtaButton, ServiceHeadline } from "@/sanity/types";

type SubServiceHeroIntroProps = {
  pageKey: string;
  tagline?: string;
  headline?: ServiceHeadline;
  title: string;
  description?: string;
  heroCta?: CtaButton;
};

export function SubServiceHeroIntro({
  pageKey,
  tagline,
  headline,
  title,
  description,
  heroCta,
}: SubServiceHeroIntroProps) {
  return (
    <div key={pageKey} className="sub-service-hero-intro min-w-0 max-w-xl lg:max-w-none">
      {tagline ? (
        <span
          className="sub-service-hero-item mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3.5 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
          style={{ animationDelay: "0ms" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
          {tagline}
        </span>
      ) : null}
      <h1
        id="sub-service-hero-heading"
        className="sub-service-hero-title sub-service-hero-item"
        style={{ animationDelay: tagline ? "70ms" : "0ms" }}
      >
        <SubServiceHeadline headline={headline} fallbackTitle={title} />
      </h1>
      {description ? (
        <p
          className="sub-service-hero-lead sub-service-hero-item mt-6"
          style={{ animationDelay: tagline ? "140ms" : "70ms" }}
        >
          {description}
        </p>
      ) : null}
      <div
        className="sub-service-hero-item mt-9 flex flex-wrap gap-3"
        style={{ animationDelay: tagline ? "210ms" : "140ms" }}
      >
        {heroCta ? (
          <CtaAction
            cta={heroCta}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-body text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-primary/30"
          >
            {heroCta.label}
            <ArrowRight size={16} aria-hidden />
          </CtaAction>
        ) : null}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3.5 font-body text-sm font-medium text-foreground/90 transition-colors hover:border-primary/30 hover:text-primary"
        >
          All Services
        </Link>
      </div>
    </div>
  );
}
