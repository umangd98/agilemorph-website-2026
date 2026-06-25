import { LightAnimShell } from "./LightAnimShell";
import type { WhyUsAnimProps } from "./types";

const DEFAULT_BARS = [
  { label: "Strategy", w: 85 },
  { label: "Build", w: 95 },
  { label: "Scale", w: 78 },
];

export function ExpertiseAnim({
  active = true,
  labels,
  title = "Expertise",
}: WhyUsAnimProps) {
  const bars = ((labels?.length ? labels : DEFAULT_BARS.map((b) => b.label)) ?? []).slice(0, 3).map((label, i) => ({
    label,
    w: DEFAULT_BARS[i]?.w ?? 80,
  }));

  return (
    <LightAnimShell label={`${title}, deep knowledge layers`} active={active}>
      <style>{`
        @keyframes exp-slide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
        @keyframes exp-layer {
          0%, 100% { opacity: 0.5; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-4px); }
        }
        @keyframes exp-meter {
          from { width: 0; }
          to { width: 100%; }
        }
        .exp-book { animation: exp-slide 3s ease-in-out infinite; }
        .exp-layer-1 { animation: exp-layer 2.5s ease-in-out infinite; }
        .exp-layer-2 { animation: exp-layer 2.5s ease-in-out 0.3s infinite; }
        .exp-layer-3 { animation: exp-layer 2.5s ease-in-out 0.6s infinite; }
        .exp-meter { animation: exp-meter 2.5s ease-in-out infinite alternate; }
      `}</style>
      <svg viewBox="0 0 280 180" className="h-full w-full text-primary" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <g transform="translate(24, 40)">
          {bars.map((bar, i) => (
            <g key={bar.label} transform={`translate(0, ${i * 36})`}>
              <text x={0} y={10} fill="var(--color-muted-foreground)" fontSize="10" fontFamily="system-ui, sans-serif">
                {bar.label}
              </text>
              <rect x={0} y={16} width={120} height={8} rx={4} fill="var(--color-muted)" />
              <rect
                x={0}
                y={16}
                height={8}
                rx={4}
                fill="currentColor"
                className="exp-meter"
                style={{ width: `${bar.w}%`, animationDelay: `${i * 0.3}s` }}
              />
            </g>
          ))}
        </g>

        <g transform="translate(160, 35)" className="exp-book">
          <g className="exp-layer-3">
            <rect x={20} y={30} width={90} height={60} rx={8} fill="color-mix(in srgb, var(--color-primary) 5%, transparent)" stroke="var(--color-border)" strokeWidth="1" />
          </g>
          <g className="exp-layer-2">
            <rect x={10} y={20} width={90} height={60} rx={8} fill="color-mix(in srgb, var(--color-primary) 8%, transparent)" stroke="var(--color-border)" strokeWidth="1" />
            <line x1={20} y1={38} x2={80} y2={38} stroke="var(--color-muted-foreground)" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g className="exp-layer-1">
            <rect x={0} y={10} width={90} height={60} rx={8} fill="color-mix(in srgb, var(--color-primary) 12%, transparent)" stroke="currentColor" strokeWidth="1.5" />
            <line x1={12} y1={28} x2={72} y2={28} stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity={0.7} />
            <line x1={12} y1={40} x2={58} y2={40} stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity={0.5} />
            <circle cx={72} cy={52} r={10} fill="currentColor" opacity={0.15} />
            <path
              d="M 72 46 L 74 50 L 78 50 L 75 53 L 76 57 L 72 54 L 68 57 L 69 53 L 66 50 L 70 50 Z"
              fill="currentColor"
              opacity={0.8}
            />
          </g>
        </g>
      </svg>
    </LightAnimShell>
  );
}
