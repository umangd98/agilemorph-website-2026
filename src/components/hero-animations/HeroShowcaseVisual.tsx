"use client";

import { useEffect, useId, useState } from "react";

import { useTheme } from "@/components/ThemeProvider";
import {
  CHEVRON_ARMS,
  CHEVRON_CLIP_TRANSFORM,
  CHEVRON_INTERIOR_CLIP,
  CHEVRON_NODES,
  CHEVRON_ROWS,
} from "@/components/hero-animations/hero-chevron-paths";

const AMBIENT_PARTICLES = [
  { cx: 72, cy: 88, r: 1.5, delay: 0 },
  { cx: 514, cy: 120, r: 2, delay: 0.4 },
  { cx: 140, cy: 420, r: 1.2, delay: 0.8 },
  { cx: 460, cy: 460, r: 1.8, delay: 1.2 },
  { cx: 293, cy: 280, r: 1, delay: 0.6 },
] as const;

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

type HeroShowcaseVisualProps = {
  imageUrl?: string | null;
  alt?: string;
  visible?: boolean;
};

export function HeroShowcaseVisual({
  imageUrl,
  alt = "Team collaborating with AI-powered digital tools, framed by an animated upward chevron",
  visible = true,
}: HeroShowcaseVisualProps) {
  const uid = useId().replace(/:/g, "");
  const { resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const isDark = resolvedTheme === "dark";
  const shouldAnimate = visible && !reducedMotion;

  const clipId = `${uid}-chevron-clip`;
  const strokeGradId = `${uid}-stroke`;
  const fillGradId = `${uid}-fill`;
  const holoGradId = `${uid}-holo`;
  const glowFilterId = `${uid}-glow-filter`;
  const edgeVignetteId = `${uid}-vignette-edge`;
  const topVignetteId = `${uid}-vignette-top`;

  const edgeVignetteOpacity = isDark ? 0.32 : 0.08;
  const topVignetteOpacity = isDark ? 0.18 : 0.04;

  return (
    <div
      className={`relative ml-auto aspect-square w-full max-w-[min(100%,520px)] lg:max-w-none lg:w-[118%] lg:max-w-[720px] xl:max-w-[820px] 2xl:max-w-[900px] ${
        shouldAnimate ? "hero-showcase-in" : visible ? "opacity-100" : "opacity-0"
      }`}
      role="img"
      aria-label={alt}
    >
      {shouldAnimate ? (
        <>
          <div
            className="hero-showcase-orb-a pointer-events-none absolute -left-10 top-1/4 h-40 w-40 rounded-full"
            aria-hidden
          />
          <div
            className="hero-showcase-orb-b pointer-events-none absolute -right-10 bottom-1/4 h-48 w-48 rounded-full"
            aria-hidden
          />
        </>
      ) : null}

      <div className={`relative h-full ${shouldAnimate ? "hero-chevron-float" : ""}`}>
          <svg
            viewBox="0 0 586 584"
            className="h-full w-full"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id={clipId}>
                <path d={CHEVRON_INTERIOR_CLIP} transform={CHEVRON_CLIP_TRANSFORM} />
              </clipPath>

              <linearGradient id={strokeGradId} x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>

              <linearGradient id={fillGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0A9D86" stopOpacity="0.12" />
                <stop offset="50%" stopColor="#5FD06A" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.05" />
              </linearGradient>

              <linearGradient id={holoGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
                <stop offset="45%" stopColor="#4ade80" stopOpacity="0.28" />
                <stop offset="55%" stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>

              <radialGradient id={edgeVignetteId} cx="50%" cy="42%" r="68%">
                <stop offset="30%" stopColor="var(--color-background)" stopOpacity="0" />
                <stop
                  offset="100%"
                  stopColor="var(--color-background)"
                  stopOpacity={edgeVignetteOpacity}
                />
              </radialGradient>

              <linearGradient id={topVignetteId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-background)"
                  stopOpacity={topVignetteOpacity}
                />
                <stop offset="40%" stopColor="var(--color-background)" stopOpacity="0" />
              </linearGradient>

              <filter id={glowFilterId} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Sanity cover image inside chevron clip */}
            {imageUrl ? (
              <g clipPath={`url(#${clipId})`}>
                <foreignObject
                  x="0"
                  y="0"
                  width="586"
                  height="584"
                  xmlns="http://www.w3.org/1999/xhtml"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt=""
                    className={`h-full w-full object-cover object-center ${shouldAnimate ? "hero-showcase-photo-static" : ""}`}
                    style={{ display: "block", width: "100%", height: "100%" }}
                  />
                </foreignObject>
                <rect width="586" height="584" fill={`url(#${fillGradId})`} opacity={isDark ? 0.06 : 0.05} />
                <rect width="586" height="584" fill={`url(#${edgeVignetteId})`} />
                <rect width="586" height="584" fill={`url(#${topVignetteId})`} />
                {shouldAnimate ? (
                  <rect
                    width="586"
                    height="584"
                    fill={`url(#${holoGradId})`}
                    className="hero-holo-sweep"
                  />
                ) : null}
                {shouldAnimate ? (
                  <rect
                    width="586"
                    height="584"
                    fill="#4ade80"
                    opacity="0.05"
                    className="hero-showcase-scan"
                  />
                ) : null}
              </g>
            ) : (
              <g clipPath={`url(#${clipId})`}>
                <rect width="586" height="584" fill={`url(#${fillGradId})`} />
              </g>
            )}

            {shouldAnimate
              ? AMBIENT_PARTICLES.map(({ cx, cy, r, delay }) => (
                  <circle
                    key={`${cx}-${cy}`}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="#4ade80"
                    className="hero-showcase-particle"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))
              : null}

            {/* Chevron rows rise in from bottom, top row first */}
            {CHEVRON_ROWS.map((row) => (
              <g
                key={row.id}
                className={shouldAnimate ? "hero-chevron-row" : undefined}
                style={shouldAnimate ? { animationDelay: `${row.delay}s` } : undefined}
              >
                {row.armIndices.map((armIndex) => {
                  const arm = CHEVRON_ARMS[armIndex];
                  const strokeWidth = 2.5;
                  return (
                    <g key={arm.d}>
                      {shouldAnimate ? (
                        <path
                          d={arm.d}
                          fill="none"
                          stroke={`url(#${strokeGradId})`}
                          strokeWidth={strokeWidth + 6}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.2"
                          filter={`url(#${glowFilterId})`}
                          className="hero-chevron-glow"
                          style={{ animationDelay: `${row.delay + 0.15}s` }}
                        />
                      ) : null}
                      <path
                        d={arm.d}
                        fill="none"
                        stroke={`url(#${strokeGradId})`}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={shouldAnimate ? "hero-chevron-segment" : undefined}
                        style={
                          shouldAnimate
                            ? {
                                animationDelay: `${row.delay + 0.1}s, ${row.delay + 1.5}s`,
                              }
                            : undefined
                        }
                      />
                      {shouldAnimate ? (
                        <path
                          d={arm.d}
                          fill="none"
                          stroke={`url(#${strokeGradId})`}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.45"
                          className="hero-stroke-energy"
                          style={{ animationDelay: `${row.delay + 1.4}s` }}
                        />
                      ) : null}
                    </g>
                  );
                })}
              </g>
            ))}

            {CHEVRON_NODES.map((node, index) => {
              const nodeRadius = 2.5;
              return (
              <g key={`${node.cx}-${node.cy}`}>
                {shouldAnimate ? (
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={nodeRadius + 4}
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="1"
                    opacity="0.35"
                    className="hero-chevron-node-ring"
                    style={{ animationDelay: `${0.55 + index * 0.1}s` }}
                  />
                ) : null}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={nodeRadius}
                  fill="#4ade80"
                  className={shouldAnimate ? "hero-chevron-node" : undefined}
                  style={
                    shouldAnimate ? { animationDelay: `${0.45 + index * 0.08}s` } : undefined
                  }
                />
              </g>
            );})}
          </svg>
      </div>
    </div>
  );
}
