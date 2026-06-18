import { LightAnimShell } from "./LightAnimShell";

type PillarAnimProps = {
  active?: boolean;
};

export function ProfessionalismAnim({ active = true }: PillarAnimProps) {
  return (
    <LightAnimShell label="Professionalism — quality and trust" active={active}>
      <style>{`
        @keyframes prof-draw {
          from { stroke-dashoffset: 320; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes prof-check {
          from { stroke-dashoffset: 48; opacity: 0; }
          to { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes prof-tick {
          0%, 100% { opacity: 0.4; transform: scaleX(0.6); }
          50% { opacity: 1; transform: scaleX(1); }
        }
        .prof-shield { stroke-dasharray: 320; animation: prof-draw 3s ease-in-out infinite alternate; }
        .prof-check { stroke-dasharray: 48; animation: prof-check 3s ease-in-out 0.6s infinite alternate; }
        .prof-bar { animation: prof-tick 2s ease-in-out infinite; transform-origin: left center; }
      `}</style>
      <svg viewBox="0 0 280 180" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        {/* Quality checklist beside shield */}
        <g transform="translate(30, 50)">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(0, ${i * 32})`}>
              <rect x={0} y={0} width={90} height={24} rx={6} fill="rgba(34,197,94,0.06)" stroke="#e2e8f0" strokeWidth="1" />
              <line
                x1={10}
                y1={12}
                x2={10 + 50 * (i + 1) / 3}
                y2={12}
                stroke="#22c55e"
                strokeWidth="3"
                strokeLinecap="round"
                className="prof-bar"
                style={{ animationDelay: `${i * 0.4}s` }}
              />
            </g>
          ))}
        </g>

        <ellipse cx={195} cy={155} rx={50} ry={8} fill="rgba(34,197,94,0.06)" />
        <path
          d="M 195 40 L 245 62 L 245 108 C 245 138 195 158 195 158 C 195 158 145 138 145 108 L 145 62 Z"
          fill="rgba(34,197,94,0.08)"
          stroke="#22c55e"
          strokeWidth="2.5"
          strokeLinejoin="round"
          className="prof-shield"
        />
        <path
          d="M 175 100 L 190 118 L 220 82"
          fill="none"
          stroke="#16a34a"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="prof-check"
        />
      </svg>
    </LightAnimShell>
  );
}
