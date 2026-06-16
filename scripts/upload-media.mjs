#!/usr/bin/env node
/**
 * Uploads media/ assets to Sanity and writes scripts/media-manifest.json
 * Usage: node scripts/upload-media.mjs
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const MEDIA_DIR = join(ROOT, "media");
const MANIFEST_PATH = join(__dirname, "media-manifest.json");
const ENV_PATH = join(ROOT, ".env.local");

function loadEnv() {
  if (!existsSync(ENV_PATH)) return {};
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
  if (env.SANITY_API_READ_TOKEN) return env.SANITY_API_READ_TOKEN;

  const configPath = join(process.env.HOME, ".config/sanity/config.json");
  if (existsSync(configPath)) {
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    if (config.authToken) return config.authToken;
  }

  throw new Error("No Sanity auth token found.");
}

function walkFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walkFiles(fullPath, files);
    } else if (!entry.endsWith(".zip")) {
      files.push(fullPath);
    }
  }
  return files;
}

function getContentType(filePath) {
  const ext = extname(filePath).toLowerCase();
  const map = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  return map[ext] ?? "application/octet-stream";
}

async function uploadAsset({ filePath, projectId, dataset, token }) {
  const filename = basename(filePath);
  const contentType = getContentType(filePath);
  const url = `https://${projectId}.api.sanity.io/v2021-06-07/assets/images/${dataset}?filename=${encodeURIComponent(filename)}`;

  const body = readFileSync(filePath);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": contentType,
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to upload ${filename}: ${response.status} ${text}`);
  }

  const json = await response.json();
  return {
    id: json.document._id,
    url: json.document.url,
  };
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getAuthToken();

  if (!projectId) {
    throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required in .env.local");
  }

  const existingManifest = existsSync(MANIFEST_PATH)
    ? JSON.parse(readFileSync(MANIFEST_PATH, "utf8"))
    : {};

  const files = walkFiles(MEDIA_DIR);
  const manifest = { ...existingManifest };
  let uploaded = 0;
  let skipped = 0;

  console.log(`Uploading ${files.length} media files to ${projectId}/${dataset}...`);

  for (const filePath of files) {
    const key = relative(MEDIA_DIR, filePath).replace(/\\/g, "/");
    if (manifest[key]?.id) {
      skipped += 1;
      continue;
    }

    try {
      const asset = await uploadAsset({ filePath, projectId, dataset, token });
      manifest[key] = asset;
      uploaded += 1;
      console.log(`✓ ${key}`);
    } catch (error) {
      console.error(`✗ ${key}: ${error.message}`);
    }
  }

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\nDone. Uploaded: ${uploaded}, skipped: ${skipped}, total in manifest: ${Object.keys(manifest).length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
