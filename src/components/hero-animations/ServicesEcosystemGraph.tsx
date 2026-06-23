"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";

import {
  AI_AUTOMATION_ZONE,
  CIRCUIT_PATHS,
  GRAPH_CENTER,
  GRAPH_ECOSYSTEM_LABEL_Y,
  GRAPH_EDGES,
  GRAPH_NODES,
  GRAPH_PILLS,
  GRAPH_VIEWBOX,
  edgeId,
  getNodeDimensions,
  type GraphNode,
  type GraphNodeType,
} from "@/components/hero-animations/hero-ecosystem-graph";
import { useRichAnimations } from "@/hooks/useRichAnimations";
import { serviceHref } from "@/lib/services";

type ZoneInfo = { slug: string; label: string };

type ServicesEcosystemGraphProps = {
  visible?: boolean;
};

function nodeRectClass(type: GraphNodeType) {
  if (type === "base") return "graph-node-rect graph-node-rect-base";
  if (type === "core") return "graph-node-rect graph-node-rect-core";
  return "graph-node-rect";
}

function GraphNodeShape({
  type,
  uid,
}: {
  type: GraphNodeType;
  uid: string;
}) {
  const { w, h, rx } = getNodeDimensions(type);

  return (
    <rect
      x={-w / 2}
      y={-h / 2}
      width={w}
      height={h}
      rx={rx}
      className={nodeRectClass(type)}
      stroke={type === "core" ? "var(--color-primary)" : undefined}
      fill={type === "base" ? "var(--color-muted)" : "var(--color-background)"}
      filter={type === "core" ? `url(#graph-glow-${uid})` : undefined}
    />
  );
}

function GraphNodeLink({
  node,
  uid,
  staticFrame,
  onActivate,
  onDeactivate,
}: {
  node: GraphNode;
  uid: string;
  staticFrame: boolean;
  onActivate: (zone: ZoneInfo) => void;
  onDeactivate: () => void;
}) {
  const { w, h } = getNodeDimensions(node.type);
  const hitPad = 8;

  return (
    <a
      href={serviceHref(node.slug)}
      className="graph-zone-link outline-none"
      aria-label={`${node.label} — view service`}
      onMouseEnter={() => onActivate({ slug: node.slug, label: node.label })}
      onMouseLeave={onDeactivate}
      onFocus={() => onActivate({ slug: node.slug, label: node.label })}
      onBlur={onDeactivate}
    >
      <g
        id={`node-${node.id}`}
        transform={`translate(${node.x}, ${node.y})`}
        style={{ opacity: staticFrame ? 1 : 0 }}
      >
        <rect
          x={-w / 2 - hitPad}
          y={-h / 2 - hitPad}
          width={w + hitPad * 2}
          height={h + hitPad * 2}
          fill="transparent"
          className="graph-hit-rect"
        />
        <GraphNodeShape type={node.type} uid={uid} />
        <text y={-2} className="graph-node-text pointer-events-none">
          {node.label}
        </text>
        <text y={12} className="graph-sub-text pointer-events-none">
          {node.sub}
        </text>
      </g>
    </a>
  );
}

function GraphPillLink({
  pill,
  staticFrame,
  onActivate,
  onDeactivate,
}: {
  pill: (typeof GRAPH_PILLS)[number];
  staticFrame: boolean;
  onActivate: (zone: ZoneInfo) => void;
  onDeactivate: () => void;
}) {
  return (
    <a
      href={serviceHref(pill.slug)}
      className="graph-zone-link outline-none"
      aria-label={`${pill.label} — view service`}
      onMouseEnter={() => onActivate({ slug: pill.slug, label: pill.label })}
      onMouseLeave={onDeactivate}
      onFocus={() => onActivate({ slug: pill.slug, label: pill.label })}
      onBlur={onDeactivate}
    >
      <g transform={`translate(${pill.x}, ${pill.y})`} style={{ opacity: staticFrame ? 1 : 0 }} data-layer="pill">
        <rect
          width={150}
          height={32}
          rx={16}
          className="graph-pill-bg"
          fill="var(--color-background)"
          stroke="var(--color-border)"
        />
        <text
          x={75}
          y={20}
          textAnchor="middle"
          className="graph-pill-label pointer-events-none"
        >
          {pill.label}
        </text>
      </g>
    </a>
  );
}

export function ServicesEcosystemGraph({ visible = true }: ServicesEcosystemGraphProps) {
  const uid = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const richAnimations = useRichAnimations();
  const staticFrame = !richAnimations;
  const [activeZone, setActiveZone] = useState<ZoneInfo | null>(null);

  const handleZoneActivate = useCallback((zone: ZoneInfo) => {
    setActiveZone(zone);
    timelineRef.current?.timeScale(0.2);
  }, []);

  const handleZoneDeactivate = useCallback(() => {
    setActiveZone(null);
    timelineRef.current?.timeScale(1);
  }, []);

  const nodeById = useCallback(
    (id: string) => GRAPH_NODES.find((node) => node.id === id),
    [],
  );

  useEffect(() => {
    if (!visible || !richAnimations || !svgRef.current) return;

    const root = svgRef.current;
    const particleCleanups: Array<() => void> = [];

    function spawnParticle(pathId: string) {
      const path = root.querySelector<SVGPathElement>(`#${pathId}`);
      if (!path) return;

      const length = path.getTotalLength();
      const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      particle.setAttribute("r", "3");
      particle.setAttribute("class", "graph-data-particle");
      particle.setAttribute("fill", "var(--color-primary)");
      root.querySelector("#particles-layer")?.appendChild(particle);

      const tween = gsap.to(
        { progress: 0 },
        {
          progress: 1,
          duration: 2 + Math.random(),
          repeat: -1,
          ease: "none",
          onUpdate: function () {
            const point = path.getPointAtLength(this.targets()[0].progress * length);
            particle.setAttribute("cx", String(point.x));
            particle.setAttribute("cy", String(point.y));
          },
        },
      );

      particleCleanups.push(() => {
        tween.kill();
        particle.remove();
      });
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    timelineRef.current = tl;

    tl.to(`#chevron-stack-${uid} use`, {
      fill: "var(--color-primary)",
      stagger: 0.2,
      duration: 0.8,
    })
      .to(`#chevron-stack-${uid}`, {
        scale: 0.5,
        opacity: 0,
        duration: 0.5,
        transformOrigin: `${GRAPH_CENTER.x}px ${GRAPH_CENTER.y}px`,
      })
      .to(
        "#node-core",
        { opacity: 1, scale: 1.1, duration: 0.8, ease: "back.out" },
        "-=0.1",
      )
      .to(
        `#core-pulse-${uid}`,
        {
          opacity: 0.4,
          attr: { r: 80 },
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        },
        "<",
      );

    tl.add("phase3", "+=0.5");
    GRAPH_NODES.filter((node) => node.phase === 3).forEach((node) => {
      tl.to(`#node-${node.id}`, { opacity: 1, duration: 0.6 }, "phase3");
    });
    GRAPH_EDGES.filter((edge) => edge.phase === 3).forEach((edge) => {
      const id = edgeId(edge.from, edge.to);
      tl.to(
        `#${id}`,
        {
          stroke: "var(--color-primary)",
          strokeWidth: 2,
          opacity: 1,
          duration: 0.8,
        },
        "phase3",
      );
      tl.call(() => spawnParticle(id), undefined, "phase3");
    });

    tl.add("phase4", "+=0.8");
    GRAPH_NODES.filter((node) => node.phase === 4).forEach((node) => {
      tl.to(`#node-${node.id}`, { opacity: 1, duration: 0.6 }, "phase4");
    });
    GRAPH_EDGES.filter((edge) => edge.phase === 4).forEach((edge) => {
      const id = edgeId(edge.from, edge.to);
      tl.to(
        `#${id}`,
        {
          stroke: edge.accent ? "#0ea5e9" : "var(--color-primary)",
          strokeWidth: 2,
          opacity: 1,
          duration: 0.8,
        },
        "phase4",
      );
      tl.call(() => spawnParticle(id), undefined, "phase4");
    });

    tl.add("phase5", "+=0.8");
    tl.to("#node-infra", { opacity: 1, duration: 1 }, "phase5");
    GRAPH_EDGES.filter((edge) => edge.phase === 5).forEach((edge) => {
      const id = edgeId(edge.from, edge.to);
      tl.to(`#${id}`, { opacity: 1, strokeWidth: 2, duration: 1 }, "phase5");
      tl.call(() => spawnParticle(id), undefined, "phase5");
    });

    tl.add("phase6", "+=0.8");
    GRAPH_NODES.filter((node) => node.phase === 6).forEach((node) => {
      tl.to(`#node-${node.id}`, { opacity: 1, scale: 1.05, duration: 0.6 }, "phase6");
    });
    GRAPH_EDGES.filter((edge) => edge.phase === 6).forEach((edge) => {
      const id = edgeId(edge.from, edge.to);
      tl.to(`#${id}`, { stroke: "var(--color-primary)", opacity: 0.85, duration: 0.8 }, "phase6");
      tl.call(() => spawnParticle(id), undefined, "phase6");
    });

    tl.add("phase7", "+=0.8");
    tl.to('[data-layer="pill"]', { opacity: 1, duration: 0.8 }, "phase7");
    tl.to(`#ecosystem-label-${uid}`, {
      opacity: 1,
      attr: { y: GRAPH_ECOSYSTEM_LABEL_Y },
      duration: 1,
      ease: "power2.out",
    }, "phase7");
    tl.fromTo(
      `#radar-ring-${uid}`,
      { attr: { r: 0 }, opacity: 0 },
      { attr: { r: 600 }, opacity: 0.2, duration: 4, repeat: -1, ease: "sine.out" },
      "phase7",
    );

    return () => {
      tl.kill();
      timelineRef.current = null;
      particleCleanups.forEach((cleanup) => cleanup());
    };
  }, [visible, richAnimations, uid]);

  return (
    <div className="relative w-full min-w-0">
      {activeZone ? (
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-full border border-primary/25 bg-background/95 px-4 py-1.5 font-body text-xs font-semibold text-primary shadow-sm backdrop-blur-sm sm:text-sm"
          role="status"
          aria-live="polite"
        >
          {activeZone.label}
          <span className="ml-1.5 font-normal text-muted-foreground">· View service →</span>
        </div>
      ) : null}

      <svg
        ref={svgRef}
        viewBox={GRAPH_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        className="services-ecosystem-graph aspect-[800/880] h-auto w-full min-h-[360px] sm:min-h-[440px] lg:min-h-[520px] xl:min-h-[580px]"
        role="img"
        aria-label="Interactive AgileMorph service ecosystem graph — select a node to explore AI automation, agents, workflow, messaging, CRM, infrastructure, audit, Shopify, marketing, virtual assistance, and web services"
      >
        <defs>
          <pattern id={`graph-grid-${uid}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="var(--color-border)"
              strokeOpacity="0.6"
              strokeWidth="0.5"
            />
            <circle cx="0" cy="0" r="1" fill="var(--color-border)" />
          </pattern>

          <filter id={`graph-glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <symbol id={`chevron-${uid}`} viewBox="0 0 40 20">
            <path d="M 0 0 L 20 10 L 40 0 L 20 5 Z" />
          </symbol>
        </defs>

        <rect width="100%" height="100%" fill={`url(#graph-grid-${uid})`} />

        <g id="circuit-layer" opacity="0.35">
          {CIRCUIT_PATHS.map((d, index) => (
            <path key={index} d={d} className="graph-circuit-line" />
          ))}
        </g>

        <g id="links-layer">
          {GRAPH_EDGES.map((edge) => {
            const source = nodeById(edge.from);
            const target = nodeById(edge.to);
            if (!source || !target) return null;
            const id = edgeId(edge.from, edge.to);
            return (
              <path
                key={id}
                id={id}
                d={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
                className={`graph-link-path${staticFrame ? " graph-link-active" : ""}`}
                stroke={staticFrame ? (edge.accent ? "#0ea5e9" : "var(--color-primary)") : undefined}
                strokeWidth={staticFrame ? 2 : undefined}
                strokeDasharray={edge.dashed ? "5,5" : undefined}
                style={{ opacity: staticFrame ? 0.85 : 0.2 }}
              />
            );
          })}
        </g>

        <g id="particles-layer" />

        <a
          href={serviceHref(AI_AUTOMATION_ZONE.slug)}
          className="graph-zone-link outline-none"
          aria-label={`${AI_AUTOMATION_ZONE.label} — view service`}
          onMouseEnter={() =>
            handleZoneActivate({
              slug: AI_AUTOMATION_ZONE.slug,
              label: AI_AUTOMATION_ZONE.label,
            })
          }
          onMouseLeave={handleZoneDeactivate}
          onFocus={() =>
            handleZoneActivate({
              slug: AI_AUTOMATION_ZONE.slug,
              label: AI_AUTOMATION_ZONE.label,
            })
          }
          onBlur={handleZoneDeactivate}
        >
          <circle
            cx={AI_AUTOMATION_ZONE.cx}
            cy={AI_AUTOMATION_ZONE.cy}
            r={AI_AUTOMATION_ZONE.r}
            fill="transparent"
            className="graph-hit-rect"
          />
        </a>

        <g id={`core-group-${uid}`}>
          <g
            id={`chevron-stack-${uid}`}
            transform={`translate(${GRAPH_CENTER.x}, ${GRAPH_CENTER.y})`}
            style={{ opacity: staticFrame ? 0 : 1 }}
          >
            <use href={`#chevron-${uid}`} x={-40} y={-30} width={80} height={40} fill="#CBD5E1" />
            <use href={`#chevron-${uid}`} x={-40} y={-15} width={80} height={40} fill="#94A3B8" />
            <use href={`#chevron-${uid}`} x={-40} y={0} width={80} height={40} fill="#64748B" />
          </g>
          <circle
            id={`core-pulse-${uid}`}
            cx={GRAPH_CENTER.x}
            cy={GRAPH_CENTER.y}
            r={40}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={2}
            opacity={staticFrame ? 0.4 : 0}
          />
        </g>

        <g id="nodes-layer">
          {GRAPH_NODES.map((node) => (
            <GraphNodeLink
              key={node.id}
              node={node}
              uid={uid}
              staticFrame={staticFrame}
              onActivate={handleZoneActivate}
              onDeactivate={handleZoneDeactivate}
            />
          ))}
        </g>

        <g id="pills-layer">
          {GRAPH_PILLS.map((pill) => (
            <GraphPillLink
              key={pill.slug}
              pill={pill}
              staticFrame={staticFrame}
              onActivate={handleZoneActivate}
              onDeactivate={handleZoneDeactivate}
            />
          ))}
        </g>

        <text
          id={`ecosystem-label-${uid}`}
          x={400}
          y={GRAPH_ECOSYSTEM_LABEL_Y}
          textAnchor="middle"
          className="graph-ecosystem-label"
          style={{ opacity: staticFrame ? 1 : 0 }}
        >
          AGILEMORPH SERVICE ECOSYSTEM
        </text>

        <circle
          id={`radar-ring-${uid}`}
          cx={400}
          cy={350}
          r={staticFrame ? 200 : 0}
          className="graph-radar-ring"
          style={{ opacity: staticFrame ? 0.2 : 0 }}
        />
      </svg>
    </div>
  );
}
