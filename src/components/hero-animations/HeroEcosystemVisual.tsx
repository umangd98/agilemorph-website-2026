"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import {
  ADDITIONAL_SERVICE_PILLS,
  ECOSYSTEM_CENTER,
  ECOSYSTEM_SERVICE_ZONES,
  ECOSYSTEM_VIEWBOX,
  ECOSYSTEM_VIEWBOX_CROP,
  PACKET_PATHS,
  RADAR_MAX_RADIUS,
  type EcosystemServiceZone,
} from "@/components/hero-animations/hero-ecosystem-paths";
import { serviceHref } from "@/lib/services";
import { useRichAnimations } from "@/hooks/useRichAnimations";

gsap.registerPlugin(MotionPathPlugin);

type ZoneInfo = { slug: string; label: string };

type HeroEcosystemVisualProps = {
  visible?: boolean;
  interactive?: boolean;
};

const INTERACTIVE_ZONE_ORDER: readonly string[] = [
  "ai-automation",
  "workflow-automation",
  "messaging-automation",
  "mcp-ai-infrastructure",
  "crm-lead-automation",
  "ai-audit",
  "shopify-automation",
  "ai-agents",
];

function EcosystemHitLink({
  zone,
  onActivate,
  onDeactivate,
}: {
  zone: EcosystemServiceZone;
  onActivate: (zone: ZoneInfo) => void;
  onDeactivate: () => void;
}) {
  const { hit } = zone;
  return (
    <a
      href={serviceHref(zone.slug)}
      className="ecosystem-zone-link outline-none"
      aria-label={`${zone.label} — view service`}
      onMouseEnter={() => onActivate({ slug: zone.slug, label: zone.label })}
      onMouseLeave={onDeactivate}
      onFocus={() => onActivate({ slug: zone.slug, label: zone.label })}
      onBlur={onDeactivate}
    >
      <rect
        x={hit.x}
        y={hit.y}
        width={hit.width}
        height={hit.height}
        rx={hit.rx ?? 8}
        fill="transparent"
        className="ecosystem-hit-rect"
      />
      <rect
        x={hit.x}
        y={hit.y}
        width={hit.width}
        height={hit.height}
        rx={hit.rx ?? 8}
        fill="var(--color-primary)"
        fillOpacity={0}
        stroke="var(--color-primary)"
        strokeWidth={2}
        className="ecosystem-hit-highlight pointer-events-none"
        aria-hidden
      />
    </a>
  );
}

function EcosystemPillLink({
  slug,
  label,
  x,
  onActivate,
  onDeactivate,
  children,
}: {
  slug: string;
  label: string;
  x: number;
  onActivate: (zone: ZoneInfo) => void;
  onDeactivate: () => void;
  children: ReactNode;
}) {
  return (
    <a
      href={serviceHref(slug)}
      className="ecosystem-zone-link outline-none"
      aria-label={`${label} — view service`}
      onMouseEnter={() => onActivate({ slug, label })}
      onMouseLeave={onDeactivate}
      onFocus={() => onActivate({ slug, label })}
      onBlur={onDeactivate}
    >
      <g transform={`translate(${x}, 660)`}>
        {children}
        <rect
          width={150}
          height={32}
          rx={16}
          fill="transparent"
          className="ecosystem-hit-rect"
        />
      </g>
    </a>
  );
}

export function HeroEcosystemVisual({
  visible = true,
  interactive = false,
}: HeroEcosystemVisualProps) {
  const uid = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const packetsRef = useRef<SVGGElement>(null);
  const finalLabelRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const richAnimations = useRichAnimations();
  const staticFrame = !richAnimations || interactive;
  const [activeZone, setActiveZone] = useState<ZoneInfo | null>(null);

  const handleZoneActivate = useCallback((zone: ZoneInfo) => {
    setActiveZone(zone);
    if (interactive) timelineRef.current?.timeScale(0.2);
  }, [interactive]);

  const handleZoneDeactivate = useCallback(() => {
    setActiveZone(null);
    if (interactive) timelineRef.current?.timeScale(1);
  }, [interactive]);

  const orderedZones = INTERACTIVE_ZONE_ORDER.map((id) =>
    ECOSYSTEM_SERVICE_ZONES.find((zone) => zone.id === id),
  ).filter((zone): zone is (typeof ECOSYSTEM_SERVICE_ZONES)[number] => Boolean(zone));

  useEffect(() => {
    if (!visible || !richAnimations || !svgRef.current) return;

    const root = svgRef.current;
    const q = <T extends Element>(sel: string) => root.querySelector<T>(sel);

    const chevMid = q<SVGPathElement>('[data-layer="chev-mid"]');
    const chevTop = q<SVGPathElement>('[data-layer="chev-top"]');
    const chevBot = q<SVGPathElement>('[data-layer="chev-bot"]');
    const coreMatrix = q<SVGGElement>('[data-layer="core-matrix"]');
    const nodes = q<SVGGElement>('[data-layer="nodes"]');
    const pipelineLayer = q<SVGGElement>('[data-layer="pipeline"]');
    const mainPipe = q<SVGPathElement>('[data-layer="main-pipe"]');
    const pipelineIcons = root.querySelectorAll('[data-layer="pipeline-icon"]');
    const crmLayer = q<SVGGElement>('[data-layer="crm"]');
    const leadProgress = q<SVGRectElement>('[data-layer="lead-progress"]');
    const foundationLayer = q<SVGGElement>('[data-layer="foundation"]');
    const messagingLayer = q<SVGGElement>('[data-layer="messaging"]');
    const messagingPaths = root.querySelectorAll('[data-layer="messaging-path"]');
    const auditLayer = q<SVGGElement>('[data-layer="audit"]');
    const radarSweep = q<SVGCircleElement>('[data-layer="radar"]');
    const finalLabel = finalLabelRef.current;
    const additionalStrip = q<SVGGElement>('[data-layer="additional"]');

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    timelineRef.current = tl;

    gsap.set(root.querySelector('[data-layer="chevrons"]'), {
      scale: 0.8,
      transformOrigin: "center center",
    });

    if (interactive) {
      tl.set(
        [
          pipelineLayer,
          crmLayer,
          foundationLayer,
          messagingLayer,
          auditLayer,
          coreMatrix,
          additionalStrip,
          radarSweep,
        ],
        { opacity: 1 },
      );
      if (leadProgress) gsap.set(leadProgress, { width: 100 });
      if (finalLabel) gsap.set(finalLabel, { opacity: 1 });
    } else {
      tl.to(chevMid, { strokeWidth: 12, duration: 0.8, yoyo: true, repeat: 1 })
        .to(chevTop, { y: -20, opacity: 0.3, duration: 0.5 }, "expand")
        .to(chevBot, { y: 20, opacity: 0.3, duration: 0.5 }, "expand")
        .to(coreMatrix, { opacity: 1, scale: 1.05, duration: 0.8 }, "expand");

      if (nodes) {
        tl.to(
          nodes.querySelectorAll("circle"),
          { scale: 1.2, duration: 1, repeat: -1, yoyo: true, stagger: 0.2 },
          "expand",
        );
      }

      tl.to(pipelineLayer, { opacity: 1, duration: 1 }, "phase2")
        .from(mainPipe, { strokeDasharray: "0, 1000", duration: 1.5 }, "phase2")
        .from(pipelineIcons, { y: 20, opacity: 0, stagger: 0.2, duration: 0.5 }, "-=1");

      tl.to(crmLayer, { opacity: 1, duration: 0.8 }, "phase3")
        .to(leadProgress, { width: 100, duration: 2, ease: "none" }, "phase3");

      tl.to(foundationLayer, { opacity: 1, y: 500, duration: 1, startAt: { y: 530 } }, "phase4");

      tl.to(messagingLayer, { opacity: 1, duration: 1 }, "phase5").from(
        messagingPaths,
        { strokeDashoffset: 500, strokeDasharray: 500, duration: 1.5 },
        "phase5",
      );

      tl.to(auditLayer, { opacity: 1, scale: 1, duration: 0.8, startAt: { scale: 0.8 } }, "phase5b");

      tl.to(
        radarSweep,
        {
          opacity: 1,
          attr: { r: RADAR_MAX_RADIUS },
          duration: 3,
          repeat: -1,
          ease: "sine.inOut",
        },
        "final",
      )
        .to(finalLabel, { opacity: 1, duration: 1 }, "final")
        .to(additionalStrip, { opacity: 1, y: 0, duration: 0.8, startAt: { y: 12 } }, "final");
    }

    const packetContainer = packetsRef.current;
    const packetTimers: ReturnType<typeof setTimeout>[] = [];
    const activePackets: SVGElement[] = [];

    function createPacket() {
      if (!packetContainer) return;
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", "3");
      circle.setAttribute("fill", "var(--color-primary)");
      circle.setAttribute("filter", `url(#glow-${uid})`);
      packetContainer.appendChild(circle);
      activePackets.push(circle);

      const selectedPath = PACKET_PATHS[Math.floor(Math.random() * PACKET_PATHS.length)];

      gsap.to(circle, {
        duration: 2 + Math.random() * 2,
        motionPath: { path: selectedPath },
        ease: "none",
        onComplete: () => {
          circle.remove();
          const idx = activePackets.indexOf(circle);
          if (idx !== -1) activePackets.splice(idx, 1);
          createPacket();
        },
      });
    }

    if (!interactive) {
      const packetStart = setTimeout(() => {
        for (let i = 0; i < 8; i++) {
          packetTimers.push(setTimeout(createPacket, i * 500));
        }
      }, 3000);

      return () => {
        clearTimeout(packetStart);
        packetTimers.forEach(clearTimeout);
        tl.kill();
        timelineRef.current = null;
        activePackets.forEach((el) => {
          gsap.killTweensOf(el);
          el.remove();
        });
      };
    }

    if (!richAnimations) {
      const packetStart = setTimeout(() => {
        for (let i = 0; i < 4; i++) {
          packetTimers.push(setTimeout(createPacket, i * 700));
        }
      }, 500);

      return () => {
        clearTimeout(packetStart);
        packetTimers.forEach(clearTimeout);
        tl.kill();
        timelineRef.current = null;
        activePackets.forEach((el) => {
          gsap.killTweensOf(el);
          el.remove();
        });
      };
    }

    return () => {
      tl.kill();
      timelineRef.current = null;
    };
  }, [visible, richAnimations, uid, interactive]);

  const layerOpacity = staticFrame ? 1 : undefined;
  const ariaLabel = interactive
    ? "Interactive AgileMorph service ecosystem — select a region to explore AI automation, agents, workflow, messaging, CRM, infrastructure, audit, Shopify, marketing, virtual assistance, and web services"
    : "AgileMorph integrated AI ecosystem: AI Agents, Workflow Automation, CRM and Lead Automation, MCP and AI Infrastructure, Messaging Automation, AI Audit, Shopify Automation, plus Digital Marketing, Virtual Assistance, and Website";

  return (
    <div className="relative w-full min-w-0 pt-2 lg:pt-4 lg:-mr-2 xl:-mr-4">
      {interactive && activeZone ? (
        <div
          className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-full border border-primary/25 bg-background/95 px-4 py-1.5 font-body text-xs font-semibold text-primary shadow-sm backdrop-blur-sm sm:text-sm"
          role="status"
          aria-live="polite"
        >
          {activeZone.label}
          <span className="ml-1.5 font-normal text-muted-foreground">· View service →</span>
        </div>
      ) : null}

      <svg
        ref={svgRef}
        viewBox={`${ECOSYSTEM_VIEWBOX_CROP.x} ${ECOSYSTEM_VIEWBOX_CROP.y} ${ECOSYSTEM_VIEWBOX_CROP.width} ${ECOSYSTEM_VIEWBOX_CROP.height}`}
        preserveAspectRatio="xMidYMid meet"
        className={`h-auto w-full aspect-[640/720] ${interactive ? "ecosystem-interactive" : ""}`}
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          <pattern id={`grid-${uid}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="var(--color-primary)"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
            <circle cx="0" cy="0" r="1" fill="var(--color-primary)" fillOpacity="0.2" />
          </pattern>

          <filter id={`glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <linearGradient id={`pipeGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.1" />
          </linearGradient>

          <clipPath id={`stage-clip-${uid}`}>
            <rect width={ECOSYSTEM_VIEWBOX.width} height={ECOSYSTEM_VIEWBOX.height} />
          </clipPath>
        </defs>

        <rect width="100%" height="100%" fill={`url(#grid-${uid})`} />

        <g opacity="0.3" stroke="var(--color-primary)" strokeWidth="0.5" fill="none">
          <path d="M0,100 H150 L200,150 V300" />
          <path d="M750,600 H600 L550,550 V400" />
          <path d="M100,700 V600 L150,550 H300" />
        </g>

        <g data-layer="foundation" opacity={layerOpacity ?? 0} transform="translate(150, 500)">
          <rect x="0" y="0" width="450" height="120" rx="10" fill="var(--color-muted)" stroke="var(--color-border)" />
          <rect x="20" y="20" width="410" height="80" rx="4" fill="var(--color-foreground)" fillOpacity="0.92" />
          <text x="40" y="45" fill="var(--color-muted-foreground)" fontSize="10" fontFamily="monospace">
            SYSTEM READY... PRODUCTION DEPLOYMENT ACTIVE
          </text>
          <text x="40" y="75" fill="var(--color-primary)" fontSize="12" fontWeight="bold">
            MCP & AI INFRASTRUCTURE
          </text>
          <rect x="320" y="65" width="80" height="20" rx="10" fill="var(--color-primary-dark)" />
          <text x="335" y="79" fill="white" fontSize="9" fontWeight="bold">
            SELF-HOSTED
          </text>
        </g>

        <g data-layer="pipeline" opacity={layerOpacity ?? 0}>
          <path
            data-layer="main-pipe"
            d="M100,350 H650"
            stroke={`url(#pipeGrad-${uid})`}
            strokeWidth="4"
            fill="none"
          />
          <path d="M450,350 V480 H550" stroke="#3B82F6" strokeWidth="2" fill="none" strokeDasharray="5,5" />

          <g data-layer="pipeline-icon" transform="translate(140, 335)">
            <rect width="30" height="30" rx="6" fill="var(--color-background)" stroke="var(--color-primary)" />
            <circle cx="15" cy="15" r="8" stroke="var(--color-primary)" fill="none" strokeWidth="1" />
            <text x="0" y="45" fill="var(--color-primary-dark)" fontSize="10" fontWeight="700">
              n8n
            </text>
          </g>
          <g data-layer="pipeline-icon" transform="translate(240, 335)">
            <rect width="30" height="30" rx="6" fill="var(--color-background)" stroke="var(--color-primary)" />
            <path d="M15,8 L22,22 L8,22 Z" fill="var(--color-primary)" />
            <text x="0" y="45" fill="var(--color-primary-dark)" fontSize="10" fontWeight="700">
              Make
            </text>
          </g>
          <g data-layer="pipeline-icon" transform="translate(480, 335)">
            <rect width="30" height="30" rx="6" fill="var(--color-background)" stroke="#96BF48" />
            <text x="8" y="20" fill="#96BF48" fontSize="14" fontWeight="bold">
              S
            </text>
            <text x="-8" y="45" fill="var(--color-primary-dark)" fontSize="9" fontWeight="700">
              Shopify
            </text>
          </g>
          <g data-layer="pipeline-icon" transform="translate(580, 335)">
            <rect width="30" height="30" rx="6" fill="var(--color-background)" stroke="var(--color-primary)" />
            <path d="M18,5 L10,15 H20 L12,25" stroke="var(--color-primary)" fill="none" strokeWidth="2" />
            <text x="0" y="45" fill="var(--color-primary-dark)" fontSize="10" fontWeight="700">
              Zapier
            </text>
          </g>
        </g>

        <g data-layer="messaging" opacity={layerOpacity ?? 0}>
          <path data-layer="messaging-path" d="M375,300 V150" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="4,2" />
          <path data-layer="messaging-path" d="M375,150 L250,100" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="4,2" />
          <path data-layer="messaging-path" d="M375,150 L500,100" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="4,2" />

          <g transform="translate(220, 70)">
            <circle r="25" cx="25" cy="25" fill="var(--color-background)" stroke="var(--color-primary)" />
            <path d="M15,25 H35 M25,15 V35" stroke="var(--color-primary)" strokeWidth="2" />
            <text x="-10" y="-10" fill="var(--color-primary-dark)" fontSize="10" fontWeight="700">
              WhatsApp
            </text>
          </g>
          <g transform="translate(350, 40)">
            <circle r="25" cx="25" cy="25" fill="var(--color-background)" stroke="var(--color-primary)" />
            <rect x="15" y="18" width="20" height="14" stroke="var(--color-primary)" fill="none" />
            <text x="0" y="-10" fill="var(--color-primary-dark)" fontSize="10" fontWeight="700">
              Email
            </text>
          </g>
          <g transform="translate(480, 70)">
            <circle r="25" cx="25" cy="25" fill="var(--color-background)" stroke="var(--color-primary)" />
            <path d="M15,20 Q25,35 35,20" stroke="var(--color-primary)" fill="none" />
            <text x="10" y="-10" fill="var(--color-primary-dark)" fontSize="10" fontWeight="700">
              Chat
            </text>
          </g>
        </g>

        <g data-layer="crm" opacity={layerOpacity ?? 0} transform="translate(500, 430)">
          <rect width="140" height="72" rx="8" fill="var(--color-background)" stroke="#3B82F6" strokeWidth="2" />
          <text x="10" y="25" fill="#3B82F6" fontSize="10" fontWeight="bold">
            CRM AUTOMATION
          </text>
          <g transform="translate(20, 40)">
            <rect width="100" height="10" rx="5" fill="var(--color-muted)" />
            <rect data-layer="lead-progress" width={staticFrame ? 100 : 0} height="10" rx="5" fill="#3B82F6" />
          </g>
        </g>

        <g data-layer="audit" opacity={layerOpacity ?? 0} transform="translate(80, 400)">
          <rect width="90" height="56" rx="8" fill="var(--color-background)" stroke="var(--color-primary)" strokeWidth="1.5" />
          <circle cx="28" cy="28" r="14" stroke="var(--color-primary)" fill="none" strokeWidth="2" />
          <path d="M28,20 V28 H34" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
          <text x="48" y="24" fill="var(--color-primary-dark)" fontSize="9" fontWeight="700">
            AI AUDIT
          </text>
          <text x="48" y="38" fill="var(--color-muted-foreground)" fontSize="8">
            ROI scan
          </text>
        </g>

        <g data-layer="core-complex" transform="translate(375, 350)">
          <g data-layer="core-matrix" opacity={layerOpacity ?? 0}>
            <circle r="80" fill="var(--color-background)" fillOpacity="0.9" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="4,4" />
            <text y="100" textAnchor="middle" fill="var(--color-primary-dark)" fontSize="10" fontWeight="700">
              AI AGENTS (Classify & Decide)
            </text>
          </g>

          <g data-layer="chevrons" transform="translate(0, -10)">
            <path data-layer="chev-top" d="M-40,-40 L0,-20 L40,-40" fill="none" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" />
            <path data-layer="chev-mid" d="M-40,0 L0,20 L40,0" fill="none" stroke="var(--color-primary)" strokeWidth="8" strokeLinecap="round" />
            <path data-layer="chev-bot" d="M-40,40 L0,60 L40,40" fill="none" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" />
          </g>
        </g>

        <g clipPath={`url(#stage-clip-${uid})`}>
          <g ref={packetsRef} data-layer="data-packets" />

          <circle
            data-layer="radar"
            cx={ECOSYSTEM_CENTER.x}
            cy={ECOSYSTEM_CENTER.y}
            r={staticFrame ? 200 : 0}
            fill="none"
            stroke="var(--color-primary)"
            strokeOpacity="0.2"
            strokeWidth="2"
            opacity={layerOpacity ?? 0}
          />
        </g>

        <g
          data-layer="additional"
          opacity={layerOpacity ?? 0}
          transform={staticFrame ? "translate(0, 0)" : "translate(0, 12)"}
        >
          {ADDITIONAL_SERVICE_PILLS.map((pill) =>
            interactive ? (
              <EcosystemPillLink
                key={pill.slug}
                slug={pill.slug}
                label={pill.label}
                x={pill.x}
                onActivate={handleZoneActivate}
                onDeactivate={handleZoneDeactivate}
              >
                <rect
                  width="150"
                  height="32"
                  rx="16"
                  fill="var(--color-background)"
                  stroke="var(--color-border)"
                  className="ecosystem-pill-bg"
                />
                <text
                  x="75"
                  y="20"
                  textAnchor="middle"
                  fill="var(--color-muted-foreground)"
                  fontSize="10"
                  fontWeight="600"
                  className="ecosystem-pill-label pointer-events-none"
                >
                  {pill.label}
                </text>
              </EcosystemPillLink>
            ) : (
              <g key={pill.slug} transform={`translate(${pill.x}, 660)`}>
                <rect width="150" height="32" rx="16" fill="var(--color-background)" stroke="var(--color-border)" />
                <text
                  x="75"
                  y="20"
                  textAnchor="middle"
                  fill="var(--color-muted-foreground)"
                  fontSize="10"
                  fontWeight="600"
                >
                  {pill.label}
                </text>
              </g>
            ),
          )}
        </g>

        {interactive ? (
          <g data-layer="interactive-hits">
            {orderedZones.map((zone) => (
              <EcosystemHitLink
                key={zone.id}
                zone={zone}
                onActivate={handleZoneActivate}
                onDeactivate={handleZoneDeactivate}
              />
            ))}
          </g>
        ) : null}
      </svg>

      <div
        ref={finalLabelRef}
        className="pointer-events-none mt-4 text-center font-body text-[10px] font-bold tracking-[0.12em] text-primary sm:mt-5 sm:text-xs sm:tracking-[0.14em]"
        style={{ opacity: staticFrame ? 1 : 0 }}
      >
        {interactive
          ? "AGILEMORPH SERVICE ECOSYSTEM"
          : "AGILEMORPH'S INTEGRATED AI ECOSYSTEM"}
      </div>
    </div>
  );
}
