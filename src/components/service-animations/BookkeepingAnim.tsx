import { AnimShell } from "./AnimShell";

const ROWS = [
  { label: "Invoices", amount: "$12,400" },
  { label: "Payroll", amount: "$8,200" },
  { label: "Expenses", amount: "$3,150" },
];

export function BookkeepingAnim() {
  return (
    <AnimShell label="Bookkeeping ledger animation">
      <style>{`
        @keyframes bk-row-in {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bk-check-in {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bk-balance-count {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 1; }
        }
        .bk-row-0 { animation: bk-row-in 0.5s ease 0.2s both; }
        .bk-row-1 { animation: bk-row-in 0.5s ease 0.6s both; }
        .bk-row-2 { animation: bk-row-in 0.5s ease 1s both; }
        .bk-check-0 { animation: bk-check-in 0.3s ease 0.8s both; }
        .bk-check-1 { animation: bk-check-in 0.3s ease 1.2s both; }
        .bk-check-2 { animation: bk-check-in 0.3s ease 1.6s both; }
        .bk-balance { animation: bk-balance-count 2s ease 1.8s both infinite; }
      `}</style>

      <div className="mx-auto w-full max-w-sm rounded-xl border border-white/10 bg-[#0a1018]/80 p-4">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <span className="font-heading text-xs font-bold text-white">Ledger</span>
          <span className="font-body text-[10px] text-slate-500">Q2 2026</span>
        </div>

        <div className="space-y-2">
          {ROWS.map((row, i) => (
            <div
              key={row.label}
              className={`bk-row-${i} flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`bk-check-${i} flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[10px] text-primary`}
                >
                  ✓
                </span>
                <span className="font-body text-xs text-slate-300">{row.label}</span>
              </div>
              <span className="font-mono text-xs font-semibold text-primary">{row.amount}</span>
            </div>
          ))}
        </div>

        <div className="bk-balance mt-4 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
          <span className="font-body text-xs font-medium text-slate-300">Balance</span>
          <span className="font-heading text-lg font-bold text-primary">$23,750</span>
        </div>
      </div>
    </AnimShell>
  );
}
