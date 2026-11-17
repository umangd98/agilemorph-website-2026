"use client";

import { MotionConfig } from "motion/react";
import { Fragment, useEffect, useState } from "react";

import { Container } from "@/components/Container";
import SplitFlapText from "@/components/kokonutui/split-flap-text";
import TopoBackground from "@/components/kokonutui/topo-background";
import { ONE_LINER, PROOF } from "@/content/site";

import { Explainer } from "./Explainer";
import { BookButton, ButtonLink } from "./Button";
import { HeroLoop, useLoopCycle } from "./HeroLoop";

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

// The entrance runs in CSS (.hero-rise and .hero-up in globals.css), not
// Motion: Motion's starting styles are server-rendered, which kept the hero
// copy invisible until JavaScript loaded and left it blank in Google's render.
function Words({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span className="hero-rise" style={{ animationDelay: `${delay + i * 0.05}s` }}>
              {word}
            </span>
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

function FadeUp({ delay, children, className }: { delay: number; children: React.ReactNode; className?: string }) {
  return (
    <div className={`hero-up ${className ?? ""}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
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
              <span aria-hidden className="mt-2 block">
                <SplitFlapText
                  text={system}
                  className="text-[0.62em] font-semibold sm:text-[0.62em]"
                  tileClassName="bg-ink text-paper"
                />
              </span>
              <span aria-hidden className="mt-2 block text-ink-muted">
                <Words text="that gets used." delay={0.3} />
              </span>
            </h1>

            <FadeUp delay={0.4}>
              <p className="type-lede mt-8 max-w-xl text-ink-muted">{ONE_LINER}</p>
            </FadeUp>
            <FadeUp delay={0.45} className="mt-8 flex flex-wrap gap-3">
              <BookButton />
              <ButtonLink href="/how-we-work">See how we work</ButtonLink>
            </FadeUp>
            <FadeUp delay={0.5}>
              <Explainer className="mt-10 max-w-xl" />
            </FadeUp>
          </div>

          <FadeUp delay={0.3}>
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
