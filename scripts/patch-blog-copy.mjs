#!/usr/bin/env node
/**
 * Brings the live blog posts in Sanity in line with the house rules:
 * "Agilemorph" spelling, no em dashes, no unverified metrics. Posts listed in
 * src/data/retired-blog-posts.ts are hidden from the site and left alone.
 *
 * Changes are written as DRAFTS; publish them from Studio. A string-level diff
 * for review goes to content-review/blog-copy-diff.md.
 *
 * Usage: node scripts/patch-blog-copy.mjs [--dry-run]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";


const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const ENV_PATH = join(ROOT, ".env.local");
const DIFF_PATH = join(ROOT, "content-review", "blog-copy-diff.md");
const dryRun = process.argv.includes("--dry-run");

const SKIP_KEYS = new Set(["_id", "_rev", "_ref", "_key", "_type", "_weak", "url", "href", "asset"]);
const SYSTEM_KEYS = ["_rev", "_createdAt", "_updatedAt", "_system"];

function loadEnv() {
  return Object.fromEntries(
    readFileSync(ENV_PATH, "utf8")
      .split("\n")
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const [k, ...rest] = line.split("=");
        return [k.trim(), rest.join("=").trim()];
      }),
  );
}

function getAuthToken(env) {
  if (dryRun && env.SANITY_API_READ_TOKEN) return env.SANITY_API_READ_TOKEN;
  if (env.SANITY_API_WRITE_TOKEN) return env.SANITY_API_WRITE_TOKEN;
  const configPath = join(process.env.HOME, ".config/sanity/config.json");
  if (existsSync(configPath)) {
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    if (config.authToken) return config.authToken;
  }
  throw new Error("No Sanity write token found.");
}

async function fetchAllDocuments(projectId, dataset, token) {
  const query = encodeURIComponent('*[_type == "blogPost"]');
  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}&perspective=raw`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Query failed: ${await response.text()}`);
  return (await response.json()).result ?? [];
}

async function mutate(projectId, dataset, token, mutations) {
  const response = await fetch(
    `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ mutations }),
    },
  );
  if (!response.ok) throw new Error(`Mutate failed: ${await response.text()}`);
  return response.json();
}

/* -------------------------------------------------------------------------- */
/* Global copy fixes                                                           */
/* -------------------------------------------------------------------------- */

/** Specific sentences that carry unverified metrics, rewritten in place. */
const SENTENCE_FIXES = [
  [
    "That's the pattern across the 180+ projects we've delivered for 100+ clients across four continents: the fix",
    "That's the pattern across the 40+ projects we've delivered: the fix",
  ],
  [
    "We've spent more than four years connecting systems like these, across 500-plus platforms for over 100 clients on four continents, and the pattern",
    "We've connected systems like these across 40+ projects, and the pattern",
  ],
];

function fixString(text) {
  let next = text;
  for (const [before, after] of SENTENCE_FIXES) next = next.split(before).join(after);
  next = next
    .replace(/AgileMorph Solutions(['’]) /g, "Agilemorph$1s ")
    .replace(/AgileMorph Solutions/g, "Agilemorph")
    .replace(/AgileMorph/g, "Agilemorph")
    .replace(/\s*\u2014\s*/g, ", ");
  return next;
}

function deepFix(value, parentKey) {
  if (typeof value === "string") return SKIP_KEYS.has(parentKey) ? value : fixString(value);
  if (Array.isArray(value)) return value.map((item) => deepFix(item, parentKey));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, child]) => [k, SKIP_KEYS.has(k) ? child : deepFix(child, k)]),
    );
  }
  return value;
}

/* -------------------------------------------------------------------------- */
/* Diff for founder review                                                     */
/* -------------------------------------------------------------------------- */

function flatten(value, path = "", out = new Map()) {
  if (typeof value === "string") {
    out.set(path, value);
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => flatten(item, `${path}[${item?._key ?? i}]`, out));
  } else if (value && typeof value === "object") {
    for (const [k, child] of Object.entries(value)) {
      if (SKIP_KEYS.has(k) && k !== "href" && k !== "_ref") continue;
      if (SYSTEM_KEYS.includes(k)) continue;
      flatten(child, path ? `${path}.${k}` : k, out);
    }
  }
  return out;
}

function diffDocs(before, after) {
  const a = flatten(before ?? {});
  const b = flatten(after);
  const changes = [];
  for (const [path, value] of b) {
    if (a.get(path) !== value) changes.push({ path, before: a.get(path), after: value });
  }
  for (const [path, value] of a) {
    if (!b.has(path)) changes.push({ path, before: value, after: undefined });
  }
  return changes;
}

const quote = (text) => (text === undefined ? "_(none)_" : `> ${text.replace(/\n/g, "\n> ")}`);

/** Blog posts hidden from the site (src/data/retired-blog-posts.ts). Left untouched. */
const RETIRED_BLOG_SLUGS = new Set(
  [...readFileSync(join(ROOT, "src/data/retired-blog-posts.ts"), "utf8").matchAll(/^\s*"([^"]+)",$/gm)].map(
    (m) => m[1],
  ),
);

function stripSystem(doc) {
  const copy = { ...doc };
  for (const k of SYSTEM_KEYS) delete copy[k];
  return copy;
}

/* -------------------------------------------------------------------------- */
/* Main                                                                        */
/* -------------------------------------------------------------------------- */

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getAuthToken(env);

  const docs = await fetchAllDocuments(projectId, dataset, token);
  const byId = new Map(docs.map((d) => [d._id, d]));
  const baseFor = (id) => byId.get(`drafts.${id}`) ?? byId.get(id);

  const outputs = [];
  const ids = new Set(
    docs
      .filter((d) => d._type === "blogPost" && !d._id.startsWith("versions."))
      .map((d) => d._id.replace(/^drafts\./, "")),
  );
  for (const id of ids) {
    const base = baseFor(id);
    if (RETIRED_BLOG_SLUGS.has(base.slug?.current)) continue;
    const after = deepFix(stripSystem(base));
    if (JSON.stringify(after) !== JSON.stringify(stripSystem(base))) {
      outputs.push({ id, before: base, after });
    }
  }

  // Diff report.
  const lines = [
    "# Blog copy fixes for review",
    "",
    `Generated ${new Date().toISOString()} from dataset \`${dataset}\`. Every change below is saved as an unpublished draft in Sanity.`,
    "Nothing is live until it is published from Studio. Items containing `[CONFIRM]` need a founder decision before publishing.",
    "",
  ];
  let totalChanges = 0;
  for (const { id, before, after, isNew } of outputs) {
    const changes = diffDocs(before ? stripSystem(before) : undefined, stripSystem(after));
    if (!changes.length) continue;
    totalChanges += changes.length;
    lines.push(`## ${id} (${after._type})${isNew ? ", new document" : ""}`, "");
    for (const change of changes) {
      lines.push(`- \`${change.path}\``);
      if (!isNew) lines.push("", "  Before:", "", `  ${quote(change.before).replace(/\n/g, "\n  ")}`);
      lines.push("", isNew ? "  Text:" : "  After:", "", `  ${quote(change.after).replace(/\n/g, "\n  ")}`, "");
    }
  }
  mkdirSync(join(ROOT, "content-review"), { recursive: true });
  writeFileSync(DIFF_PATH, `${lines.join("\n")}\n`);

  console.log(`${outputs.length} document(s), ${totalChanges} string change(s). Diff: ${DIFF_PATH}`);
  for (const { id, isNew } of outputs) console.log(`  ${isNew ? "new " : "edit"} drafts.${id}`);

  if (dryRun) {
    console.log("Dry run: nothing written.");
    return;
  }

  const mutations = outputs.map(({ id, after }) => ({
    createOrReplace: { ...after, _id: `drafts.${id}` },
  }));
  for (let i = 0; i < mutations.length; i += 50) {
    await mutate(projectId, dataset, token, mutations.slice(i, i + 50));
  }
  console.log(`Wrote ${mutations.length} draft(s). Nothing was published.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
