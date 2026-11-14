"use client";

import { animate, AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { LOOP_EXAMPLES, PHASES } from "@/content/site";
import { cn } from "@/lib/utils";

/*
 * The loop we run on every engagement, drawn as a loop. A marker travels the
 * ring through Find, Build, Ship, Adopt and Iterate while the centre tells
 * that stage for one team. Once round, it moves on to the next team: same
 * loop, different part of the business. Every stage and team can be picked.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const STAGE_MS = 2600;
const STAGES = PHASES.length;
const R = 40; // ring radius, as a percentage of the box

function point(i: number) {
  const angle = ((-90 + (360 / STAGES) * i) * Math.PI) / 180;
  return { x: 50 + R * Math.cos(angle), y: 50 + R * Math.sin(angle) };
}

export function useLoopCycle() {
  const reduced = useReducedMotion();
  const [team, setTeam] = useState(0);
  const [stage, setStage] = useState(0);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);

  // Pause off screen and in background tabs.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), {
      threshold: 0.15,
    });
    observer.observe(node);
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // The marker travels from this stage to the next while the stage is shown.
  useEffect(() => {
    const from = stage / STAGES;
    if (reduced || !visible) {
      progress.set(from);
      return;
    }
    progress.set(from);
    const controls = animate(progress, (stage + 1) / STAGES, { duration: STAGE_MS / 1000, ease: "linear" });
    const id = setTimeout(() => {
      if (stage === STAGES - 1) {
        setTeam((t) => (t + 1) % LOOP_EXAMPLES.length);
        setStage(0);
      } else {
        setStage(stage + 1);
      }
    }, STAGE_MS);
    return () => {
      controls.stop();
      clearTimeout(id);
    };
  }, [stage, team, visible, reduced, progress]);

  const pickTeam = (next: number) => {
    setTeam(next);
    setStage(0);
  };

  return { ref, team, stage, setStage, pickTeam, progress, example: LOOP_EXAMPLES[team]!, reduced };
}

export function HeroLoop({ cycle }: { cycle: ReturnType<typeof useLoopCycle> }) {
  const { ref, team, stage, setStage, pickTeam, progress, example } = cycle;
  const cx = useTransform(progress, (p) => 50 + R * Math.cos((p * 360 - 90) * (Math.PI / 180)));
  const cy = useTransform(progress, (p) => 50 + R * Math.sin((p * 360 - 90) * (Math.PI / 180)));
  const phase = PHASES[stage]!;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[1.25rem] bg-white/90 shadow-[0_1px_0_rgba(11,13,16,0.04),0_30px_60px_-30px_rgba(11,13,16,0.25)] ring-1 ring-rule backdrop-blur"
    >
      {/* Teams */}
      <div className="flex items-center gap-1 border-b border-rule-soft p-1.5" role="tablist" aria-label="Example teams">
        {LOOP_EXAMPLES.map((ex, i) => (
          <button
            key={ex.team}
            type="button"
            role="tab"
            aria-selected={i === team}
            onClick={() => pickTeam(i)}
            className={cn(
              "relative flex-1 rounded-[0.8rem] px-2 py-2 text-[0.8125rem] font-medium transition-colors",
              i === team ? "text-ink" : "text-ink-faint hover:text-ink-muted",
            )}
          >
            {i === team ? (
              <motion.span
                layoutId="loop-team-pill"
                className="absolute inset-0 rounded-[0.8rem] bg-panel"
                transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
              />
            ) : null}
            <span className="relative truncate">{ex.team}</span>
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 pb-5 sm:px-6">
        <div className="relative mx-auto aspect-square w-full max-w-[25rem]">
          {/* The ring and the travelling marker */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            <circle cx="50" cy="50" r={R} fill="none" stroke="var(--color-rule)" strokeWidth="0.5" strokeDasharray="0.6 1.4" />
            <motion.circle
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke="var(--color-green)"
              strokeWidth="0.8"
              strokeLinecap="round"
              style={{ pathLength: progress, rotate: -90, transformOrigin: "50% 50%" }}
            />
            <motion.circle cx={cx} cy={cy} r="3.2" fill="var(--color-green)" opacity="0.18" />
            <motion.circle cx={cx} cy={cy} r="1.5" fill="var(--color-green)" />
          </svg>

          {/* Stage chips on the ring */}
          {PHASES.map((p, i) => {
            const { x, y } = point(i);
            const done = i < stage;
            const current = i === stage;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => setStage(i)}
                aria-pressed={current}
                className={cn(
                  "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-pill px-3 py-1.5 text-[0.8125rem] font-semibold ring-1 transition-colors duration-300 sm:px-3.5 sm:text-sm",
                  current
                    ? "bg-green text-white ring-green"
                    : done
                      ? "bg-green-soft text-green-deep ring-green/30"
                      : "bg-white text-ink-muted ring-rule hover:text-ink",
                )}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {current ? (
                  <motion.span
                    layoutId="loop-stage-glow"
                    className="absolute inset-0 -z-10 rounded-pill bg-green/25 blur-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    aria-hidden
                  />
                ) : null}
                {p.name}
              </button>
            );
          })}

          {/* What this stage looks like for this team */}
          <div className="absolute inset-[23%] flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${team}-${stage}`}
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <p className="text-[0.75rem] font-medium text-green-deep sm:text-[0.8125rem]">{phase.verb}</p>
                <p className="mt-2 text-[0.875rem] leading-snug text-ink sm:text-[0.9375rem]">
                  {example.stages[stage]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-2 text-center text-[0.8125rem] text-ink-muted">
          Then round again, with the next thing your team asks for.
        </p>
      </div>
    </div>
  );
}
