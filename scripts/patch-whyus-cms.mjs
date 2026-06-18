#!/usr/bin/env node
/**
 * Backfill homepage whyUs items with animationType, highlights, and animationLabels.
 * Usage: node scripts/patch-whyus-cms.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const ENV_PATH = join(ROOT, ".env.local");

const HOMEPAGE_WHY_US_ITEMS = [
  {
    title: "Innovation",
    animationType: "innovation",
    highlights: ["Future-ready", "Bold ideas"],
    animationLabels: ["AI", "Web", "Auto"],
  },
  {
    title: "Professionalism",
    animationType: "professionalism",
    highlights: ["Trusted delivery", "On every project"],
    animationLabels: [],
  },
  {
    title: "Expertise",
    animationType: "expertise",
    highlights: ["Deep domain knowledge", "Tailored solutions"],
    animationLabels: ["Strategy", "Build", "Scale"],
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

async function fetchDocument({ projectId, dataset, token, id }) {
  const query = encodeURIComponent(`*[_id == "${id}"][0]`);
  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Query failed: ${await response.text()}`);
  const json = await response.json();
  return json.result;
}

async function mutate({ projectId, dataset, token, mutations }) {
  const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mutations }),
  });
  if (!response.ok) {
    throw new Error(`Mutate failed: ${await response.text()}`);
  }
}

function mergeWhyUsItems(existingItems = []) {
  return existingItems.map((item) => {
    const patch = HOMEPAGE_WHY_US_ITEMS.find((p) => p.title === item.title);
    if (!patch) {
      return {
        ...item,
        animationType: item.animationType ?? "generic",
      };
    }
    return {
      ...item,
      animationType: patch.animationType,
      highlights: patch.highlights,
      ...(patch.animationLabels.length ? { animationLabels: patch.animationLabels } : {}),
    };
  });
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("Missing SANITY_API_WRITE_TOKEN");

  console.log("Fetching homepage...");
  const homepage = await fetchDocument({ projectId, dataset, token, id: "homepage" });
  if (!homepage?.whyUs?.items?.length) {
    throw new Error("Homepage whyUs.items not found");
  }

  const items = mergeWhyUsItems(homepage.whyUs.items);
  await mutate({
    projectId,
    dataset,
    token,
    mutations: [
      {
        patch: {
          id: "homepage",
          set: { "whyUs.items": items },
        },
      },
    ],
  });

  console.log(`✓ Patched ${items.length} homepage whyUs items`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
