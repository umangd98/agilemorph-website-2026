#!/usr/bin/env node
/**
 * Uploads technology logos and patches servicePage-ai-automation technologies.
 * Usage: node scripts/seed-service-technology-logos.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const MANIFEST_PATH = join(__dirname, "media-manifest.json");
const ENV_PATH = join(ROOT, ".env.local");

const TECHNOLOGIES = [
  { name: "n8n", filename: "n8n.svg", url: "https://cdn.simpleicons.org/n8n/EA4B71" },
  { name: "Zapier", filename: "zapier.svg", url: "https://cdn.simpleicons.org/zapier/FF4A00" },
  { name: "Make.com", filename: "make.svg", url: "https://cdn.simpleicons.org/make/6D00CC" },
  { name: "OpenAI", filename: "openai.svg", url: "https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/openai.svg" },
  { name: "Google Cloud", filename: "googlecloud.svg", url: "https://cdn.simpleicons.org/googlecloud/4285F4" },
  { name: "AWS", filename: "aws.svg", url: "https://cdn.jsdelivr.net/npm/simple-icons@11/icons/amazonaws.svg" },
  { name: "Python", filename: "python.svg", url: "https://cdn.simpleicons.org/python/3776AB" },
  { name: "WordPress", filename: "wordpress.svg", url: "https://cdn.simpleicons.org/wordpress/21759B" },
  { name: "Shopify", filename: "shopify.svg", url: "https://cdn.simpleicons.org/shopify/96BF48" },
  { name: "HubSpot", filename: "hubspot.svg", url: "https://cdn.simpleicons.org/hubspot/FF7A59" },
  { name: "Pipedrive", filename: "pipedrive.svg", url: "https://cdn.simpleicons.org/pipedrive/017737" },
  { name: "Notion", filename: "notion.svg", url: "https://cdn.simpleicons.org/notion/000000" },
  { name: "Salesforce", filename: "salesforce.svg", url: "https://cdn.jsdelivr.net/npm/simple-icons@11/icons/salesforce.svg" },
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
  const cached = manifest[manifestKey];
  if (cached?.id && cached?.url?.includes(`${projectId}/${dataset}`)) {
    return cached;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);

  const uploadResponse = await fetch(
    `https://${projectId}.api.sanity.io/v2021-06-07/assets/images/${dataset}?filename=${encodeURIComponent(filename)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": response.headers.get("content-type") ?? "image/svg+xml",
      },
      body: Buffer.from(await response.arrayBuffer()),
    },
  );

  if (!uploadResponse.ok) {
    throw new Error(`Upload failed: ${await uploadResponse.text()}`);
  }

  const json = await uploadResponse.json();
  const asset = { id: json.document._id, url: json.document.url };
  manifest[manifestKey] = asset;
  return asset;
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getAuthToken();
  const manifest = loadManifest();

  const technologies = [];
  for (const tool of TECHNOLOGIES) {
    let asset = null;
    try {
      asset = await uploadFromUrl({
        url: tool.url,
        filename: tool.filename,
        projectId,
        dataset,
        token,
        manifest,
      });
      console.log(`  ✓ ${tool.name}`);
    } catch (err) {
      console.warn(`  ✗ ${tool.name}: ${err.message}`);
    }

    const item = {
      _type: "technologyItem",
      _key: tool.filename.replace(".svg", ""),
      name: tool.name,
    };
    if (asset?.id) {
      item.logo = {
        _type: "image",
        asset: { _type: "reference", _ref: asset.id },
        alt: `${tool.name} logo`,
      };
    }
    technologies.push(item);
  }

  saveManifest(manifest);

  const patchUrl = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`;
  const response = await fetch(patchUrl, {
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
              technologiesHeading: "Technologies that power our solutions",
              technologies,
            },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Patch failed: ${await response.text()}`);
  }

  console.log("\nPatched servicePage-ai-automation technologies.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
