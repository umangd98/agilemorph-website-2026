/**
 * Theme-aware line-art for the "AgileMorph Solutions" company-story section.
 *
 * Matches the "production console" aesthetic of ProcessArtwork: base linework
 * tracks `--color-fg` via `currentColor` (dark on light, light on dark) and the
 * green accents use `text-signal`. Concept: a console that turns a workflow
 * (raw ideas) into a rising growth curve (revenue-ready systems).
 */

type CompanyStoryArtworkProps = {
  className?: string;
};

const BASE = "text-fg/70";
const ACCENT = "text-signal";

export function CompanyStoryArtwork({ className = "" }: CompanyStoryArtworkProps) {
  return (
    <div className={`flex h-full items-center justify-center p-8 ${className}`}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        className="h-full w-full"
        aria-hidden
        preserveAspectRatio="xMidYMid meet"
      >
        {/* base linework — console window, workflow nodes, chart axes */}
        <g
          className={BASE}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* console window */}
          <rect x="48" y="56" width="304" height="172" rx="14" />
          <line x1="48" y1="86" x2="352" y2="86" />
          <circle cx="66" cy="71" r="3.5" />
          <circle cx="80" cy="71" r="3.5" />
          <circle cx="94" cy="71" r="3.5" />

          {/* left column — workflow nodes */}
          <rect x="72" y="104" width="104" height="30" rx="7" />
          <rect x="72" y="150" width="104" height="30" rx="7" />
          <rect x="72" y="196" width="104" height="30" rx="7" />
          {/* node icons + content lines */}
          <circle cx="90" cy="119" r="5" />
          <line x1="104" y1="119" x2="146" y2="119" />
          <rect x="85" y="160" width="10" height="10" rx="2.5" />
          <line x1="104" y1="165" x2="160" y2="165" />
          <circle cx="90" cy="211" r="5" />
          <line x1="104" y1="211" x2="152" y2="211" />
          {/* connectors between nodes */}
          <line x1="124" y1="134" x2="124" y2="150" />
          <line x1="124" y1="180" x2="124" y2="196" />

          {/* right column — chart axes + ticks */}
          <line x1="214" y1="104" x2="214" y2="210" />
          <line x1="214" y1="210" x2="332" y2="210" />
          <line x1="244" y1="210" x2="244" y2="214" />
          <line x1="274" y1="210" x2="274" y2="214" />
          <line x1="304" y1="210" x2="304" y2="214" />

          {/* grounding baseline */}
          <line x1="60" y1="252" x2="284" y2="252" opacity="0.55" />
          <line x1="300" y1="252" x2="316" y2="252" opacity="0.55" />
        </g>

        {/* green accents — status pill, done-check, growth curve, spark */}
        <g className={ACCENT}>
          {/* address / status pill */}
          <rect x="250" y="64" width="86" height="12" rx="6" fill="currentColor" opacity="0.9" />

          {/* first node completed */}
          <circle cx="158" cy="119" r="9" fill="currentColor" opacity="0.14" />
          <circle cx="158" cy="119" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
          <path
            d="M153 119l3.5 3.5 6.5-7"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* growth curve */}
          <path
            d="M216 196l28-14 24 8 28-40 30-30"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="326" cy="120" r="4" fill="currentColor" />

          {/* 100% badge */}
          <rect x="286" y="98" width="44" height="16" rx="8" fill="currentColor" opacity="0.14" />
          <text
            x="308"
            y="110"
            textAnchor="middle"
            fontSize="11"
            fontFamily="var(--font-mono)"
            fill="currentColor"
          >
            100%
          </text>

          {/* spark */}
          <path
            d="M344 36c0 7 2 9 9 9-7 0-9 2-9 9 0-7-2-9-9-9 7 0 9-2 9-9z"
            fill="currentColor"
            opacity="0.85"
          />
        </g>
      </svg>
    </div>
  );
}
