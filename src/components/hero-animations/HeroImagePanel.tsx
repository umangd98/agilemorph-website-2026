"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

/** Single hero tone — matches the image's darkest background areas. */
export const HERO_BG = {
  deep: "#060908",
  base: "#050706",
} as const;

export const HERO_SECTION_BG = HERO_BG.deep;

export const HERO_GRID_STYLE = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
  backgroundSize: "56px 56px",
} as const;

const CIRCUIT_PATHS = [
  "M 60 140 Q 140 90 220 110 T 380 130",
  "M 80 220 L 180 180 L 280 200 L 360 170",
  "M 100 280 Q 200 240 300 260 T 380 240",
] as const;

const NODES: { cx: number; cy: number; r?: number }[] = [
  { cx: 60, cy: 140 },
  { cx: 140, cy: 100 },
  { cx: 220, cy: 110 },
  { cx: 300, cy: 120 },
  { cx: 180, cy: 180 },
  { cx: 280, cy: 200 },
  { cx: 200, cy: 250 },
  { cx: 320, cy: 230 },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useParallaxEnabled() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return enabled;
}

type HeroImagePanelProps = {
  imageUrl: string;
  alt?: string;
  lqip?: string;
  visible: boolean;
};

export function HeroImagePanel({ imageUrl, alt = "", lqip, visible }: HeroImagePanelProps) {
  const reducedMotion = useReducedMotion();
  const parallaxEnabled = useParallaxEnabled();
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!parallaxEnabled || reducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setParallax({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 16,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 16,
      });
    },
    [parallaxEnabled, reducedMotion],
  );

  const motionClass = reducedMotion ? "" : "hero-image-drift";

  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden={!alt}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 1.4s ease 300ms",
        maskImage:
          "linear-gradient(to right, transparent 0%, transparent 28%, rgba(0,0,0,0.12) 38%, rgba(0,0,0,0.45) 46%, rgba(0,0,0,0.82) 54%, black 62%, black 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, transparent 28%, rgba(0,0,0,0.12) 38%, rgba(0,0,0,0.45) 46%, rgba(0,0,0,0.82) 54%, black 62%, black 100%)",
      }}
    >
      <div
        className="absolute inset-0 overflow-hidden lg:pointer-events-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setParallax({ x: 0, y: 0 })}
        style={{
          transform:
            parallaxEnabled && !reducedMotion
              ? `translate(${parallax.x * 0.5}px, ${parallax.y * 0.5}px)`
              : undefined,
          transition: "transform 0.2s ease-out",
        }}
      >
        <div className={`absolute inset-[-4%] ${motionClass}`}>
          <Image
            src={imageUrl}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_center] opacity-[0.88] saturate-[0.82] contrast-[1.02] brightness-[0.92]"
            placeholder={lqip ? "blur" : "empty"}
            blurDataURL={lqip}
          />
        </div>

        {/* Tech circuit overlay */}
        <svg
          viewBox="0 0 400 360"
          className="absolute inset-0 h-full w-full opacity-[0.28]"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="hero-circuit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {[100, 180, 260].map((y) => (
            <line
              key={`h-${y}`}
              x1="40"
              y1={y}
              x2="380"
              y2={y + 20}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.75"
            />
          ))}
          {[120, 220, 320].map((x) => (
            <line
              key={`v-${x}`}
              x1={x}
              y1="60"
              x2={x - 30}
              y2="320"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.75"
            />
          ))}

          {CIRCUIT_PATHS.map((d, i) => (
            <path
              key={d}
              d={d}
              fill="none"
              stroke="url(#hero-circuit-grad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              className={reducedMotion ? undefined : "hero-circuit-path"}
              style={{ animationDelay: `${i * 0.6}s` }}
            />
          ))}

          {NODES.map(({ cx, cy, r = 3.5 }) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#22c55e" opacity={0.6} />
          ))}

          {!reducedMotion &&
            [0, 1.2, 2.4].map((delay) => (
              <circle
                key={delay}
                r={3}
                fill="#06b6d4"
                className="hero-packet"
                style={{
                  offsetPath: `path('${CIRCUIT_PATHS[0]}')`,
                  animationDelay: `${delay}s`,
                }}
              />
            ))}
        </svg>

        {!reducedMotion && (
          <div
            className="hero-image-scan pointer-events-none absolute inset-x-[20%] top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent"
            aria-hidden="true"
          />
        )}

        {/* Pull image luminosity toward section bg */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{ background: `${HERO_BG.deep}4d` }}
        />

        {/* Top/bottom vignette only — no left color strip */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom, ${HERO_BG.deep} 0%, transparent 12%, transparent 88%, ${HERO_BG.base} 100%)
            `,
          }}
        />

        <div
          className={`absolute inset-0 ${reducedMotion ? "" : "hero-image-glow"}`}
          style={{
            background:
              "radial-gradient(ellipse 75% 65% at 72% 42%, rgba(34,197,94,0.06) 0%, transparent 72%)",
          }}
        />
      </div>
    </div>
  );
}
