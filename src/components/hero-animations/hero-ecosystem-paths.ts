/** Motion paths for data packets traveling through the ecosystem */
export const PACKET_PATHS = [
  "M375,350 H100",
  "M375,350 H650",
  "M375,350 V150",
  "M450,350 V480 H550",
  "M375,350 H340",
] as const;

export type EcosystemHitRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
};

export type EcosystemServiceZone = {
  id: string;
  slug: string;
  label: string;
  hit: EcosystemHitRect;
};

/** Clickable regions mapped to service routes (viewBox coordinates) */
export const ECOSYSTEM_SERVICE_ZONES = [
  {
    id: "ai-agents",
    slug: "ai-agents",
    label: "AI Agents",
    hit: { x: 300, y: 268, width: 150, height: 175, rx: 12 },
  },
  {
    id: "ai-automation",
    slug: "ai-automation",
    label: "AI Automation",
    hit: { x: 175, y: 150, width: 400, height: 400, rx: 200 },
  },
  {
    id: "workflow-automation",
    slug: "workflow-automation",
    label: "Workflow Automation",
    hit: { x: 95, y: 318, width: 530, height: 72, rx: 8 },
  },
  {
    id: "shopify-automation",
    slug: "shopify-automation",
    label: "Shopify Automation",
    hit: { x: 458, y: 318, width: 72, height: 72, rx: 8 },
  },
  {
    id: "messaging-automation",
    slug: "messaging-automation",
    label: "Messaging Automation",
    hit: { x: 195, y: 28, width: 360, height: 115, rx: 12 },
  },
  {
    id: "crm-lead-automation",
    slug: "crm-lead-automation",
    label: "CRM & Lead Automation",
    hit: { x: 492, y: 422, width: 156, height: 88, rx: 8 },
  },
  {
    id: "mcp-ai-infrastructure",
    slug: "mcp-ai-infrastructure",
    label: "MCP & AI Infrastructure",
    hit: { x: 142, y: 492, width: 466, height: 132, rx: 12 },
  },
  {
    id: "ai-audit",
    slug: "ai-audit",
    label: "AI Audit",
    hit: { x: 72, y: 392, width: 106, height: 72, rx: 8 },
  },
] as const satisfies readonly EcosystemServiceZone[];

/** Centered 3-pill strip: 150px pills in 750px viewBox */
export const ADDITIONAL_SERVICE_PILLS = [
  { label: "Digital Marketing", slug: "digital-marketing", x: 75 },
  { label: "Virtual Assistance", slug: "virtual-assistance", x: 300 },
  { label: "Website Development", slug: "website-development", x: 525 },
] as const;

/** All services for mobile quick-jump chips */
export const ECOSYSTEM_QUICK_JUMP_SERVICES = [
  ...ECOSYSTEM_SERVICE_ZONES.map((zone) => ({ slug: zone.slug, label: zone.label })),
  ...ADDITIONAL_SERVICE_PILLS.map((pill) => ({ slug: pill.slug, label: pill.label })),
] as const;

export const ECOSYSTEM_VIEWBOX = { width: 750, height: 720 } as const;
/** Tighter crop so diagram fills the rendered area instead of floating in empty grid space */
export const ECOSYSTEM_VIEWBOX_CROP = {
  x: 55,
  y: 0,
  width: 640,
  height: 720,
} as const;
export const ECOSYSTEM_CENTER = { x: 375, y: 350 } as const;
export const RADAR_MAX_RADIUS = 200;
