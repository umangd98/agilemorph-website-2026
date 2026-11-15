/**
 * The teardown story at /deconstruction-v2. One scroll position, from 0 to 1,
 * drives the copy, the 3D scene and the loop tracker, so they can't drift apart.
 */

export const LOOP = ["Find", "Build", "Ship", "Adopt", "Iterate"] as const;
export type LoopStage = (typeof LOOP)[number];

export type Beat = {
  /** Where this beat starts, as a share of the scroll. */
  at: number;
  loop: LoopStage | null;
  title: string;
  body: string;
};

export const BEATS: Beat[] = [
  {
    at: 0,
    loop: null,
    title: "On paper, every business is an org chart.",
    body: "Neat boxes and reporting lines. It says who reports to whom. It doesn't say how work gets done.",
  },
  {
    at: 0.12,
    loop: "Find",
    title: "In reality, work moves like this.",
    body: "We embed with your teams and take every one apart: the people, the tools they use and the data underneath.",
  },
  {
    at: 0.31,
    loop: "Find",
    title: "We follow one request through the business.",
    body: "It's asked on WhatsApp, copied into a spreadsheet, retyped into the system, and still gets lost.",
  },
  {
    at: 0.46,
    loop: "Build",
    title: "We build AI into every team.",
    body: "An AI hub at the centre, and an AI layer that slots into each team, between their tools and their data.",
  },
  {
    at: 0.62,
    loop: "Ship",
    title: "Live with Sales first.",
    body: "Everything goes back together with AI inside. One team goes live, and the same request now goes through cleanly.",
  },
  {
    at: 0.75,
    loop: "Adopt",
    title: "We make sure it gets used.",
    body: "Usage tracked team by team. When a team slips back, we nudge and fix what slowed them down.",
  },
  {
    at: 0.89,
    loop: "Iterate",
    title: "Then we make it better.",
    body: "Feedback comes in, the AI learns something new, and the loop starts again on the next workflow.",
  },
];

/** Which loop stage is lit for a scroll position. Iterate hands back to Find at the very end. */
export function loopIndex(p: number): number {
  if (p < 0.12) return -1;
  if (p < 0.46) return 0;
  if (p < 0.62) return 1;
  if (p < 0.75) return 2;
  if (p < 0.89) return 3;
  return p > 0.975 ? 0 : 4;
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** 0 before a, 1 after b, eased in between. */
export const seg = (p: number, a: number, b: number) => ease(clamp01((p - a) / (b - a)));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
