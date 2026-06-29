#!/usr/bin/env node
/**
 * Process leadership portraits, upload to Sanity, and patch aboutPage.teamLeads.
 * Usage: npm run upload:team-leads
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const MANIFEST_PATH = join(__dirname, "media-manifest.json");
const ENV_PATH = join(ROOT, ".env.local");

const TEAM_LEAD_KEYS = [
  "team-leads/umang-dhandhania.png",
  "team-leads/kaustumbh-jaiswal.png",
  "team-leads/muskan-agrawal.png",
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

function imageRef(manifest, key, alt = "") {
  const asset = manifest[key];
  if (!asset?.id) return undefined;
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset.id },
    alt,
  };
}

async function patchTeamLeads(dataset, projectId, token, manifest) {
  const teamLeads = {
    eyebrow: "Leadership",
    heading: "Meet Our Leadership",
    subheading:
      "The people steering strategy, engineering, and delivery, building automation that ships fast and scales with your business.",
    cardFooter: "AgileMorph leadership",
    members: [
      {
        _type: "teamLeadItem",
        _key: "umang",
        name: "Umang Dhandhania",
        role: "CEO",
        bio: "A Northwestern-educated engineer who turns complex business problems into clear, revenue-lifting systems. Over the past decade he has guided more than 100 companies through launches, process overhauls, and market-ready builds that beat timelines and KPIs.",
        image: imageRef(manifest, "team-leads/umang-dhandhania.png", "Umang Dhandhania"),
      },
      {
        _type: "teamLeadItem",
        _key: "kaustumbh",
        name: "Kaustumbh Jaiswal",
        role: "CTO",
        bio: "Leads AgileMorph's engineering and product architecture, turning automation strategy into reliable, scalable systems. He pairs deep technical craft with a builder's mindset so every solution ships fast and holds up in production.",
        image: imageRef(manifest, "team-leads/kaustumbh-jaiswal.png", "Kaustumbh Jaiswal"),
      },
      {
        _type: "teamLeadItem",
        _key: "muskan",
        name: "Muskan Agrawal",
        role: "COO",
        bio: "Keeps delivery sharp across client engagements, aligning teams, timelines, and outcomes so projects move from discovery to launch without friction. She brings operational rigor and a client-first lens to every engagement.",
        image: imageRef(manifest, "team-leads/muskan-agrawal.png", "Muskan Agrawal"),
      },
    ],
  };

  const response = await fetch(
    `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mutations: [{ patch: { id: "aboutPage", set: { teamLeads } } }],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

function main() {
  console.log("Processing team lead portraits...");
  execSync("python3 scripts/process-team-leads.py", { cwd: ROOT, stdio: "inherit" });

  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
  for (const key of TEAM_LEAD_KEYS) {
    delete manifest[key];
  }
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log("Uploading to Sanity...");
  execSync("node scripts/upload-media.mjs", { cwd: ROOT, stdio: "inherit" });

  const updatedManifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
  for (const key of TEAM_LEAD_KEYS) {
    if (!updatedManifest[key]?.id) {
      throw new Error(`Upload failed for ${key}`);
    }
    console.log(`✓ ${key} → ${updatedManifest[key].id}`);
  }

  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getAuthToken();

  return patchTeamLeads(dataset, projectId, token, updatedManifest).then(() => {
    console.log("Patched aboutPage.teamLeads in Sanity.");
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
