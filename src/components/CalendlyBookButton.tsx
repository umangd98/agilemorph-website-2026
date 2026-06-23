"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { CALENDLY_DISCOVERY_URL } from "@/lib/calendly";
import { openCalendlyPopup } from "@/lib/calendly-widget";

type CalendlyBookButtonProps = Omit<ComponentPropsWithoutRef<"button">, "type"> & {
  url?: string;
  children: ReactNode;
  onBook?: () => void;
};

export function CalendlyBookButton({
  url = CALENDLY_DISCOVERY_URL,
  children,
  onBook,
  onClick,
  ...props
}: CalendlyBookButtonProps) {
  return (
    <button
      type="button"
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        onBook?.();
        void openCalendlyPopup(url);
      }}
    >
      {children}
    </button>
  );
}
