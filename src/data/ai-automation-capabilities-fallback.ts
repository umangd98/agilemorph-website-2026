import type { CapabilityItem } from "@/sanity/types";

/** Canonical What we build grid. Used when Sanity data is missing or incomplete. */
export const AI_AUTOMATION_CAPABILITIES_FALLBACK: CapabilityItem[] = [
  {
    title: "AI Automation",
    slug: "ai-automation",
    featured: true,
    description:
      "Everything we build during an engagement, inside the systems you already run and measured until it's used.",
    icon: "⚡",
  },
  {
    title: "AI Agents",
    slug: "ai-agents",
    description: "Agents that work inside your existing systems.",
    icon: "◈",
  },
  {
    title: "Workflow Automation",
    slug: "workflow-automation",
    description: "Custom code, n8n, Make and Zapier.",
    icon: "⟳",
  },
  {
    title: "CRM & Lead Automation",
    slug: "crm-lead-automation",
    description: "Capture, route and follow up inside the CRM you run.",
    icon: "◎",
  },
  {
    title: "Messaging Automation",
    slug: "messaging-automation",
    description: "WhatsApp, email and chat, written into your systems.",
    icon: "✉",
  },
  {
    title: "MCP & AI Infrastructure",
    slug: "mcp-ai-infrastructure",
    description: "MCP servers and self-hosted AI on your cloud or on-premise.",
    icon: "⧉",
  },
  {
    title: "Custom AI Engineering",
    slug: "custom-ai-engineering",
    description: "RAG, voice AI and evals in Python, TypeScript and Java.",
    icon: "⌘",
  },
  {
    title: "Shopify Automation",
    slug: "shopify-automation",
    description: "Orders, inventory, fulfilment and customer flows.",
    icon: "🛍",
  },
  {
    title: "AI Audit",
    slug: "ai-audit",
    description:
      "A fixed-scope audit for growing businesses: where AI pays off, in 1 to 2 weeks.",
    icon: "◷",
  },
];
