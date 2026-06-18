import { LightAnimShell } from "./LightAnimShell";

type PillarAnimProps = {
  active?: boolean;
};

export function PartnershipAnim({ active = true }: PillarAnimProps) {
  return (
    <LightAnimShell label="Partnership — aligned collaboration" active={active}>
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
      <svg viewBox="0 0 280 180" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        {/* Sync lines between two parties */}
        <line x1={60} y1={90} x2={220} y2={90} stroke="#e2e8f0" strokeWidth="1" />
        <line x1={60} y1={90} x2={220} y2={90} stroke="#22c55e" strokeWidth="2" className="part-sync" strokeOpacity={0.5} />

        {/* Left party */}
        <g transform="translate(50, 70)">
          <circle cx={0} cy={0} r={28} fill="rgba(34,197,94,0.08)" stroke="#22c55e" strokeWidth="1.5" />
          <circle cx={0} cy={0} r={4} fill="#22c55e" />
          <circle cx={0} cy={0} r={28} fill="none" stroke="#22c55e" strokeWidth="1" className="part-ping" opacity={0.3} />
          <text x={0} y={42} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="system-ui, sans-serif">
            You
          </text>
        </g>

        {/* Right party — AgileMorph */}
        <g transform="translate(230, 70)">
          <circle cx={0} cy={0} r={28} fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="1.5" />
          <circle cx={0} cy={0} r={4} fill="#22c55e" />
          <text x={0} y={42} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="system-ui, sans-serif">
            Us
          </text>
        </g>

        {/* Handshake / link icon in center */}
        <g className="part-hands" transform="translate(140, 100)">
          <rect x={-36} y={-20} width={72} height={40} rx={10} fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="1.5" />
          <path
            d="M -18 0 L -8 -8 L 0 0 L 8 -8 L 18 0"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={0} cy={0} r={5} fill="#22c55e" />
        </g>

        {/* Milestones below */}
        {["Discover", "Build", "Grow"].map((label, i) => (
          <g key={label} transform={`translate(${70 + i * 70}, 145)`}>
            <circle cx={0} cy={0} r={6} fill={i <= 1 ? "#22c55e" : "#e2e8f0"} />
            <text x={0} y={18} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="system-ui, sans-serif">
              {label}
            </text>
          </g>
        ))}
      </svg>
    </LightAnimShell>
  );
}
