"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/Container";
import { ClaudePartnerBadge } from "@/components/ClaudePartnerBadge";
import { PageHeroBackground } from "@/components/PageHeroBackground";
import { CtaAction } from "@/components/CtaAction";
import { HeroShowcaseVisual } from "@/components/hero-animations/HeroShowcaseVisual";
import { HeroTagline } from "@/components/sections/HeroTagline";
import { urlForImage } from "@/sanity/image";
import type { HomepageHero } from "@/sanity/types";

type HeroSectionProps = { hero: HomepageHero };

function useEntrance() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);
  return visible;
}

function AnimItem({
  children,
  delay = 0,
  className = "",
  visible,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  visible: boolean;
}) {
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.75s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.75s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function StarRating() {
  const starPath =
    "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(4)].map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-yellow-400">
          <path d={starPath} />
        </svg>
      ))}
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5">
        <defs>
          <linearGradient id="hero-star-partial">
            <stop offset="90%" stopColor="#facc15" />
            <stop offset="90%" stopColor="var(--color-muted-foreground)" />
          </linearGradient>
        </defs>
        <path d={starPath} fill="url(#hero-star-partial)" />
      </svg>
    </div>
  );
}

export function HeroSection({ hero }: HeroSectionProps) {
  const visible = useEntrance();

  const heroImageUrl = hero.image?.asset
    ? urlForImage(hero.image).width(900).auto("format").quality(85).url()
    : null;
  const heroImageAlt = hero.image?.alt ?? "";
  const headingLines = hero.heading
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-background"
      aria-labelledby="hero-heading"
    >
      <PageHeroBackground tall />

      <Container className="relative z-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 items-center gap-16 overflow-visible lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-12">
          <div className="max-w-xl">
            <AnimItem visible={visible} delay={0} className="mb-5">
              <ClaudePartnerBadge />
            </AnimItem>

            <AnimItem visible={visible} delay={100}>
              <h1
                id="hero-heading"
                className="mb-4 font-heading text-4xl font-extrabold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              >
                {headingLines.map((line, index) => (
                  <span key={line}>
                    {index > 0 ? <br /> : null}
                    {line}
                  </span>
                ))}
                {hero.headingAccent ? (
                  <>
                    <br />
                    <span className="text-accent-gradient">{hero.headingAccent}</span>
                  </>
                ) : null}
              </h1>
            </AnimItem>

            {hero.tagline?.length ? (
              <AnimItem visible={visible} delay={200} className="mb-6">
                <HeroTagline value={hero.tagline} />
              </AnimItem>
            ) : null}

            <AnimItem visible={visible} delay={320}>
              <div className="flex flex-col gap-3 sm:flex-row">
                {hero.ctaPrimary ? (
                  <CtaAction
                    cta={hero.ctaPrimary}
                    className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-primary px-8 py-4 font-body text-sm font-bold text-white shadow-[0_8px_32px_rgba(34,197,94,0.35)] transition-all duration-300 hover:bg-primary-dark hover:shadow-[0_12px_40px_rgba(34,197,94,0.5)] active:scale-95"
                  >
                    <span
                      className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-white/15 transition-transform duration-500 group-hover:translate-x-full"
                      aria-hidden="true"
                    />
                    {hero.ctaPrimary.label}
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </CtaAction>
                ) : null}
                {hero.ctaSecondary && (
                  <Link
                    href={hero.ctaSecondary.href}
                    target={hero.ctaSecondary.openInNewTab ? "_blank" : undefined}
                    rel={hero.ctaSecondary.openInNewTab ? "noopener noreferrer" : undefined}
                    className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-border bg-muted/60 px-8 py-4 font-body text-sm font-bold text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 active:scale-95 dark:border-[var(--glass-border)] dark:bg-[var(--glass-bg)]"
                  >
                    <Play size={13} className="fill-current opacity-80" />
                    {hero.ctaSecondary.label}
                  </Link>
                )}
              </div>
            </AnimItem>

            <AnimItem visible={visible} delay={460} className="mt-8">
              <div className="flex items-center gap-2">
                <StarRating />
                <span className="font-body text-xs font-semibold text-muted-foreground">
                  4.9 · Rated by clients worldwide
                </span>
              </div>
            </AnimItem>
          </div>

          {heroImageUrl ? (
            <AnimItem
              visible={visible}
              delay={400}
              className="mt-8 hidden overflow-visible lg:mt-0 lg:flex lg:justify-end"
            >
              <HeroShowcaseVisual
                imageUrl={heroImageUrl}
                alt={heroImageAlt}
                visible={visible}
              />
            </AnimItem>
          ) : (
            <div className="hidden lg:block" aria-hidden="true" />
          )}
        </div>
      </Container>
    </section>
  );
}
