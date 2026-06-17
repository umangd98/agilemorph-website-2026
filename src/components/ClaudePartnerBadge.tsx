import Link from "next/link";

import { ClaudeLogo } from "@/components/icons/ClaudeLogo";

type ClaudePartnerBadgeProps = {
  className?: string;
};

export function ClaudePartnerBadge({ className = "" }: ClaudePartnerBadgeProps) {
  return (
    <Link
      href="https://www.anthropic.com/claude"
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-3 rounded-full border border-border bg-background px-3.5 py-2 transition-colors duration-200 hover:border-slate-300 hover:shadow-sm ${className}`}
      aria-label="Claude Services Partner — we design and build on Claude"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d97757] text-white">
        <ClaudeLogo className="h-[18px] w-[18px]" />
      </span>
      <span className="flex min-w-0 flex-col justify-center gap-0.5 pr-0.5">
        <span className="font-body text-sm font-semibold leading-none tracking-tight text-foreground">
          Services Partner
        </span>
        <span className="font-mono text-[11px] leading-tight text-muted-foreground">
          We design and build on Claude
        </span>
      </span>
    </Link>
  );
}
