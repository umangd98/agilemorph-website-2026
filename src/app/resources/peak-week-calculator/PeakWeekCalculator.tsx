"use client";

import { useEffect, useRef } from "react";

import { initPeakWeekCalculator } from "./init";
import { PEAK_WEEK_MARKUP } from "./markup";

export function PeakWeekCalculator({ className }: { className: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const controller = new AbortController();
    initPeakWeekCalculator(rootRef.current, controller.signal);
    return () => controller.abort();
  }, []);

  return (
    <div
      ref={rootRef}
      className={`peak-week ${className}`}
      dangerouslySetInnerHTML={{ __html: PEAK_WEEK_MARKUP }}
    />
  );
}
