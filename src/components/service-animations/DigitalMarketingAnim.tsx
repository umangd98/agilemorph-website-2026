import { AnimShell } from "./AnimShell";

export function DigitalMarketingAnim() {
  return (
    <AnimShell label="Digital marketing growth chart animation">
      <style>{`
        @keyframes dm-draw-line {
          to { stroke-dashoffset: 0; }
        }
        @keyframes dm-pill-in {
          from { opacity: 0; transform: translateY(6px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dm-chart-line {
          stroke-dasharray: 320;
          stroke-dashoffset: 320;
          animation: dm-draw-line 2.5s ease-out forwards infinite;
        }
        .dm-pill-1 { animation: dm-pill-in 0.5s ease 1s both infinite; animation-direction: alternate; }
        .dm-pill-2 { animation: dm-pill-in 0.5s ease 1.4s both infinite; animation-direction: alternate; }
      `}</style>

      <div className="relative mx-auto w-full max-w-sm">
        <svg viewBox="0 0 300 160" className="w-full" aria-hidden>
          <defs>
            <linearGradient id="dmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(34,197,94,0.35)" />
              <stop offset="100%" stopColor="rgba(34,197,94,0)" />
            </linearGradient>
          </defs>
          {[40, 80, 120].map((y) => (
            <line
              key={y}
              x1="30"
              y1={y}
              x2="270"
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          ))}
          <path
            d="M 30 120 L 80 110 L 130 95 L 180 70 L 230 45 L 270 25 L 270 140 L 30 140 Z"
            fill="url(#dmGrad)"
          />
          <polyline
            className="dm-chart-line"
            points="30,120 80,110 130,95 180,70 230,45 270,25"
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="270" cy="25" r="5" fill="#22c55e" className="opacity-80" />
        </svg>

        <div className="absolute left-2 top-2 dm-pill-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-body text-[10px] font-bold text-primary">
          Reach +120%
        </div>
        <div className="absolute bottom-4 right-2 dm-pill-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-body text-[10px] font-bold text-primary">
          CTR ↑ 3.2×
        </div>
      </div>
    </AnimShell>
  );
}
