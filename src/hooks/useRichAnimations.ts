"use client";

import { useEffect, useState } from "react";

function subscribeMediaQuery(query: string, onChange: (matches: boolean) => void) {
  const mq = window.matchMedia(query);
  const update = () => onChange(mq.matches);
  update();
  mq.addEventListener("change", update);
  return () => mq.removeEventListener("change", update);
}

/** True below Tailwind `lg` (1024px) — use for layout splits. */
export function useIsMobileLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => subscribeMediaQuery("(max-width: 1023px)", setIsMobile), []);

  return isMobile;
}

/** True when GSAP / complex motion is appropriate: desktop, fine pointer, no reduced motion. */
export function useRichAnimations() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopMq = window.matchMedia("(min-width: 1024px)");
    const fineMq = window.matchMedia("(pointer: fine)");

    const update = () => {
      setEnabled(
        !reducedMq.matches && desktopMq.matches && fineMq.matches,
      );
    };

    update();
    reducedMq.addEventListener("change", update);
    desktopMq.addEventListener("change", update);
    fineMq.addEventListener("change", update);

    return () => {
      reducedMq.removeEventListener("change", update);
      desktopMq.removeEventListener("change", update);
      fineMq.removeEventListener("change", update);
    };
  }, []);

  return enabled;
}
