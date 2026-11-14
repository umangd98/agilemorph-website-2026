"use client";

import {
  AnimatePresence,
  motion,
  MotionConfig,
  useInView,
} from "motion/react";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
/* Where AI fits: one business, function by function                           */
/* -------------------------------------------------------------------------- */

export function FunctionExplorer() {
  const [active, setActive] = useState(0);
  const fn = FUNCTIONS[active]!;

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
        <div role="tablist" aria-label="Business functions" aria-orientation="vertical" className="flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:self-start lg:border-b lg:border-rule">
          {FUNCTIONS.map((f, i) => (
            <button
              key={f.name}
              type="button"
              role="tab"
              id={`fn-tab-${i}`}
              aria-selected={i === active}
              aria-controls="fn-panel"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "relative rounded-pill px-4 py-2 text-left text-[0.9375rem] font-medium ring-1 ring-rule transition-colors lg:rounded-none lg:border-t lg:border-rule lg:px-0 lg:py-5 lg:text-xl lg:ring-0",
                i === active ? "bg-ink text-white lg:bg-transparent lg:text-ink" : "text-ink-muted hover:text-ink",
              )}
            >
              {i === active ? (
                <motion.span
                  layoutId="fn-marker"
                  className="absolute top-1/2 -left-5 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-green lg:block"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  aria-hidden
                />
              ) : null}
              <span className={cn("relative transition-transform duration-300", i === active && "lg:inline-block lg:translate-x-1")}>
                {f.name}
              </span>
            </button>
          ))}
        </div>

        <div id="fn-panel" role="tabpanel" aria-labelledby={`fn-tab-${active}`} className="relative min-h-[22rem] overflow-hidden rounded-panel bg-white ring-1 ring-rule">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="grid h-full"
            >
              <div className="border-b border-rule-soft p-7 sm:p-9">
                <p className="text-sm font-medium text-red">What we usually find</p>
                <p className="type-heading mt-3">{fn.find}</p>
              </div>
              <div className="border-b border-rule-soft bg-green-soft/50 p-7 sm:p-9">
                <p className="text-sm font-medium text-green-deep">What we build</p>
                <p className="type-heading mt-3">{fn.build}</p>
              </div>
              <div className="p-7 sm:p-9">
                <p className="text-sm font-medium text-ink-faint">Built into</p>
                <p className="mt-2 text-ink-muted">{fn.systems}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
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
