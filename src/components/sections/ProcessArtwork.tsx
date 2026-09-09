/**
 * Theme-aware line-art illustrations for the "Our Process" steps.
 *
 * Drawn with `currentColor` so the base linework tracks `--color-fg` (dark on
 * light theme, light on dark), with signal-green accents via nested groups.
 * One illustration per step concept; cycles by index so any step count works.
 *
 * 0 — Plan: a project board / blueprint being laid out
 * 1 — Build: a workstation shipping code, momentum forward
 * 2 — Results: a launch + growth curve reaching 100%
 */

import type { ComponentType } from "react";

type ProcessArtworkProps = {
  index: number;
  className?: string;
};

const BASE = "text-fg/70";
const ACCENT = "text-signal";

function PlanArt() {
  return (
    <svg
      viewBox="0 0 360 220"
      fill="none"
      className="h-full w-full"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        className={BASE}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* board window */}
        <rect x="40" y="34" width="280" height="150" rx="12" />
        <line x1="40" y1="62" x2="320" y2="62" />
        <circle cx="58" cy="48" r="3" />
        <circle cx="72" cy="48" r="3" />
        <circle cx="86" cy="48" r="3" />
        {/* three columns of cards */}
        <rect x="60" y="78" width="66" height="16" rx="4" />
        <rect x="60" y="102" width="66" height="30" rx="4" />
        <rect x="60" y="142" width="66" height="16" rx="4" />
        <rect x="147" y="78" width="66" height="30" rx="4" />
        <rect x="147" y="118" width="66" height="16" rx="4" />
        <rect x="234" y="78" width="66" height="16" rx="4" />
        <rect x="234" y="102" width="66" height="24" rx="4" />
      </g>
      <g className={ACCENT}>
        {/* accent header pill */}
        <rect
          x="234"
          y="44"
          width="66"
          height="10"
          rx="5"
          fill="currentColor"
          opacity="0.9"
        />
        {/* done check */}
        <circle cx="300" cy="150" r="15" fill="currentColor" opacity="0.14" />
        <circle cx="300" cy="150" r="15" stroke="currentColor" strokeWidth="2" />
        <path
          d="M292 150l6 6 11-12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

function BuildArt() {
  return (
    <svg
      viewBox="0 0 360 220"
      fill="none"
      className="h-full w-full"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        className={BASE}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* monitor */}
        <rect x="48" y="30" width="264" height="140" rx="12" />
        <line x1="140" y1="182" x2="220" y2="182" />
        <line x1="180" y1="170" x2="180" y2="182" />
        {/* code lines */}
        <line x1="72" y1="58" x2="150" y2="58" />
        <line x1="72" y1="74" x2="126" y2="74" />
        <line x1="90" y1="90" x2="168" y2="90" />
        <line x1="90" y1="106" x2="140" y2="106" />
        <line x1="72" y1="122" x2="120" y2="122" />
      </g>
      <g
        className={ACCENT}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* angle brackets </> */}
        <path d="M214 66l-16 12 16 12" />
        <path d="M248 66l16 12-16 12" />
        <line x1="238" y1="60" x2="224" y2="98" />
        {/* forward momentum chevrons */}
        <path d="M226 128l12 10-12 10" opacity="0.9" />
        <path d="M248 128l12 10-12 10" opacity="0.55" />
      </g>
    </svg>
  );
}

function ResultsArt() {
  return (
    <svg
      viewBox="0 0 360 220"
      fill="none"
      className="h-full w-full"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        className={BASE}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* screen with growth chart */}
        <rect x="150" y="40" width="176" height="132" rx="12" />
        <line x1="168" y1="150" x2="308" y2="150" />
        <line x1="168" y1="150" x2="168" y2="66" />
        {/* axis ticks */}
        <line x1="200" y1="150" x2="200" y2="154" />
        <line x1="238" y1="150" x2="238" y2="154" />
        <line x1="276" y1="150" x2="276" y2="154" />
      </g>
      <g className={ACCENT}>
        {/* growth curve */}
        <path
          d="M168 138l34-18 28 10 34-34 44-14"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="308" cy="82" r="4" fill="currentColor" />
        {/* 100% badge */}
        <rect
          x="270"
          y="52"
          width="44"
          height="16"
          rx="8"
          fill="currentColor"
          opacity="0.14"
        />
        <text
          x="292"
          y="64"
          textAnchor="middle"
          fontSize="11"
          fontFamily="var(--font-mono)"
          fill="currentColor"
        >
          100%
        </text>
      </g>
      {/* rocket */}
      <g
        className={BASE}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M64 118c0-30 12-52 24-64 12 12 24 34 24 64l-24 14-24-14z" />
        <path d="M64 112l-14 12 4 20 18-12" />
        <path d="M112 112l14 12-4 20-18-12" />
      </g>
      <g className={ACCENT}>
        <circle cx="88" cy="74" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
        <path
          d="M76 140c4 12 8 18 12 26 4-8 8-14 12-26"
          fill="currentColor"
          opacity="0.85"
        />
      </g>
    </svg>
  );
}

const ARTS: ComponentType[] = [PlanArt, BuildArt, ResultsArt];

export function ProcessArtwork({ index, className = "" }: ProcessArtworkProps) {
  const Art =
    ARTS[((index % ARTS.length) + ARTS.length) % ARTS.length] ?? PlanArt;
  return (
    <div className={`flex h-full items-center justify-center p-6 ${className}`}>
      <Art />
    </div>
  );
}
