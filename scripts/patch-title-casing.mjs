#!/usr/bin/env node
/**
 * Patch Sanity documents with corrected Title Case headings and UI labels.
 * Usage: node scripts/patch-title-casing.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { AI_AUTOMATION_SUB_SERVICES } from "./ai-automation-sub-services.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const ENV_PATH = join(ROOT, ".env.local");

const MAIN_SERVICE_CTA_HEADINGS = {
  "servicePage-ai-automation": "Ready To Automate Your Success?",
  "servicePage-website-development": "Ready To Build Your Website?",
  "servicePage-digital-marketing": "Ready To Grow Your Brand?",
  "servicePage-virtual-assistance": "Ready To Boost Your Productivity?",
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
    const body = await response.text();
    const notFound = body.match(/"id":"([^"]+)".*documentNotFoundError/);
    if (notFound) {
      return { missingId: notFound[1] };
    }
    throw new Error(`Mutate failed: ${body}`);
  }
  return { missingId: null };
}

function patchMutation(id, set) {
  return {
    patch: {
      id,
      set,
    },
  };
}

function buildPatches() {
  const mutations = [];

  mutations.push(
    patchMutation("homepage", {
      "hero.heading": "Cut The Overhead.\nReclaim Your Time.",
      "hero.ctaPrimary.label": "Get In Touch",
      "whyUs.heading": "Why AgileMorph Is Your Ideal Partner?",
      "whyUs.efficiencyCalculator.heading": "Estimate Your Efficiency Gain",
      "whyUs.efficiencyCalculator.ctaLabel": "Book A Discovery Call",
      "integrations.heading": "We Integrate With 500+ Platforms Seamlessly",
    }),
  );

  mutations.push(
    patchMutation("aboutPage", {
      "founder.heading": "Founder-Led Delivery With Engineering Depth",
      "integrations.heading": "We've Been Featured On",
    }),
  );

  mutations.push(
    patchMutation("servicesIndexPage", {
      "hero.eyebrow": "What We Do",
      "hero.heading": "Services Built For Modern Operations",
      "cta.heading": "Not Sure Where To Start?",
      "cta.button.label": "Get In Touch",
    }),
  );

  mutations.push(
    patchMutation("pricingPage", {
      "hero.heading": "Straightforward Engagements.\nPredictable Outcomes.",
      "cta.heading": "Start With A Free\nDiscovery Audit.",
      "cta.headingAccent": "Discovery Audit.",
      "cta.primaryCta.label": "Book A Discovery Call",
      "cta.secondaryCta.label": "See What We Build",
    }),
  );

  mutations.push(
    patchMutation("contactPage", {
      "discoveryCall.title": "Book A Discovery Call",
      "discoveryCall.ctaLabel": "Book A Slot",
    }),
  );

  mutations.push(
    patchMutation("servicePage-ai-automation", {
      "cta.heading": MAIN_SERVICE_CTA_HEADINGS["servicePage-ai-automation"],
      technologiesHeading: "Technologies That Power Our Solutions",
    }),
  );

  for (const [id, heading] of Object.entries(MAIN_SERVICE_CTA_HEADINGS)) {
    if (id === "servicePage-ai-automation") continue;
    mutations.push(patchMutation(id, { "cta.heading": heading }));
  }

  for (const service of AI_AUTOMATION_SUB_SERVICES) {
    mutations.push(
      patchMutation(`servicePage-${service.id}`, {
        capabilitiesHeading: service.capabilitiesHeading,
        whyUsHeading: service.whyUsHeading,
        "cta.heading": service.cta.heading,
      }),
    );
  }

  return mutations;
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("Missing SANITY_API_WRITE_TOKEN in .env.local");

  const mutations = buildPatches();
  let patched = 0;
  const skipped = [];

  for (const mutation of mutations) {
    const id = mutation.patch.id;
    const result = await mutate({ projectId, dataset, token, mutations: [mutation] });
    if (result.missingId) {
      skipped.push(id);
      console.log(`  ⊘ Skipped missing document: ${id}`);
      continue;
    }
    patched += 1;
    console.log(`  ✓ ${id}`);
  }

  console.log(`\n✓ Patched title casing on ${patched} Sanity document(s)`);
  if (skipped.length) {
    console.log(`  Skipped ${skipped.length} missing document(s)`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
