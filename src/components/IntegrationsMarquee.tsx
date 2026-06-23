"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { urlForImage } from "@/sanity/image";
import type { IntegrationItem } from "@/sanity/types";

const BRAND_COLORS: Record<string, string> = {
  airtable: "#18BFFF",
  n8n: "#EA4B71",
  "monday.com": "#FF3D57",
  whatsapp: "#25D366",
  stripe: "#635BFF",
  openai: "#412991",
  shopify: "#96BF48",
  "google workspace": "#4285F4",
  "power automate": "#0066FF",
  "make.com": "#6D00CC",
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

function IntegrationChip({ item }: { item: IntegrationItem }) {
  const color = BRAND_COLORS[item.name.toLowerCase()] ?? "#64748b";

  const logoUrl = item.logo?.asset
    ? urlForImage(item.logo).width(32).height(32).auto("format").url()
    : null;

  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-pill border border-border bg-background px-3 py-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:gap-2.5 sm:px-4 sm:py-2.5">
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
  items: IntegrationItem[];
  direction?: "normal" | "reverse";
  duration?: string;
  reducedMotion?: boolean;
}) {
  const doubled = [...items, ...items];

  return (
    <div className="relative isolate max-w-full">
      <div className="overflow-hidden">
        <div
          className="flex w-max gap-2.5 sm:gap-3"
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
            <IntegrationChip key={`${item.name}-${idx}`} item={item} />
          ))}
        </div>
      </div>

      <MarqueeEdgeMist side="left" />
      <MarqueeEdgeMist side="right" />
    </div>
  );
}

type IntegrationsMarqueeProps = {
  heading?: string;
  items?: IntegrationItem[];
};

export function IntegrationsMarquee({
  heading = "We integrate with 500+ platforms seamlessly",
  items = [],
}: IntegrationsMarqueeProps) {
  const reducedMotion = useReducedMotion();

  if (!items.length) return null;

  const mid = Math.ceil(items.length / 2);
  const rowA = items.slice(0, mid);
  const rowB = items.slice(mid);
  const showSecondRow = rowB.length > 0;

  return (
    <section
      className="overflow-x-clip border-y border-border bg-background py-10 sm:py-section-sm"
      aria-label="Integrations we work with"
    >
      <div className="mb-6 px-4 text-center sm:mb-8 sm:px-6">
        <p className="mx-auto max-w-md font-body text-[10px] font-bold uppercase leading-relaxed tracking-[0.16em] text-muted-foreground sm:text-xs sm:tracking-[0.2em]">
          {heading}
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
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
    </section>
  );
}
