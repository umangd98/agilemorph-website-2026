import type { ReactNode } from "react";

type BadgeVariant = "primary" | "dark" | "outline";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-primary/20 text-primary-dark border border-primary/30",
  dark: "bg-foreground text-surface-elevated border border-foreground",
  outline: "bg-transparent text-foreground border border-border",
};

export function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
