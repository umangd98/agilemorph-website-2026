"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { CalendlyBookButton } from "@/components/CalendlyBookButton";
import { isCalendlyBookingCta } from "@/lib/calendly-widget";
import { externalLinkProps } from "@/lib/links";
import type { CtaButton } from "@/sanity/types";

type CtaActionProps = {
  cta: CtaButton;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "type" | "children">;

export function CtaAction({ cta, className, children, ...buttonProps }: CtaActionProps) {
  if (isCalendlyBookingCta(cta)) {
    return (
      <CalendlyBookButton className={className} url={cta.href} {...buttonProps}>
        {children}
      </CalendlyBookButton>
    );
  }

  return (
    <Link
      href={cta.href}
      className={className}
      {...externalLinkProps(cta.href, cta.openInNewTab)}
    >
      {children}
    </Link>
  );
}
