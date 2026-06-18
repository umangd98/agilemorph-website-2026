import { AnimShell } from "./AnimShell";

const COLUMNS = ["To Do", "In Progress", "Done"] as const;

const CARDS = [
  { col: 0, label: "Inbox triage", delay: 0 },
  { col: 1, label: "Schedule call", delay: 1.2 },
  { col: 2, label: "Report sent", delay: 2.4 },
];

export function VirtualAssistanceAnim() {
  return (
    <AnimShell label="Virtual assistance task board animation">
      <style>{`
        @keyframes va-card-move {
          0%, 20% { transform: translateX(0); opacity: 1; }
          33% { transform: translateX(calc(100% + 8px)); opacity: 1; }
          53% { transform: translateX(calc(200% + 16px)); opacity: 1; }
          73% { transform: translateX(calc(200% + 16px)); opacity: 0.6; }
          100% { transform: translateX(0); opacity: 0; }
        }
        .va-card-0 { animation: va-card-move 6s ease-in-out infinite; }
        .va-card-1 { animation: va-card-move 6s ease-in-out 2s infinite; }
        .va-card-2 { animation: va-card-move 6s ease-in-out 4s infinite; }
      `}</style>

      <div className="mx-auto w-full max-w-sm">
        <div className="mb-3 grid grid-cols-3 gap-2">
          {COLUMNS.map((col) => (
            <div
              key={col}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-2 text-center font-body text-[9px] font-semibold uppercase tracking-wider text-slate-400"
            >
              {col}
            </div>
          ))}
        </div>

        <div className="relative grid grid-cols-3 gap-2" style={{ minHeight: "100px" }}>
          {COLUMNS.map((col) => (
            <div
              key={col}
              className="min-h-[88px] rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-2"
            />
          ))}

          <div className="pointer-events-none absolute inset-0 p-2">
            {CARDS.map((card, i) => (
              <div
                key={card.label}
                className={`va-card-${i} absolute left-2 top-2 w-[calc(33.333%-0.5rem)] rounded-lg border border-primary/25 bg-primary/10 p-2 shadow-lg`}
                style={{ width: "calc(33.333% - 0.35rem)" }}
              >
                <div className="mb-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[8px] font-bold text-primary">
                  VA
                </div>
                <p className="font-body text-[9px] font-medium text-slate-300">{card.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimShell>
  );
}
