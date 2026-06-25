import { LightAnimShell } from "./LightAnimShell";
import type { WhyUsAnimProps } from "./types";

const DEFAULT_MILESTONES = ["Discover", "Build", "Grow"];

export function PartnershipAnim({
  active = true,
  labels,
  title = "Partnership",
}: WhyUsAnimProps) {
  const milestones = ((labels?.length ? labels : DEFAULT_MILESTONES) ?? []).slice(0, 3);

  return (
    <LightAnimShell label={`${title}, aligned collaboration`} active={active}>
      <style>{`
        @keyframes part-handshake {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes part-ping {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes part-flow {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        .part-hands { animation: part-handshake 2.5s ease-in-out infinite; transform-origin: 140px 100px; }
        .part-ping { animation: part-ping 2s ease-out infinite; transform-origin: center; }
        .part-sync { stroke-dasharray: 6 6; animation: part-flow 1.5s linear infinite; }
      `}</style>
      <svg viewBox="0 0 280 180" className="h-full w-full text-primary" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <line x1={60} y1={90} x2={220} y2={90} stroke="var(--color-border)" strokeWidth="1" />
        <line x1={60} y1={90} x2={220} y2={90} stroke="currentColor" strokeWidth="2" className="part-sync" strokeOpacity={0.5} />

        <g transform="translate(50, 70)">
          <circle cx={0} cy={0} r={28} fill="color-mix(in srgb, var(--color-primary) 8%, transparent)" stroke="currentColor" strokeWidth="1.5" />
          <circle cx={0} cy={0} r={4} fill="currentColor" />
          <circle cx={0} cy={0} r={28} fill="none" stroke="currentColor" strokeWidth="1" className="part-ping" opacity={0.3} />
          <text x={0} y={42} textAnchor="middle" fill="var(--color-muted-foreground)" fontSize="9" fontFamily="system-ui, sans-serif">
            You
          </text>
        </g>

        <g transform="translate(230, 70)">
          <circle cx={0} cy={0} r={28} fill="color-mix(in srgb, var(--color-primary) 12%, transparent)" stroke="currentColor" strokeWidth="1.5" />
          <circle cx={0} cy={0} r={4} fill="currentColor" />
          <text x={0} y={42} textAnchor="middle" fill="var(--color-muted-foreground)" fontSize="9" fontFamily="system-ui, sans-serif">
            Us
          </text>
        </g>

        <g className="part-hands" transform="translate(140, 100)">
          <rect x={-36} y={-20} width={72} height={40} rx={10} fill="color-mix(in srgb, var(--color-primary) 10%, transparent)" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M -18 0 L -8 -8 L 0 0 L 8 -8 L 18 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={0} cy={0} r={5} fill="currentColor" />
        </g>

        {milestones.map((label, i) => (
          <g key={label} transform={`translate(${70 + i * 70}, 145)`}>
            <circle cx={0} cy={0} r={6} fill={i <= 1 ? "currentColor" : "var(--color-border)"} />
            <text x={0} y={18} textAnchor="middle" fill="var(--color-muted-foreground)" fontSize="8" fontFamily="system-ui, sans-serif">
              {label}
            </text>
          </g>
        ))}
      </svg>
    </LightAnimShell>
  );
}
