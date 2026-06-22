"use client";

import { useCallback, useEffect, useId, useState } from "react";

import {
  CHEVRON_ARMS,
  CHEVRON_CLIP_TRANSFORM,
  CHEVRON_FRAME_FILL,
  CHEVRON_NODES,
  CHEVRON_PULSE_PATHS,
} from "@/components/hero-animations/hero-chevron-paths";

const AMBIENT_PARTICLES = [
  { cx: 72, cy: 88, r: 1.5, delay: 0 },
  { cx: 514, cy: 120, r: 2, delay: 0.4 },
  { cx: 140, cy: 420, r: 1.2, delay: 0.8 },
  { cx: 460, cy: 460, r: 1.8, delay: 1.2 },
  { cx: 293, cy: 280, r: 1, delay: 0.6 },
  { cx: 420, cy: 220, r: 1.4, delay: 1.5 },
  { cx: 180, cy: 180, r: 1.6, delay: 0.2 },
  { cx: 520, cy: 380, r: 1.1, delay: 1.8 },
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

type HeroShowcaseVisualProps = {
  imageUrl?: string | null;
  alt?: string;
  visible: boolean;
};

export function HeroShowcaseVisual({
  imageUrl,
  alt = "",
  visible,
}: HeroShowcaseVisualProps) {
  const reducedMotion = useReducedMotion();
  const parallaxEnabled = useParallaxEnabled();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const uid = useId().replace(/:/g, "");
  const clipId = `heroChevronClip-${uid}`;
  const strokeGradId = `hero-chevron-stroke-${uid}`;
  const fillGradId = `hero-chevron-fill-${uid}`;
  const glowFilterId = `hero-chevron-glow-${uid}`;
  const holoGradId = `hero-holo-${uid}`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!parallaxEnabled || reducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setTilt({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 14,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 14,
      });
    },
    [parallaxEnabled, reducedMotion],
  );

  const ariaLabel =
    alt ||
    "Team collaborating with AI-powered digital tools, framed by an animated upward chevron";

  const motion = !reducedMotion;

  return (
    <div
      className={`relative ml-auto aspect-square w-[min(88vw,360px)] shrink-0 xl:w-[400px] ${
        visible && motion ? "hero-showcase-in" : visible ? "opacity-100" : "opacity-0"
      }`}
      role="img"
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      {motion && (
        <>
          <div
            className="hero-showcase-orb-a pointer-events-none absolute -left-8 top-1/4 h-32 w-32 rounded-full"
            aria-hidden
          />
          <div
            className="hero-showcase-orb-b pointer-events-none absolute -right-6 bottom-1/4 h-40 w-40 rounded-full"
            aria-hidden
          />
        </>
      )}

      <div
        className="hero-showcase-stage relative h-full overflow-hidden rounded-3xl bg-background shadow-[0_24px_80px_rgba(0,0,0,0.35)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
        style={{
          transform:
            parallaxEnabled && motion
              ? `perspective(900px) rotateY(${tilt.x * 0.35}deg) rotateX(${-tilt.y * 0.35}deg)`
              : undefined,
          transition: "transform 0.25s ease-out",
        }}
      >
        <div className={`relative z-[2] h-full ${motion ? "hero-chevron-float" : ""}`}>
          <svg
            viewBox="0 0 586 584"
            className="h-full w-full"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id={clipId}>
                <path d={CHEVRON_FRAME_FILL} transform={CHEVRON_CLIP_TRANSFORM} />
              </clipPath>
              <linearGradient id={strokeGradId} x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4">
                  {motion && (
                    <animate
                      attributeName="stop-color"
                      values="#06b6d4;#22c55e;#4ade80;#06b6d4"
                      dur="5s"
                      repeatCount="indefinite"
                    />
                  )}
                </stop>
                <stop offset="50%" stopColor="#4ade80">
                  {motion && (
                    <animate
                      attributeName="stop-color"
                      values="#4ade80;#06b6d4;#22c55e;#4ade80"
                      dur="5s"
                      repeatCount="indefinite"
                    />
                  )}
                </stop>
                <stop offset="100%" stopColor="#22c55e">
                  {motion && (
                    <animate
                      attributeName="stop-color"
                      values="#22c55e;#4ade80;#06b6d4;#22c55e"
                      dur="5s"
                      repeatCount="indefinite"
                    />
                  )}
                </stop>
              </linearGradient>
              <linearGradient id={fillGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0A9D86" stopOpacity="0.16" />
                <stop offset="50%" stopColor="#5FD06A" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.07" />
              </linearGradient>
              <linearGradient id={holoGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
                <stop offset="45%" stopColor="#4ade80" stopOpacity="0.35" />
                <stop offset="55%" stopColor="#06b6d4" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
              <radialGradient id={`${uid}-vignette-r`} cx="50%" cy="38%" r="65%">
                <stop offset="25%" stopColor="var(--color-background)" stopOpacity="0" />
                <stop offset="100%" stopColor="var(--color-background)" stopOpacity="0.85" />
              </radialGradient>
              <linearGradient id={`${uid}-vignette-b`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-background)" stopOpacity="0.55" />
                <stop offset="22%" stopColor="var(--color-background)" stopOpacity="0" />
                <stop offset="72%" stopColor="var(--color-footer)" stopOpacity="0" />
                <stop offset="100%" stopColor="var(--color-footer)" stopOpacity="0.7" />
              </linearGradient>
              <filter id={glowFilterId} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {imageUrl ? (
              <g clipPath={`url(#${clipId})`}>
                <image
                  href={imageUrl}
                  x="-32"
                  y="-32"
                  width="650"
                  height="648"
                  preserveAspectRatio="xMidYMid slice"
                  className={motion ? "hero-showcase-photo" : undefined}
                />
                {motion && (
                  <rect
                    width="586"
                    height="584"
                    fill={`url(#${holoGradId})`}
                    className="hero-holo-sweep"
                  />
                )}
                <rect width="586" height="584" fill={`url(#${fillGradId})`} opacity="0.3" />
                <rect width="586" height="584" fill={`url(#${uid}-vignette-r)`} />
                <rect width="586" height="584" fill={`url(#${uid}-vignette-b)`} />
                {motion && (
                  <rect
                    width="586"
                    height="584"
                    fill="#4ade80"
                    opacity="0.05"
                    className="hero-showcase-scan"
                  />
                )}
              </g>
            ) : null}

            {motion &&
              AMBIENT_PARTICLES.map(({ cx, cy, r, delay }) => (
                <circle
                  key={`${cx}-${cy}`}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="#4ade80"
                  className="hero-showcase-particle"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}

            <path d={CHEVRON_FRAME_FILL} fill={`url(#${fillGradId})`} opacity="0.45" />

            {CHEVRON_ARMS.map(({ d }) => (
              <path
                key={`glow-${d}`}
                d={d}
                fill="none"
                stroke={`url(#${strokeGradId})`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.18"
                filter={`url(#${glowFilterId})`}
                className={motion ? "hero-chevron-glow" : undefined}
              />
            ))}

            {CHEVRON_ARMS.map(({ d, delay }) => (
              <path
                key={`energy-${d}`}
                d={d}
                fill="none"
                stroke={`url(#${strokeGradId})`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.45"
                className={motion ? "hero-stroke-energy" : undefined}
                style={motion ? { animationDelay: `${1.6 + delay}s` } : undefined}
              />
            ))}

            {CHEVRON_ARMS.map(({ d, delay }) => (
              <path
                key={d}
                d={d}
                fill="none"
                stroke={`url(#${strokeGradId})`}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={motion ? "hero-chevron-segment" : undefined}
                style={
                  motion ? { animationDelay: `${delay}s`, animationFillMode: "both" } : undefined
                }
              />
            ))}

            {CHEVRON_NODES.map(({ cx, cy }, i) => (
              <g key={`${cx}-${cy}`}>
                {motion && (
                  <>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={14}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="0.75"
                      className="hero-node-spark"
                      style={{ animationDelay: `${1.4 + i * 0.15}s` }}
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={8}
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="1"
                      opacity="0.35"
                      className="hero-chevron-node-ring"
                      style={{ animationDelay: `${1.2 + i * 0.1}s` }}
                    />
                  </>
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill="#22c55e"
                  filter={`url(#${glowFilterId})`}
                  className={motion ? "hero-chevron-node" : undefined}
                  style={motion ? { animationDelay: `${1.2 + i * 0.1}s` } : undefined}
                />
              </g>
            ))}

            {motion &&
              CHEVRON_ARMS.map((arm, i) => (
                <g key={`pulse-group-${arm.d}`}>
                  <circle r={4} fill="#4ade80" filter={`url(#${glowFilterId})`}>
                    <animateMotion
                      dur={`${2.8 + i * 0.35}s`}
                      repeatCount="indefinite"
                      path={arm.d}
                      begin={`${i * 0.45}s`}
                    />
                  </circle>
                  <circle r={2.5} fill="#06b6d4" opacity="0.85">
                    <animateMotion
                      dur={`${3.6 + i * 0.4}s`}
                      repeatCount="indefinite"
                      path={arm.d}
                      begin={`${i * 0.45 + 1.4}s`}
                    />
                  </circle>
                </g>
              ))}

            {motion &&
              CHEVRON_PULSE_PATHS.map((path, i) => (
                <circle
                  key={`comet-${path}`}
                  r={6}
                  fill="#fff"
                  opacity="0.9"
                  filter={`url(#${glowFilterId})`}
                >
                  <animateMotion
                    dur={`${4.2 + i}s`}
                    repeatCount="indefinite"
                    path={path}
                    begin={`${i * 1.1}s`}
                  />
                  <animate
                    attributeName="opacity"
                    values="0;0.9;0.9;0"
                    keyTimes="0;0.1;0.9;1"
                    dur={`${4.2 + i}s`}
                    repeatCount="indefinite"
                    begin={`${i * 1.1}s`}
                  />
                </circle>
              ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
