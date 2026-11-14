"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Image as ImageIcon, MessageSquare, Mic, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SCENARIOS, type Scenario } from "@/content/scenarios";
import { cn } from "@/lib/utils";

/*
 * The hero console: a message from the floor travels through capture,
 * validation and a person's confirmation, and lands as a record in the
 * client's system. It cycles through three sites and can be driven by hand.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/** When each stage starts within a scenario, in ms. */
const STAGE_AT = [0, 750, 1550, 2150, 2750, 3850, 4350, 5150];
const SCENARIO_MS = 8600;
const FINAL_STAGE = STAGE_AT.length - 1;

const STEPS = ["Captured", "Validated", "Person confirms", "Written"] as const;
/** The stage at which each step lights up. */
const STEP_STAGE = [2, 3, 4, 7] as const;

const CHANNEL_ICON = {
  "WhatsApp text": MessageSquare,
  "Voice note": Mic,
  Photo: ImageIcon,
  "Phone call": Phone,
} as const;

export function useScenarioCycle() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState(0);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (reduced) {
      const id = requestAnimationFrame(() => setStage(FINAL_STAGE));
      return () => cancelAnimationFrame(id);
    }
    if (!visible) return;

    const timers = STAGE_AT.map((at, s) => setTimeout(() => setStage(s), at));
    timers.push(
      setTimeout(() => {
        setStage(0);
        setIndex((i) => (i + 1) % SCENARIOS.length);
      }, SCENARIO_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, [index, visible, reduced]);

  const select = (next: number) => {
    setStage(reduced ? FINAL_STAGE : 0);
    setIndex(next);
  };

  return { ref, index, stage, select, scenario: SCENARIOS[index] as Scenario, reduced };
}

function VoiceBars({ active }: { active: boolean }) {
  const heights = [6, 10, 14, 9, 16, 12, 7, 13, 17, 10, 6, 12, 15, 8, 11, 5];
  return (
    <span className="flex h-5 items-center gap-[3px]" aria-hidden>
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-green/70"
          style={{ height: h }}
          animate={active ? { scaleY: [0.5, 1.15, 0.5] } : { scaleY: 1 }}
          transition={active ? { duration: 0.8, repeat: Infinity, delay: i * 0.045, ease: "easeInOut" } : { duration: 0.3 }}
        />
      ))}
    </span>
  );
}

function TypingDots() {
  return (
    <span className="flex h-5 items-center gap-1" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-ink-faint"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

export function HeroConsole({
  cycle,
}: {
  cycle: ReturnType<typeof useScenarioCycle>;
}) {
  const { ref, index, stage, select, scenario } = cycle;
  const Icon = CHANNEL_ICON[scenario.message.channel];
  const confirmed = stage >= 5;
  const progress = stage >= 7 ? 1 : stage >= 5 ? 0.75 : stage >= 4 ? 0.62 : stage >= 3 ? 0.36 : stage >= 2 ? 0.12 : 0;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[1.25rem] bg-white/90 shadow-[0_1px_0_rgba(11,13,16,0.04),0_30px_60px_-30px_rgba(11,13,16,0.25)] ring-1 ring-rule backdrop-blur"
    >
      {/* Sites */}
      <div className="flex items-center gap-1 border-b border-rule-soft p-1.5" role="tablist" aria-label="Example sites">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.site}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => select(i)}
            className={cn(
              "relative flex-1 rounded-[0.8rem] px-2 py-2 text-[0.8125rem] font-medium transition-colors",
              i === index ? "text-ink" : "text-ink-faint hover:text-ink-muted",
            )}
          >
            {i === index ? (
              <motion.span
                layoutId="site-pill"
                className="absolute inset-0 rounded-[0.8rem] bg-panel"
                transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
              />
            ) : null}
            <span className="relative flex items-center justify-center gap-1.5">
              {i === index ? (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
                </span>
              ) : null}
              <span className="truncate">{s.site}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-6">
        {/* On the floor */}
        <p className="text-xs font-medium text-ink-faint">On the floor</p>
        <div className="mt-2 min-h-[6.25rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: EASE }}
              className="max-w-[26rem] rounded-2xl rounded-tl-md bg-panel px-4 py-3"
            >
              <p className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
                <Icon size={14} aria-hidden className="shrink-0 text-green" />
                {scenario.message.from}, {scenario.message.channel.toLowerCase()}
              </p>
              {stage < 1 ? (
                <TypingDots />
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  {scenario.message.channel === "Voice note" ? (
                    <div className="mt-2">
                      <VoiceBars active={stage < 3} />
                    </div>
                  ) : null}
                  <p className="mt-1.5 text-[0.9375rem] leading-snug">{scenario.message.body}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* The pipeline */}
        <div className="relative mt-6">
          <div className="absolute top-[0.6875rem] right-3 left-3 h-px bg-rule" aria-hidden />
          <motion.div
            className="absolute top-[0.6875rem] left-3 h-px origin-left bg-green"
            style={{ right: "0.75rem" }}
            initial={false}
            animate={{ scaleX: progress }}
            transition={{ duration: 0.55, ease: EASE }}
            aria-hidden
          />
          <ol className="relative grid grid-cols-4">
            {STEPS.map((step, i) => {
              const lit = stage >= (STEP_STAGE[i] ?? Infinity);
              const isConfirm = step === "Person confirms";
              const amber = isConfirm && lit && !confirmed;
              return (
                <li key={step} className="flex flex-col items-center gap-2 text-center">
                  <motion.span
                    className={cn(
                      "relative flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-full ring-1 transition-colors duration-300",
                      lit ? (amber ? "bg-amber-soft ring-amber" : "bg-green ring-green") : "bg-white ring-rule",
                    )}
                    animate={lit ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {amber ? (
                      <motion.span
                        className="absolute inset-0 rounded-full ring-2 ring-amber/40"
                        animate={{ scale: [1, 1.7], opacity: [0.8, 0] }}
                        transition={{ duration: 1.1, repeat: Infinity }}
                        aria-hidden
                      />
                    ) : null}
                    {lit && !amber ? <Check size={12} strokeWidth={3} className="text-white" aria-hidden /> : null}
                  </motion.span>
                  <span
                    className={cn(
                      "text-[0.75rem] leading-tight font-medium transition-colors duration-300",
                      amber ? "text-amber" : lit ? "text-green-deep" : "text-ink-faint",
                    )}
                  >
                    {step}
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mt-3 h-5 text-center text-[0.8125rem]">
            <AnimatePresence mode="wait" initial={false}>
              {stage >= 4 ? (
                <motion.p
                  key={confirmed ? "done" : "ask"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className={confirmed ? "text-green-deep" : "text-amber"}
                >
                  {confirmed ? scenario.confirm.done : scenario.confirm.ask}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* In the system */}
        <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-rule">
          <div className="flex items-center justify-between gap-3 border-b border-rule-soft bg-panel/60 px-4 py-2.5">
            <p className="font-display text-[0.9375rem] font-semibold tracking-[-0.01em]">{scenario.record.title}</p>
            <motion.span
              initial={false}
              animate={{ opacity: stage >= 7 ? 1 : 0.35 }}
              className={cn(
                "rounded-pill px-2.5 py-0.5 text-xs font-medium",
                stage >= 7 ? "bg-green-soft text-green-deep" : "bg-white text-ink-faint",
              )}
            >
              {stage >= 7 ? `Written to ${scenario.system === "SALESFORCE" ? "Salesforce" : scenario.system}` : "Waiting"}
            </motion.span>
          </div>
          <dl className="px-4 py-2 font-code text-[0.8125rem]">
            {scenario.record.fields.map(([label, value], i) => (
              <div key={label} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-1.5">
                <dt className="text-ink-faint">{label}</dt>
                <dd className="min-w-0 truncate">
                  <motion.span
                    key={`${index}-${label}`}
                    className="inline-block"
                    initial={{ opacity: 0, x: -6 }}
                    animate={stage >= 6 ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
                    transition={{ duration: 0.35, delay: stage >= 6 ? i * 0.09 : 0, ease: EASE }}
                  >
                    {value}
                  </motion.span>
                </dd>
              </div>
            ))}
            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 py-2">
              <dt className="text-ink-faint">Status</dt>
              <dd className="relative h-6">
                <AnimatePresence mode="wait" initial={false}>
                  {stage >= 6 ? (
                    <motion.span
                      key={`${index}-status`}
                      initial={{ opacity: 0, scale: 0.85, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", bounce: 0.35, duration: 0.5 }}
                      className="inline-flex items-center gap-1.5 rounded-md bg-ink px-2 py-0.5 text-white"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#3dd67a]" />
                      {scenario.record.status}
                    </motion.span>
                  ) : (
                    <motion.span key="pending" exit={{ opacity: 0 }} className="text-ink-faint">
                      Pending
                    </motion.span>
                  )}
                </AnimatePresence>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
