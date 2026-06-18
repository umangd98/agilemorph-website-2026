import type { ReactNode } from "react";

type LightAnimShellProps = {
  children: ReactNode;
  label: string;
  active?: boolean;
};

export function LightAnimShell({ children, label, active = true }: LightAnimShellProps) {
  return (
    <div
      className="relative h-full min-h-[140px] w-full overflow-hidden rounded-2xl border border-border bg-background"
      role="img"
      aria-label={label}
      style={{
        boxShadow: active
          ? "inset 0 1px 0 color-mix(in srgb, var(--color-background) 80%, white), 0 4px 24px color-mix(in srgb, var(--color-primary) 6%, transparent)"
          : undefined,
        transition: "box-shadow 0.4s ease",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in srgb, var(--color-primary) 4%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-primary) 4%, transparent) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative z-10 flex h-full w-full min-h-[140px] items-center justify-center p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
}
