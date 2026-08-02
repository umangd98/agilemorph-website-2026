import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

import { Container } from "@/components/ui";
import { ClaudePartnerBadge } from "@/components/ClaudePartnerBadge";
import { CtaAction } from "@/components/CtaAction";
import { HeroTagline } from "@/components/sections/HeroTagline";
import type { HomepageHero } from "@/sanity/types";

type HeroSectionProps = { hero: HomepageHero };

/** Ambient SVG grid + drawn accent lines — the Quido hero backdrop. */
function HeroGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        maskImage: "radial-gradient(80% 80% at 50% 40%, black, transparent)",
        WebkitMaskImage: "radial-gradient(80% 80% at 50% 40%, black, transparent)",
      }}
    >
      <svg className="h-full w-full" aria-hidden>
        <defs>
          <pattern
            id="hero-grid"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M64 0H0V64"
              fill="none"
              stroke="var(--color-grid-line)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
    </div>
  );
}

function WordReveal({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={`${word}-${i}`}
          className="word"
          style={{
            animation: "word-appear 0.8s ease-out forwards",
            animationDelay: `${baseDelay + i * 70}ms`,
          }}
        >
          {word}
        </span>
      ))}
    </>
  );
}

export function HeroSection({ hero }: HeroSectionProps) {
  const headingLines = hero.heading
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section
      className="relative flex min-h-[92vh] w-full flex-col justify-center overflow-hidden pt-28 pb-16 sm:pt-32"
      aria-labelledby="hero-heading"
    >
      <HeroGrid />

      <Container className="relative z-10 text-center">
        <div
          className="mx-auto mb-6 flex w-fit justify-center opacity-0"
          style={{ animation: "word-appear 0.9s ease-out 120ms forwards" }}
        >
          <ClaudePartnerBadge />
        </div>

        <h1
          id="hero-heading"
          className="mx-auto max-w-4xl text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-fg sm:text-6xl lg:text-[4.5rem]"
        >
          {headingLines.map((line, index) => (
            <span key={line} className="block">
              <WordReveal text={line} baseDelay={index * 220} />
            </span>
          ))}
          {hero.headingAccent ? (
            <span className="block text-signal">
              <WordReveal
                text={hero.headingAccent}
                baseDelay={headingLines.length * 220}
              />
            </span>
          ) : null}
        </h1>

        {hero.tagline?.length ? (
          <div
            className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-relaxed text-fg-muted opacity-0 sm:text-lg"
            style={{ animation: "word-appear 0.9s ease-out 700ms forwards" }}
          >
            <HeroTagline value={hero.tagline} />
          </div>
        ) : null}

        <div
          className="mt-9 flex flex-col items-center justify-center gap-3 opacity-0 sm:flex-row"
          style={{ animation: "word-appear 0.9s ease-out 850ms forwards" }}
        >
          {hero.ctaPrimary ? (
            <CtaAction
              cta={hero.ctaPrimary}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3.5 font-body text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-90 active:scale-95"
            >
              {hero.ctaPrimary.label}
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </CtaAction>
          ) : null}
          {hero.ctaSecondary ? (
            <Link
              href={hero.ctaSecondary.href}
              target={hero.ctaSecondary.openInNewTab ? "_blank" : undefined}
              rel={hero.ctaSecondary.openInNewTab ? "noopener noreferrer" : undefined}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3.5 font-body text-sm font-medium text-fg transition-colors duration-200 hover:border-line-strong hover:bg-bg-elevated active:scale-95"
            >
              <Play size={13} className="fill-current opacity-80" />
              {hero.ctaSecondary.label}
            </Link>
          ) : null}
        </div>

        <div
          className="mt-8 flex items-center justify-center gap-2 opacity-0"
          style={{ animation: "word-appear 0.9s ease-out 1000ms forwards" }}
        >
          <span className="tnum font-mono text-sm font-medium text-signal">4.9</span>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-fg-dim">
            Rated by clients worldwide
          </span>
        </div>
      </Container>
    </section>
  );
}
