"use client";

import { motion, MotionConfig } from "motion/react";
import { useEffect, useState } from "react";

import { Container } from "@/components/Container";
import SplitFlapText from "@/components/kokonutui/split-flap-text";
import TopoBackground from "@/components/kokonutui/topo-background";
import { ONE_LINER, PROOF } from "@/content/site";

import { Explainer } from "./Explainer";
import { BookButton, ButtonLink } from "./Button";
import { HeroLoop, useLoopCycle } from "./HeroLoop";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Systems the headline flips through, on its own beat, faster than the loop. */
const SYSTEMS = ["HUBSPOT", "SAP", "SALESFORCE", "ZENDESK", "TALLY", "SHOPIFY", "ZOHO", "ODOO", "XERO", "ERP"];
const SYSTEM_MS = 2200;

function useSystemWord(fallback: string, reduced: boolean | null) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") setI((n) => (n + 1) % SYSTEMS.length);
    }, SYSTEM_MS);
    return () => clearInterval(id);
  }, [reduced]);
  return reduced ? fallback : SYSTEMS[i]!;
}

function Words({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "105%", opacity: 0, filter: "blur(6px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: delay + i * 0.06, ease: EASE }}
          >
            {word}
          </motion.span>
          {" "}
        </span>
      ))}
    </>
  );
}

function FadeUp({ delay, children, className }: { delay: number; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const cycle = useLoopCycle();
  const system = useSystemWord(cycle.example.system, cycle.reduced);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative isolate overflow-hidden">
        {/* A contour map behind the hero: the cursor raises the ground, a click sends a ripple. */}
        <TopoBackground
          className="absolute inset-0 -z-10 min-h-0 bg-transparent text-[#cfd1c7] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
          labels={false}
          interval={0.085}
          speed={0.5}
          seed={41}
        >
          {null}
        </TopoBackground>

        <Container className="grid grid-cols-[minmax(0,1fr)] gap-12 pt-12 pb-16 sm:pt-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:pb-20">
          <div>
            <h1 className="type-display">
              <span className="sr-only">
                AI, built into the systems you already run, that gets used.
              </span>
              <span aria-hidden className="block">
                <Words text="AI, built into your" />
              </span>
              <motion.span
                aria-hidden
                className="mt-2 block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.45 }}
              >
                <SplitFlapText
                  text={system}
                  className="text-[0.62em] font-semibold sm:text-[0.62em]"
                  tileClassName="bg-ink text-paper"
                />
              </motion.span>
              <span aria-hidden className="mt-2 block text-ink-muted">
                <Words text="that gets used." delay={0.55} />
              </span>
            </h1>

            <FadeUp delay={0.75}>
              <p className="type-lede mt-8 max-w-xl text-ink-muted">{ONE_LINER}</p>
            </FadeUp>
            <FadeUp delay={0.85} className="mt-8 flex flex-wrap gap-3">
              <BookButton />
              <ButtonLink href="/how-we-work">See how we work</ButtonLink>
            </FadeUp>
            <FadeUp delay={0.95}>
              <Explainer className="mt-10 max-w-xl" />
            </FadeUp>
          </div>

          <FadeUp delay={0.5}>
            <HeroLoop cycle={cycle} />
          </FadeUp>
        </Container>

        <Container>
          <ul className="flex flex-wrap gap-x-10 gap-y-2 border-t border-rule/80 py-5 text-[0.9375rem] text-ink-muted">
            {PROOF.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Container>
      </section>
    </MotionConfig>
  );
}
