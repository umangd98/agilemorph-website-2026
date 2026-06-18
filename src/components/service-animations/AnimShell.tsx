import type { ReactNode } from "react";

type AnimShellProps = {
  children: ReactNode;
  label: string;
};

export function AnimShell({ children, label }: AnimShellProps) {
  return (
    <div
      className="relative aspect-[4/3] w-full min-h-0 overflow-hidden rounded-3xl border border-white/10"
      style={{ background: "linear-gradient(145deg, #060d1a 0%, #0b1628 50%, #0d1f2d 100%)" }}
      role="img"
      aria-label={label}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl"
        aria-hidden
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.25), transparent 70%)" }}
      />
      <div className="relative z-10 flex h-full w-full min-h-0 items-center justify-center p-4 sm:p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
