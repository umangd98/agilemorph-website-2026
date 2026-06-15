import type { ComponentPropsWithoutRef, ElementType } from "react";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingProps<T extends ElementType = "h2"> = {
  as?: T;
  level?: HeadingLevel;
  size?: "display" | "xl" | "lg" | "md" | "sm";
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "level" | "size" | "className">;

const defaultTags: Record<HeadingLevel, ElementType> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

const sizeClasses = {
  display: "text-4xl sm:text-5xl lg:text-6xl",
  xl: "text-3xl sm:text-4xl",
  lg: "text-2xl sm:text-3xl",
  md: "text-xl sm:text-2xl",
  sm: "text-lg sm:text-xl",
} as const;

export function Heading<T extends ElementType = "h2">({
  as,
  level = 2,
  size = "lg",
  className = "",
  children,
  ...props
}: HeadingProps<T>) {
  const Component = as ?? defaultTags[level];

  return (
    <Component
      className={`font-heading font-semibold tracking-tight text-foreground ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
