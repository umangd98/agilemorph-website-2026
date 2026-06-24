import type { CapabilityItem } from "@/sanity/types";

/** Canonical AI Automation capabilities grid — used when Sanity data is missing or incomplete. */
export const AI_AUTOMATION_CAPABILITIES_FALLBACK: CapabilityItem[] = [
  {
    title: "AI Automation",
    slug: "ai-automation",
    featured: true,
    description:
      "Our core practice — end-to-end AI workflows, agents, and integrations that cut manual work across your business.",
    icon: "⚡",
  },
  {
    title: "Workflow Automation",
    slug: "workflow-automation",
    description: "n8n, Make, and Zapier pipelines that eliminate repetitive work.",
    icon: "⟳",
  },
  {
    title: "CRM & Lead Automation",
    slug: "crm-lead-automation",
    description: "Capture, enrich, route, and follow up on every lead automatically.",
    icon: "◎",
  },
  {
    title: "MCP & AI Infrastructure",
    slug: "mcp-ai-infrastructure",
    description:
      "Self-hosted pipelines, MCP servers, and production-grade deployments.",
    icon: "⧉",
  },
  {
    title: "Messaging Automation",
    slug: "messaging-automation",
    description: "WhatsApp, email, and chat automations that respond and convert.",
    icon: "✉",
  },
  {
    title: "AI Audit",
    slug: "ai-audit",
    description:
      "A fixed-scope review that maps where AI saves you the most time and money.",
    icon: "◷",
  },
  {
    title: "Shopify Automation",
    slug: "shopify-automation",
    description:
      "Automate orders, inventory, fulfillment, and customer flows across your Shopify store.",
    icon: "🛍",
  },
];
