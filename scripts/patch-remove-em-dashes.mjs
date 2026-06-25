#!/usr/bin/env node
/**
 * Removes em dashes from all Sanity documents, replacing with commas.
 * Usage: node scripts/patch-remove-em-dashes.mjs [--dry-run]
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const ENV_PATH = join(ROOT, ".env.local");
const EM_DASH = "\u2014";
const EM_DASH_PATTERN = /\s*\u2014\s*/g;
const SKIP_KEYS = new Set(["_id", "_rev", "_createdAt", "_updatedAt", "_weak"]);
const dryRun = process.argv.includes("--dry-run");

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

function stripEmDash(text) {
  if (typeof text !== "string" || !text.includes(EM_DASH)) return text;
  return text.replace(EM_DASH_PATTERN, ", ");
}

function transformValue(value, path, changes) {
  if (typeof value === "string") {
    const next = stripEmDash(value);
    if (next !== value) {
      changes.push({ path, before: value, after: next });
      return next;
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item, index) =>
      transformValue(item, `${path}[${index}]`, changes),
    );
  }

  if (value && typeof value === "object") {
    const result = {};
    for (const [key, child] of Object.entries(value)) {
      if (SKIP_KEYS.has(key)) {
        result[key] = child;
        continue;
      }
      const childPath = path ? `${path}.${key}` : key;
      result[key] = transformValue(child, childPath, changes);
    }
    return result;
  }

  return value;
}

function containsEmDash(value) {
  return JSON.stringify(value).includes(EM_DASH);
}

async function fetchAllDocuments(projectId, dataset, token) {
  const query = encodeURIComponent("*[]");
  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Query failed: ${await response.text()}`);
  }
  const json = await response.json();
  return json.result ?? [];
}

async function createOrReplace(dataset, projectId, token, doc) {
  const { _rev, ...docWithoutRev } = doc;
  const response = await fetch(
    `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mutations: [{ createOrReplace: docWithoutRev }] }),
    },
  );
  if (!response.ok) {
    throw new Error(`Mutate failed for ${doc._id}: ${await response.text()}`);
  }
}

async function publishDocument(dataset, projectId, token, publishedId) {
  const draftId = `drafts.${publishedId}`;
  const response = await fetch(
    `https://${projectId}.api.sanity.io/v2021-06-07/data/actions/${dataset}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actions: [
          {
            actionType: "sanity.action.document.publish",
            draftId,
            publishedId,
          },
        ],
      }),
    },
  );
  if (!response.ok) {
    const text = await response.text();
    if (
      text.includes("not found") ||
      text.includes("No draft") ||
      text.includes("httpNotFound")
    ) {
      return false;
    }
    throw new Error(`Publish failed for ${publishedId}: ${text}`);
  }
  return true;
}

function publishedIdFor(docId) {
  return docId.startsWith("drafts.") ? docId.slice("drafts.".length) : docId;
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getAuthToken();

  console.log(dryRun ? "Dry run: scanning for em dashes..." : "Patching em dashes in Sanity...");

  const documents = await fetchAllDocuments(projectId, dataset, token);
  const affected = documents.filter(containsEmDash);

  if (!affected.length) {
    console.log("No documents with em dashes found.");
    return;
  }

  console.log(`Found ${affected.length} document(s) with em dashes.\n`);

  const publishIds = new Set();

  for (const doc of affected) {
    const changes = [];
    const transformed = transformValue(doc, "", changes);

    if (!changes.length) continue;

    console.log(`${doc._id} (${doc._type}): ${changes.length} replacement(s):`);
    for (const change of changes.slice(0, 5)) {
      console.log(`  ${change.path}`);
      console.log(`    - ${change.before.slice(0, 100)}${change.before.length > 100 ? "..." : ""}`);
      console.log(`    + ${change.after.slice(0, 100)}${change.after.length > 100 ? "..." : ""}`);
    }
    if (changes.length > 5) {
      console.log(`  ... and ${changes.length - 5} more`);
    }

    if (!dryRun) {
      await createOrReplace(dataset, projectId, token, transformed);
      console.log(`  Saved ${doc._id}`);
      publishIds.add(publishedIdFor(doc._id));
    }

    console.log();
  }

  if (dryRun) {
    console.log(`Dry run complete. ${affected.length} document(s) would be patched.`);
    return;
  }

  console.log("Publishing changed documents...");
  for (const publishedId of publishIds) {
    const published = await publishDocument(dataset, projectId, token, publishedId);
    if (published) {
      console.log(`  Published ${publishedId}`);
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
