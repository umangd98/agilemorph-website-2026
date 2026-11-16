import Link from "next/link";
import type { ReactNode } from "react";

import { CalendlyBookButton } from "@/components/CalendlyBookButton";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "inverse";

const base =
  "inline-flex min-h-12 items-center justify-center rounded-pill px-6 text-[0.9375rem] font-medium transition-colors duration-150";

const variants: Record<Variant, string> = {
  primary: "bg-green text-white hover:bg-green-deep",
  secondary: "border border-rule text-ink hover:border-ink",
  inverse: "bg-white text-green-deep hover:bg-green-soft",
};

export function ButtonLink({
  href,
  children,
  variant = "secondary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}

/** Opens the Calendly discovery-call booking in a popup. */
export function BookButton({
  children = "Book a discovery call",
  variant = "primary",
  className,
}: {
  children?: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <CalendlyBookButton className={cn(base, variants[variant], className)}>
      {children}
    </CalendlyBookButton>
  );
}
