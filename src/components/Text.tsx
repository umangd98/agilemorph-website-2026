import type { ComponentPropsWithoutRef, ElementType } from "react";

type TextProps<T extends ElementType = "p"> = {
  as?: T;
  size?: "sm" | "base" | "lg";
  tone?: "default" | "muted";
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "size" | "tone" | "className">;

const sizeClasses = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
} as const;

const toneClasses = {
  default: "text-foreground",
  muted: "text-muted-foreground",
} as const;

export function Text<T extends ElementType = "p">({
  as,
  size = "base",
  tone = "default",
  className = "",
  children,
  ...props
}: TextProps<T>) {
  const Component = as ?? "p";

  return (
    <Component
      className={`font-body leading-relaxed ${sizeClasses[size]} ${toneClasses[tone]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
