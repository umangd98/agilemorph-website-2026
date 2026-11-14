"use client";

import {
  AnimatePresence,
  motion,
  MotionConfig,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/Container";
import FlowField from "@/components/kokonutui/flow-field";
import { COMPANY, COMPARISON, FAQ, PHASES } from "@/content/site";
import { cn } from "@/lib/utils";

import { BookButton } from "./Button";

const EASE = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/* Comparison: flips from the vendor's answer to ours as it comes into view    */
/* -------------------------------------------------------------------------- */

export function ComparisonSwitch() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [side, setSide] = useState<"before" | "after">("before");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!inView || touched) return;
    const id = setTimeout(() => setSide("after"), 1100);
    return () => clearTimeout(id);
  }, [inView, touched]);

  const choose = (next: "before" | "after") => {
    setTouched(true);
    setSide(next);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref}>
        <div role="tablist" aria-label="Compare" className="inline-flex rounded-pill bg-panel p-1 ring-1 ring-rule">
          {(
            [
              ["before", COMPARISON.before],
              ["after", COMPARISON.after],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={side === key}
              onClick={() => choose(key)}
              className={cn(
                "relative rounded-pill px-5 py-2.5 text-[0.9375rem] font-medium transition-colors",
                side === key ? (key === "after" ? "text-white" : "text-ink") : "text-ink-muted hover:text-ink",
              )}
            >
              {side === key ? (
                <motion.span
                  layoutId="compare-pill"
                  className={cn("absolute inset-0 rounded-pill", key === "after" ? "bg-green" : "bg-white ring-1 ring-rule")}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.55 }}
                />
              ) : null}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>

        <dl className="mt-10 border-b border-rule">
          {COMPARISON.rows.map(([label, before, after], i) => (
            <div
              key={label}
              className="grid gap-2 border-t border-rule py-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] md:items-baseline md:gap-10"
            >
              <dt className="text-[0.9375rem] font-medium text-ink-muted">{label}</dt>
              <dd className="relative min-h-[2.2em] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.p
                    key={side}
                    initial={{ y: "70%", opacity: 0, filter: "blur(6px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: "-70%", opacity: 0, filter: "blur(6px)" }}
                    transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
                    className={cn(
                      "type-heading",
                      side === "after" ? "text-ink" : "text-ink-faint line-through decoration-red/50 decoration-2",
                    )}
                  >
                    {side === "after" ? after : before}
                  </motion.p>
                </AnimatePresence>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </MotionConfig>
  );
}

/* -------------------------------------------------------------------------- */
/* Phases: a sticky rail that fills as you scroll through the engagement       */
/* -------------------------------------------------------------------------- */

export function PhaseScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.min(PHASES.length - 1, Math.max(0, Math.floor(value * PHASES.length))));
  });

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <div className="flex items-baseline gap-4">
              <div className="relative h-[7.5rem] w-[5.5rem] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={active}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="absolute inset-0 font-display text-[7.5rem] leading-none font-semibold tracking-[-0.06em] text-green tabular-nums"
                  >
                    {active + 1}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="font-display text-3xl font-semibold text-ink-faint">/ {PHASES.length}</span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mt-6 max-w-sm text-lg"
              >
                <span className="text-ink-faint">You decide: </span>
                {PHASES[active]?.decision}
              </motion.p>
            </AnimatePresence>
            <div className="mt-10 h-1 w-full max-w-sm overflow-hidden rounded-full bg-rule">
              <motion.div className="h-full origin-left rounded-full bg-green" style={{ scaleX: fill }} />
            </div>
          </div>
        </div>

        <ol>
          {PHASES.map((phase, i) => (
            <li
              key={phase.name}
              className={cn(
                "border-t border-rule py-10 transition-opacity duration-500 last:border-b lg:py-14",
                i === active ? "lg:opacity-100" : "lg:opacity-35",
              )}
            >
              <p className="font-display text-xl font-semibold text-green tabular-nums lg:hidden">{i + 1}</p>
              <h3 className="type-title mt-2 text-[2rem] sm:text-[2.5rem] lg:mt-0">{phase.name}</h3>
              <p className="type-lede mt-4 max-w-xl text-ink-muted">{phase.summary}</p>
              <p className="mt-5 text-sm lg:hidden">
                <span className="text-ink-faint">You decide: </span>
                {phase.decision}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </MotionConfig>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ with animated height                                                    */
/* -------------------------------------------------------------------------- */

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <MotionConfig reducedMotion="user">
      <div className="border-b border-rule">
        {FAQ.map(([question, answer], i) => {
          const isOpen = open === i;
          return (
            <div key={question} className="border-t border-rule">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-baseline justify-between gap-6 py-5 text-left text-lg font-medium"
                >
                  {question}
                  <motion.span
                    aria-hidden
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                    className="shrink-0 text-green"
                  >
                    <Plus size={22} />
                  </motion.span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    id={`faq-${i}`}
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pb-6 text-ink-muted">{answer}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </MotionConfig>
  );
}

/* -------------------------------------------------------------------------- */
/* Closing call to action over wind that parts around the cursor               */
/* -------------------------------------------------------------------------- */

export function CtaBand({
  heading = "Let's pick one workflow and prove it on site.",
  body = "Book a discovery call. We'll tell you where AI fits in your operation and what a pilot would take.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-green text-white">
      <FlowField
        className="absolute inset-0 -z-10 min-h-0 bg-transparent text-white/35"
        density={0.9}
        speed={0.6}
      >
        {null}
      </FlowField>
      <Container className="grid gap-10 py-24 sm:py-32 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <h2 className="type-title max-w-2xl">{heading}</h2>
          <p className="type-lede mt-5 max-w-xl text-white/85">{body}</p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <BookButton variant="inverse" />
          <a
            href={`mailto:${COMPANY.email}`}
            className="text-[0.9375rem] text-white/90 underline decoration-white/40 underline-offset-4 hover:decoration-white"
          >
            or email {COMPANY.email}
          </a>
        </div>
      </Container>
    </section>
  );
}
