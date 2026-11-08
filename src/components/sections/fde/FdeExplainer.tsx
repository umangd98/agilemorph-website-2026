import { FDE_EXPLAINER } from "@/data/positioning";
import { cn } from "@/lib/utils";

type FdeExplainerProps = {
  text?: string;
  align?: "left" | "center";
  className?: string;
};

/**
 * The one-line plain-English explanation of Forward Deployed Engineering.
 * Every page that names FDE renders this inside its first screen.
 */
export function FdeExplainer({ text, align = "center", className }: FdeExplainerProps) {
  return (
    <aside
      aria-label="What Forward Deployed Engineering means"
      className={cn(
        "rounded-2xl border border-line bg-bg-elevated/80 px-5 py-4 backdrop-blur-sm",
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left",
        className,
      )}
    >
      <p className="syslabel text-signal">What Forward Deployed Engineering means</p>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-fg-muted sm:text-[0.9375rem]">
        {text || FDE_EXPLAINER}
      </p>
    </aside>
  );
}
