"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import type { EngineHandle } from "./engine3d";

/**
 * The film's opening turn beside the same engine drawn live in three.js, both
 * driven by one clock so they stop on the same team at the same moment.
 */

const TEAMS = ["Operations", "Finance", "Customer support", "Sales", "Marketing", "People and HR"];
const HOLD = 1.6, TURN = 0.9;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Loop position in film frames (60 per turn, 6 degrees each, starting at 8 degrees). */
function loopPos(clock: number) {
  const k = Math.floor(clock / (HOLD + TURN)), u = clock - k * (HOLD + TURN);
  return (10 * (k + 1) - 1 + 10 * ease(clamp01((u - HOLD) / TURN))) % 60;
}

export function EngineCompare() {
  const filmRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef<HTMLCanvasElement>(null);
  // Phones get the phone film and the phone camera; decided once, on the client
  const mobile = useSyncExternalStore(
    () => () => {},
    () => window.matchMedia("(max-width: 767px)").matches,
    () => null,
  );
  const [team, setTeam] = useState("");
  const [fps, setFps] = useState(0);
  const [live, setLive] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    if (mobile === null) return;
    const film = filmRef.current, liveCanvas = liveRef.current;
    if (!film || !liveCanvas) return;
    const variant = mobile ? "mobile" : "desktop";
    const frames: HTMLImageElement[] = [];
    for (let i = 0; i < 60; i++) {
      const img = new Image();
      img.src = `/deconstruction-v3/${variant}-loop/${String(i).padStart(4, "0")}.webp`;
      frames[i] = img;
    }
    const ctx = film.getContext("2d")!;
    let handle: EngineHandle | null = null, raf = 0, disposed = false;
    import("./engine3d")
      .then(({ createEngine }) => createEngine(liveCanvas, mobile))
      .then((h) => { if (disposed) h.dispose(); else { handle = h; setLive("ready"); } })
      .catch(() => setLive("failed"));

    const sizeFilm = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      film.width = Math.round(film.clientWidth * dpr);
      film.height = Math.round(film.clientHeight * dpr);
    };
    sizeFilm();
    const onResize = () => { sizeFilm(); handle?.resize(); };
    window.addEventListener("resize", onResize);

    const draw = (img: HTMLImageElement, alpha: number) => {
      if (!img.complete || !img.naturalWidth) return;
      const s = Math.max(film.width / img.naturalWidth, film.height / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (film.width - w) / 2, (film.height - h) / 2, w, h);
    };

    const start = performance.now();
    let count = 0, since = start, lastTeam = -1;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const pos = loopPos((now - start) / 1000);
      const a = Math.floor(pos), frac = pos - a;
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgb(5,6,7)";
      ctx.fillRect(0, 0, film.width, film.height);
      draw(frames[a]!, 1);
      if (frac > 0.001) draw(frames[(a + 1) % 60]!, frac);
      const spin = 8 + 6 * pos;
      handle?.setSpin(spin);
      const front = ((Math.round((240 - spin) / 60) % 6) + 6) % 6;
      if (front !== lastTeam) { lastTeam = front; setTeam(TEAMS[front]!); }
      count++;
      if (now - since > 1000) { setFps(Math.round((count * 1000) / (now - since))); count = 0; since = now; }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      handle?.dispose();
    };
  }, [mobile]);

  const aspect = mobile ? "aspect-[4/5]" : "aspect-video";
  return (
    <section className="bg-[#050607] px-4 pt-28 pb-20 text-white sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">Film or live 3D?</h1>
        <p className="mt-4 max-w-2xl text-white/70">
          The same opening turn two ways, kept in step. {mobile ? "On top" : "On the left"}, frames rendered in Blender. {mobile ? "Below" : "On the right"}, the same model drawn live in your browser.
        </p>
        <p className="mt-6 flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-[#2fd06a]" />
          <span className="font-semibold">{team}</span>
          <span className="text-white/50">at the front</span>
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <figure>
            <canvas ref={filmRef} className={`w-full rounded-xl ${aspect}`} />
            <figcaption className="mt-3 text-sm text-white/60">
              <span className="font-semibold text-white">Rendered film.</span> What the page uses today. About {mobile ? "2.0" : "2.3"} MB for this turn, and about 9 MB for the whole page.
            </figcaption>
          </figure>
          <figure>
            <div className="relative">
              <canvas ref={liveRef} className={`w-full rounded-xl ${aspect}`} />
              {live !== "ready" && (
                <p className="absolute inset-0 grid place-items-center text-sm text-white/60">
                  {live === "loading" ? "Loading the 3D model" : "This browser couldn't start WebGL"}
                </p>
              )}
            </div>
            <figcaption className="mt-3 text-sm text-white/60">
              <span className="font-semibold text-white">Live three.js.</span> About 1.8 MB for the model, and it would stay about that for the whole page. Running at {fps} frames a second here.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
