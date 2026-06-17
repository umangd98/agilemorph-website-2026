import { AnimShell } from "./AnimShell";

export function AiAutomationAnim() {
  return (
    <AnimShell label="AI automation pipeline animation">
      <style>{`
        @keyframes ai-flow-dot {
          0% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes ai-pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes ai-chip-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ai-flow-dot {
          offset-path: path('M 40 80 L 140 80 L 240 80');
          animation: ai-flow-dot 2.8s ease-in-out infinite;
        }
        .ai-node-pulse { animation: ai-pulse-ring 2s ease-in-out infinite; }
        .ai-chip-1 { animation: ai-chip-in 0.6s ease 0.3s both; }
        .ai-chip-2 { animation: ai-chip-in 0.6s ease 0.6s both; }
      `}</style>

      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex items-center justify-between gap-2">
          {[
            { label: "Trigger", sub: "Webhook" },
            { label: "AI Agent", sub: "Claude" },
            { label: "Action", sub: "CRM sync" },
          ].map((node, i) => (
            <div key={node.label} className="flex flex-1 flex-col items-center">
              <div
                className={`ai-node-pulse flex h-14 w-14 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 ${i === 1 ? "border-primary/50 bg-primary/20" : ""}`}
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-primary">
                  {node.label.split(" ")[0]}
                </span>
              </div>
              <span className="mt-2 font-body text-[10px] text-slate-400">{node.sub}</span>
            </div>
          ))}
        </div>

        <svg viewBox="0 0 280 100" className="absolute left-1/2 top-[4.5rem] w-[85%] -translate-x-1/2" aria-hidden>
          <path
            d="M 40 80 L 140 80 L 240 80"
            fill="none"
            stroke="rgba(34,197,94,0.35)"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <circle r="5" fill="#22c55e" className="ai-flow-dot" />
        </svg>

        <div className="mt-8 flex justify-center gap-3">
          <span className="ai-chip-1 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-body text-[10px] font-semibold text-primary">
            24/7 uptime
          </span>
          <span className="ai-chip-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-body text-[10px] font-semibold text-primary">
            95% accuracy
          </span>
        </div>
      </div>
    </AnimShell>
  );
}
