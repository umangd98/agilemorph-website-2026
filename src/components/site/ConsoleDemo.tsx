"use client";

import { HeroConsole, useScenarioCycle } from "./HeroConsole";

/** The hero console on its own, for pages other than the homepage. */
export function ConsoleDemo() {
  const cycle = useScenarioCycle();
  return <HeroConsole cycle={cycle} />;
}
