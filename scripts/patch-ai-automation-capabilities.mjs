#!/usr/bin/env node
/**
 * Patches ai-automation capabilities on the servicePage document in Sanity.
 * Usage: node scripts/patch-ai-automation-capabilities.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const ENV_PATH = join(ROOT, ".env.local");

function loadEnv() {
  return Object.fromEntries(
    readFileSync(ENV_PATH, "utf8")
      .split("\n")
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const [key, ...rest] = line.split("=");
        return [key.trim(), rest.join("=").trim()];
      }),
  );
}

function getAuthToken() {
  const env = loadEnv();
  if (env.SANITY_API_WRITE_TOKEN) return env.SANITY_API_WRITE_TOKEN;

  const configPath = join(process.env.HOME, ".config/sanity/config.json");
  const cliToken =
    existsSync(configPath) &&
    JSON.parse(readFileSync(configPath, "utf8")).authToken;

  if (cliToken) return cliToken;
  if (env.SANITY_API_READ_TOKEN) return env.SANITY_API_READ_TOKEN;

  throw new Error("No Sanity auth token found.");
}

const CAPABILITIES = [
  {
    _type: "capabilityItem",
    title: "AI Automation",
    slug: "ai-automation",
    featured: true,
    description:
      "Our core practice, end-to-end AI workflows, agents, and integrations that cut manual work across your business.",
    icon: "⚡",
  },
  {
    _type: "capabilityItem",
    title: "Workflow Automation",
    slug: "workflow-automation",
    description: "n8n, Make, and Zapier pipelines that eliminate repetitive work.",
    icon: "⟳",
  },
  {
    _type: "capabilityItem",
    title: "CRM & Lead Automation",
    slug: "crm-lead-automation",
    description: "Capture, enrich, route, and follow up on every lead automatically.",
    icon: "◎",
  },
  {
    _type: "capabilityItem",
    title: "MCP & AI Infrastructure",
    slug: "mcp-ai-infrastructure",
    description:
      "Self-hosted pipelines, MCP servers, and production-grade deployments.",
    icon: "⧉",
  },
  {
    _type: "capabilityItem",
    title: "Messaging Automation",
    slug: "messaging-automation",
    description: "WhatsApp, email, and chat automations that respond and convert.",
    icon: "✉",
  },
  {
    _type: "capabilityItem",
    title: "AI Audit",
    slug: "ai-audit",
    description:
      "A fixed-scope review that maps where AI saves you the most time and money.",
    icon: "◷",
  },
  {
    _type: "capabilityItem",
    title: "Shopify Automation",
    slug: "shopify-automation",
    description:
      "Automate orders, inventory, fulfillment, and customer flows across your Shopify store.",
    icon: "🛍",
  },
];

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getAuthToken();

  const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mutations: [
        {
          patch: {
            id: "servicePage-ai-automation",
            set: {
              capabilitiesHeading: "Core Capabilities",
              capabilities: CAPABILITIES,
            },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Patch failed: ${response.status} ${text}`);
  }

  console.log("ai-automation capabilities patched successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
