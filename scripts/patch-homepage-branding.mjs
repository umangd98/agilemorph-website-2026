#!/usr/bin/env node
/**
 * One-off patch: hero badge removal, Claude partner rename, Upwork label, brand logo upload.
 * Usage: node scripts/patch-homepage-branding.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const MANIFEST_PATH = join(__dirname, "media-manifest.json");
const ENV_PATH = join(ROOT, ".env.local");
const BRAND_LOGO_PATH = join(
  process.env.HOME,
  ".cursor/projects/Users-satvik-Downloads-projects-agilemorph-agilemorph-site/assets/Screenshot_2026-06-18_at_3.39.57_PM-61457487-d42a-46c6-b77f-72d03c9fec6f.png",
);

const CLAUDE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 257" fill="#D97757"><path d="m50.228 170.321l50.357-28.257l.843-2.463l-.843-1.361h-2.462l-8.426-.518l-28.775-.778l-24.952-1.037l-24.175-1.296l-6.092-1.297L0 125.796l.583-3.759l5.12-3.434l7.324.648l16.202 1.101l24.304 1.685l17.629 1.037l26.118 2.722h4.148l.583-1.685l-1.426-1.037l-1.101-1.037l-25.147-17.045l-27.22-18.017l-14.258-10.37l-7.713-5.25l-3.888-4.925l-1.685-10.758l7-7.713l9.397.649l2.398.648l9.527 7.323l20.35 15.75L94.817 91.9l3.889 3.24l1.555-1.102l.195-.777l-1.75-2.917l-14.453-26.118l-15.425-26.572l-6.87-11.018l-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0l10.63 1.426l4.472 3.888l6.61 15.101l10.694 23.786l16.591 32.34l4.861 9.592l2.592 8.879l.973 2.722h1.685v-1.556l1.36-18.211l2.528-22.36l2.463-28.776l.843-8.1l4.018-9.722l7.971-5.25l6.222 2.981l5.12 7.324l-.713 4.73l-3.046 19.768l-5.962 30.98l-3.889 20.739h2.268l2.593-2.593l10.499-13.934l17.628-22.036l7.778-8.749l9.073-9.657l5.833-4.601h11.018l8.1 12.055l-3.628 12.443l-11.342 14.388l-9.398 12.184l-13.48 18.147l-8.426 14.518l.778 1.166l2.01-.194l30.46-6.481l16.462-2.982l19.637-3.37l8.88 4.148l.971 4.213l-3.5 8.62l-20.998 5.184l-24.628 4.926l-36.682 8.685l-.454.324l.519.648l16.526 1.555l7.065.389h17.304l32.21 2.398l8.426 5.574l5.055 6.805l-.843 5.184l-12.962 6.611l-17.498-4.148l-40.83-9.721l-14-3.5h-1.944v1.167l11.666 11.406l21.387 19.314l26.767 24.887l1.36 6.157l-3.434 4.86l-3.63-.518l-23.526-17.693l-9.073-7.972l-20.545-17.304h-1.36v1.814l4.73 6.935l25.017 37.59l1.296 11.536l-1.814 3.76l-6.481 2.268l-7.13-1.297l-14.647-20.544l-15.1-23.138l-12.185-20.739l-1.49.843l-7.194 77.448l-3.37 3.953l-7.778 2.981l-6.48-4.925l-3.436-7.972l3.435-15.749l4.148-20.544l3.37-16.333l3.046-20.285l1.815-6.74l-.13-.454l-1.49.194l-15.295 20.999l-23.267 31.433l-18.406 19.702l-4.407 1.75l-7.648-3.954l.713-7.064l4.277-6.286l25.47-32.405l15.36-20.092l9.917-11.6l-.065-1.686h-.583L44.07 198.125l-12.055 1.555l-5.185-4.86l.648-7.972l2.463-2.593l20.35-13.999z"/></svg>`;

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

function loadManifest() {
  return existsSync(MANIFEST_PATH)
    ? JSON.parse(readFileSync(MANIFEST_PATH, "utf8"))
    : {};
}

function saveManifest(manifest) {
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

async function uploadBuffer({ buffer, filename, contentType, projectId, dataset, token }) {
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
  return { id: json.document._id, url: json.document.url };
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

function updatePartners(partners, claudeAssetId) {
  const items = partners.items.map((item) => {
    if (item._key === "anthropic") {
      return {
        ...item,
        name: "Claude",
        label: "SERVICE PARTNER",
        url: "https://www.anthropic.com/claude",
        logo: {
          _type: "image",
          asset: { _type: "reference", _ref: claudeAssetId },
          alt: "Claude logo",
        },
      };
    }
    if (item._key === "upwork") {
      return { ...item, label: "TOP RATED" };
    }
    return item;
  });
  return { ...partners, items };
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("Missing SANITY_API_WRITE_TOKEN");

  const manifest = loadManifest();

  console.log("Uploading Claude partner logo...");
  let claudeAsset = manifest["partners/claude.svg"];
  if (!claudeAsset?.id) {
    claudeAsset = await uploadBuffer({
      buffer: Buffer.from(CLAUDE_SVG),
      filename: "claude.svg",
      contentType: "image/svg+xml",
      projectId,
      dataset,
      token,
    });
    manifest["partners/claude.svg"] = claudeAsset;
    console.log(`  ✓ ${claudeAsset.url}`);
  }

  console.log("Uploading brand logo...");
  let brandAsset = manifest["brand/logo-primary.png"];
  if (!brandAsset?.id) {
    if (!existsSync(BRAND_LOGO_PATH)) {
      throw new Error(`Brand logo not found at ${BRAND_LOGO_PATH}`);
    }
    brandAsset = await uploadBuffer({
      buffer: readFileSync(BRAND_LOGO_PATH),
      filename: "agilemorph-logo-primary.png",
      contentType: "image/png",
      projectId,
      dataset,
      token,
    });
    manifest["brand/logo-primary.png"] = brandAsset;
    console.log(`  ✓ ${brandAsset.url}`);
  }

  saveManifest(manifest);

  for (const docId of ["homepage", "aboutPage"]) {
    console.log(`Patching ${docId}...`);
    const doc = await fetchDocument({ projectId, dataset, token, id: docId });
    if (!doc) {
      console.warn(`  ⚠ ${docId} not found, skipping`);
      continue;
    }

    const partners = updatePartners(doc.partners, claudeAsset.id);
    const mutations = [
      {
        patch: {
          id: docId,
          unset: ["hero.badge"],
          set: { partners },
        },
      },
    ];
    await mutate({ projectId, dataset, token, mutations });
    console.log(`  ✓ Patched ${docId}`);
  }

  console.log("\nBrand logo CDN URL:", brandAsset.url);
  console.log("Done. (Patches applied directly to published documents.)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
