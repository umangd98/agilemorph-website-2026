import { AnimShell } from "./AnimShell";

const CODE_LINES = [
  { width: "72%", color: "bg-primary/60" },
  { width: "55%", color: "bg-slate-500/50" },
  { width: "88%", color: "bg-primary/40" },
  { width: "48%", color: "bg-slate-500/40" },
  { width: "65%", color: "bg-primary/50" },
];

export function WebDevelopmentAnim() {
  return (
    <AnimShell label="Website development code animation">
      <style>{`
        @keyframes web-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes web-line-reveal {
          from { width: 0; opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes web-cursor-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes web-block-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .web-progress-bar { animation: web-progress 3s ease-in-out infinite; }
        .web-line-1 { animation: web-line-reveal 0.5s ease 0.2s both; }
        .web-line-2 { animation: web-line-reveal 0.5s ease 0.5s both; }
        .web-line-3 { animation: web-line-reveal 0.5s ease 0.8s both; }
        .web-line-4 { animation: web-line-reveal 0.5s ease 1.1s both; }
        .web-line-5 { animation: web-line-reveal 0.5s ease 1.4s both; }
        .web-cursor { animation: web-cursor-blink 1s step-end infinite; }
        .web-block-1 { animation: web-block-in 0.4s ease 1.8s both; }
        .web-block-2 { animation: web-block-in 0.4s ease 2.1s both; }
        .web-block-3 { animation: web-block-in 0.4s ease 2.4s both; }
      `}</style>

      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-[#0a1018] shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
          <span className="ml-2 font-mono text-[10px] text-slate-500">app.tsx</span>
        </div>

        <div className="h-1 w-full bg-white/5">
          <div className="web-progress-bar h-full bg-primary/80" />
        </div>

        <div className="space-y-2.5 p-4">
          {CODE_LINES.map((line, i) => (
            <div
              key={i}
              className={`web-line-${i + 1} h-2 rounded-full ${line.color}`}
              style={{ width: line.width }}
            />
          ))}
          <div className="flex items-center gap-1 pt-1">
            <span className="web-cursor inline-block h-3.5 w-0.5 bg-primary" />
          </div>
        </div>

        <div className="flex gap-2 border-t border-white/10 p-3">
          {["Header", "Hero", "CTA"].map((label, i) => (
            <div
              key={label}
              className={`web-block-${i + 1} flex-1 rounded-lg border border-primary/20 bg-primary/5 py-2 text-center font-body text-[9px] font-medium text-primary`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </AnimShell>
  );
}
