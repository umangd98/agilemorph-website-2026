import { LightAnimShell } from "./LightAnimShell";

type PillarAnimProps = {
  active?: boolean;
};

export function ExpertiseAnim({ active = true }: PillarAnimProps) {
  return (
    <LightAnimShell label="Expertise — deep knowledge layers" active={active}>
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
      <svg viewBox="0 0 280 180" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        {/* Skill meter bars */}
        <g transform="translate(24, 40)">
          {[
            { label: "Strategy", w: 85 },
            { label: "Build", w: 95 },
            { label: "Scale", w: 78 },
          ].map((bar, i) => (
            <g key={bar.label} transform={`translate(0, ${i * 36})`}>
              <text x={0} y={10} fill="#64748b" fontSize="10" fontFamily="system-ui, sans-serif">
                {bar.label}
              </text>
              <rect x={0} y={16} width={120} height={8} rx={4} fill="#f1f5f9" />
              <rect
                x={0}
                y={16}
                height={8}
                rx={4}
                fill="#22c55e"
                className="exp-meter"
                style={{ width: `${bar.w}%`, animationDelay: `${i * 0.3}s` }}
              />
            </g>
          ))}
        </g>

        {/* Layered knowledge cards */}
        <g transform="translate(160, 35)" className="exp-book">
          <g className="exp-layer-3">
            <rect x={20} y={30} width={90} height={60} rx={8} fill="rgba(34,197,94,0.05)" stroke="#e2e8f0" strokeWidth="1" />
          </g>
          <g className="exp-layer-2">
            <rect x={10} y={20} width={90} height={60} rx={8} fill="rgba(34,197,94,0.08)" stroke="#cbd5e1" strokeWidth="1" />
            <line x1={20} y1={38} x2={80} y2={38} stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g className="exp-layer-1">
            <rect x={0} y={10} width={90} height={60} rx={8} fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="1.5" />
            <line x1={12} y1={28} x2={72} y2={28} stroke="#22c55e" strokeWidth="2" strokeLinecap="round" opacity={0.7} />
            <line x1={12} y1={40} x2={58} y2={40} stroke="#22c55e" strokeWidth="2" strokeLinecap="round" opacity={0.5} />
            <circle cx={72} cy={52} r={10} fill="#22c55e" opacity={0.15} />
            <path
              d="M 72 46 L 74 50 L 78 50 L 75 53 L 76 57 L 72 54 L 68 57 L 69 53 L 66 50 L 70 50 Z"
              fill="#22c55e"
              opacity={0.8}
            />
          </g>
        </g>
      </svg>
    </LightAnimShell>
  );
}
