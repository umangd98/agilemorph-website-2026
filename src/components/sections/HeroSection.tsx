"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/Container";
import { ClaudePartnerBadge } from "@/components/ClaudePartnerBadge";
import { HERO_BG, HERO_GRID_STYLE, HERO_SECTION_BG, HeroImagePanel } from "@/components/hero-animations/HeroImagePanel";
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
            <stop offset="90%" stopColor="#334155" />
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
    ? urlForImage(hero.image).width(1200).auto("format").quality(90).url()
    : null;
  const lqip = hero.image?.lqip;
  const heroImageAlt = hero.image?.alt ?? "";

  const words = hero.heading.split(" ");
  const headingMain = words.slice(0, -2).join(" ");
  const headingAccent = words.slice(-2).join(" ");

  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden"
      aria-labelledby="hero-heading"
      style={{
        background: HERO_SECTION_BG,
      }}
    >
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.10) 0%, transparent 65%)",
          filter: "blur(60px)",
          animation: "hero-orb 9s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%)",
          filter: "blur(70px)",
          animation: "hero-orb-2 11s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute right-[15%] top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)",
          filter: "blur(80px)",
          animation: "hero-orb 14s ease-in-out infinite reverse",
        }}
      />

      {heroImageUrl ? (
        <HeroImagePanel
          imageUrl={heroImageUrl}
          alt={heroImageAlt}
          lqip={lqip}
          visible={visible}
        />
      ) : null}

      {/* Grid on top of image so both halves share the same texture */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
        style={HERO_GRID_STYLE}
      />

      <Container className="relative z-10 py-28 lg:py-36">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="max-w-xl">
            <AnimItem visible={visible} delay={0} className="mb-8">
              <ClaudePartnerBadge />
            </AnimItem>

            <AnimItem visible={visible} delay={100}>
              <h1
                id="hero-heading"
                className="mb-7 font-heading text-5xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[4.5rem]"
              >
                {headingMain && (
                  <>
                    {headingMain}
                    <br />
                  </>
                )}
                <span
                  style={{
                    background: "linear-gradient(135deg, #4ade80 0%, #22c55e 30%, #10b981 65%, #06b6d4 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    animation: "text-shine 5s linear infinite",
                  }}
                >
                  {headingAccent}
                </span>
              </h1>
            </AnimItem>

            {hero.tagline && (
              <AnimItem visible={visible} delay={200} className="mb-10">
                <p className="font-body text-[1.08rem] leading-relaxed text-slate-300/90">
                  {hero.tagline}
                </p>
              </AnimItem>
            )}

            <AnimItem visible={visible} delay={320}>
              <div className="flex flex-col gap-3 sm:flex-row">
                {hero.ctaPrimary && (
                  <Link
                    href={hero.ctaPrimary.href}
                    target={hero.ctaPrimary.openInNewTab ? "_blank" : undefined}
                    rel={hero.ctaPrimary.openInNewTab ? "noopener noreferrer" : undefined}
                    className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-8 py-4 font-body text-sm font-bold text-white transition-all duration-300 active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 60%, #15803d 100%)",
                      boxShadow: "0 8px 32px rgba(34,197,94,0.35), 0 2px 8px rgba(34,197,94,0.2)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 12px 40px rgba(34,197,94,0.5), 0 4px 12px rgba(34,197,94,0.3)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 8px 32px rgba(34,197,94,0.35), 0 2px 8px rgba(34,197,94,0.2)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                  >
                    <span
                      className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-white/15 transition-transform duration-500 group-hover:translate-x-full"
                      aria-hidden="true"
                    />
                    {hero.ctaPrimary.label}
                    <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                )}
                {hero.ctaSecondary && (
                  <Link
                    href={hero.ctaSecondary.href}
                    target={hero.ctaSecondary.openInNewTab ? "_blank" : undefined}
                    rel={hero.ctaSecondary.openInNewTab ? "noopener noreferrer" : undefined}
                    className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-8 py-4 font-body text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 active:scale-95"
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
                <span className="font-body text-xs font-semibold text-slate-400">
                  4.9 · Rated by clients worldwide
                </span>
              </div>
            </AnimItem>
          </div>

          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </Container>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        aria-hidden="true"
        style={{
          background: `linear-gradient(to bottom, transparent, ${HERO_BG.deep})`,
        }}
      />
    </section>
  );
}
