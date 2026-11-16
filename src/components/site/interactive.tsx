"use client";

import {
  AnimatePresence,
  motion,
  MotionConfig,
  useInView,
} from "motion/react";
import { Plus } from "lucide-react";
import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from "react";

import { Container } from "@/components/Container";
import FlowField from "@/components/kokonutui/flow-field";
import { COMPANY, COMPARISON, FAQ, FUNCTIONS } from "@/content/site";
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
/* Where AI fits: one piece of work, moving through each team                  */
/* -------------------------------------------------------------------------- */

const flowCard = {
  hidden: { opacity: 0, y: 12 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  gone: { opacity: 0, transition: { duration: 0.15 } },
};

function FlowArrow() {
  return (
    <motion.div variants={flowCard} aria-hidden className="grid h-8 place-items-center text-ink-faint lg:h-auto">
      <svg viewBox="0 0 20 20" className="h-5 w-5 rotate-90 lg:rotate-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10h12M11 5l5 5-5 5" />
      </svg>
    </motion.div>
  );
}

export function FunctionExplorer() {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const fn = FUNCTIONS[active]!;

  const onKeyDown = (event: KeyboardEvent) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + FUNCTIONS.length) % FUNCTIONS.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        role="tablist"
        aria-label="Teams"
        onKeyDown={onKeyDown}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {FUNCTIONS.map((f, i) => (
          <button
            key={f.name}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`fn-tab-${i}`}
            aria-selected={i === active}
            aria-controls="fn-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "relative shrink-0 rounded-pill px-4 py-2 text-[0.9375rem] font-medium whitespace-nowrap transition-colors",
              i === active ? "text-white" : "bg-white text-ink-muted ring-1 ring-rule hover:text-ink",
            )}
          >
            {i === active ? (
              <motion.span
                layoutId="fn-pill"
                className="absolute inset-0 rounded-pill bg-ink"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            ) : null}
            <span className="relative">{f.name}</span>
          </button>
        ))}
      </div>

      <div id="fn-panel" role="tabpanel" aria-labelledby={`fn-tab-${active}`} className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial="hidden"
            animate="shown"
            exit="gone"
            transition={{ staggerChildren: 0.09 }}
            className="grid lg:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)_2.5rem_minmax(0,1fr)]"
          >
            <motion.div variants={flowCard} className="grid content-start gap-4 rounded-panel bg-white p-6 ring-1 ring-rule">
              <p className="text-sm font-medium text-ink-faint">What comes in</p>
              <div className="rounded-[1rem_1rem_1rem_0.25rem] bg-panel px-4 py-3">
                <p className="text-[0.8125rem] text-ink-faint">{fn.input[0]}</p>
                <p className="mt-1">{fn.input[1]}</p>
              </div>
            </motion.div>

            <FlowArrow />

            <motion.div variants={flowCard} className="grid content-start gap-4 rounded-panel bg-green-soft p-6 ring-1 ring-[#c7e2d0]">
              <p className="text-sm font-medium text-green-deep">What the AI does</p>
              <p className="type-heading">{fn.action}</p>
              <p className="text-sm text-ink-muted">A person approves anything it isn&apos;t sure of.</p>
            </motion.div>

            <FlowArrow />

            <motion.div variants={flowCard} className="grid content-start gap-4 rounded-panel bg-white p-6 ring-1 ring-rule">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-sm font-medium text-ink-faint">Where it lands</p>
                <p className={cn("text-[0.8125rem] font-medium", fn.lands.built ? "text-amber" : "text-green-deep")}>
                  {fn.lands.built ? "Built from scratch" : "A system you already run"}
                </p>
              </div>
              <p className="flex items-baseline gap-2 font-medium">
                <span aria-hidden className={cn("h-2 w-2 shrink-0 -translate-y-px rounded-full", fn.lands.built ? "bg-amber" : "bg-green")} />
                {fn.lands.name}
              </p>
              <dl className="grid gap-2 text-[0.9375rem]">
                {fn.record.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-dashed border-rule pb-2 last:border-b-0 last:pb-0">
                    <dt className="text-ink-faint">{label}</dt>
                    <dd className="text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <p className="mt-8 grid gap-1 border-t border-rule pt-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-6">
          <span className="font-medium text-red">What we usually find</span>
          <span className="text-ink-muted">{fn.find}</span>
        </p>
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
  heading = "Let's find where AI fits in your business.",
  body = "Book a discovery call. We'll tell you where AI would pay off in your systems, and what the first build would take.",
  faces,
}: {
  heading?: string;
  body?: string;
  /** Shows the team's faces and a line under the body. */
  faces?: ReactNode;
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
          {faces ? <div className="mt-8">{faces}</div> : null}
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
