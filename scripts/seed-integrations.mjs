#!/usr/bin/env node
/**
 * Seeds integration tool logos via SimpleIcons CDN and patches
 * homepage + aboutPage documents in Sanity.
 *
 * Usage: node scripts/seed-integrations.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const MANIFEST_PATH = join(__dirname, "media-manifest.json");
const ENV_PATH = join(ROOT, ".env.local");

// Each entry specifies a logo source URL and filename.
// cdn.simpleicons.org is preferred; jsdelivr v15 is a fallback.
const INTEGRATIONS = [
  { name: "Airtable",         filename: "airtable.svg",        url: "https://cdn.simpleicons.org/airtable/18BFFF" },
  { name: "n8n",              filename: "n8n.svg",             url: "https://cdn.simpleicons.org/n8n/EA4B71" },
  { name: "Slack",            filename: "slack.svg",           url: "https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/slack.svg" },
  { name: "WhatsApp",         filename: "whatsapp.svg",        url: "https://cdn.simpleicons.org/whatsapp/25D366" },
  { name: "Stripe",           filename: "stripe.svg",          url: "https://cdn.simpleicons.org/stripe/635BFF" },
  { name: "OpenAI",           filename: "openai.svg",          url: "https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/openai.svg" },
  { name: "Shopify",          filename: "shopify.svg",         url: "https://cdn.simpleicons.org/shopify/96BF48" },
  { name: "HubSpot",          filename: "hubspot.svg",         url: "https://cdn.simpleicons.org/hubspot/FF7A59" },
  { name: "Asana",            filename: "asana.svg",           url: "https://cdn.simpleicons.org/asana/F06A6A" },
  { name: "Make.com",         filename: "make.svg",            url: "https://cdn.simpleicons.org/make/6D00CC" },
  { name: "Zapier",           filename: "zapier.svg",          url: "https://cdn.simpleicons.org/zapier/FF4A00" },
  { name: "Jira",             filename: "jira.svg",            url: "https://cdn.simpleicons.org/jira/0052CC" },
  { name: "Mailchimp",        filename: "mailchimp.svg",       url: "https://cdn.simpleicons.org/mailchimp/FFE01B" },
  { name: "Google Sheets",    filename: "googlesheets.svg",    url: "https://cdn.simpleicons.org/googlesheets/34A853" },
  { name: "Miro",             filename: "miro.svg",            url: "https://cdn.simpleicons.org/miro/050038" },
  { name: "Telegram",         filename: "telegram.svg",        url: "https://cdn.simpleicons.org/telegram/26A5E4" },
  { name: "Notion",           filename: "notion.svg",          url: "https://cdn.simpleicons.org/notion/000000" },
  { name: "Zoom",             filename: "zoom.svg",            url: "https://cdn.simpleicons.org/zoom/2D8CFF" },
  { name: "Calendly",         filename: "calendly.svg",        url: "https://cdn.simpleicons.org/calendly/006BFF" },
  { name: "Twilio",           filename: "twilio.svg",          url: "https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/twilio.svg" },
  { name: "Meta / Facebook",  filename: "facebook.svg",        url: "https://cdn.simpleicons.org/facebook/1877F2" },
  { name: "Discord",          filename: "discord.svg",         url: "https://cdn.simpleicons.org/discord/5865F2" },
];

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
  return existsSync(MANIFEST_PATH)
    ? JSON.parse(readFileSync(MANIFEST_PATH, "utf8"))
    : {};
}

function saveManifest(manifest) {
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

async function uploadFromUrl({ url, filename, projectId, dataset, token, manifest }) {
  const manifestKey = `integrations/${filename}`;
  if (manifest[manifestKey]?.id) {
    console.log(`  (cached) ${filename}`);
    return manifest[manifestKey];
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed ${url}: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type")?.split(";")[0]?.trim() || "image/svg+xml";
  const uploadUrl = `https://${projectId}.api.sanity.io/v2021-06-07/assets/images/${dataset}?filename=${encodeURIComponent(filename)}`;

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": contentType.includes("svg") ? "image/svg+xml" : contentType,
    },
    body: buffer,
  });

  if (!uploadResponse.ok) {
    const text = await uploadResponse.text();
    throw new Error(`Upload failed ${filename}: ${text}`);
  }

  const json = await uploadResponse.json();
  const asset = { id: json.document._id, url: json.document.url };
  manifest[manifestKey] = asset;
  return asset;
}

async function patchIntegrations({ projectId, dataset, token, docId, integrations }) {
  const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mutations: [{ patch: { id: docId, set: { integrations } } }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Patch failed for ${docId}: ${text}`);
  }
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getAuthToken();
  const manifest = loadManifest();

  console.log(`Seeding ${INTEGRATIONS.length} integration logos to ${projectId}/${dataset}...\n`);

  const items = [];
  const failed = [];

  for (const tool of INTEGRATIONS) {
    try {
      const asset = await uploadFromUrl({
        url: tool.url,
        filename: tool.filename,
        projectId,
        dataset,
        token,
        manifest,
      });

      const key = tool.filename.replace(".svg", "");
      items.push({
        _type: "integrationItem",
        _key: key,
        name: tool.name,
        logo: {
          _type: "image",
          asset: { _type: "reference", _ref: asset.id },
          alt: `${tool.name} logo`,
        },
      });

      console.log(`  ✓ ${tool.name}`);
    } catch (err) {
      console.warn(`  ✗ ${tool.name}: ${err.message}`);
      // Still add without a logo so the name at least shows
      const key = tool.filename.replace(".svg", "");
      items.push({
        _type: "integrationItem",
        _key: key,
        name: tool.name,
      });
      failed.push(tool.name);
    }
  }

  saveManifest(manifest);

  const integrations = {
    heading: "We Integrate With 500+ Platforms Seamlessly",
    items,
  };

  await patchIntegrations({ projectId, dataset, token, docId: "homepage", integrations });
  console.log("\n  ✓ Patched homepage");

  await patchIntegrations({ projectId, dataset, token, docId: "aboutPage", integrations });
  console.log("  ✓ Patched aboutPage");

  if (failed.length) {
    console.log(`\nNote: ${failed.length} logo(s) could not be downloaded and will use fallback initials: ${failed.join(", ")}`);
  }

  console.log("\nIntegration seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
