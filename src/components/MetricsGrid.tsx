import { RevealGroup, RevealItem } from "@/components/Reveal";
import type { Stat } from "@/sanity/types";

type MetricsGridProps = {
  items?: Stat[];
  variant?: "default" | "onPrimary";
  animate?: boolean;
};

/**
 * Quido "telemetry" metric grid — mono tabular values in signal-green, seated
 * in a hairline gap-px grid of elevated cells.
 */
export function MetricsGrid({ items = [], animate = true }: MetricsGridProps) {
  if (!items.length) return null;

  const cells = items.map((stat, index) => (
    <RevealItem
      key={`${stat.label}-${index}`}
      className="flex flex-col items-center justify-center gap-2 bg-bg-elevated px-3 py-7 text-center transition-colors duration-300 hover:bg-bg-raised"
    >
      <span className="tnum font-mono text-2xl font-medium leading-none text-signal sm:text-3xl">
        {stat.value}
      </span>
      <span className="max-w-[10.5rem] text-pretty text-[0.6875rem] leading-tight text-fg-dim sm:text-xs">
        {stat.label}
      </span>
    </RevealItem>
  ));

  if (!animate) {
    return (
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3 lg:grid-cols-6">
        {cells}
      </div>
    );
  }

  return (
    <RevealGroup className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3 lg:grid-cols-6">
      {cells}
    </RevealGroup>
  );
}
