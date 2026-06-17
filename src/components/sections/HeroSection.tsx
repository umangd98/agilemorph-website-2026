"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/Container";
import { urlForImage } from "@/sanity/image";
import type { HomepageHero } from "@/sanity/types";

type HeroSectionProps = {
  hero: HomepageHero;
};

function useEntrance() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(timer);
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
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function HeroSection({ hero }: HeroSectionProps) {
  const visible = useEntrance();

  const heroImageUrl = hero.image?.asset
    ? urlForImage(hero.image).width(800).auto("format").url()
    : null;

  const lqip = hero.image?.lqip;

  return (
    <section
      className="relative flex min-h-[92vh] items-center overflow-hidden"
      aria-labelledby="hero-heading"
      style={{ background: "#0f172a" }}
    >
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Radial glow — left */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 10% 50%, rgba(34,197,94,0.10) 0%, transparent 65%)",
        }}
      />

      {/* ── Background image — absolutely fills the right half, fully blended ── */}
      {heroImageUrl && (
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[58%]"
          aria-hidden="true"
          style={{
            opacity: visible ? 0.55 : 0,
            transition: "opacity 1.2s ease 200ms",
          }}
        >
          <Image
            src={heroImageUrl}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover object-center"
            placeholder={lqip ? "blur" : "empty"}
            blurDataURL={lqip}
          />
          {/* Heavy mask: fades left edge into bg, top, bottom, and right */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(to right,  #0f172a 0%,   rgba(15,23,42,0.85) 20%, rgba(15,23,42,0.3) 45%, transparent 65%),
                linear-gradient(to bottom, #0f172a 0%,   transparent 18%,   transparent 82%, #0f172a 100%),
                linear-gradient(to left,   #0f172a 0%,   transparent 18%)
              `,
            }}
          />
          {/* Extra green tint overlay so it blends with the section palette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 70% 50%, rgba(34,197,94,0.08) 0%, transparent 70%)",
            }}
          />
        </div>
      )}

      <Container className="relative z-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* ── Left: copy ── */}
          <div className="max-w-2xl">
            {hero.badge && (
              <AnimItem visible={visible} delay={0} className="mb-7">
                <div className="inline-flex items-center gap-2.5 rounded-pill border border-primary/25 bg-primary/10 px-4 py-1.5 backdrop-blur-sm">
                  <Sparkles size={13} className="text-primary" />
                  <span className="font-body text-xs font-bold uppercase tracking-widest text-primary">
                    {hero.badge}
                  </span>
                </div>
              </AnimItem>
            )}

            <AnimItem visible={visible} delay={120}>
              <h1
                id="hero-heading"
                className="mb-6 font-heading text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
              >
                {hero.heading.split(" ").slice(0, -2).join(" ")}{" "}
                <span className="text-primary">
                  {hero.heading.split(" ").slice(-2).join(" ")}
                </span>
              </h1>
            </AnimItem>

            {hero.tagline && (
              <AnimItem visible={visible} delay={240} className="mb-10">
                <p className="font-body text-lg leading-relaxed text-slate-300">
                  {hero.tagline}
                </p>
              </AnimItem>
            )}

            <AnimItem visible={visible} delay={360}>
              <div className="flex flex-col gap-4 sm:flex-row">
                {hero.ctaPrimary && (
                  <Link
                    href={hero.ctaPrimary.href}
                    target={hero.ctaPrimary.openInNewTab ? "_blank" : undefined}
                    rel={
                      hero.ctaPrimary.openInNewTab
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 font-body text-sm font-bold text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-primary/50 active:scale-95"
                  >
                    {hero.ctaPrimary.label}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                )}
                {hero.ctaSecondary && (
                  <Link
                    href={hero.ctaSecondary.href}
                    target={
                      hero.ctaSecondary.openInNewTab ? "_blank" : undefined
                    }
                    rel={
                      hero.ctaSecondary.openInNewTab
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-8 py-4 font-body text-sm font-bold text-white backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/10 active:scale-95"
                  >
                    {hero.ctaSecondary.label}
                  </Link>
                )}
              </div>
            </AnimItem>

            {/* Trust indicators */}
            <AnimItem visible={visible} delay={480} className="mt-12">
              <div className="flex flex-wrap items-center gap-6">
                {[
                  { value: "100+", label: "Projects" },
                  { value: "50+", label: "Clients" },
                  { value: "3+", label: "Years" },
                ].map(({ value, label }) => (
                  <div key={label} className="flex flex-col">
                    <span className="font-heading text-2xl font-extrabold text-primary">
                      {value}
                    </span>
                    <span className="font-body text-xs text-slate-400">
                      {label}
                    </span>
                  </div>
                ))}
                <div className="h-8 w-px bg-white/10" />
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 20 20"
                      className="h-4 w-4 fill-yellow-400"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 font-body text-sm text-slate-400">
                    5.0 rated
                  </span>
                </div>
              </div>
            </AnimItem>
          </div>

          {/* Right column — empty spacer so the grid still pushes content left */}
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
}
