"use client";

import "lenis/dist/lenis.css";

import Lenis from "lenis";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { SceneHandle } from "./scene";
import { BEATS, clamp01, LOOP, loopIndex, seg } from "./story";

/*
 * The scroll-driven teardown. The section is tall; the scene is pinned while
 * it scrolls past, and the scroll position plays the story. The 3D code and
 * models load only when the section comes near, so the rest of the page
 * doesn't pay for them. Without WebGL, the poster and the copy still tell it.
 */

function pickQuality(): "high" | "low" {
  const small = window.matchMedia("(max-width: 860px)").matches;
  const cores = navigator.hardwareConcurrency || 4;
  return small || cores <= 4 ? "low" : "high";
}

export function Teardown3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "failed">("idle");
  const [loop, setLoop] = useState(-1);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const overlay = overlayRef.current;
    if (!section || !stage || !overlay) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduced ? null : new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    let handle: SceneHandle | null = null;
    let raf = 0;
    let visible = false;
    let started = false;
    let disposed = false;
    let clock = 0;
    let last = performance.now();
    let lastLoop = -2;

    const progress = () => {
      const rect = section.getBoundingClientRect();
      const pinTop = parseFloat(getComputedStyle(stage).top) || 0;
      const run = rect.height - stage.clientHeight;
      return run > 0 ? clamp01((pinTop - rect.top) / run) : 0;
    };

    const paintCopy = (p: number) => {
      const wide = window.innerWidth >= 860;
      BEATS.forEach((beat, i) => {
        const el = copyRefs.current[i];
        if (!el) return;
        const next = BEATS[i + 1]?.at ?? 1.05;
        const local = (p - beat.at) / (next - beat.at);
        const op = i === 0 ? 1 - seg(local, 0.8, 0.97) : seg(local, 0.02, 0.14) * (1 - seg(local, 0.84, 0.98));
        const drift = (0.5 - clamp01(local)) * (wide ? 64 : 24);
        el.style.opacity = op.toFixed(3);
        el.style.visibility = op < 0.01 ? "hidden" : "visible";
        el.style.transform = `translateY(calc(${wide ? "-50%" : "0px"} + ${drift.toFixed(1)}px))`;
      });
      const li = loopIndex(p);
      if (li !== lastLoop) {
        lastLoop = li;
        setLoop(li);
      }
    };

    const frame = (now: number) => {
      raf = 0;
      lenis?.raf(now);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) clock += dt;
      const p = progress();
      paintCopy(p);
      if (visible && handle) handle.render(p, clock);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const start = async () => {
      if (started) return;
      started = true;
      setStatus("loading");
      try {
        const { createScene } = await import("./scene");
        if (disposed) return;
        handle = await createScene(stage, overlay, { quality: pickQuality(), reduced });
        if (disposed) {
          handle.dispose();
          return;
        }
        setStatus("ready");
      } catch (error) {
        console.error(error);
        setStatus("failed");
      }
    };

    const near = new IntersectionObserver(([e]) => { if (e?.isIntersecting) void start(); }, { rootMargin: "100% 0px" });
    near.observe(section);
    const onScreen = new IntersectionObserver(([e]) => { visible = Boolean(e?.isIntersecting); });
    onScreen.observe(section);
    const ro = new ResizeObserver(() => handle?.resize());
    ro.observe(stage);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      near.disconnect();
      onScreen.disconnect();
      ro.disconnect();
      lenis?.destroy();
      handle?.dispose();
    };
  }, []);

  return (
    <section ref={sectionRef} aria-label="How we take a business apart and build AI into it" className="relative h-[1000vh] bg-[#050607]">
      <div ref={stageRef} className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden bg-[#050607] text-white">
        {/* Shown until the scene is ready, and as the fallback without WebGL */}
        <Image
          src="/deconstruction/poster.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={cn("object-cover transition-opacity duration-700", status === "ready" ? "opacity-0" : "opacity-60")}
        />
        <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-10" aria-hidden />
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(5,6,7,.85)_0,rgba(5,6,7,.5)_26%,transparent_46%)] max-[860px]:bg-[linear-gradient(to_top,rgba(5,6,7,.92)_0,transparent_48%)]" />

        <div className="pointer-events-none absolute inset-0 z-20">
          {BEATS.map((beat, i) => (
            <div
              key={beat.title}
              ref={(node) => { copyRefs.current[i] = node; }}
              className="absolute top-1/2 left-0 w-[min(34rem,42vw)] px-[max(1.5rem,calc((100vw-80rem)/2+2rem))] will-change-transform max-[860px]:top-auto max-[860px]:bottom-24 max-[860px]:w-full max-[860px]:px-5"
              style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
            >
              {beat.loop ? <p className="mb-3 text-sm font-medium text-[#5cd68b]">{beat.loop}</p> : null}
              {i === 0 ? (
                <h1 className="type-display text-[clamp(2.2rem,4.6vw,4rem)] [text-shadow:0_2px_24px_rgba(0,0,0,.8)]">{beat.title}</h1>
              ) : (
                <h2 className="type-title [text-shadow:0_2px_24px_rgba(0,0,0,.8)]">{beat.title}</h2>
              )}
              <p className="type-lede mt-4 max-w-md text-white/75 [text-shadow:0_1px_14px_rgba(0,0,0,.9)]">{beat.body}</p>
              {i === 0 ? <p className="mt-6 text-sm text-white/50">Scroll to take it apart</p> : null}
            </div>
          ))}
        </div>

        <ol className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm" aria-label="Where we are in the loop">
          {LOOP.map((name, i) => (
            <li
              key={name}
              aria-current={loop === i ? "step" : undefined}
              className={cn(
                "rounded-pill px-3 py-1.5 ring-1 transition-colors duration-300",
                loop === i ? "bg-green text-white ring-green" : "bg-black/50 text-white/70 ring-white/20",
              )}
            >
              {name}
            </li>
          ))}
        </ol>

        {status === "loading" ? (
          <p className="absolute top-6 right-6 z-20 text-sm text-white/60" role="status">
            Loading the 3D scene
          </p>
        ) : null}
        {status === "failed" ? (
          <p className="absolute top-6 right-6 z-20 max-w-xs text-right text-sm text-white/70" role="status">
            The 3D scene couldn&apos;t load in this browser, so you&apos;re seeing a still. The story still plays as you scroll.
          </p>
        ) : null}
      </div>
    </section>
  );
}
