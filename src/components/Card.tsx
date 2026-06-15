import type { ComponentPropsWithoutRef, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"article">, "children" | "className">;

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <article
      className={`overflow-hidden rounded-xl border border-border bg-background shadow-sm ${className}`}
      {...props}
    >
      {children}
    </article>
  );
}
