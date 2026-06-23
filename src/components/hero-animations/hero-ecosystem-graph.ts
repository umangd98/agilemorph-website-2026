export type GraphNodeType =
  | "core"
  | "tool"
  | "process"
  | "sub"
  | "base"
  | "channel"
  | "audit"
  | "commerce";

export type GraphNode = {
  id: string;
  label: string;
  sub: string;
  type: GraphNodeType;
  x: number;
  y: number;
  slug: string;
  phase: 2 | 3 | 4 | 5 | 6 | 7;
};

export type GraphEdge = {
  from: string;
  to: string;
  dashed?: boolean;
  phase: 3 | 4 | 5 | 6;
  accent?: boolean;
};

export type GraphPill = {
  label: string;
  slug: string;
  x: number;
  y: number;
};

export const GRAPH_VIEWBOX = "0 0 800 880" as const;

export const GRAPH_CENTER = { x: 400, y: 300 } as const;

/** Interactive halo for the full AI Automation practice */
export const AI_AUTOMATION_ZONE = {
  slug: "ai-automation",
  label: "AI Automation",
  cx: 400,
  cy: 350,
  r: 200,
} as const;

export const GRAPH_NODES: readonly GraphNode[] = [
  {
    id: "core",
    label: "AI AGENTS",
    sub: "Classify & Decide",
    type: "core",
    x: 400,
    y: 300,
    slug: "ai-agents",
    phase: 2,
  },
  {
    id: "n8n",
    label: "n8n",
    sub: "Logic",
    type: "tool",
    x: 250,
    y: 300,
    slug: "workflow-automation",
    phase: 3,
  },
  {
    id: "make",
    label: "Make",
    sub: "Workflows",
    type: "tool",
    x: 550,
    y: 300,
    slug: "workflow-automation",
    phase: 3,
  },
  {
    id: "zapier",
    label: "Zapier",
    sub: "Connect",
    type: "tool",
    x: 400,
    y: 420,
    slug: "workflow-automation",
    phase: 3,
  },
  {
    id: "shopify",
    label: "Shopify",
    sub: "Commerce",
    type: "commerce",
    x: 500,
    y: 420,
    slug: "shopify-automation",
    phase: 3,
  },
  {
    id: "crm",
    label: "CRM & LEAD",
    sub: "Lead Matrix",
    type: "process",
    x: 600,
    y: 450,
    slug: "crm-lead-automation",
    phase: 4,
  },
  {
    id: "enrich",
    label: "Enrichment",
    sub: "Data DB",
    type: "sub",
    x: 720,
    y: 450,
    slug: "crm-lead-automation",
    phase: 4,
  },
  {
    id: "route",
    label: "Routing",
    sub: "Team Sync",
    type: "sub",
    x: 600,
    y: 550,
    slug: "crm-lead-automation",
    phase: 4,
  },
  {
    id: "audit",
    label: "AI AUDIT",
    sub: "ROI scan",
    type: "audit",
    x: 120,
    y: 450,
    slug: "ai-audit",
    phase: 4,
  },
  {
    id: "infra",
    label: "AI INFRASTRUCTURE",
    sub: "Self-hosted Production",
    type: "base",
    x: 400,
    y: 650,
    slug: "mcp-ai-infrastructure",
    phase: 5,
  },
  {
    id: "msg_wa",
    label: "WhatsApp",
    sub: "Messaging",
    type: "channel",
    x: 200,
    y: 150,
    slug: "messaging-automation",
    phase: 6,
  },
  {
    id: "msg_em",
    label: "Email",
    sub: "Outbound",
    type: "channel",
    x: 400,
    y: 100,
    slug: "messaging-automation",
    phase: 6,
  },
  {
    id: "msg_ch",
    label: "Chat",
    sub: "Real-time",
    type: "channel",
    x: 600,
    y: 150,
    slug: "messaging-automation",
    phase: 6,
  },
] as const;

export const GRAPH_EDGES: readonly GraphEdge[] = [
  { from: "core", to: "n8n", phase: 3 },
  { from: "core", to: "make", phase: 3 },
  { from: "core", to: "zapier", phase: 3 },
  { from: "zapier", to: "shopify", phase: 3 },
  { from: "zapier", to: "crm", phase: 4, accent: true },
  { from: "crm", to: "enrich", phase: 4, accent: true },
  { from: "crm", to: "route", phase: 4, accent: true },
  { from: "core", to: "audit", phase: 4 },
  { from: "infra", to: "core", phase: 5, dashed: true },
  { from: "n8n", to: "msg_wa", phase: 6 },
  { from: "core", to: "msg_em", phase: 6 },
  { from: "make", to: "msg_ch", phase: 6 },
] as const;

export const GRAPH_PILLS: readonly GraphPill[] = [
  { label: "Digital Marketing", slug: "digital-marketing", x: 100, y: 718 },
  { label: "Virtual Assistance", slug: "virtual-assistance", x: 325, y: 718 },
  { label: "Website", slug: "website-development", x: 550, y: 718 },
] as const;

/** Bottom caption — sits below service pills */
export const GRAPH_ECOSYSTEM_LABEL_Y = 812 as const;

/** Deterministic decorative circuit paths (no random per mount) */
export const CIRCUIT_PATHS = [
  "M 48 120 h 80 v 40 h 20",
  "M 620 88 h 95 v 55 h 30",
  "M 140 520 v 70 h 60 v 35",
  "M 680 480 h -75 v 45 h -25",
  "M 320 680 h 110 v -40 h 45",
  "M 90 280 h 55 v 80 h 35",
  "M 710 240 v 90 h -40",
  "M 250 60 h 70 v 50",
  "M 520 620 h 85 v -55",
  "M 400 200 v -45 h 60",
  "M 160 640 h 40 v -30 h 55",
  "M 580 340 h 50 v 70",
  "M 30 400 h 65 v 45",
  "M 650 150 v 60 h -50",
  "M 360 560 h 90 v 35",
] as const;

export function edgeId(from: string, to: string) {
  return `edge-${from}-${to}`;
}

export function nodeSelector(id: string) {
  return `#node-${id}`;
}

export const ECOSYSTEM_QUICK_JUMP_SERVICES = [
  { slug: AI_AUTOMATION_ZONE.slug, label: AI_AUTOMATION_ZONE.label },
  { slug: "ai-agents", label: "AI Agents" },
  { slug: "workflow-automation", label: "Workflow Automation" },
  { slug: "shopify-automation", label: "Shopify Automation" },
  { slug: "crm-lead-automation", label: "CRM & Lead Automation" },
  { slug: "mcp-ai-infrastructure", label: "MCP & AI Infrastructure" },
  { slug: "messaging-automation", label: "Messaging Automation" },
  { slug: "ai-audit", label: "AI Audit" },
  ...GRAPH_PILLS.map((pill) => ({ slug: pill.slug, label: pill.label })),
] as const;

export function getNodeDimensions(type: GraphNodeType) {
  switch (type) {
    case "core":
      return { w: 132, h: 66, rx: 10 };
    case "base":
      return { w: 320, h: 86, rx: 4 };
    case "audit":
      return { w: 108, h: 56, rx: 8 };
    default:
      return { w: 98, h: 54, rx: 6 };
  }
}
