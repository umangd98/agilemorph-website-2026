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
      className={`group inline-flex items-center gap-3 rounded-full border border-[#d97757]/30 bg-[#d97757]/10 px-4 py-2 backdrop-blur-md transition-all duration-300 hover:border-[#d97757]/50 hover:bg-[#d97757]/15 ${className}`}
      style={{ boxShadow: "0 0 20px rgba(217,119,87,0.12)" }}
      aria-label="Claude Services Partner — we design and build on Claude"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d97757] text-white transition-colors group-hover:bg-[#c96a4d]">
        <ClaudeLogo className="h-4 w-4" />
      </span>
      <span className="flex min-w-0 flex-col justify-center gap-0.5">
        <span className="font-body text-sm font-semibold leading-none tracking-tight text-white">
          Claude Service Partner
        </span>
        <span className="font-mono text-[11px] leading-tight text-slate-400">
          We design and build on Claude
        </span>
      </span>
    </Link>
  );
}
