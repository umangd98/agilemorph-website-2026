#!/usr/bin/env node
/**
 * Patches only the homepage stats section in Sanity.
 * Usage: node scripts/patch-homepage-stats.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const ENV_PATH = join(ROOT, ".env.local");
const STATS_PATH = join(ROOT, "src/data/homepage-stats.json");

const homepageStats = JSON.parse(readFileSync(STATS_PATH, "utf8"));
const HOMEPAGE_STATS = {
  eyebrow: homepageStats.eyebrow,
  heading: homepageStats.heading,
  items: homepageStats.items.map((item) => ({ _type: "stat", ...item })),
};

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

async function patchHomepageStats({ projectId, dataset, token }) {
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
            id: "homepage",
            set: { stats: HOMEPAGE_STATS },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Patch failed: ${response.status} ${text}`);
  }
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getAuthToken({ preferCli: true });

  console.log("Patching homepage stats...");
  await patchHomepageStats({ projectId, dataset, token });
  console.log("Homepage stats updated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
