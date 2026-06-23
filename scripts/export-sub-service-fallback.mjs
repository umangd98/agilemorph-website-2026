#!/usr/bin/env node
/**
 * Exports sub-service page content as JSON for runtime fallback when Sanity
 * documents are not yet seeded. Re-run after editing ai-automation-sub-services.mjs.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAiAutomationSubServicePages } from "./ai-automation-sub-services.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const OUT_PATH = join(__dirname, "../src/data/sub-service-pages.json");

function cta(label, href, openInNewTab = false) {
  return { label, href, openInNewTab };
}

function whyUsItem({ title, description, highlights }) {
  return { title, description, highlights };
}

const pages = buildAiAutomationSubServicePages({}, { cta, whyUsItem, imageRef: () => undefined });

const normalized = pages.map((page) => ({
  _id: page._id,
  _type: page._type,
  title: page.title,
  slug: page.slug.current,
  layout: page.layout,
  tagline: page.tagline,
  description: page.description,
  headline: page.headline,
  flow: page.flow,
  stats: page.stats,
  whyTitle: page.whyTitle,
  whyHighlight: page.whyHighlight,
  whyText: page.whyText,
  checks: page.checks,
  useCases: page.useCases,
  pricing: page.pricing,
  faq: page.faq,
  processSteps: page.processSteps,
  heroCta: page.heroCta,
  capabilitiesHeading: page.capabilitiesHeading,
  capabilities: page.capabilities,
  whyUsHeading: page.whyUsHeading,
  whyUs: page.whyUs,
  technologiesHeading: page.technologiesHeading,
  technologies: page.technologies,
  cta: page.cta,
  seo: page.seo,
}));

writeFileSync(OUT_PATH, `${JSON.stringify(normalized, null, 2)}\n`);
console.log(`Wrote ${normalized.length} sub-service pages to ${OUT_PATH}`);
