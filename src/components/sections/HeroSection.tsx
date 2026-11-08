import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui";
import { CtaAction } from "@/components/CtaAction";
import { HeroTagline } from "@/components/sections/HeroTagline";
import { FdeExplainer } from "@/components/sections/fde/FdeExplainer";
import type { HomepageHero } from "@/sanity/types";

type HeroSectionProps = { hero: HomepageHero };

/** Ambient SVG grid backdrop. */
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
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span
            className="word"
            style={{
              animation: "word-appear 0.8s ease-out forwards",
              animationDelay: `${baseDelay + i * 70}ms`,
            }}
          >
            {word}
          </span>
          {/* Real whitespace text node between words so crawlers and screen
              readers read spaced words, not one concatenated string. */}
          {i < words.length - 1 ? " " : null}
        </Fragment>
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
      className="relative flex min-h-[92vh] w-full flex-col justify-center overflow-hidden pt-24 pb-16 sm:pt-28"
      aria-labelledby="hero-heading"
    >
      <HeroGrid />

      <Container className="relative z-10 text-center">
        {hero.badge ? (
          <p
            className="syslabel mx-auto mb-6 w-fit text-signal opacity-0"
            style={{ animation: "word-appear 0.9s ease-out 120ms forwards" }}
          >
            {hero.badge}
          </p>
        ) : null}

        <h1
          id="hero-heading"
          className="mx-auto max-w-5xl text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-fg sm:text-6xl lg:text-[4rem]"
        >
          {headingLines.map((line, index) => (
            <Fragment key={line}>
              <span className="block">
                <WordReveal text={line} baseDelay={index * 220} />
              </span>
              {/* Real whitespace between heading lines. Each line is its own
                  block box, so a lone space between them is not rendered and
                  the visual result is unchanged, but text extraction reads
                  "agency for teams", not "agencyfor teams". */}{" "}
            </Fragment>
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
          className="mt-8 flex flex-col items-center justify-center gap-3 opacity-0 sm:flex-row"
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
              {hero.ctaSecondary.label}
            </Link>
          ) : null}
        </div>

        {hero.proofPoints?.length ? (
          <ul
            className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2 opacity-0"
            style={{ animation: "word-appear 0.9s ease-out 1000ms forwards" }}
            aria-label="Proof points"
          >
            {hero.proofPoints.map((point) => (
              <li
                key={point}
                className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-fg-dim sm:text-xs sm:tracking-[0.12em]"
              >
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal" />
                {point}
              </li>
            ))}
          </ul>
        ) : null}

        <div
          className="mt-7 opacity-0"
          style={{ animation: "word-appear 0.9s ease-out 1100ms forwards" }}
        >
          <FdeExplainer text={hero.explainer} />
        </div>
      </Container>
    </section>
  );
}
