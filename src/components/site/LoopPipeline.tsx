"use client";

import { AnimatePresence, motion, MotionConfig, useInView, useReducedMotion } from "motion/react";
import { Check, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { PHASES } from "@/content/site";
import { cn } from "@/lib/utils";

/*
 * The loop as a build pipeline. Stages run left to right (top to bottom on
 * phones), each turning amber while it runs and green when it passes. Between
 * stages sits a gate: the decision the client makes before we continue. When
 * Iterate passes, the line runs back to Build with the next workflow.
 *
 * The run is counted in half-steps: an even step means stage step/2 is
 * running, an odd step means it has passed and its gate is being asked.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const STEP_MS = 1200;
const LAST = PHASES.length * 2; // one extra beat with the loop lit
const LOOPED = PHASES.length * 2 - 1;

type State = "queued" | "running" | "passed";

function stateOf(i: number, step: number): State {
  const running = Math.floor(step / 2);
  if (i < running || (i === running && step % 2 === 1)) return "passed";
  return i === running ? "running" : "queued";
}

function gateOf(i: number, step: number) {
  if (step >= 2 * i + 2) return "passed";
  return step === 2 * i + 1 ? "asking" : "queued";
}

function StageIcon({ state }: { state: State }) {
  if (state === "passed") return <Check size={20} strokeWidth={2.6} aria-hidden />;
  if (state === "running")
    return (
      <span
        aria-hidden
        className="h-5 w-5 animate-spin rounded-full border-2 border-amber border-r-transparent motion-reduce:animate-none"
      />
    );
  return <span aria-hidden className="h-2 w-2 rounded-full ring-[1.5px] ring-ink-faint" />;
}

const tile = {
  queued: "bg-white ring-rule text-ink-faint",
  running: "bg-amber-soft ring-amber text-amber",
  passed: "bg-green ring-green text-white",
} as const;

const label = { queued: "queued", running: "running", passed: "passed" } as const;

const labelTone = {
  queued: "text-ink-faint",
  running: "text-amber",
  passed: "text-green-deep",
} as const;

const diamond = {
  queued: "bg-white ring-rule",
  asking: "bg-amber-soft ring-amber",
  passed: "bg-green ring-green",
} as const;

export function LoopPipeline({ showDetails = false }: { showDetails?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    if (reduced || picked !== null || !inView) return;
    const id = setInterval(() => setStep((s) => (s >= LAST ? 0 : s + 1)), STEP_MS);
    return () => clearInterval(id);
  }, [reduced, picked, inView]);

  // With reduced motion, show the finished run and let people pick a stage.
  const shownStep = reduced ? LOOPED : step;
  const selected = picked ?? (reduced ? 0 : Math.min(PHASES.length - 1, Math.floor(step / 2)));
  const phase = PHASES[selected]!;
  const looped = shownStep >= LOOPED;

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref}>
        {/* Desktop: left to right */}
        <div className="hidden md:block">
          <div className="relative grid grid-cols-5 pb-16">
            {PHASES.map((p, i) => {
              const state = stateOf(i, shownStep);
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setPicked(i)}
                  aria-pressed={selected === i}
                  className="group relative z-10 flex flex-col items-center gap-3 px-2 text-center"
                >
                  <motion.span
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-2xl ring-[1.5px] transition-colors duration-300",
                      tile[state],
                    )}
                    animate={state === "passed" ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <StageIcon state={state} />
                  </motion.span>
                  <span
                    className={cn(
                      "font-display text-xl font-semibold tracking-[-0.02em] underline-offset-[6px] decoration-2",
                      selected === i ? "underline decoration-green" : "decoration-transparent group-hover:underline group-hover:decoration-rule",
                    )}
                  >
                    {p.name}
                  </span>
                  <span className={cn("font-code text-xs transition-colors duration-300", labelTone[state])}>
                    {label[state]}
                  </span>
                </button>
              );
            })}

            {/* Connectors and gates between stages */}
            {PHASES.slice(0, -1).map((p, i) => {
              const gate = gateOf(i, shownStep);
              return (
                <div key={p.name} aria-hidden>
                  <div
                    className="absolute top-7 h-0.5 bg-rule"
                    style={{ left: `calc(${i * 20 + 10}% + 32px)`, right: `calc(${100 - (i * 20 + 30)}% + 32px)` }}
                  >
                    <motion.div
                      className="absolute inset-0 origin-left bg-green"
                      initial={false}
                      animate={{ scaleX: gate === "passed" ? 1 : 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                    />
                  </div>
                  <span
                    title={p.decision}
                    className={cn(
                      "absolute top-[1.125rem] z-10 h-5 w-5 -translate-x-1/2 rotate-45 ring-[1.5px] transition-colors duration-300",
                      diamond[gate],
                    )}
                    style={{ left: `${(i + 1) * 20}%` }}
                  >
                    {gate === "asking" ? (
                      <span className="absolute inset-0 animate-ping bg-amber/30 motion-reduce:animate-none" />
                    ) : null}
                  </span>
                </div>
              );
            })}

            {/* Back to Build */}
            <div
              aria-hidden
              className={cn(
                "absolute right-[10%] bottom-3 left-[30%] h-9 rounded-b-2xl border-2 border-t-0 transition-colors duration-500",
                looped ? "border-solid border-green" : "border-dashed border-rule",
              )}
            >
              <span
                className={cn(
                  "absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 bg-paper px-3 text-sm whitespace-nowrap transition-colors duration-500",
                  looped ? "text-green-deep" : "text-ink-muted",
                )}
              >
                <RotateCcw size={14} />
                Back to Build, with the next workflow
              </span>
            </div>
          </div>

          <div className="mt-4 border-t border-rule pt-8" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-12"
              >
                <div>
                  <p className="font-medium text-green-deep">{phase.verb}</p>
                  <p className="type-lede mt-2">{phase.summary}</p>
                  {showDetails ? (
                    <ul className="mt-5 flex flex-col gap-2 text-ink-muted">
                      {phase.details.map((detail) => (
                        <li key={detail} className="flex gap-3">
                          <span aria-hidden className="mt-[0.75em] h-px w-3 shrink-0 bg-ink-faint" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="self-start rounded-2xl bg-amber-soft px-6 py-5">
                  <p className="text-sm font-medium text-amber">You decide</p>
                  <p className="type-heading mt-1">{phase.decision}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          {picked !== null && !reduced ? (
            <button
              type="button"
              onClick={() => setPicked(null)}
              className="mt-6 text-sm text-ink-muted underline decoration-rule underline-offset-4 hover:text-ink"
            >
              Play the loop again
            </button>
          ) : null}
        </div>

        {/* Phones: top to bottom */}
        <div className="md:hidden">
          <ol className="relative">
            <span aria-hidden className="absolute top-6 bottom-6 left-[1.4375rem] w-0.5 bg-rule" />
            {PHASES.map((p, i) => {
              const state = stateOf(i, shownStep);
              const open = selected === i;
              const gate = i < PHASES.length - 1 ? gateOf(i, shownStep) : null;
              return (
                <li key={p.name} className="relative">
                  <button
                    type="button"
                    onClick={() => setPicked(i)}
                    aria-expanded={open}
                    className="grid w-full grid-cols-[3rem_minmax(0,1fr)] items-center gap-x-4 text-left"
                  >
                    <span
                      className={cn(
                        "row-span-2 flex h-12 w-12 items-center justify-center rounded-2xl ring-[1.5px] transition-colors duration-300",
                        tile[state],
                      )}
                    >
                      <StageIcon state={state} />
                    </span>
                    <span className="font-display text-xl font-semibold tracking-[-0.02em]">{p.name}</span>
                    <span className={cn("font-code text-xs transition-colors duration-300", labelTone[state])}>
                      {label[state]}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        key="detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="overflow-hidden pl-16"
                      >
                        <p className="pt-2 text-[0.9375rem] font-medium text-green-deep">{p.verb}</p>
                        <p className="mt-1 text-[0.9375rem] text-ink-muted">{p.summary}</p>
                        {showDetails ? (
                          <ul className="mt-3 flex flex-col gap-1.5 text-sm text-ink-muted">
                            {p.details.map((detail) => (
                              <li key={detail} className="flex gap-2.5">
                                <span aria-hidden className="mt-[0.7em] h-px w-2.5 shrink-0 bg-ink-faint" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                  {gate ? (
                    <p
                      className={cn(
                        "relative flex items-center gap-4 py-4 text-sm transition-colors duration-300",
                        gate === "asking" ? "text-amber" : gate === "passed" ? "text-green-deep" : "text-ink-faint",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn("mx-[1.0625rem] h-3.5 w-3.5 shrink-0 rotate-45 ring-[1.5px] transition-colors duration-300", diamond[gate])}
                      />
                      <span>
                        <span className="sr-only">You decide: </span>
                        {p.decision}
                      </span>
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ol>
          <p
            className={cn(
              "mt-5 flex items-center gap-2.5 rounded-xl border-[1.5px] px-4 py-3 text-sm transition-colors duration-500",
              looped ? "border-solid border-green bg-green-soft text-green-deep" : "border-dashed border-rule text-ink-muted",
            )}
          >
            <RotateCcw size={16} aria-hidden />
            Back to Build, with the next workflow
          </p>
          <p className="mt-4 text-sm text-ink-muted">
            <span className="text-ink-faint">You decide after {PHASES[PHASES.length - 1]!.name}: </span>
            {PHASES[PHASES.length - 1]!.decision}
          </p>
        </div>
      </div>
    </MotionConfig>
  );
}
