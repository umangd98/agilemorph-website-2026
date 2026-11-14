import { FDE_EXPLAINER } from "@/content/site";
import { cn } from "@/lib/utils";

/** The plain-English definition. Shown in the first screen of every page that names FDE. */
export function Explainer({ className }: { className?: string }) {
  return (
    <div className={cn("border-l-2 border-green pl-5", className)}>
      <p className="text-sm font-medium text-ink">What forward deployed engineering means</p>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">{FDE_EXPLAINER}</p>
    </div>
  );
}
