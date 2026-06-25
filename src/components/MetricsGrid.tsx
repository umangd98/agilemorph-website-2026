import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import type { Stat } from "@/sanity/types";

type MetricsGridProps = {
  items?: Stat[];
  variant?: "default" | "onPrimary";
  animate?: boolean;
};

export function MetricsGrid({
  items = [],
  variant = "default",
  animate = true,
}: MetricsGridProps) {
  if (!items.length) return null;

  const isOnPrimary = variant === "onPrimary";

  const grid = (
    <div
      className={
        isOnPrimary
          ? "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
          : "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 lg:gap-4"
      }
    >
      {items.map((stat, index) => {
        const card = (
          <div
            className={
              isOnPrimary
                ? "flex min-h-[5.5rem] flex-col items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-center backdrop-blur-sm sm:min-h-[6rem] sm:px-4"
                : "flex min-h-[6.5rem] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background/80 px-3 py-4 text-center shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5 sm:min-h-[7rem]"
            }
          >
            <span
              className={
                isOnPrimary
                  ? "font-heading text-2xl font-extrabold leading-none text-white sm:text-3xl"
                  : "font-heading text-2xl font-extrabold leading-none text-primary sm:text-3xl"
              }
            >
              {stat.value}
            </span>
            <span
              className={
                isOnPrimary
                  ? "max-w-[9rem] font-body text-[10px] font-semibold uppercase leading-snug tracking-wide text-white/85 sm:max-w-[10rem] sm:text-[11px]"
                  : "max-w-[9.5rem] font-body text-[11px] font-semibold leading-snug text-muted-foreground sm:max-w-[10.5rem] sm:text-xs"
              }
            >
              {stat.label}
            </span>
          </div>
        );

        if (!animate) {
          return (
            <div key={`${stat.label}-${index}`} className="h-full">
              {card}
            </div>
          );
        }

        return (
          <AnimateOnScroll key={`${stat.label}-${index}`} delay={index * 40} className="h-full">
            {card}
          </AnimateOnScroll>
        );
      })}
    </div>
  );

  return grid;
}
