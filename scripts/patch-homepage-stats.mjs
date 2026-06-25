#!/usr/bin/env node
/**
 * Patches homepage and about page stats sections in Sanity.
 * Usage: node scripts/patch-homepage-stats.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildStatsSection } from "./site-metrics.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const ENV_PATH = join(ROOT, ".env.local");

const STATS = buildStatsSection();

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

function getAuthToken({ preferCli = false } = {}) {
  const configPath = join(process.env.HOME, ".config/sanity/config.json");
  const cliToken =
    existsSync(configPath) &&
    JSON.parse(readFileSync(configPath, "utf8")).authToken;

  if (preferCli && cliToken) return cliToken;

  const env = loadEnv();
  if (env.SANITY_API_WRITE_TOKEN) return env.SANITY_API_WRITE_TOKEN;
  if (cliToken) return cliToken;
  if (env.SANITY_API_READ_TOKEN) return env.SANITY_API_READ_TOKEN;

  throw new Error("No Sanity auth token found.");
}

async function patchDocument({ projectId, dataset, token, id, field }) {
  const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mutations: [{ patch: { id, set: { [field]: STATS } } }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Patch failed for ${id}: ${response.status} ${text}`);
  }
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getAuthToken();

  console.log("Patching site metrics...");
  await patchDocument({ projectId, dataset, token, id: "homepage", field: "stats" });
  console.log("  ✓ homepage.stats");
  await patchDocument({ projectId, dataset, token, id: "aboutPage", field: "stats" });
  console.log("  ✓ aboutPage.stats");
  console.log("Site metrics updated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
