import { LightAnimShell } from "./LightAnimShell";
import type { WhyUsAnimProps } from "./types";

export function GenericAnim({
  active = true,
  highlights,
  title = "Why us",
}: WhyUsAnimProps) {
  const pills = (highlights ?? []).slice(0, 3);
  const positions = [
    { x: 70, y: 55, delay: "0s" },
    { x: 210, y: 70, delay: "0.4s" },
    { x: 140, y: 130, delay: "0.8s" },
  ];

  return (
    <LightAnimShell label={`${title}, key strengths`} active={active}>
      <style>{`
        @keyframes gen-pulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes gen-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes gen-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .gen-core { animation: gen-pulse 2.5s ease-in-out infinite; transform-origin: 140px 90px; }
        .gen-pill { animation: gen-float 3s ease-in-out infinite; }
        .gen-ring { animation: gen-orbit 12s linear infinite; transform-origin: 140px 90px; }
      `}</style>
      <svg viewBox="0 0 280 180" className="h-full w-full text-primary" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <circle
          cx={140}
          cy={90}
          r={58}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="1"
          strokeDasharray="4 6"
          className="gen-ring"
          opacity={0.6}
        />

        <g className="gen-core">
          <circle cx={140} cy={90} r={32} fill="color-mix(in srgb, var(--color-primary) 12%, transparent)" stroke="currentColor" strokeWidth="2" />
          <circle cx={140} cy={90} r={10} fill="currentColor" opacity={0.9} />
        </g>

        {(pills.length ? pills : [title]).map((label, i) => {
          const pos = positions[i] ?? positions[0]!;
          return (
            <g
              key={`${label}-${i}`}
              className="gen-pill"
              style={{ animationDelay: pos.delay, transformOrigin: `${pos.x}px ${pos.y}px` }}
            >
              <rect
                x={pos.x - 36}
                y={pos.y - 14}
                width={72}
                height={28}
                rx={14}
                fill="color-mix(in srgb, var(--color-primary) 10%, transparent)"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity={0.5}
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                fill="currentColor"
                fontSize="9"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                {label.length > 14 ? `${label.slice(0, 12)}…` : label}
              </text>
            </g>
          );
        })}
      </svg>
    </LightAnimShell>
  );
}
