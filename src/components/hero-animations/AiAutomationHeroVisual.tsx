"use client";

import {
  Bot,
  Mail,
  MessageSquare,
  RefreshCw,
  Webhook,
  Workflow,
  Zap,
} from "lucide-react";

type AiAutomationHeroVisualProps = {
  compact?: boolean;
};

const TRIGGERS = [
  { icon: Mail, label: "Email" },
  { icon: Webhook, label: "Webhook" },
  { icon: RefreshCw, label: "CRM event" },
] as const;

const TOOLS = ["n8n", "Make", "Zapier"] as const;

const OUTPUTS = [
  { icon: Workflow, label: "Workflows" },
  { icon: MessageSquare, label: "Slack alerts" },
  { icon: Zap, label: "CRM sync" },
] as const;

export function AiAutomationHeroVisual({ compact = false }: AiAutomationHeroVisualProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border border-border bg-linear-to-br from-mint/50 via-background to-surface shadow-sm ${
        compact ? "aspect-[4/3]" : "aspect-[4/3] min-h-[280px]"
      }`}
      role="img"
      aria-label="AI automation pipeline: triggers flow through an AI agent into automated workflows"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
        <p className="text-center font-body text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
          AI automation pipeline
        </p>

        <div className="relative mx-auto w-full max-w-[19rem] flex-1 py-2">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {TRIGGERS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background/90 px-2 py-2.5 text-center shadow-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={15} strokeWidth={2.2} aria-hidden />
                </span>
                <span className="font-body text-[10px] font-semibold leading-tight text-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <svg
            viewBox="0 0 280 56"
            className="mx-auto mt-2 h-8 w-[88%] max-w-[16rem]"
            aria-hidden="true"
          >
            <path
              d="M 46 8 L 140 44 M 140 44 L 234 8"
              fill="none"
              stroke="rgba(34,197,94,0.35)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <circle r="3.5" fill="var(--color-primary)" className="ai-pipeline-dot ai-pipeline-dot-1" />
            <circle r="3.5" fill="var(--color-primary)" className="ai-pipeline-dot ai-pipeline-dot-2" />
            <circle r="3.5" fill="var(--color-primary)" className="ai-pipeline-dot ai-pipeline-dot-3" />
          </svg>

          <div className="relative mx-auto mt-1 max-w-[13rem]">
            <div className="ai-hub-ring absolute inset-0 rounded-2xl border border-primary/25 bg-primary/5" />
            <div className="relative flex flex-col items-center rounded-2xl border border-primary/35 bg-background px-4 py-3 shadow-md shadow-primary/10">
              <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/25">
                <Bot size={22} strokeWidth={2.2} aria-hidden />
              </span>
              <span className="font-heading text-sm font-bold text-foreground">AI Agent</span>
              <span className="mt-0.5 font-body text-[10px] text-muted-foreground">
                Classify · decide · act
              </span>
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {TOOLS.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-primary/20 bg-primary/8 px-2 py-0.5 font-body text-[9px] font-semibold text-primary"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <svg
            viewBox="0 0 280 56"
            className="mx-auto mt-2 h-8 w-[88%] max-w-[16rem]"
            aria-hidden="true"
          >
            <path
              d="M 140 8 L 46 44 M 140 8 L 234 44"
              fill="none"
              stroke="rgba(34,197,94,0.35)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {OUTPUTS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-primary/20 bg-mint/60 px-2 py-2.5 text-center"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon size={15} strokeWidth={2.2} aria-hidden />
                </span>
                <span className="font-body text-[10px] font-semibold leading-tight text-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center font-body text-[10px] font-medium text-muted-foreground">
          Manual steps → intelligent routing → always-on workflows
        </p>
      </div>
    </div>
  );
}
