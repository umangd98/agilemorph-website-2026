#!/usr/bin/env node
/**
 * Patches live Sanity documents with audited content (team leads, discovery call, copy fixes).
 * Usage: node scripts/patch-content-audit.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const MANIFEST_PATH = join(__dirname, "media-manifest.json");
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
  if (existsSync(configPath)) {
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    if (config.authToken) return config.authToken;
  }
  throw new Error("No Sanity write token found.");
}

function loadManifest() {
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
}

function imageRef(manifest, key, alt = "", projectId, dataset) {
  const asset = manifest[key];
  if (!asset?.id) return undefined;
  if (projectId && dataset && asset.url && !asset.url.includes(`${projectId}/${dataset}`)) {
    return undefined;
  }
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset.id },
    alt,
  };
}

function techItem(manifest, name, logoKey, projectId, dataset) {
  const item = { _type: "technologyItem", name };
  const logo = imageRef(manifest, logoKey, `${name} logo`, projectId, dataset);
  if (logo) item.logo = logo;
  return item;
}

async function patchDocument(dataset, projectId, token, id, set) {
  const response = await fetch(
    `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mutations: [{ patch: { id, set } }] }),
    },
  );
  if (!response.ok) {
    const text = await response.text();
    if (text.includes("documentNotFoundError")) {
      console.warn(`  Skipped missing document: ${id}`);
      return;
    }
    throw new Error(text);
  }
  console.log(`  Patched ${id}`);
}

async function mutate(dataset, projectId, token, mutations) {
  const response = await fetch(
    `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mutations }),
    },
  );
  if (!response.ok) {
    throw new Error(await response.text());
  }
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getAuthToken();
  const manifest = loadManifest();

  const teamLeads = {
    eyebrow: "Leadership",
    heading: "Meet Our Leadership",
    subheading:
      "The people steering strategy, engineering, and delivery, building automation that ships fast and scales with your business.",
    cardFooter: "AgileMorph leadership",
    members: [
      {
        _type: "teamLeadItem",
        _key: "umang",
        name: "Umang Dhandhania",
        role: "CEO",
        bio: "A Northwestern-educated engineer who turns complex business problems into clear, revenue-lifting systems. Over the past decade he has guided more than 100 companies through launches, process overhauls, and market-ready builds that beat timelines and KPIs.",
        image: imageRef(manifest, "team-leads/umang-dhandhania.png", "Umang Dhandhania", projectId, dataset),
      },
      {
        _type: "teamLeadItem",
        _key: "kaustumbh",
        name: "Kaustumbh Jaiswal",
        role: "CTO",
        bio: "Leads AgileMorph's engineering and product architecture, turning automation strategy into reliable, scalable systems. He pairs deep technical craft with a builder's mindset so every solution ships fast and holds up in production.",
        image: imageRef(manifest, "team-leads/kaustumbh-jaiswal.png", "Kaustumbh Jaiswal", projectId, dataset),
      },
      {
        _type: "teamLeadItem",
        _key: "muskan",
        name: "Muskan Agrawal",
        role: "COO",
        bio: "Keeps delivery sharp across client engagements, aligning teams, timelines, and outcomes so projects move from discovery to launch without friction. She brings operational rigor and a client-first lens to every engagement.",
        image: imageRef(manifest, "team-leads/muskan-agrawal.png", "Muskan Agrawal", projectId, dataset),
      },
    ],
  };

  const discoveryCall = {
    title: "Book a discovery call",
    subtitle: "15 Minute Discovery with Umang Dhandhania",
    description:
      "Pick a time that works for you. We'll discuss your goals and whether AgileMorph is the right fit.",
    availabilityNote:
      "We take on only 5 new client projects each month. Spots are limited, so book early if timing matters.",
    bullets: [
      "15-minute video call with our team",
      "Discuss goals, scope, and fit",
      "Leave with clear next steps",
    ],
    ctaLabel: "Book a slot",
  };

  const technologies = [
    ["n8n", "integrations/n8n.svg"],
    ["Zapier", "integrations/zapier.svg"],
    ["Make.com", "integrations/make.svg"],
    ["OpenAI", "integrations/openai.svg"],
    ["Google Cloud", "integrations/googlecloud.svg"],
    ["AWS", "integrations/aws.svg"],
    ["Python", "integrations/python.svg"],
    ["WordPress", "integrations/wordpress.svg"],
    ["Shopify", "integrations/shopify.svg"],
    ["HubSpot", "integrations/hubspot.svg"],
    ["Pipedrive", "integrations/pipedrive.svg"],
    ["Notion", "integrations/notion.svg"],
    ["Salesforce", "integrations/salesforce.svg"],
  ]
    .map(([name, logoKey]) => ({
      ...techItem(manifest, name, logoKey, projectId, dataset),
      _key: name.toLowerCase().replace(/[^a-z0-9]/g, ""),
    }))
    .filter((item) => item.logo?.asset?._ref);

  const aboutPatch = {
    teamLeads,
    "hero.tagline":
      'Empowering businesses with agile solutions, innovative technology, and a customer-first approach to thrive in the digital era. Where agility meets transformation, so your next breakthrough isn\'t trapped in "someday."',
    "about.body":
      "Agile because we sprint, iterate, and out-learn the market. Morph because we turn raw ideas into revenue-ready systems that keep adapting as you grow. Born out of AI research at Northwestern University, AgileMorph has become the execution partner for leaders who want operations that scale without adding headcount.\n\nThe result: marketing teams regain time, ops teams close the day without a backlog, and owners get systems that turn messy workflows into reliable automation. When you work with AgileMorph, you get a proven delivery process that converts inefficiency into momentum and ideas into measurable ROI.",
    "about.promise":
      "Whether you need a landing page, a machine-learning workflow, or dozens of small automations that free up your team, we deliver on scope, on timeline, and with clear handoff documentation.",
    "founder.heading": "Founder-led delivery with engineering depth",
    "founder.bio":
      "A Northwestern-educated engineer who turns complex business problems into clear, revenue-lifting systems. Over the past decade he has guided more than 100 companies through launches, process overhauls, and market-ready builds that beat timelines and KPIs.\n\nHis focus at AgileMorph is practical: give ambitious teams the automation, software, and delivery support they need to move faster without sacrificing quality.\n\nWhen you work with AgileMorph, you work directly with leadership that understands both the business case and the technical build.",
  };

  await patchDocument(dataset, projectId, token, "aboutPage", aboutPatch);
  await patchDocument(dataset, projectId, token, "contactPage", { discoveryCall });
  await patchDocument(dataset, projectId, token, "servicesIndexPage", {
    "hero.description":
      "AI automation is our core practice, with seven specializations plus marketing, virtual assistance, and web development when you need the full stack.",
  });

  if (technologies.length) {
    await patchDocument(dataset, projectId, token, "servicePage-ai-automation", {
      technologiesHeading: "Technologies that power our solutions",
      technologies,
    });
  }

  console.log("Content audit patches applied to Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
