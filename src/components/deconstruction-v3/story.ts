/**
 * The department engine story at /deconstruction-v3. One scroll position, from
 * 0 to 1, picks the film frame, the copy, the labels and the process ring, so
 * nothing on screen can disagree with anything else.
 */

export const LOOP = ["Find", "Build", "Ship", "Adopt", "Iterate"] as const;

/** The rendered film covers the first part of the scroll; the process ring plays live after it. */
export const FILM_END = 0.7;

export type Beat = { at: number; loop: (typeof LOOP)[number] | null; title: string; body: string };

export const BEATS: Beat[] = [
  {
    at: 0,
    loop: null,
    title: "Every business runs like an engine.",
    body: "Six teams turning together. From the outside, you can't see where it slows down.",
  },
  {
    at: 0.1,
    loop: "Find",
    title: "We take it apart, layer by layer.",
    body: "Our engineers embed with each team and open it up: the people, the tools they use and the data underneath.",
  },
  {
    at: 0.27,
    loop: "Find",
    title: "We map every part with your teams.",
    body: "Who does the work, with which tools, on what data, and where it stalls. The empty centre is where AI fits.",
  },
  {
    at: 0.45,
    loop: "Build",
    title: "We build AI into the heart of it.",
    body: "An AI core in the centre, wired into every team's own tools. Not another app beside them.",
  },
  {
    at: 0.7,
    loop: "Ship",
    title: "Live with Sales first.",
    body: "One team goes live in production, with checks, an audit log and a person approving anything unsure.",
  },
  {
    at: 0.8,
    loop: "Adopt",
    title: "We make sure it gets used.",
    body: "Adoption tracked team by team. When a team slips back, we nudge and fix what slowed them down.",
  },
  {
    at: 0.9,
    loop: "Iterate",
    title: "Then we make it better.",
    body: "Feedback turns into the next release, and the loop starts again on the next workflow.",
  },
];

/** The blueprint shows over the middle of the teardown. */
export const blueprintAt = (p: number) => seg(p, 0.27, 0.3) * (1 - seg(p, 0.42, 0.45));

/** The process ring and its live demos take over once the camera is overhead. */
export const ringAt = (p: number) => seg(p, 0.66, 0.71);

export function loopIndex(p: number): number {
  if (p < 0.1) return -1;
  if (p < 0.45) return 0;
  if (p < 0.7) return 1;
  if (p < 0.8) return 2;
  if (p < 0.9) return 3;
  return p > 0.985 ? 0 : 4;
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const seg = (p: number, a: number, b: number) => ease(clamp01((p - a) / (b - a)));
