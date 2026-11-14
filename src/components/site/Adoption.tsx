"use client";

import { createTimeline, stagger, utils } from "animejs";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef } from "react";

import { Grid } from "@/components/charts/grid";
import { Line, LineChart } from "@/components/charts/line-chart";

/*
 * Adoption, made visible. Left: everyone who should be using the new workflow,
 * one dot each, across four teams. They go from the old way (grey), through a
 * nudge (amber), to the new way (green), week after week. Right: the curve we
 * chase, updates moving out of chat and into the system. Both illustrative.
 */

const SITES = ["Sales", "Support", "Finance", "Operations"] as const;
const COLS = 12;
const ROWS = 4;
const GRID: [number, number] = [COLS, ROWS];

const GREY = "#dcddd6";
const AMBER = "#9a5b00";
const GREEN = "#157f3d";

function SiteGrid({ play }: { play: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const sites = Array.from(root.querySelectorAll<HTMLElement>("[data-site]"));
    const dots = (site: HTMLElement) => Array.from(site.querySelectorAll<HTMLElement>("[data-dot]"));

    if (reduced) {
      utils.set(root.querySelectorAll("[data-dot]"), { backgroundColor: GREEN });
      return;
    }
    if (!play) return;

    // Each team adopts from a different starting point, a beat after the last.
    const tl = createTimeline({ loop: true, loopDelay: 1600, defaults: { ease: "outQuad" } });
    sites.forEach((site, i) => {
      const origin = (1 + (i % 3)) * COLS + 3 + i * 2;
      const all = dots(site);
      tl.add(
        all,
        {
          backgroundColor: [GREY, AMBER],
          scale: [1, 1.35, 1],
          duration: 520,
          delay: stagger(26, { grid: GRID, from: origin }),
        },
        i * 380,
      ).add(
        all,
        {
          backgroundColor: [AMBER, GREEN],
          duration: 420,
          delay: stagger(30, { grid: GRID, from: origin }),
        },
        `<<+=${900}`,
      );
    });
    tl.add(root.querySelectorAll("[data-dot]"), { backgroundColor: GREY, duration: 500, delay: stagger(4) }, "+=1800");

    return () => {
      tl.revert();
    };
  }, [play, reduced]);

  return (
    <div ref={ref} className="grid gap-5">
      {SITES.map((site) => (
        <div key={site} data-site className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-4">
          <span className="text-sm text-ink-muted">{site}</span>
          <div className="grid gap-[5px]" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
            {Array.from({ length: COLS * ROWS }, (_, i) => (
              <span
                key={i}
                data-dot
                className="aspect-square w-full max-w-3 rounded-full"
                style={{ backgroundColor: GREY }}
              />
            ))}
          </div>
        </div>
      ))}
      <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted" aria-label="Legend">
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: GREY }} /> Still on the old way
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: AMBER }} /> Nudged
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: GREEN }} /> Using the new workflow
        </li>
      </ul>
    </div>
  );
}

/** An illustrative adoption curve: updates in the system rise as updates left in chat fall. */
function useCurve() {
  return useMemo(() => {
    const start = Date.UTC(2026, 0, 5);
    const week = 7 * 24 * 3600 * 1000;
    return Array.from({ length: 16 }, (_, i) => {
      const t = i / 15;
      const inSystem = 8 + 84 / (1 + Math.exp(-9 * (t - 0.42))) + Math.sin(i * 1.7) * 1.6;
      return {
        date: new Date(start + i * week),
        inSystem,
        inChat: 100 - inSystem + Math.cos(i * 1.3) * 2,
      };
    });
  }, []);
}

export function Adoption() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const data = useCurve();

  return (
    <div ref={ref} className="grid gap-14 lg:grid-cols-2 lg:gap-16">
      <figure className="m-0">
        <SiteGrid play={inView} />
        <figcaption className="mt-6 text-[0.9375rem] text-ink-muted">
          Every dot is a person who should be using the new workflow. We track them per team, per
          week, and nudge until the grid is green.
        </figcaption>
      </figure>

      <figure className="m-0">
        <div className="h-64 sm:h-72" aria-hidden>
          {inView ? (
            <LineChart data={data} margin={{ top: 12, right: 8, bottom: 8, left: 8 }} animationDuration={1800}>
              <Grid horizontal numTicksRows={4} />
              <Line dataKey="inChat" stroke="#c4c6bd" strokeWidth={2} />
              <Line dataKey="inSystem" stroke={GREEN} strokeWidth={3} glow={{ blur: 6, opacity: 0.35 }} />
            </LineChart>
          ) : null}
        </div>
        <figcaption className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded bg-green" /> Updates written in the system
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded bg-[#c4c6bd]" /> Updates left in chat and spreadsheets
          </span>
        </figcaption>
        <p className="mt-3 text-[0.9375rem] text-ink-muted">
          The curve we chase on every engagement, week by week. Illustration, not client data.
        </p>
      </figure>
    </div>
  );
}
