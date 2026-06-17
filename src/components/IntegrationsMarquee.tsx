"use client";

import Image from "next/image";
import { urlForImage } from "@/sanity/image";
import type { IntegrationItem } from "@/sanity/types";

// Fallback brand colours keyed by lowercase tool name
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

function InitialIcon({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-[9px] font-bold text-white"
      style={{ background: color }}
      aria-hidden
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function IntegrationChip({ item }: { item: IntegrationItem }) {
  const color =
    BRAND_COLORS[item.name.toLowerCase()] ?? "#64748b";

  const logoUrl = item.logo?.asset
    ? urlForImage(item.logo).width(32).height(32).auto("format").url()
    : null;

  return (
    <span className="inline-flex shrink-0 items-center gap-2.5 rounded-pill border border-border bg-background px-4 py-2.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={item.logo?.alt ?? item.name}
          width={16}
          height={16}
          className="h-4 w-4 object-contain"
          unoptimized
        />
      ) : (
        <InitialIcon name={item.name} color={color} />
      )}
      <span className="whitespace-nowrap font-body text-sm font-medium tracking-tight text-foreground">
        {item.name}
      </span>
    </span>
  );
}

function MarqueeRow({
  items,
  direction = "normal",
  duration = "40s",
}: {
  items: IntegrationItem[];
  direction?: "normal" | "reverse";
  duration?: string;
}) {
  // Duplicate so the loop is seamless: translateX(-50%) scrolls one full copy
  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
      }}
    >
      <div
        className="flex w-max gap-3"
        style={{
          animation: `marquee ${duration} linear infinite ${direction === "reverse" ? "reverse" : "normal"}`,
          willChange: "transform",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState =
            "paused";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState =
            "running";
        }}
      >
        {doubled.map((item, idx) => (
          <IntegrationChip key={`${item.name}-${idx}`} item={item} />
        ))}
      </div>
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
  if (!items.length) return null;

  // Split into two rows for the double-band effect
  const mid = Math.ceil(items.length / 2);
  const rowA = items.slice(0, mid);
  const rowB = items.slice(mid);

  // If only one row has items (< 2 unique tools) just show one row
  const showSecondRow = rowB.length > 0;

  return (
    <section
      className="overflow-hidden border-y border-border bg-background py-section-sm"
      aria-label="Integrations we work with"
    >
      <div className="mb-8 text-center">
        <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {heading}
        </p>
      </div>

      <div className="space-y-4">
        <MarqueeRow items={rowA} direction="normal" duration="45s" />
        {showSecondRow && (
          <MarqueeRow items={rowB} direction="reverse" duration="52s" />
        )}
      </div>
    </section>
  );
}
