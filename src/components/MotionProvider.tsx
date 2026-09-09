"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Global motion policy. `reducedMotion="user"` makes Framer disable transform
 * and layout animations for users who request reduced motion (keeping gentle
 * opacity fades), without branching SSR output on the preference — which
 * would cause a hydration mismatch. `[0.16, 1, 0.3, 1]` is the brand easing.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );
}
