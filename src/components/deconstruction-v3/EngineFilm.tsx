"use client";

import "lenis/dist/lenis.css";

import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { BEATS, blueprintAt, clamp01, ease, FILM_END, LOOP, loopIndex, ringAt, seg } from "./story";

/*
 * The department engine, rendered in Blender as a film (3d/deconstruction/film.py)
 * and played by scroll: each scroll position shows one frame. Desktop and phones
 * get their own framing. The blueprint is a second, line-drawn film that fades in
 * over the middle. Once the camera is overhead, the engine's rim becomes a live
 * ring with the Ship, Adopt and Iterate demos inside it.
 */

type Anchor = { layers: number[][]; left?: number[][]; hollow: number[]; core: number[]; centre: number[]; rim: number };
type Manifest = { frames: number; loop?: number; res: [number, number]; blue: number[]; anchors: Record<string, Anchor> };

/** The engine's teams in the order of its wedges, and what each one handles. */
const WEDGES = [
  ["Operations", "Orders, inventory, field updates"],
  ["Finance", "Invoices, payments, month-end"],
  ["Customer support", "Tickets, calls, refunds"],
  ["Sales", "Leads, deals, follow-ups"],
  ["Marketing", "Campaigns, content, enquiries"],
  ["People and HR", "Hiring, onboarding, policies"],
] as const;
/** The opening turn: frames in the loop, played at this rate, starting where the film starts. */
/** The opening turn stops on each team, then clicks round to the next, like a dial. */
const LOOP_SPIN0 = 8;
const LOOP_HOLD = 1.6;
const LOOP_TURN = 0.9;
/** Phones: which side of the blueprint each callout sits on, and a nudge so neighbours don't collide. */
const MOBILE_SIDE: Array<["left" | "right", number]> = [["right", 30], ["left", 0], ["right", 0], ["left", 0], ["right", -12], ["left", 46]];

const LAYER_LABELS = [
  ["Systems of record", "CRM, ERP, helpdesk"],
  ["Data", "Records, documents"],
  ["Tools", "CRM, inbox, sheets"],
  ["People", "Who does the work"],
  ["Six teams", "One per department"],
] as const;

const TEAMS = ["Sales", "Finance", "Support", "Operations", "Marketing", "People"];

function useLoader(base: string, count: number, only?: number[]) {
  const imgs = useRef<Array<HTMLImageElement | null>>([]);
  useEffect(() => {
    if (!count) return;
    imgs.current = new Array(count).fill(null);
    const wanted = only ?? Array.from({ length: count }, (_, i) => i);
    // Coarse to fine, so the whole story is scrubbable early and sharpens as it loads
    const order: number[] = [];
    for (const step of [16, 8, 4, 2, 1]) for (const i of wanted) if (i % step === 0 && !order.includes(i)) order.push(i);
    for (const i of wanted) if (!order.includes(i)) order.push(i);
    let cancelled = false;
    let next = 0;
    const pump = () => {
      if (cancelled || next >= order.length) return;
      const i = order[next++]!;
      const img = new Image();
      img.decoding = "async";
      img.src = `${base}/${String(i).padStart(4, "0")}.webp`;
      img.onload = () => { if (!cancelled) imgs.current[i] = img; pump(); };
      img.onerror = () => pump();
    };
    for (let k = 0; k < 6; k++) pump();
    return () => { cancelled = true; };
  }, [base, count, only]);
  return imgs;
}

function nearest(imgs: Array<HTMLImageElement | null>, i: number) {
  for (let d = 0; d < imgs.length; d++) {
    const a = imgs[i - d];
    if (a) return a;
    const b = imgs[i + d];
    if (b) return b;
  }
  return null;
}

/** `embedded` is for pages that already have their own h1, such as the homepage. */
export function EngineFilm({ embedded = false }: { embedded?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLCanvasElement>(null);
  const blueRef = useRef<HTMLCanvasElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const calloutRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ringRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<Array<HTMLDivElement | null>>([]);
  const demoRefs = useRef<Array<HTMLDivElement | null>>([]);
  const arcRefs = useRef<Array<SVGPathElement | null>>([]);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);
  const iterRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [variant, setVariant] = useState<"desktop" | "mobile" | null>(null);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [loop, setLoop] = useState(-1);
  const [light, setLight] = useState(false);

  useEffect(() => {
    const v = window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
    let alive = true;
    fetch(`/deconstruction-v3/${v}.json`)
      .then((r) => r.json())
      .then((m: Manifest) => { if (alive) { setManifest(m); setVariant(v); } })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const film = useLoader(variant ? `/deconstruction-v3/${variant}` : "", manifest?.frames ?? 0);
  const blue = useLoader(variant ? `/deconstruction-v3/${variant}-blue` : "", manifest?.frames ?? 0, manifest?.blue);
  const loopFrames = useLoader(variant ? `/deconstruction-v3/${variant}-loop` : "", manifest?.loop ?? 0);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current, stage = stageRef.current, fc = filmRef.current, bc = blueRef.current;
    if (!section || !stage || !fc || !bc || !manifest || !variant) return;
    const mobile = variant === "mobile";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduced ? null : new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    const [FW, FH] = manifest.res;
    let W = 1, H = 1, pr = 1;
    let fit = { s: 1, x: 0, y: 0 };
    let lastDrawn = "";
    let lastLoop = -2;
    let lastLight = false;
    let lastR = -1;
    let raf = 0;

    const resize = () => {
      W = stage.clientWidth; H = stage.clientHeight; pr = Math.min(window.devicePixelRatio || 1, 2);
      for (const c of [fc, bc]) { c.width = Math.round(W * pr); c.height = Math.round(H * pr); }
      if (mobile) {
        // Phones: the frame fills the width at the top; the copy sits underneath
        let s = W / FW;
        if (FH * s > H * 0.66) s = (H * 0.66) / FH;
        fit = { s, x: (W - FW * s) / 2, y: 0 };
      } else {
        // Desktop: never taller than 75% of the stage, so wide screens don't blow the engine up;
        // shifted right so the copy has the left, with the frame's edges feathered into the stage
        const s = Math.min(Math.max(W / FW, H / FH), (H / FH) * 0.75);
        fit = { s, x: (W - FW * s) / 2 + W * 0.14, y: (H - FH * s) / 2 };
      }
      lastDrawn = "";
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    const toScreen = (pt: number[]): [number, number] => [fit.x + (pt[0] ?? 0) * fit.s, fit.y + (pt[1] ?? 0) * fit.s];

    const edgeColour = (img: HTMLImageElement) => {
      const probe = document.createElement("canvas");
      probe.width = probe.height = 1;
      const pg = probe.getContext("2d");
      if (!pg) return "#050607";
      pg.drawImage(img, 2, FH / 2, 1, 1, 0, 0, 1, 1);
      const [r, g, b] = pg.getImageData(0, 0, 1, 1).data;
      return `rgb(${r},${g},${b})`;
    };
    let paperColour = "";
    // Fade to the same colour at zero alpha; fading to transparent black would leave a grey band
    const clear = (bg: string) => (bg.startsWith("rgb(") ? bg.replace("rgb(", "rgba(").replace(")", ",0)") : "rgba(5,6,7,0)");
    paperColour = "";
    /** Draw frames (with their opacity) over the stage colour, then feather the edges so no seam shows. */
    const paint = (c: HTMLCanvasElement, layers: Array<[HTMLImageElement, number]>, bg: string, f = fit) => {
      const g = c.getContext("2d");
      if (!g) return;
      g.setTransform(pr, 0, 0, pr, 0, 0);
      g.fillStyle = bg;
      g.fillRect(0, 0, W, H);
      const dw = FW * f.s, dh = FH * f.s;
      for (const [img, alpha] of layers) {
        if (alpha <= 0.001) continue;
        g.globalAlpha = Math.min(1, alpha);
        g.drawImage(img, f.x, f.y, dw, dh);
      }
      g.globalAlpha = 1;
      if (f.x > 0) {
        const lg = g.createLinearGradient(f.x, 0, f.x + 90, 0);
        lg.addColorStop(0, bg); lg.addColorStop(1, clear(bg));
        g.fillStyle = lg; g.fillRect(f.x, 0, 90, H);
      }
      if (!mobile) {
        // The frame no longer always covers the stage: fade its other edges too
        const fx = Math.min(W, f.x + dw), fy0 = Math.max(0, f.y), fy1 = Math.min(H, f.y + dh);
        if (f.x + dw < W) {
          const rg = g.createLinearGradient(fx - 90, 0, fx, 0);
          rg.addColorStop(0, clear(bg)); rg.addColorStop(1, bg);
          g.fillStyle = rg; g.fillRect(fx - 90, 0, W - fx + 90, H);
        }
        if (f.y > 0) {
          const tg = g.createLinearGradient(0, fy0, 0, fy0 + 90);
          tg.addColorStop(0, bg); tg.addColorStop(1, clear(bg));
          g.fillStyle = tg; g.fillRect(0, 0, W, fy0 + 90);
        }
        if (f.y + dh < H) {
          const bgr = g.createLinearGradient(0, fy1 - 90, 0, fy1);
          bgr.addColorStop(0, clear(bg)); bgr.addColorStop(1, bg);
          g.fillStyle = bgr; g.fillRect(0, fy1 - 90, W, H - fy1 + 90);
        }
      }
      if (mobile && f.y + dh < H) {
        const bh = dh * 0.22, by = f.y + dh - bh;
        const bgd = g.createLinearGradient(0, by, 0, f.y + dh);
        bgd.addColorStop(0, clear(bg)); bgd.addColorStop(1, bg);
        g.fillStyle = bgd; g.fillRect(0, by, W, bh + 1);
      }
    };
    /** On phones the blueprint eases smaller as it fades in, leaving room for labels on both sides. */
    const blueFit = (bp: number) => {
      if (!mobile) return fit;
      const k = 1 - 0.16 * bp;
      return { s: fit.s * k, x: fit.x + (FW * fit.s * (1 - k)) / 2, y: fit.y + (FH * fit.s * (1 - k)) / 2 - 8 * bp };
    };
    let clock = 0, lastNow = performance.now(), lastFront = -1;

    const progress = () => {
      const rect = section.getBoundingClientRect();
      const pinTop = parseFloat(getComputedStyle(stage).top) || 0;
      const run = rect.height - stage.clientHeight;
      return run > 0 ? clamp01((pinTop - rect.top) / run) : 0;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      lenis?.raf(now);
      const p = progress();
      const t = clamp01(p / FILM_END);
      const idx = Math.round(t * (manifest.frames - 1));
      const anchor = manifest.anchors[String(idx)] ?? manifest.anchors[String(manifest.frames - 1)];

      // Film, with the opening turn playing over it until the visitor scrolls
      const dt = Math.min(0.05, (now - lastNow) / 1000); lastNow = now;
      if (!reduced) clock += dt;
      const bp = blueprintAt(p);
      const hero = 1 - seg(p, 0.035, 0.085);
      const N = manifest.loop ?? 0;
      const filmImg = nearest(film.current, idx);
      if (hero > 0.001 && N) {
        // Frames 9, 19, 29... face a team square on; hold there, then ease to the next
        const per = N / 6, cycle = LOOP_HOLD + LOOP_TURN;
        const k = Math.floor(clock / cycle), u = clock - k * cycle;
        const pos = (per * (k + 1) - 1 + per * ease(clamp01((u - LOOP_HOLD) / LOOP_TURN))) % N;
        const a0 = Math.floor(pos), frac = pos - a0;
        const la = loopFrames.current[a0] ?? nearest(loopFrames.current, a0);
        const lb = loopFrames.current[(a0 + 1) % N];
        const layers: Array<[HTMLImageElement, number]> = [];
        if (filmImg && hero < 0.999) layers.push([filmImg, 1]);
        if (la) layers.push([la, hero]);
        if (lb && la) layers.push([lb, hero * frac]);
        if (layers.length) { paint(fc, layers, "rgb(5,6,7)"); lastDrawn = ""; }
        // Name the team at the front
        const spin = LOOP_SPIN0 + (360 * pos) / N;
        const front = ((Math.round((240 - spin) / 60) % 6) + 6) % 6;
        if (front !== lastFront && captionRef.current) {
          lastFront = front;
          const [team, sub] = WEDGES[front]!;
          captionRef.current.innerHTML = `<span class="h-2 w-2 shrink-0 rounded-full bg-[#2fd06a]"></span><span class="font-semibold text-white">${team}</span><span class="text-white/60">${sub}</span>`;
        }
      } else if (filmImg) {
        const key = `f${idx}-${W}-${H}`;
        if (key !== lastDrawn) { lastDrawn = key; paint(fc, [[filmImg, 1]], "rgb(5,6,7)"); }
      }
      if (captionRef.current) captionRef.current.style.opacity = hero.toFixed(3);
      if (bp > 0.001) {
        const bimg = nearest(blue.current, idx);
        if (bimg) {
          if (!paperColour) {
            paperColour = edgeColour(bimg);
            if (paperRef.current) paperRef.current.style.backgroundColor = paperColour;
          }
          paint(bc, [[bimg, 1]], paperColour, blueFit(bp));
        }
      }
      bc.style.opacity = bp.toFixed(3);
      if (paperRef.current) paperRef.current.style.opacity = bp.toFixed(3);
      const isLight = bp > 0.5;
      if (isLight !== lastLight) { lastLight = isLight; setLight(isLight); }

      // Blueprint callouts: a tidy column on desktop, both sides on phones
      if (anchor) {
        const show = (bp > 0.6 ? clamp01((bp - 0.6) / 0.3) : 0).toFixed(3);
        const pts = [...anchor.layers, anchor.hollow];
        const place = (i: number, ax: number, ay: number, lx: number, ly: number, align: "left" | "right") => {
          const el = calloutRefs.current[i];
          if (!el) return;
          el.style.opacity = show;
          const lbl = el.querySelector<HTMLElement>("[data-lbl]");
          const w = lbl?.offsetWidth ?? 0;
          if (lbl) lbl.style.transform = `translate(${(align === "right" ? lx - w : lx).toFixed(1)}px, ${ly.toFixed(1)}px) translateY(-50%)`;
          const line = el.querySelector("svg line"), dot = el.querySelector("svg circle");
          if (dot) { dot.setAttribute("cx", ax.toFixed(1)); dot.setAttribute("cy", ay.toFixed(1)); }
          if (line) {
            line.setAttribute("x1", ax.toFixed(1)); line.setAttribute("y1", ay.toFixed(1));
            const x0 = align === "right" ? lx - w : lx;
            // Anchor under the label: meet its top or bottom edge instead of a side
            const under = ax >= x0 - 2 && ax <= x0 + w + 2;
            line.setAttribute("x2", (under ? ax : ax < x0 ? x0 - 6 : x0 + w + 6).toFixed(1));
            line.setAttribute("y2", (under ? ly + (ay < ly ? -11 : 11) : ly).toFixed(1));
          }
        };
        if (mobile) {
          const f = blueFit(bp);
          const conv = (pt: number[]): [number, number] => [f.x + (pt[0] ?? 0) * f.s, f.y + (pt[1] ?? 0) * f.s];
          MOBILE_SIDE.forEach(([side, dy], i) => {
            const src = i < 5 ? (side === "left" ? anchor.left?.[i] ?? anchor.layers[i]! : anchor.layers[i]!) : anchor.hollow;
            const [ax, ay] = conv(src);
            place(i, ax, ay, side === "right" ? W - 12 : 12, ay + dy, side);
          });
        } else {
          const order = pts.map((pt, i) => ({ i, y: toScreen(pt)[1] })).sort((a, b) => a.y - b.y);
          const colX = Math.min(W - 230, toScreen([FW * 0.78, 0])[0]);
          const step = (H * 0.64) / 5;
          order.forEach((o, rank) => {
            const [ax, ay] = toScreen(pts[o.i]!);
            place(o.i, ax, ay, colX, H * 0.18 + rank * step, "left");
          });
        }
      }

      // The process ring, centred on the engine once the camera is overhead
      const ring = ringRef.current;
      const r = ringAt(p);
      if (ring && anchor) {
        const last = manifest.anchors[String(manifest.frames - 1)] ?? anchor;
        const [cx, cy] = toScreen(last.centre);
        const R = last.rim * fit.s;
        ring.style.opacity = r.toFixed(3);
        ring.style.visibility = r < 0.01 ? "hidden" : "visible";
        ring.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px)`;
        ring.style.setProperty("--R", `${R.toFixed(1)}px`);
        if (Math.abs(R - lastR) > 0.5) {
          lastR = R;
          const RA = R * 1.1;
          arcRefs.current.forEach((a) => {
            if (!a) return;
            const a0 = Number(a.dataset.a0), a1 = Number(a.dataset.a1);
            a.setAttribute("d", `M ${Math.cos(a0) * RA} ${Math.sin(a0) * RA} A ${RA} ${RA} 0 0 1 ${Math.cos(a1) * RA} ${Math.sin(a1) * RA}`);
            const label = a.nextElementSibling as SVGTextElement | null;
            if (label) {
              const am = Number(label.dataset.am);
              label.setAttribute("x", (Math.cos(am) * (RA + (mobile ? 18 : 24))).toFixed(1));
              label.setAttribute("y", (Math.sin(am) * (RA + (mobile ? 18 : 24))).toFixed(1));
            }
          });
        }
        const li = loopIndex(p);
        arcRefs.current.forEach((a, i) => {
          if (!a) return;
          const done = i < li || (li === 0 && p > 0.95);
          a.style.stroke = i === li ? "#2fd06a" : done ? "#1e6e3e" : "#3a424b";
          a.style.strokeWidth = i === li ? "7" : "4";
        });
        // Demos: Ship .70-.80, Adopt .80-.90, Iterate .90-1
        const windows: Array<[number, number]> = [[0.7, 0.8], [0.8, 0.9], [0.9, 1.01]];
        windows.forEach(([a, b], k) => {
          const el = demoRefs.current[k];
          if (!el) return;
          const op = seg(p, a - 0.015, a + 0.01) * (1 - seg(p, b - 0.01, b + 0.005)) * r;
          el.style.opacity = op.toFixed(3);
          el.style.visibility = op < 0.01 ? "hidden" : "visible";
        });
        const ship = clamp01((p - 0.705) / 0.08);
        stepRefs.current.forEach((s, k) => { if (s) s.dataset.on = String(ship > (k + 0.4) / 4); });
        const adopt = clamp01((p - 0.805) / 0.085);
        dotRefs.current.forEach((d, n) => {
          if (!d) return;
          const team = Math.floor(n / 10), k = n % 10;
          let fill = clamp01(adopt * 1.4 - team * 0.07) * 10;
          const nudge = team === 4 && adopt > 0.35 && adopt < 0.75;
          if (team === 4) fill = adopt < 0.35 ? fill : adopt < 0.75 ? Math.min(fill, 4) : fill;
          d.dataset.state = k < fill ? (nudge && k >= 2 && k < 4 ? "nudge" : "on") : "off";
        });
        const iter = clamp01((p - 0.905) / 0.08);
        iterRefs.current.forEach((s, k) => { if (s) s.dataset.on = String(iter > k * 0.3); });
      }

      // Copy
      const wide = !mobile;
      BEATS.forEach((beat, i) => {
        const el = copyRefs.current[i];
        if (!el) return;
        const next = BEATS[i + 1]?.at ?? 1.05;
        const local = (p - beat.at) / (next - beat.at);
        const op = i === 0 ? 1 - seg(local, 0.8, 0.97) : seg(local, 0.02, 0.14) * (1 - seg(local, 0.84, 0.98));
        const drift = (0.5 - clamp01(local)) * (wide ? 56 : 20);
        el.style.opacity = op.toFixed(3);
        el.style.visibility = op < 0.01 ? "hidden" : "visible";
        el.style.transform = `translateY(calc(${wide ? "-50%" : "0px"} + ${drift.toFixed(1)}px))`;
      });
      const li = loopIndex(p);
      if (li !== lastLoop) { lastLoop = li; setLoop(li); }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      lenis?.destroy();
    };
  }, [manifest, variant, film, blue, loopFrames]);

  const mobile = variant === "mobile";

  return (
    <section ref={sectionRef} aria-label="How we take a business apart and build AI into it" className="relative h-[900vh] bg-[#050607]">
      <div
        ref={stageRef}
        data-tone={light ? "light" : "dark"}
        className="group/tone sticky top-16 h-[calc(100svh-4rem)] overflow-hidden bg-[#050607] text-white"
      >
        <div ref={paperRef} className="absolute inset-0 bg-[#e9eae4] opacity-0" aria-hidden />
        <canvas ref={filmRef} className="absolute inset-0 h-full w-full" aria-hidden />
        <canvas ref={blueRef} className="absolute inset-0 h-full w-full opacity-0" aria-hidden />

        {/* Shade behind the copy */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-500",
            mobile ? "bg-[linear-gradient(to_top,rgba(5,6,7,.96)_0,rgba(5,6,7,.85)_30%,transparent_42%)]" : "bg-[linear-gradient(90deg,rgba(5,6,7,.9)_0,rgba(5,6,7,.55)_28%,transparent_48%)]",
            light ? "opacity-0" : "opacity-100",
          )}
          aria-hidden
        />

        {/* Blueprint callouts */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {[...LAYER_LABELS, ["Where AI fits", "The empty centre"] as const].map(([title, sub], i) => (
            <div key={title} ref={(n) => { calloutRefs.current[i] = n; }} className="absolute inset-0 opacity-0">
              <svg className="absolute inset-0 h-full w-full overflow-visible">
                <line stroke={i === 5 ? "#157f3d" : "#7a8088"} strokeWidth="1" />
                <circle r="3" fill={i === 5 ? "#157f3d" : "#22262b"} />
              </svg>
              <div data-lbl className={cn("absolute top-0 left-0 leading-tight", mobile ? "rounded-md bg-[#e9eae4] px-1.5 py-0.5" : "")}>
                <p className={cn("font-display font-semibold", mobile ? "text-[13px]" : "text-[17px]", i === 5 ? "text-[#157f3d]" : "text-[#22262b]")}>{title}</p>
                {mobile ? null : <p className="text-[13px] text-[#646a71]">{sub}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* The process ring with live demos */}
        <div ref={ringRef} className="pointer-events-none absolute top-0 left-0 opacity-0" style={{ visibility: "hidden" }} aria-hidden>
          {/* Quiet the floor dial so the process ring reads on its own */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_closest-side,rgba(5,6,7,0)_55%,rgba(5,6,7,.97)_58.5%,rgba(5,6,7,.97)_76%,rgba(5,6,7,0)_81%)]" style={{ width: "calc(var(--R) * 3.4)", height: "calc(var(--R) * 3.4)" }} />
          <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(6,8,10,.94)_0,rgba(6,8,10,.9)_70%,rgba(6,8,10,0)_72%)]" style={{ width: "calc(var(--R) * 2.02)", height: "calc(var(--R) * 2.02)" }} />
          <svg className="absolute overflow-visible" style={{ left: 0, top: 0 }} width="1" height="1">
            {LOOP.map((name, i) => {
              const a0 = (-90 + i * 72 + 3) * (Math.PI / 180), a1 = (-90 + (i + 1) * 72 - 3) * (Math.PI / 180);
              const am = (a0 + a1) / 2;
              return (
                <g key={name}>
                  <path ref={(n) => { arcRefs.current[i] = n; }} fill="none" strokeLinecap="round" data-a0={a0} data-a1={a1} />
                  <text data-am={am} className="fill-white/70 text-[12px] font-medium" textAnchor="middle" dominantBaseline="middle">{name}</text>
                </g>
              );
            })}
          </svg>

          {/* Ship */}
          <div ref={(n) => { demoRefs.current[0] = n; }} className="absolute w-[min(19rem,calc(var(--R)*1.45))] -translate-x-1/2 -translate-y-1/2 opacity-0">
            <p className="text-center font-display text-sm font-semibold text-white sm:text-lg">Live with Sales</p>
            <ol className="mt-3 flex flex-col gap-1.5 text-[11px] sm:mt-4 sm:gap-2 sm:text-sm">
              {["Connected to the CRM", "Checks and audit log on", "A person approves anything unsure", "Sales team live"].map((s, k) => (
                <li key={s} ref={(n) => { stepRefs.current[k] = n; }} data-on="false" className="group/step flex items-center gap-2 text-white/40 transition-colors duration-300 data-[on=true]:text-white">
                  <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full ring-1 ring-white/25 transition-colors duration-300 group-data-[on=true]/step:bg-[#2fd06a] group-data-[on=true]/step:ring-[#2fd06a] sm:h-5 sm:w-5">
                    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 opacity-0 transition-opacity group-data-[on=true]/step:opacity-100" aria-hidden><path d="M2.5 6.2l2.2 2.2L9.5 3.6" fill="none" stroke="#08130c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          {/* Adopt */}
          <div ref={(n) => { demoRefs.current[1] = n; }} className="absolute w-[min(20rem,calc(var(--R)*1.5))] -translate-x-1/2 -translate-y-1/2 opacity-0">
            <p className="text-center font-display text-sm font-semibold text-white sm:text-lg">Adoption this week</p>
            <div className="mt-3 grid gap-1.5 sm:mt-4 sm:gap-2">
              {TEAMS.map((team, ti) => (
                <div key={team} className="grid grid-cols-[4.2rem_1fr] items-center gap-2 sm:grid-cols-[5.5rem_1fr]">
                  <span className="text-right text-[10px] text-white/55 sm:text-xs">{team}</span>
                  <span className="flex gap-[3px] sm:gap-1">
                    {Array.from({ length: 10 }, (_, k) => (
                      <span
                        key={k}
                        ref={(n) => { dotRefs.current[ti * 10 + k] = n; }}
                        data-state="off"
                        className="h-2 w-2 rounded-full bg-[#2a3038] transition-colors duration-300 data-[state=nudge]:bg-[#e0a24a] data-[state=on]:bg-[#2fd06a] sm:h-2.5 sm:w-2.5"
                      />
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Iterate */}
          <div ref={(n) => { demoRefs.current[2] = n; }} className="absolute flex w-[min(18rem,calc(var(--R)*1.4))] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center opacity-0 sm:gap-3">
            {[
              ["“Can it draft the replies too?”", "bg-[#1b2027] text-white ring-1 ring-white/15"],
              ["Shipped: reply drafts", "bg-[#9dffc4] text-[#08130c]"],
              ["Next: the same loop for Finance", "bg-[#e0a24a] text-[#1a1206]"],
            ].map(([text, cls], k) => (
              <div
                key={text}
                ref={(n) => { iterRefs.current[k] = n; }}
                data-on="false"
                className={cn("translate-y-2 rounded-full px-3 py-1.5 text-[11px] font-semibold opacity-0 transition-all duration-500 data-[on=true]:translate-y-0 data-[on=true]:opacity-100 sm:text-sm", cls)}
              >
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Copy */}
        <div className="pointer-events-none absolute inset-0">
          {BEATS.map((beat, i) => (
            <div
              key={beat.title}
              ref={(n) => { copyRefs.current[i] = n; }}
              className="absolute top-1/2 left-[max(1.5rem,calc((100vw-80rem)/2+2rem))] w-[min(30rem,36vw)] will-change-transform max-md:top-auto max-md:bottom-20 max-md:left-0 max-md:w-full max-md:px-5"
              style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
            >
              {beat.loop ? <p className="mb-2 text-sm font-medium text-[#5cd68b] group-data-[tone=light]/tone:text-green-deep sm:mb-3">{beat.loop}</p> : null}
              {i === 0 && !embedded ? (
                <h1 className="font-display text-[clamp(2rem,4.4vw,3.8rem)] leading-[1.02] font-semibold tracking-[-0.035em] group-data-[tone=light]/tone:text-ink">{beat.title}</h1>
              ) : (
                <h2 className="font-display text-[clamp(1.7rem,3.4vw,3rem)] leading-[1.04] font-semibold tracking-[-0.03em] group-data-[tone=light]/tone:text-ink">{beat.title}</h2>
              )}
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/72 group-data-[tone=light]/tone:text-ink-muted sm:mt-4 sm:text-lg">{beat.body}</p>
              {i === 0 ? (
                <>
                  <p ref={captionRef} className="mt-5 inline-flex max-w-full items-center gap-2 rounded-pill bg-black/55 px-3.5 py-2 text-[13px] ring-1 ring-white/12 sm:mt-6 sm:text-sm" aria-live="off" />
                  <p className="mt-4 text-sm text-white/45">Scroll to take it apart</p>
                </>
              ) : null}
            </div>
          ))}
        </div>

        {/* Where we are in the loop */}
        <ol className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5 text-xs font-medium sm:bottom-6 sm:gap-2 sm:text-sm" aria-label="Where we are in the loop">
          {LOOP.map((name, i) => (
            <li
              key={name}
              aria-current={loop === i ? "step" : undefined}
              className={cn(
                "rounded-pill px-2.5 py-1 ring-1 transition-colors duration-300 sm:px-3 sm:py-1.5",
                loop === i
                  ? "bg-green text-white ring-green"
                  : light
                    ? "bg-white/70 text-ink-muted ring-ink/15"
                    : "bg-black/50 text-white/70 ring-white/20",
              )}
            >
              {name}
            </li>
          ))}
        </ol>

        {!manifest ? <p className="absolute top-6 right-6 text-sm text-white/50" role="status">Loading</p> : null}
      </div>
    </section>
  );
}
