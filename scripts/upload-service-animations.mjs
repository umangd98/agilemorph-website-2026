#!/usr/bin/env node
/**
 * Uploads the animated service hero SVGs to Sanity and sets each
 * servicePage.heroImage to the uploaded asset.
 *
 * Usage: node scripts/upload-service-animations.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const SVG_DIR = join(__dirname, "service-svgs");
const MANIFEST_PATH = join(__dirname, "media-manifest.json");
const ENV_PATH = join(ROOT, ".env.local");

const SERVICES = [
  { slug: "ai-automation", label: "AI Automation" },
  { slug: "website-development", label: "Website Development" },
  { slug: "digital-marketing", label: "Digital Marketing" },
  { slug: "virtual-assistance", label: "Virtual Assistance" },
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

function getWriteToken(env) {
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

async function queryServicePages({ projectId, dataset, token }) {
  const query = encodeURIComponent(
    `*[_type == "servicePage"]{ _id, "slug": slug.current }`,
  );
  const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/query/${dataset}?query=${query}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Query failed: ${await response.text()}`);
  }
  const json = await response.json();
  return json.result ?? [];
}

async function uploadSvg({ slug, projectId, dataset, token, manifest }) {
  const manifestKey = `service-anim/${slug}.svg`;
  const filePath = join(SVG_DIR, `${slug}.svg`);
  const buffer = readFileSync(filePath);
  const filename = `${slug}-animation.svg`;

  const uploadUrl = `https://${projectId}.api.sanity.io/v2021-06-07/assets/images/${dataset}?filename=${encodeURIComponent(filename)}`;
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "image/svg+xml",
    },
    body: buffer,
  });

  if (!response.ok) {
    throw new Error(`Upload failed for ${slug}: ${await response.text()}`);
  }

  const json = await response.json();
  const asset = { id: json.document._id, url: json.document.url };
  manifest[manifestKey] = asset;
  return asset;
}

async function patchHeroImage({ projectId, dataset, token, docId, assetId, alt }) {
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
            id: docId,
            set: {
              heroImage: {
                _type: "image",
                asset: { _type: "reference", _ref: assetId },
                alt,
              },
            },
          },
        },
      ],
    }),
  });
  if (!response.ok) {
    throw new Error(`Patch failed for ${docId}: ${await response.text()}`);
  }
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getWriteToken(env);
  const manifest = loadManifest();

  console.log(`Uploading service animations for ${projectId}/${dataset}...\n`);

  const pages = await queryServicePages({ projectId, dataset, token });
  const bySlug = new Map(pages.map((p) => [p.slug, p._id]));

  for (const service of SERVICES) {
    const docId = bySlug.get(service.slug);
    if (!docId) {
      console.warn(`  ✗ No servicePage found for slug "${service.slug}", skipping`);
      continue;
    }

    const asset = await uploadSvg({
      slug: service.slug,
      projectId,
      dataset,
      token,
      manifest,
    });
    console.log(`  ✓ Uploaded ${service.slug}.svg`);

    await patchHeroImage({
      projectId,
      dataset,
      token,
      docId,
      assetId: asset.id,
      alt: `${service.label} animated illustration`,
    });
    console.log(`  ✓ Set heroImage on ${docId}`);
  }

  saveManifest(manifest);
  console.log(`\nDone, uploaded ${SERVICES.length} animations.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
