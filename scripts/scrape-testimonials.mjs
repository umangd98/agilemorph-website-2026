#!/usr/bin/env node
/**
 * Scrapes client success stories / testimonials from theagilemorph.com
 * and patches homepage + aboutPage testimonials in Sanity.
 *
 * Usage: node scripts/scrape-testimonials.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const MANIFEST_PATH = join(__dirname, "media-manifest.json");
const ENV_PATH = join(ROOT, ".env.local");

const SOURCE_URLS = [
  "https://theagilemorph.com/",
  "https://theagilemorph.com/?page_id=5802",
  "https://theagilemorph.com/?page_id=5802&preview=true",
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

function loadManifest() {
  return existsSync(MANIFEST_PATH)
    ? JSON.parse(readFileSync(MANIFEST_PATH, "utf8"))
    : {};
}

function saveManifest(manifest) {
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function decodeHtml(text) {
  return text
    .replace(/&#0?38;/g, "&")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const RPS_LOGO_URL =
  "https://theagilemorph.com/wp-content/uploads/2025/04/RPS-Logo-Detaled-Open-GREEN-768x557.png";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isPersonPhoto(url) {
  if (!url) return false;
  if (/Logo|Group-|\.svg$/i.test(url)) return false;
  return /\/uploads\/2025\/(03|04)\//.test(url);
}

function parseTestimonials(html) {
  const $ = cheerio.load(html);
  const hasSection = $("h2")
    .toArray()
    .some((el) => /success stories/i.test($(el).text()));

  if (!hasSection) return [];

  let found = false;
  const items = [];
  let current = null;

  $("h2, h3, p, img").each((_, el) => {
    const tag = el.tagName?.toLowerCase();
    const text = decodeHtml($(el).text());

    if (tag === "h2" && /success stories/i.test(text)) {
      found = true;
      return;
    }
    if (!found) return;

    if (tag === "img") {
      const src = $(el).attr("src") ?? "";
      if (!isPersonPhoto(src)) return;

      if (current?.name) items.push(current);
      current = { imageUrl: src };
      return;
    }

    if (!current) return;

    if (tag === "p") {
      if (text.length > 60 && !current.quote) {
        current.quote = text;
        return;
      }
      if (text.length > 0 && text.length <= 100 && current.name && !current.company) {
        current.company = text;
      }
      return;
    }

    if (tag === "h3" && !current.name) {
      current.name = text;
    }
  });

  if (current?.name) items.push(current);

  // Append company-only testimonial (logo slide, no portrait)
  let afterChris = false;
  $("h2, h3, p").each((_, el) => {
    const tag = el.tagName?.toLowerCase();
    const text = decodeHtml($(el).text());
    if (tag === "h2" && /success stories/i.test(text)) {
      found = true;
      return;
    }
    if (!found) return;
    if (tag === "h3" && /Christopher Calkins/i.test(text)) {
      afterChris = true;
      return;
    }
    if (!afterChris) return;
    if (tag === "p" && text.length > 60 && /AgileMorph delivered good work/i.test(text)) {
      const nameEl = $(el).nextAll("h3").first();
      const companyEl = nameEl.next("p");
      const name = decodeHtml(nameEl.text());
      const company = decodeHtml(companyEl.text());
      if (name && !items.some((item) => item.name === name)) {
        items.push({
          quote: text,
          name,
          company,
          imageUrl: RPS_LOGO_URL,
        });
      }
    }
  });

  return items.filter((item) => item.quote && item.name);
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "AgileMorphSiteScraper/1.0",
    },
    redirect: "follow",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

async function scrapeTestimonials() {
  for (const url of SOURCE_URLS) {
    try {
      const html = await fetchHtml(url);
      const items = parseTestimonials(html);
      if (items.length) {
        console.log(`Found ${items.length} testimonials from ${url}`);
        return items;
      }
      console.log(`No testimonials found at ${url}`);
    } catch (error) {
      console.warn(`Skipping ${url}: ${error.message}`);
    }
  }

  throw new Error("Could not find testimonials on any source URL.");
}

async function uploadFromUrl({ url, filename, projectId, dataset, token, manifest }) {
  const manifestKey = `testimonials/${filename}`;
  if (manifest[manifestKey]?.id) {
    console.log(`  (cached) ${filename}`);
    return manifest[manifestKey];
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed ${url}: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type")?.split(";")[0]?.trim() || "image/jpeg";
  const uploadUrl = `https://${projectId}.api.sanity.io/v2021-06-07/assets/images/${dataset}?filename=${encodeURIComponent(filename)}`;

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": contentType,
    },
    body: buffer,
  });

  if (!uploadResponse.ok) {
    const text = await uploadResponse.text();
    throw new Error(`Upload failed for ${filename}: ${text}`);
  }

  const json = await uploadResponse.json();
  const asset = { id: json.document._id, url: json.document.url };
  manifest[manifestKey] = asset;
  return asset;
}

async function patchTestimonials({ projectId, dataset, token, docId, testimonials }) {
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
            id: docId,
            set: { testimonials },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Patch failed for ${docId}: ${text}`);
  }
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getAuthToken();
  const manifest = loadManifest();

  console.log(`Scraping testimonials for ${projectId}/${dataset}...\n`);

  const scraped = await scrapeTestimonials();
  const items = [];

  for (const testimonial of scraped) {
    const slug = slugify(testimonial.name);
    let image;

    if (testimonial.imageUrl) {
      try {
        const filename = testimonial.imageUrl.split("/").pop() ?? `${slug}.jpg`;
        const asset = await uploadFromUrl({
          url: testimonial.imageUrl,
          filename,
          projectId,
          dataset,
          token,
          manifest,
        });

        image = {
          _type: "image",
          asset: { _type: "reference", _ref: asset.id },
          alt: /logo/i.test(filename)
            ? `${testimonial.name} logo`
            : `${testimonial.name} photo`,
        };
        console.log(`  ✓ Uploaded image for ${testimonial.name}`);
      } catch (error) {
        console.warn(`  ✗ Image for ${testimonial.name}: ${error.message}`);
      }
    }

    items.push({
      _type: "testimonial",
      _key: slug,
      quote: testimonial.quote,
      name: testimonial.name,
      company: testimonial.company,
      image,
    });

    console.log(`  ✓ ${testimonial.name}${testimonial.company ? ` — ${testimonial.company}` : ""}`);
  }

  saveManifest(manifest);

  const testimonials = {
    eyebrow: "Client Feedback",
    heading: "Success Stories of Our Clients",
    items,
  };

  await patchTestimonials({
    projectId,
    dataset,
    token,
    docId: "homepage",
    testimonials,
  });
  console.log("\n  ✓ Patched homepage testimonials");

  await patchTestimonials({
    projectId,
    dataset,
    token,
    docId: "aboutPage",
    testimonials: {
      heading: testimonials.heading,
      items,
    },
  });
  console.log("  ✓ Patched aboutPage testimonials");

  console.log(`\nDone — seeded ${items.length} testimonials.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
