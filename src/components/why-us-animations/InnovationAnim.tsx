import { LightAnimShell } from "./LightAnimShell";

type PillarAnimProps = {
  active?: boolean;
};

export function InnovationAnim({ active = true }: PillarAnimProps) {
  return (
    <LightAnimShell label="Innovation — ideas becoming solutions" active={active}>
      <style>{`
        @keyframes inno-glow {
          0%, 100% { opacity: 0.5; filter: drop-shadow(0 0 4px rgba(34,197,94,0.3)); }
          50% { opacity: 1; filter: drop-shadow(0 0 12px rgba(34,197,94,0.6)); }
        }
        @keyframes inno-rise {
          0% { transform: translateY(0); opacity: 0; }
          15% { opacity: 0.9; }
          85% { opacity: 0.9; }
          100% { transform: translateY(-55px); opacity: 0; }
        }
        @keyframes inno-filament {
          0%, 100% { stroke-opacity: 0.4; }
          50% { stroke-opacity: 1; }
        }
        .inno-bulb { animation: inno-glow 2.5s ease-in-out infinite; }
        .inno-bubble-1 { animation: inno-rise 3s ease-in-out infinite; }
        .inno-bubble-2 { animation: inno-rise 3s ease-in-out 0.8s infinite; }
        .inno-bubble-3 { animation: inno-rise 3s ease-in-out 1.6s infinite; }
        .inno-filament { animation: inno-filament 1.5s ease-in-out infinite; }
      `}</style>
      <svg viewBox="0 0 280 180" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        {/* Ground line */}
        <line x1={40} y1={150} x2={240} y2={150} stroke="#e2e8f0" strokeWidth="1" />

        {/* Rising idea bubbles */}
        {[
          { x: 95, cls: "inno-bubble-1", label: "AI" },
          { x: 140, cls: "inno-bubble-2", label: "Web" },
          { x: 185, cls: "inno-bubble-3", label: "Auto" },
        ].map((b) => (
          <g key={b.cls} className={b.cls} style={{ transformOrigin: `${b.x}px 150px` }}>
            <rect
              x={b.x - 22}
              y={118}
              width={44}
              height={28}
              rx={8}
              fill="rgba(34,197,94,0.1)"
              stroke="#22c55e"
              strokeWidth="1"
              strokeOpacity={0.5}
            />
            <text
              x={b.x}
              y={136}
              textAnchor="middle"
              fill="#22c55e"
              fontSize="10"
              fontWeight="600"
              fontFamily="system-ui, sans-serif"
            >
              {b.label}
            </text>
          </g>
        ))}

        {/* Lightbulb */}
        <g className="inno-bulb" style={{ transformOrigin: "140px 115px" }}>
          <path
            d="M 140 45 C 118 45 102 62 102 82 C 102 96 110 108 118 115 L 118 128 L 162 128 L 162 115 C 170 108 178 96 178 82 C 178 62 162 45 140 45 Z"
            fill="rgba(34,197,94,0.12)"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M 128 128 L 152 128 L 150 138 L 130 138 Z"
            fill="#22c55e"
            opacity={0.6}
          />
          <line x1={134} y1={142} x2={146} y2={142} stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M 140 70 Q 130 82 140 95 Q 150 82 140 70"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            className="inno-filament"
          />
        </g>
      </svg>
    </LightAnimShell>
  );
}
