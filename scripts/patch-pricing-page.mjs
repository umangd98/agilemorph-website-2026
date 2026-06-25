#!/usr/bin/env node
/**
 * Seeds the pricingPage singleton in Sanity.
 * Usage: node scripts/patch-pricing-page.mjs
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

function cta(label, href, openInNewTab = false) {
  return { _type: "ctaButton", label, href, openInNewTab };
}

function buildPricingPage() {
  return {
    _id: "pricingPage",
    _type: "pricingPage",
    hero: {
      eyebrow: "Pricing",
      heading: "Straightforward engagements.\nPredictable outcomes.",
      description:
        "Every engagement begins with a discovery audit. From there, you choose a fixed-scope project or an ongoing retainer, both structured around delivery, not hours.",
    },
    projectSection: {
      label: "Project pricing, four fixed-scope tiers",
      tiers: [
        {
          _type: "pricingProjectTier",
          name: "Discovery audit",
          price: "Free",
          priceStrikethrough: "$500",
          priceBadge: "Free",
          limitedNote: "Limited time, book before spots fill.",
          timeline: "1–2 days",
          tagline:
            "Understand exactly what to build before committing to the build.",
          deliverables: [
            "Current-state workflow map",
            "Prioritized bottleneck analysis",
            "Recommended automation architecture",
            "Written scope for the build phase",
            "60-min walkthrough session with the founder",
          ],
          paymentNote:
            "Free for a limited time. Normally $500, credited toward your build invoice if you proceed.",
        },
        {
          _type: "pricingProjectTier",
          name: "Single workflow",
          price: "$3K – $8K",
          timeline: "2–6 weeks",
          tagline:
            "One focused automation, scoped, built, and handed over production-ready.",
          deliverables: [
            "Workflow architecture document",
            "Production build in n8n, Make, or Zapier",
            "Integrations with your existing tools and CRM",
            "Error handling, monitoring, and retry logic",
            "Operator runbook and 30-day post-launch support",
          ],
          paymentNote: "50% at kickoff, 50% at production launch.",
        },
        {
          _type: "pricingProjectTier",
          name: "Connected systems build",
          price: "$8K – $20K",
          timeline: "4–10 weeks",
          tagline:
            "Multiple workflows operating as one cohesive system across your stack.",
          featured: true,
          deliverables: [
            "Full operational architecture and data model",
            "3–8 workflows sharing a common data layer",
            "CRM integration and contact data design",
            "Custom API integrations and webhook handlers",
            "Observability, alerting, and error management",
            "60 days post-launch support",
          ],
          paymentNote:
            "40% at kickoff, 30% at mid-build review, 30% at launch.",
        },
        {
          _type: "pricingProjectTier",
          name: "AI platform build",
          price: "$20K+",
          timeline: "2–5 months",
          tagline:
            "Custom AI infrastructure, agents, internal tools, or a full operations rebuild.",
          deliverables: [
            "Custom LLM agents built on Claude or GPT-4",
            "MCP server setup and AI tool infrastructure",
            "Full-stack development, Django, FastAPI, React",
            "Cloud deployment on AWS or DigitalOcean",
            "10+ connected workflows across teams",
            "90-day post-launch support and optimization",
          ],
          paymentNote:
            "Milestone-based. Typically 3–4 payment gates tied to delivery checkpoints.",
        },
      ],
    },
    retainerSection: {
      label: "Retainer pricing, three monthly tiers",
      description:
        "Month-to-month engagements structured around output, not seat time. Each tier reflects a different level of operational involvement.",
      tiers: [
        {
          _type: "pricingRetainerTier",
          name: "Maintain",
          price: "$2K",
          hours: "~8 hrs/month",
          tagline: "Your automations stay healthy and your team stays unblocked.",
          items: [
            "Workflow monitoring and uptime checks",
            "Credential rotations and API updates",
            "Monthly health-check report",
            "Up to 2 small enhancements per month",
          ],
        },
        {
          _type: "pricingRetainerTier",
          name: "Iterate",
          price: "$5K",
          hours: "~20 hrs/month",
          tagline:
            "Active improvement across your stack each month, not just upkeep.",
          featured: true,
          items: [
            "Everything in Maintain",
            "Quarterly ops review and roadmap session",
            "2–4 new workflows delivered per month",
            "Direct Slack or email channel with the team",
            "Same-business-day response on production issues",
          ],
        },
        {
          _type: "pricingRetainerTier",
          name: "Embed",
          price: "$10K",
          hours: "~40 hrs/month",
          tagline: "AgileMorph operates as part of your team, not alongside it.",
          items: [
            "Everything in Iterate",
            "Weekly working sessions with the team",
            "Continuous workflow delivery capacity",
            "CRM and tooling implementation included",
            "On-call coverage for business-critical workflows",
          ],
        },
      ],
    },
    engagementSection: {
      label: "How engagements work",
      steps: [
        {
          _type: "pricingEngagementStep",
          step: "Step 01",
          title: "Discovery first",
          description:
            "Every engagement starts with a paid audit. We map your current operations, identify the highest-leverage automation opportunities, and produce a written scope. You know exactly what you're getting before any build begins.",
        },
        {
          _type: "pricingEngagementStep",
          step: "Step 02",
          title: "Fixed scope, defined delivery",
          description:
            "The scope document from discovery becomes the contract. Deliverables, timelines, and payment milestones are agreed upfront. There are no change orders for work that falls within the original scope.",
        },
        {
          _type: "pricingEngagementStep",
          step: "Step 03",
          title: "Handed over, not dependent",
          description:
            "Every build includes full documentation and a runbook your team can operate. The goal is that you understand what we've built. Ongoing support is an option, not a requirement for the system to function.",
        },
      ],
    },
    cta: {
      heading: "Start with a free\ndiscovery audit.",
      headingAccent: "discovery audit.",
      primaryCta: cta("Book a discovery call", "/contact#book"),
      secondaryCta: cta("See what we build", "/services"),
    },
    seo: {
      title: "Pricing, AgileMorph Solutions",
      description:
        "Straightforward engagements and predictable outcomes. Fixed-scope project pricing and monthly retainer tiers for AI automation and digital operations.",
    },
  };
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getAuthToken();
  const doc = buildPricingPage();

  const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mutations: [{ createOrReplace: doc }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Patch failed: ${response.status} ${text}`);
  }

  console.log("pricingPage document seeded successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
