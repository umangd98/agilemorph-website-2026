import { PARTNER_MARKS } from "@/content/partner-marks";
import { cn } from "@/lib/utils";

/** A partner's logo mark in its brand colour, sized by the caller. */
export function PartnerMark({ name, className }: { name: string; className?: string }) {
  if (name === "Microsoft") {
    return (
      <svg viewBox="0 0 24 24" className={cn("h-7 w-7", className)} aria-hidden>
        <rect x="1" y="1" width="10.5" height="10.5" fill="#F25022" />
        <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7FBA00" />
        <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00A4EF" />
        <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900" />
      </svg>
    );
  }
  const mark = PARTNER_MARKS[name];
  if (!mark) return null;
  return (
    <svg viewBox="0 0 24 24" className={cn("h-7 w-7", className)} aria-hidden>
      <path d={mark.path} fill={mark.color} />
    </svg>
  );
}
