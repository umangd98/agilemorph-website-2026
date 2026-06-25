#!/usr/bin/env node
/**
 * Rename Website → Website Development in Sanity documents.
 * Usage: node scripts/patch-website-development-label.mjs
 */
import { readFileSync } from "node:fs";
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

function renameWebsiteCard(cards = []) {
  return cards.map((card) => {
    if (card?.href !== "/services/website-development" && card?.title !== "Website") {
      return card;
    }

    return {
      ...card,
      title: "Website Development",
      icon: card.icon
        ? {
            ...card.icon,
            alt: "Website Development",
          }
        : card.icon,
    };
  });
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("Missing SANITY_API_WRITE_TOKEN in .env.local");

  const homepage = await fetchDocument({ projectId, dataset, token, id: "homepage" });
  const mutations = [
    {
      patch: {
        id: "servicePage-website-development",
        set: {
          title: "Website Development",
          "heroImage.alt": "Website Development",
        },
      },
    },
  ];

  const websiteDevPage = await fetchDocument({
    projectId,
    dataset,
    token,
    id: "servicePage-website-development",
  });

  if (websiteDevPage?.capabilities?.length) {
    const capabilities = websiteDevPage.capabilities.map((item) =>
      item?.title === "Custom Web Development"
        ? { ...item, title: "Custom Website Development" }
        : item,
    );

    mutations[0].patch.set.capabilities = capabilities;
  }

  if (homepage?.services?.cards?.length) {
    mutations.push({
      patch: {
        id: "homepage",
        set: {
          "services.cards": renameWebsiteCard(homepage.services.cards),
        },
      },
    });
  }

  await mutate({ projectId, dataset, token, mutations });

  console.log("✓ Patched Website Development labels in Sanity");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
