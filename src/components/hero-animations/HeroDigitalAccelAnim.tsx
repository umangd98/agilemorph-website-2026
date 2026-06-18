"use client";

import { Globe, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

type ServiceId = "ai" | "web" | "marketing";

type Service = {
  id: ServiceId;
  label: string;
  short: string;
  description: string;
  metrics: [string, string];
  icon: LucideIcon;
  accent: string;
  x: number;
  y: number;
  path: string;
};

/** 320×320 coordinate system */
const CX = 160;
const CY = 156;
const ORBIT_R = 98;
const VIEW = 320;

function polarToXY(angleDeg: number, radius = ORBIT_R) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  };
}

function pathToHub(x: number, y: number) {
  const dx = CX - x;
  const dy = CY - y;
  const len = Math.hypot(dx, dy) || 1;
  const inset = 36;
  const start = { x: x + (dx / len) * inset, y: y + (dy / len) * inset };
  const end = { x: CX - (dx / len) * 28, y: CY - (dy / len) * 28 };
  const mx = (start.x + end.x) / 2 + (dy / len) * 8;
  const my = (start.y + end.y) / 2 - (dx / len) * 8;
  return `M ${start.x} ${start.y} Q ${mx} ${my} ${end.x} ${end.y}`;
}

const aiPos = polarToXY(-90);
const webPos = polarToXY(150);
const marketingPos = polarToXY(30);

const SERVICES: Service[] = [
  {
    id: "ai",
    label: "AI Automation",
    short: "AI",
    description: "Intelligent agents that eliminate manual work and scale operations 24/7.",
    metrics: ["24/7 uptime", "95% accuracy"],
    icon: Zap,
    accent: "#22c55e",
    x: aiPos.x,
    y: aiPos.y,
    path: pathToHub(aiPos.x, aiPos.y),
  },
  {
    id: "web",
    label: "Web Development",
    short: "Web",
    description: "Lightning-fast, responsive sites and apps built for conversion.",
    metrics: ["<2s load", "Mobile-first"],
    icon: Globe,
    accent: "#06b6d4",
    x: webPos.x,
    y: webPos.y,
    path: pathToHub(webPos.x, webPos.y),
  },
  {
    id: "marketing",
    label: "Digital Marketing",
    short: "Growth",
    description: "Data-driven campaigns that expand reach and drive measurable ROI.",
    metrics: ["3× ROI", "SEO ready"],
    icon: TrendingUp,
    accent: "#a78bfa",
    x: marketingPos.x,
    y: marketingPos.y,
    path: pathToHub(marketingPos.x, marketingPos.y),
  },
];

const CYCLE_MS = 4500;
const NODE_SIZE = "h-14 w-14 sm:h-16 sm:w-16";

type HeroDigitalAccelAnimProps = {
  visible?: boolean;
};

function DiagramNode({
  x,
  y,
  lit,
  accent,
  label,
  icon: Icon,
  delay,
  onActivate,
  isHub = false,
}: {
  x: number;
  y: number;
  lit: boolean;
  accent: string;
  label: string;
  icon?: LucideIcon;
  delay: number;
  onActivate?: () => void;
  isHub?: boolean;
}) {
  const Wrapper = isHub ? "div" : "button";

  return (
    <Wrapper
      {...(!isHub
        ? {
            type: "button" as const,
            onMouseEnter: onActivate,
            onFocus: onActivate,
            onClick: onActivate,
            "aria-pressed": lit,
          }
        : { "aria-hidden": true })}
      className={`absolute focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isHub ? "pointer-events-none" : ""}`}
      style={{
        left: `${(x / VIEW) * 100}%`,
        top: `${(y / VIEW) * 100}%`,
        zIndex: lit ? 10 : isHub ? 5 : 1,
      }}
    >
      <div
        className="hero-node-float"
        style={{
          animationDelay: `${delay}s`,
          filter: lit ? `drop-shadow(0 0 14px ${accent}55)` : undefined,
          transition: "filter 0.35s ease, transform 0.35s cubic-bezier(.22,1,.36,1)",
          transform: `translate(-50%, -50%) scale(${lit && !isHub ? 1.06 : 1})`,
        }}
      >
        <div
          className={`relative flex ${NODE_SIZE} items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300`}
          style={{
            borderColor: lit ? `${accent}88` : "rgba(255,255,255,0.14)",
            background: lit ? `${accent}22` : "rgba(255,255,255,0.05)",
            boxShadow: isHub ? "0 0 40px rgba(34,197,94,0.2)" : undefined,
          }}
        >
          {isHub ? (
            <>
              <div
                className="hero-hub-glow pointer-events-none absolute inset-0 rounded-full"
                style={{ background: `radial-gradient(circle, ${accent}35 0%, transparent 70%)` }}
              />
              <div className="hero-scan-line pointer-events-none absolute inset-x-3 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              <Sparkles className="relative h-6 w-6 text-primary sm:h-7 sm:w-7" strokeWidth={1.5} />
            </>
          ) : (
            Icon && (
              <Icon
                className="h-5 w-5 sm:h-6 sm:w-6"
                style={{ color: lit ? accent : "rgba(148,163,184,0.9)" }}
                strokeWidth={1.75}
              />
            )
          )}
          {lit && !isHub && (
            <span
              className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full"
              style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
              aria-hidden
            />
          )}
        </div>
      </div>
      <p
        className="pointer-events-none absolute left-0 top-0 max-w-[5.5rem] -translate-x-1/2 translate-y-[calc(2rem+0.35rem)] text-center font-heading text-[10px] font-bold leading-tight tracking-wide sm:max-w-24 sm:translate-y-[calc(2.25rem+0.35rem)] sm:text-[11px]"
        style={{ color: lit || isHub ? "#fff" : "rgba(148,163,184,0.85)" }}
      >
        {label}
      </p>
    </Wrapper>
  );
}

export function HeroDigitalAccelAnim({ visible = true }: HeroDigitalAccelAnimProps) {
  const [active, setActive] = useState<ServiceId>("ai");
  const [hovering, setHovering] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [cycleProgress, setCycleProgress] = useState(0);
  const cycleStart = useRef(Date.now());
  const rafRef = useRef<number>(0);

  const activeService = SERVICES.find((s) => s.id === active) ?? SERVICES[0];

  const advanceCycle = useCallback(() => {
    setActive((prev) => {
      const idx = SERVICES.findIndex((s) => s.id === prev);
      return SERVICES[(idx + 1) % SERVICES.length]!.id;
    });
    cycleStart.current = Date.now();
    setCycleProgress(0);
  }, []);

  useEffect(() => {
    if (hovering) return;

    const tick = () => {
      const elapsed = Date.now() - cycleStart.current;
      const progress = Math.min(elapsed / CYCLE_MS, 1);
      setCycleProgress(progress);
      if (progress >= 1) advanceCycle();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hovering, active, advanceCycle]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setParallax({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 12,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 12,
    });
  }, []);

  const selectService = (id: ServiceId) => {
    setActive(id);
    cycleStart.current = Date.now();
    setCycleProgress(0);
  };

  return (
    <div
      className="relative mx-auto w-full max-w-md lg:max-w-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHovering(false);
        setParallax({ x: 0, y: 0 });
      }}
      role="img"
      aria-label="Interactive diagram showing AI automation, web development, and digital marketing accelerating your brand"
    >
      <style>{`
        @keyframes hero-packet {
          0% { offset-distance: 0%; opacity: 0; transform: scale(0.6); }
          6% { opacity: 1; transform: scale(1); }
          94% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; transform: scale(0.4); }
        }
        @keyframes hero-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes hero-hub-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; }
        }
        @keyframes hero-scan {
          0% { transform: translateY(-120%); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { transform: translateY(120%); opacity: 0; }
        }
        @keyframes hero-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes hero-card-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-orbit-ring { animation: hero-orbit 24s linear infinite; transform-origin: ${CX}px ${CY}px; }
        .hero-hub-glow { animation: hero-hub-glow 3s ease-in-out infinite; }
        .hero-scan-line { animation: hero-scan 3.5s ease-in-out infinite; }
        .hero-node-float { animation: hero-float 3.5s ease-in-out infinite; }
        .hero-card-swap { animation: hero-card-in 0.35s cubic-bezier(.22,1,.36,1) both; }
        ${SERVICES.map(
          (s, i) => `
          .hero-packet-${s.id}-1 { offset-path: path('${s.path}'); animation: hero-packet 2.4s ease-in-out ${i * 0.35}s infinite; }
          .hero-packet-${s.id}-2 { offset-path: path('${s.path}'); animation: hero-packet 2.4s ease-in-out ${i * 0.35 + 0.8}s infinite; }
          .hero-packet-${s.id}-3 { offset-path: path('${s.path}'); animation: hero-packet 2.4s ease-in-out ${i * 0.35 + 1.6}s infinite; }
        `,
        ).join("")}
      `}</style>

      <div
        className="relative overflow-hidden rounded-3xl border border-white/10"
        style={{
          background: "linear-gradient(155deg, #060d1a 0%, #0b1628 45%, #0d1f2d 100%)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.9s cubic-bezier(.22,1,.36,1) 400ms, transform 0.9s cubic-bezier(.22,1,.36,1) 400ms",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,197,94,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="pointer-events-none absolute rounded-full blur-3xl"
          aria-hidden
          style={{
            left: `${((CX - 128) / VIEW) * 100}%`,
            top: `${((CY - 128) / VIEW) * 100}%`,
            width: `${(256 / VIEW) * 100}%`,
            height: `${(256 / VIEW) * 100}%`,
            background: `radial-gradient(circle, ${activeService.accent}22 0%, transparent 70%)`,
            transition: "background 0.6s ease",
          }}
        />

        <div
          className="relative aspect-square w-full"
          style={{
            transform: `translate(${parallax.x * 0.5}px, ${parallax.y * 0.5}px)`,
            transition: "transform 0.2s ease-out",
          }}
        >
          <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="h-full w-full" aria-hidden>
            <defs>
              {SERVICES.map((s) => (
                <linearGradient key={`grad-${s.id}`} id={`path-grad-${s.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={s.accent} stopOpacity={active === s.id ? "0.85" : "0.18"} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={active === s.id ? "0.9" : "0.12"} />
                </linearGradient>
              ))}
              <filter id="hero-glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g className="hero-orbit-ring">
              <circle
                cx={CX}
                cy={CY}
                r={ORBIT_R}
                fill="none"
                stroke="rgba(34,197,94,0.1)"
                strokeWidth="1"
                strokeDasharray="5 7"
              />
            </g>

            {SERVICES.map((s) => {
              const lit = active === s.id;
              return (
                <g key={s.id}>
                  <path
                    d={s.path}
                    fill="none"
                    stroke={`url(#path-grad-${s.id})`}
                    strokeWidth={lit ? 2.5 : 1.5}
                    strokeDasharray={lit ? "none" : "5 5"}
                    strokeLinecap="round"
                  />
                  {[1, 2, 3].map((n) => (
                    <circle
                      key={n}
                      r={lit ? 4 : 3}
                      fill={s.accent}
                      className={`hero-packet-${s.id}-${n}`}
                      filter={lit ? "url(#hero-glow)" : undefined}
                      style={{ opacity: lit ? 1 : 0.3 }}
                    />
                  ))}
                </g>
              );
            })}
          </svg>

          {/* Hub — same circle + label structure as service nodes */}
          <DiagramNode
            x={CX}
            y={CY}
            lit
            accent={activeService.accent}
            label="Your Brand"
            delay={0}
            isHub
          />

          {SERVICES.map((s, i) => (
            <DiagramNode
              key={s.id}
              x={s.x}
              y={s.y}
              lit={active === s.id}
              accent={s.accent}
              label={s.label}
              icon={s.icon}
              delay={i * 0.4}
              onActivate={() => {
                setHovering(true);
                selectService(s.id);
              }}
            />
          ))}
        </div>

        <div className="border-t border-white/8 bg-black/20 px-5 py-4 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2">
            {SERVICES.map((s) => {
              const lit = active === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  className="relative flex-1 overflow-hidden rounded-full py-1.5 text-center font-body text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300 sm:text-[11px]"
                  style={{
                    color: lit ? "#fff" : "rgba(148,163,184,0.7)",
                    background: lit ? `${s.accent}18` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${lit ? `${s.accent}44` : "rgba(255,255,255,0.06)"}`,
                  }}
                  onClick={() => {
                    setHovering(true);
                    selectService(s.id);
                    setTimeout(() => setHovering(false), CYCLE_MS);
                  }}
                  aria-pressed={lit}
                >
                  {s.short}
                  {lit && !hovering && (
                    <span
                      className="absolute bottom-0 left-0 h-0.5 rounded-full"
                      style={{
                        width: `${cycleProgress * 100}%`,
                        background: s.accent,
                      }}
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div key={active} className="hero-card-swap">
            <p className="font-body text-[13px] leading-relaxed text-slate-300">
              {activeService.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeService.metrics.map((metric) => (
                <span
                  key={metric}
                  className="rounded-full border px-2.5 py-1 font-body text-[10px] font-semibold"
                  style={{
                    borderColor: `${activeService.accent}33`,
                    background: `${activeService.accent}12`,
                    color: activeService.accent,
                  }}
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
