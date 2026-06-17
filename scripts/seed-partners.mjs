#!/usr/bin/env node
/**
 * Seeds partner logos and patches homepage + aboutPage documents.
 * Usage: node scripts/seed-partners.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const MANIFEST_PATH = join(__dirname, "media-manifest.json");
const ENV_PATH = join(ROOT, ".env.local");

const PARTNERS = [
  {
    name: "Anthropic",
    label: "SERVICES PARTNER",
    url: "https://www.anthropic.com",
    slug: "anthropic",
    color: "191919",
  },
  {
    name: "Make.com",
    label: "PLATINUM PARTNER",
    url: "https://www.make.com",
    slug: "make",
    color: "6D00CC",
  },
  {
    name: "Upwork",
    label: "TOP RATED PLUS",
    url: "https://www.upwork.com",
    slug: "upwork",
    color: "6FDA44",
  },
  {
    name: "n8n",
    label: "INTEGRATION PARTNER",
    url: "https://n8n.io",
    slug: "n8n",
    color: "EA4B71",
  },
  {
    name: "Microsoft",
    label: "PARTNER",
    url: "https://www.microsoft.com",
    slug: "microsoft",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    filename: "microsoft.svg",
  },
  {
    name: "Zapier",
    label: "CERTIFIED EXPERT",
    url: "https://zapier.com",
    slug: "zapier",
    color: "FF4A00",
    filename: "zapier.svg",
  },
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
  const manifestKey = `partners/${filename}`;
  if (manifest[manifestKey]?.id) {
    return manifest[manifestKey];
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const uploadUrl = `https://${projectId}.api.sanity.io/v2021-06-07/assets/images/${dataset}?filename=${encodeURIComponent(filename)}`;

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "image/svg+xml",
    },
    body: buffer,
  });

  if (!uploadResponse.ok) {
    const text = await uploadResponse.text();
    throw new Error(`Upload failed for ${filename}: ${text}`);
  }

  const json = await uploadResponse.json();
  const asset = { id: json.document._id, url: json.document.url };
  manifest[manifestKey] = asset;
  return asset;
}

async function patchDocument({ projectId, dataset, token, id, partners }) {
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
            id,
            set: { partners },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Patch failed for ${id}: ${text}`);
  }
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getAuthToken();
  const manifest = loadManifest();

  console.log(`Seeding partners to ${projectId}/${dataset}...`);

  const items = [];

  for (const partner of PARTNERS) {
    const logoUrl =
      partner.logoUrl ??
      `https://cdn.simpleicons.org/${partner.slug}/${partner.color ?? "000000"}`;
    const filename = partner.filename ?? `${partner.slug}.svg`;
    const asset = await uploadFromUrl({
      url: logoUrl,
      filename,
      projectId,
      dataset,
      token,
      manifest,
    });

    items.push({
      _type: "partnerItem",
      _key: partner.slug,
      name: partner.name,
      label: partner.label,
      url: partner.url,
      logo: {
        _type: "image",
        asset: { _type: "reference", _ref: asset.id },
        alt: `${partner.name} logo`,
      },
    });

    console.log(`  ✓ ${partner.name}`);
  }

  saveManifest(manifest);

  const partners = {
    heading: "Certified & Partnered With",
    items,
  };

  await patchDocument({
    projectId,
    dataset,
    token,
    id: "homepage",
    partners,
  });
  console.log("  ✓ Patched homepage");

  await patchDocument({
    projectId,
    dataset,
    token,
    id: "aboutPage",
    partners,
  });
  console.log("  ✓ Patched aboutPage");

  console.log("Partner seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
