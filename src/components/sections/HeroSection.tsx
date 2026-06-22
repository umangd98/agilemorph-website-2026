"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/Container";
import { ClaudePartnerBadge } from "@/components/ClaudePartnerBadge";
import { CtaAction } from "@/components/CtaAction";
import { HeroEcosystemVisual } from "@/components/hero-animations/HeroEcosystemVisual";
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

  const words = hero.heading.split(" ");
  const headingMain = words.slice(0, -2).join(" ");
  const headingAccent = words.slice(-2).join(" ");

  return (
    <section
      className="relative flex min-h-screen items-center overflow-x-clip bg-background"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle, var(--hero-orb-green) 0%, transparent 65%)`,
          filter: "blur(60px)",
          animation: "hero-orb 9s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle, var(--hero-orb-cyan) 0%, transparent 65%)`,
          filter: "blur(70px)",
          animation: "hero-orb-2 11s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute right-[15%] top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle, var(--hero-orb-violet) 0%, transparent 65%)`,
          filter: "blur(80px)",
          animation: "hero-orb 14s ease-in-out infinite reverse",
        }}
      />

      <div
        className="site-grid-pattern pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
      />

      <Container className="relative z-10 py-24 sm:py-28 lg:py-32 xl:py-36">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] xl:gap-10">
          <div className="min-w-0 max-w-2xl">
            <AnimItem visible={visible} delay={0} className="mb-8">
              <ClaudePartnerBadge />
            </AnimItem>

            <AnimItem visible={visible} delay={100}>
              <h1
                id="hero-heading"
                className="mb-7 font-heading text-5xl font-extrabold leading-[1.06] tracking-tight text-foreground sm:text-6xl lg:text-[4.5rem]"
              >
                {headingMain && (
                  <>
                    {headingMain}
                    <br />
                  </>
                )}
                <span className="text-accent-gradient">{headingAccent}</span>
              </h1>
            </AnimItem>

            {hero.tagline && (
              <AnimItem visible={visible} delay={200} className="mb-10">
                <p className="font-body text-[1.08rem] leading-relaxed text-muted-foreground">
                  {hero.tagline}
                </p>
              </AnimItem>
            )}

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

            <AnimItem visible={visible} delay={460} className="mt-12">
              <div className="flex items-center gap-2">
                <StarRating />
                <span className="font-body text-xs font-semibold text-muted-foreground">
                  4.9 · Rated by clients worldwide
                </span>
              </div>
            </AnimItem>
          </div>

          <AnimItem
            visible={visible}
            delay={400}
            className="hidden w-full min-w-0 lg:block lg:self-center"
          >
            <HeroEcosystemVisual visible={visible} />
          </AnimItem>
        </div>
      </Container>

      <div
        className="hero-bottom-fade pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        aria-hidden="true"
      />
    </section>
  );
}
