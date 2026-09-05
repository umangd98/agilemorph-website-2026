"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { urlForImage } from "@/sanity/image";
import type { SanityImageAsset } from "@/sanity/types";

export type LogoMarqueeItem = {
  name: string;
  logo?: SanityImageAsset;
};

const BRAND_COLORS: Record<string, string> = {
  airtable: "#18BFFF",
  n8n: "#EA4B71",
  "monday.com": "#FF3D57",
  whatsapp: "#25D366",
  stripe: "#635BFF",
  openai: "#412991",
  shopify: "#96BF48",
  "google workspace": "#4285F4",
  "google cloud": "#4285F4",
  "power automate": "#0066FF",
  "make.com": "#6D00CC",
  make: "#6D00CC",
  zapier: "#FF4A00",
  jira: "#0052CC",
  mailchimp: "#FFE01B",
  "google sheets": "#34A853",
  "power apps": "#742774",
  telegram: "#26A5E4",
  notion: "#000000",
  zoom: "#2D8CFF",
  calendly: "#006BFF",
  twilio: "#F22F46",
  "meta / facebook": "#1877F2",
  meta: "#1877F2",
  facebook: "#1877F2",
  discord: "#5865F2",
  slack: "#4A154B",
  hubspot: "#FF7A59",
  salesforce: "#00A1E0",
  asana: "#F06A6A",
  miro: "#050038",
  aws: "#FF9900",
  "power bi": "#F2C811",
  quickbooks: "#2CA01C",
  python: "#3776AB",
  wordpress: "#21759B",
  javascript: "#F7DF1E",
  html: "#E34F26",
  php: "#777BB4",
  joomla: "#5091CD",
  api: "#6BA539",
  pipedrive: "#017737",
  postgresql: "#4169E1",
  firebase: "#FFCA28",
  mongodb: "#47A248",
  woocommerce: "#96588A",
};

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

function InitialIcon({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded text-[8px] font-bold text-white sm:h-4 sm:w-4 sm:text-[9px]"
      style={{ background: color }}
      aria-hidden
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function LogoChip({ item }: { item: LogoMarqueeItem }) {
  const color = BRAND_COLORS[item.name.toLowerCase()] ?? "#64748b";

  const logoUrl = item.logo?.asset
    ? urlForImage(item.logo).width(32).height(32).auto("format").url()
    : null;

  return (
    <span className="me-2.5 inline-flex shrink-0 items-center gap-2 rounded-pill border border-border bg-background px-3 py-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:me-3 sm:gap-2.5 sm:px-4 sm:py-2.5">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={item.logo?.alt ?? item.name}
          width={16}
          height={16}
          className="h-3.5 w-3.5 object-contain sm:h-4 sm:w-4"
          unoptimized
        />
      ) : (
        <InitialIcon name={item.name} color={color} />
      )}
      <span className="whitespace-nowrap font-body text-xs font-medium tracking-tight text-foreground sm:text-sm">
        {item.name}
      </span>
    </span>
  );
}

function MarqueeEdgeMist({ side }: { side: "left" | "right" }) {
  const positionClass = side === "left" ? "left-0 bg-linear-to-r" : "right-0 bg-linear-to-l";

  return (
    <div
      className={`pointer-events-none absolute inset-y-0 z-10 w-10 from-background via-background/90 to-transparent sm:w-16 md:w-24 ${positionClass}`}
      aria-hidden
    />
  );
}

function MarqueeRow({
  items,
  direction = "normal",
  duration = "40s",
  reducedMotion = false,
}: {
  items: LogoMarqueeItem[];
  direction?: "normal" | "reverse";
  duration?: string;
  reducedMotion?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(1);

  // Repeat the items enough times so a single half of the track always spans
  // the container. Otherwise the track (2 halves, animated -50%) runs out of
  // content and leaves a white gap on wide viewports.
  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const compute = () => {
      const containerWidth = container.offsetWidth;
      const setWidth = measure.offsetWidth;
      if (containerWidth > 0 && setWidth > 0) {
        setCopies(Math.max(1, Math.ceil(containerWidth / setWidth) + 1));
      }
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(container);
    return () => ro.disconnect();
  }, [items]);

  const half = Array.from({ length: copies }, () => items).flat();
  const doubled = [...half, ...half];

  return (
    <div className="relative isolate max-w-full" ref={containerRef}>
      {/* Hidden single set used only to measure one set's width. */}
      <div
        ref={measureRef}
        className="pointer-events-none invisible absolute left-0 top-0 flex"
        aria-hidden
      >
        {items.map((item, idx) => (
          <LogoChip key={`measure-${item.name}-${idx}`} item={item} />
        ))}
      </div>

      <div className="overflow-hidden">
        <div
          className="flex w-max"
          style={{
            animation: reducedMotion
              ? "none"
              : `marquee ${duration} linear infinite ${direction === "reverse" ? "reverse" : "normal"}`,
            willChange: reducedMotion ? "auto" : "transform",
          }}
          onMouseEnter={(e) => {
            if (reducedMotion) return;
            (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused";
          }}
          onMouseLeave={(e) => {
            if (reducedMotion) return;
            (e.currentTarget as HTMLDivElement).style.animationPlayState = "running";
          }}
        >
          {doubled.map((item, idx) => (
            <LogoChip key={`${item.name}-${idx}`} item={item} />
          ))}
        </div>
      </div>

      <MarqueeEdgeMist side="left" />
      <MarqueeEdgeMist side="right" />
    </div>
  );
}

type LogoMarqueeProps = {
  items: LogoMarqueeItem[];
  className?: string;
};

export function LogoMarquee({ items, className = "" }: LogoMarqueeProps) {
  const reducedMotion = useReducedMotion();

  if (!items.length) return null;

  const mid = Math.ceil(items.length / 2);
  const rowA = items.slice(0, mid);
  const rowB = items.slice(mid);
  const showSecondRow = rowB.length > 0;

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      <MarqueeRow
        items={rowA}
        direction="normal"
        duration="45s"
        reducedMotion={reducedMotion}
      />
      {showSecondRow ? (
        <MarqueeRow
          items={rowB}
          direction="reverse"
          duration="52s"
          reducedMotion={reducedMotion}
        />
      ) : null}
    </div>
  );
}
