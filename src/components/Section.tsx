import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type SectionProps<T extends ElementType = "section"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  spacing?: "default" | "compact";
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className" | "spacing">;

const spacingClasses = {
  default: "py-section max-sm:py-section-sm",
  compact: "py-section-sm",
} as const;

export function Section<T extends ElementType = "section">({
  as,
  children,
  className = "",
  spacing = "default",
  ...props
}: SectionProps<T>) {
  const Component = as ?? "section";

  return (
    <Component
      className={`${spacingClasses[spacing]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
