#!/usr/bin/env node
/**
 * Applies the Forward Deployed Engineering repositioning to Sanity content.
 *
 * Everything is written as DRAFTS. Nothing is published, so the live site does
 * not change. Review the drafts in Studio, or locally with
 * `SANITY_PREVIEW_DRAFTS=true npm run dev`, then publish from Studio.
 *
 * What it does:
 * - Homepage, About and Contact: new copy, retired fields removed.
 * - New documents: How We Work, What We Build, Case Studies index and five
 *   case studies.
 * - Every other document: "AgileMorph" spelling, em dashes and the unverified
 *   metrics removed (blog posts included).
 * - Writes a string-level diff for founder review to
 *   content-review/positioning-fde-copy-diff.md.
 *
 * Usage: node scripts/patch-positioning-fde.mjs [--dry-run] [--emit-preview]
 * Safe to re-run: it rebuilds each draft from the published document.
 *
 * --emit-preview writes nothing to Sanity. It saves the published dataset with
 * these changes applied to content-review/preview-dataset.json (gitignored),
 * which `SANITY_LOCAL_PREVIEW=content-review/preview-dataset.json npm run dev`
 * renders. Use it to review the branch before the drafts exist.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  DIFFERENTIATORS,
  HOMEPAGE_CASE_STUDY_IDS,
  aboutFields,
  caseStudiesIndexDoc,
  caseStudyDocs,
  homepageFields,
  howWeWorkDoc,
  key,
  whatWeBuildDoc,
} from "./positioning-fde-content.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const ENV_PATH = join(ROOT, ".env.local");
const DIFF_PATH = join(ROOT, "content-review", "positioning-fde-copy-diff.md");
const emitPreview = process.argv.includes("--emit-preview");
const dryRun = process.argv.includes("--dry-run") || emitPreview;
const PREVIEW_PATH = join(ROOT, "content-review", "preview-dataset.json");

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
  if (emitPreview && env.SANITY_API_READ_TOKEN) return env.SANITY_API_READ_TOKEN;
  if (env.SANITY_API_WRITE_TOKEN) return env.SANITY_API_WRITE_TOKEN;
  const configPath = join(process.env.HOME, ".config/sanity/config.json");
  if (existsSync(configPath)) {
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    if (config.authToken) return config.authToken;
  }
  throw new Error("No Sanity write token found.");
}

async function fetchAllDocuments(projectId, dataset, token) {
  const query = encodeURIComponent(
    '*[!(_type match "system.*") && (!(_type match "sanity.*") || _type == "sanity.imageAsset")]',
  );
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
  ["We connect to 500+ platforms", "Connects to the 500+ platforms in the Make, n8n and Zapier catalogues"],
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

/* -------------------------------------------------------------------------- */
/* Page transforms                                                             */
/* -------------------------------------------------------------------------- */

function stripSystem(doc) {
  const copy = { ...doc };
  for (const k of SYSTEM_KEYS) delete copy[k];
  return copy;
}

function founderImages(aboutDoc) {
  const members = aboutDoc?.teamLeads?.members ?? [];
  const find = (name) => members.find((m) => m.name === name)?.image;
  return {
    kaustumbhImage: find("Kaustumbh Jaiswal"),
    umangImage: find("Umang Dhandhania"),
  };
}

function transformHomepage(doc, images) {
  const fields = homepageFields(images, HOMEPAGE_CASE_STUDY_IDS);
  const next = { ...doc, ...fields };
  next.hero = {
    ...fields.hero,
    ...(doc.hero?.image ? { image: { ...doc.hero.image, alt: "Agilemorph" } } : {}),
  };
  next.seo = { ...fields.seo, ...(doc.seo?.ogImage ? { ogImage: { ...doc.seo.ogImage, alt: "Agilemorph" } } : {}) };
  next.partners = { ...doc.partners, heading: "Certified and partnered with" };
  // Fields removed from the homepage schema in the rebuild.
  for (const field of RETIRED_FIELDS.homepage) delete next[field];
  return next;
}

/** Fields dropped from the schema. Sanity history keeps the old values. */
const RETIRED_FIELDS = {
  homepage: ["process", "services", "whyUs", "stats", "integrations", "featuredLogos", "testimonials"],
  aboutPage: ["process", "stats", "teamLeads", "founder", "integrations", "featuredLogos", "testimonials"],
};

/** Document types whose pages no longer exist. Left untouched. */
const RETIRED_TYPES = new Set(["servicePage", "servicesIndexPage", "pricingPage"]);

/** Blog posts hidden from the site (src/data/retired-blog-posts.ts). Left untouched. */
const RETIRED_BLOG_SLUGS = new Set(
  [...readFileSync(join(ROOT, "src/data/retired-blog-posts.ts"), "utf8").matchAll(/^\s*"([^"]+)",$/gm)].map(
    (m) => m[1],
  ),
);

function transformAbout(doc, images) {
  const fields = aboutFields(images);
  const values = DIFFERENTIATORS.map(([title, description], i) => ({
    _type: "companyValue",
    _key: doc.values?.[i]?._key ?? key(),
    title,
    description,
    ...(doc.values?.[i]?.icon ? { icon: doc.values[i].icon } : {}),
  }));
  const next = {
    ...doc,
    ...fields,
    hero: { ...doc.hero, ...fields.hero },
    about: {
      ...doc.about,
      ...fields.about,
      ...(doc.about?.image ? { image: { ...doc.about.image, alt: "Agilemorph team" } } : {}),
    },
    values,
    partners: { ...doc.partners, heading: "Certified and partnered with" },
    seo: { ...doc.seo, ...fields.seo },
  };
  // Fields removed from the About schema in the rebuild.
  for (const field of RETIRED_FIELDS.aboutPage) delete next[field];
  return next;
}

function transformContact(doc) {
  const next = {
    ...doc,
    hero: {
      ...doc.hero,
      heading: "Contact",
      description:
        "Whether you have a question or want to see where AI fits in your operation, talk to the engineers who would build it.",
    },
    email: "info@theagilemorph.com",
    discoveryCall: {
      ...doc.discoveryCall,
      title: "Book a discovery call",
      description:
        "Pick a time that works for you. We'll discuss your operation and whether Agilemorph is the right fit.",
      availabilityNote: "",
      ctaLabel: "Book a slot",
    },
    faqs: (doc.faqs ?? []).map((item) => {
      if (item._key === "kazma4ze") {
        return {
          ...item,
          question: "What does Agilemorph do?",
          answer:
            "We embed engineers with your teams to find where AI fits in your systems, workflows and processes, build it in production, and stay until it's used. Engagements start with a discovery audit, or an AI Audit for growing businesses.",
        };
      }
      if (item._key === "u05z3a74") {
        return {
          ...item,
          question: "Can we work with Agilemorph on a long-term engagement?",
          answer:
            "Yes. After a pilot proves itself, we roll out across sites and functions with a dedicated engineer on a monthly retainer.",
        };
      }
      return item;
    }),
    seo: {
      ...doc.seo,
      title: "Contact",
      description:
        "Talk to Agilemorph about building AI into the systems you already run. Book a discovery call or email info@theagilemorph.com.",
    },
  };
  // Contact details on the site are the company email only.
  delete next.phone;
  return next;
}

/* -------------------------------------------------------------------------- */
/* Main                                                                        */
/* -------------------------------------------------------------------------- */

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getAuthToken(env);

  const allDocs = await fetchAllDocuments(projectId, dataset, token);
  const assets = allDocs.filter((d) => d._type === "sanity.imageAsset");
  const docs = allDocs.filter((d) => d._type !== "sanity.imageAsset");
  const byId = new Map(docs.map((d) => [d._id, d]));

  /** The draft we write starts from the existing draft if there is one. */
  const baseFor = (id) => byId.get(`drafts.${id}`) ?? byId.get(id);

  const images = founderImages(byId.get("aboutPage"));
  const transforms = {
    homepage: (doc) => transformHomepage(doc, images),
    aboutPage: (doc) => transformAbout(doc, images),
    contactPage: transformContact,
  };

  const outputs = [];

  // 1. Pages with new copy.
  for (const [id, transform] of Object.entries(transforms)) {
    const base = baseFor(id);
    if (!base) {
      console.warn(`Skipping ${id}: not found.`);
      continue;
    }
    outputs.push({ id, before: base, after: deepFix(transform(stripSystem(base))) });
  }

  // 2. New documents.
  for (const doc of [howWeWorkDoc(), whatWeBuildDoc(), caseStudiesIndexDoc(), ...caseStudyDocs()]) {
    outputs.push({ id: doc._id, before: baseFor(doc._id), after: deepFix(doc), isNew: !byId.has(doc._id) });
  }

  // 3. Everything else: spelling, em dashes and metric sentences only.
  const handled = new Set(outputs.map((o) => o.id));
  const candidates = new Set(
    docs.map((d) => d._id.replace(/^drafts\./, "")).filter((id) => !handled.has(id) && !id.startsWith("versions.")),
  );
  for (const id of candidates) {
    const base = baseFor(id);
    if (RETIRED_TYPES.has(base._type)) continue;
    if (base._type === "blogPost" && RETIRED_BLOG_SLUGS.has(base.slug?.current)) continue;
    const after = deepFix(stripSystem(base));
    if (JSON.stringify(after) !== JSON.stringify(stripSystem(base))) {
      outputs.push({ id, before: base, after });
    }
  }

  // Diff report.
  const lines = [
    "# Positioning FDE: copy changes for founder review",
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

  if (emitPreview) {
    const patched = new Map(outputs.map(({ id, after }) => [id, { ...after, _id: id }]));
    const preview = [
      ...assets,
      ...docs
        .filter((d) => !d._id.startsWith("drafts.") && !d._id.startsWith("versions."))
        .map((d) => patched.get(d._id) ?? d),
      ...outputs.filter((o) => o.isNew).map((o) => patched.get(o.id)),
    ];
    writeFileSync(PREVIEW_PATH, JSON.stringify(preview));
    console.log(`Preview dataset: ${PREVIEW_PATH} (${preview.length} documents).`);
  }

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
