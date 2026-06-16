#!/usr/bin/env node
/**
 * Scrapes blogs and service pages from theagilemorph.com (WordPress REST API)
 * and seeds/updates Sanity documents.
 *
 * Usage: node scripts/scrape-wordpress.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const MANIFEST_PATH = join(__dirname, "media-manifest.json");
const ENV_PATH = join(ROOT, ".env.local");
const WP_BASE = "https://theagilemorph.com/wp-json/wp/v2";

const SERVICE_PAGE_MAP = [
  { wpSlug: "ai-automation-development", sanitySlug: "ai-automation", wpId: 842, title: "AI Automation Development" },
  { wpSlug: "website-development", sanitySlug: "website-development", wpId: 2462, title: "Website Development" },
  { wpSlug: "digital-marketing-services", sanitySlug: "digital-marketing", wpId: 2571, title: "Digital Marketing Services" },
  { wpSlug: "virtual-assistance-services", sanitySlug: "virtual-assistance", wpId: 2554, title: "Virtual Assistance Services" },
  { wpSlug: "book-keeping-services", sanitySlug: "bookkeeping", wpId: 2528, title: "Book keeping Services" },
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

function getAuthToken({ preferCli = false } = {}) {
  const configPath = join(process.env.HOME, ".config/sanity/config.json");
  const cliToken =
    existsSync(configPath) &&
    JSON.parse(readFileSync(configPath, "utf8")).authToken;

  if (preferCli && cliToken) return cliToken;

  const env = loadEnv();
  if (env.SANITY_API_WRITE_TOKEN) return env.SANITY_API_WRITE_TOKEN;
  if (cliToken) return cliToken;
  if (env.SANITY_API_READ_TOKEN) return env.SANITY_API_READ_TOKEN;

  throw new Error("No Sanity auth token found.");
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
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
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

function cta(label, href, openInNewTab = false) {
  return { _type: "ctaButton", label, href, openInNewTab };
}

async function wpFetch(path) {
  const response = await fetch(`${WP_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`WP fetch failed ${path}: ${response.status}`);
  }
  return response.json();
}

async function uploadFromUrl({ url, filename, projectId, dataset, token, manifest }) {
  const manifestKey = `wp-imports/${filename}`;
  if (manifest[manifestKey]?.id) {
    return manifest[manifestKey];
  }

  const response = await fetch(url);
  if (!response.ok) {
    console.warn(`Failed to download ${url}`);
    return null;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") ?? "image/jpeg";
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
    console.warn(`Upload failed for ${filename}: ${text}`);
    return null;
  }

  const json = await uploadResponse.json();
  const asset = { id: json.document._id, url: json.document.url };
  manifest[manifestKey] = asset;
  return asset;
}

function htmlToPortableText(html) {
  const $ = cheerio.load(html);
  const blocks = [];
  let index = 0;

  $("h2, h3, h4, p, li").each((_, element) => {
    const tag = element.tagName?.toLowerCase();
    const text = $(element).text().replace(/\s+/g, " ").trim();
    if (!text || text.length < 2) return;

    const style =
      tag === "h2" ? "h2" : tag === "h3" ? "h3" : tag === "h4" ? "h4" : "normal";

    blocks.push({
      _type: "block",
      _key: `block-${index}`,
      style,
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `span-${index}`,
          text,
          marks: [],
        },
      ],
    });
    index += 1;
  });

  return blocks.slice(0, 300);
}

function parseServicePage(page) {
  const $ = cheerio.load(page.content.rendered);
  const title = decodeHtml(page.title.rendered);
  const paragraphs = $("p")
    .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
    .get()
    .filter((text) => text.length > 20);

  const tagline = paragraphs[0] ?? "";
  const description = paragraphs[1] ?? paragraphs[0] ?? "";

  const capabilities = [];
  $(".swiper-slide").each((_, slide) => {
    const slideTitle = $(slide).find("h3").first().text().replace(/\s+/g, " ").trim();
    const slideDesc = $(slide).find("p").first().text().replace(/\s+/g, " ").trim();
    if (slideTitle && slideDesc) {
      capabilities.push({ title: slideTitle, description: slideDesc });
    }
  });

  if (!capabilities.length) {
    $("h3").each((_, el) => {
      const capTitle = $(el).text().replace(/\s+/g, " ").trim();
      const capDesc = $(el).next("p").text().replace(/\s+/g, " ").trim();
      if (capTitle && capDesc && capTitle.length < 80) {
        capabilities.push({ title: capTitle, description: capDesc });
      }
    });
  }

  const whyUs = [];
  $("summary").each((_, el) => {
    const whyTitle = $(el)
      .find(".e-n-accordion-item-title-text")
      .text()
      .replace(/\s+/g, " ")
      .trim();
    const whyDesc = $(el)
      .next()
      .find(".elementor-widget-text-editor p")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();
    if (whyTitle && whyDesc) {
      whyUs.push({ title: whyTitle, description: whyDesc });
    }
  });

  const technologies = [];
  let inTechSection = false;
  $("h2, h3").each((_, el) => {
    const heading = $(el).text().replace(/\s+/g, " ").trim();
    if (/technologies/i.test(heading)) {
      inTechSection = true;
      return;
    }
    if (/ready to|scale your|why you choose/i.test(heading)) {
      inTechSection = false;
      return;
    }
    if (inTechSection && el.tagName === "h3") {
      const techName = heading;
      if (techName && techName.length < 40) {
        technologies.push({ name: techName });
      }
    }
  });

  const ctaHeading = "Ready to scale your brand?";
  const ctaDescription =
    "Crafting exceptional digital experiences for your business success.";

  return {
    title,
    tagline,
    description,
    capabilitiesHeading: "Here are More Services We Can Help You with",
    capabilities: capabilities.map((item) => ({
      _type: "capabilityItem",
      title: item.title,
      description: item.description,
    })),
    whyUsHeading: `Why You Choose Us for ${title} Services?`,
    whyUs: whyUs.map((item) => ({
      _type: "whyUsItem",
      title: item.title,
      description: item.description,
    })),
    technologiesHeading: "Technologies that power our solutions",
    technologies: technologies.map((item) => ({
      _type: "technologyItem",
      name: item.name,
    })),
    cta: {
      heading: ctaHeading,
      description: ctaDescription,
      button: cta("Schedule a Consultation", "/contact"),
    },
    seo: {
      title: `${title} - AgileMorph Solutions`,
      description: description.slice(0, 160),
    },
  };
}

async function fetchCategories() {
  const categories = await wpFetch("/categories?per_page=100");
  return Object.fromEntries(categories.map((cat) => [cat.id, cat.name]));
}

async function fetchFeaturedImage(mediaId, { projectId, dataset, token, manifest }) {
  if (!mediaId) return undefined;
  try {
    const media = await wpFetch(`/media/${mediaId}`);
    const sourceUrl = media.source_url;
    if (!sourceUrl) return undefined;

    const filename = sourceUrl.split("/").pop() ?? `media-${mediaId}.jpg`;
    const asset = await uploadFromUrl({
      url: sourceUrl,
      filename,
      projectId,
      dataset,
      token,
      manifest,
    });

    if (!asset?.id) return undefined;

    return {
      _type: "image",
      asset: { _type: "reference", _ref: asset.id },
      alt: decodeHtml(media.title?.rendered ?? ""),
    };
  } catch {
    return undefined;
  }
}

async function buildBlogPosts({ projectId, dataset, token, manifest }) {
  const categoryMap = await fetchCategories();
  const posts = await wpFetch("/posts?per_page=100&orderby=date&order=desc");
  const blogPosts = [];

  console.log(`Scraping ${posts.length} blog posts...`);

  for (const post of posts) {
    const title = decodeHtml(post.title.rendered);
    const slug = post.slug;
    const excerpt = decodeHtml(post.excerpt.rendered);
    const body = htmlToPortableText(post.content.rendered);
    const categories = (post.categories ?? [])
      .map((id) => categoryMap[id])
      .filter(Boolean);
    const coverImage = await fetchFeaturedImage(post.featured_media, {
      projectId,
      dataset,
      token,
      manifest,
    });

    blogPosts.push({
      _id: `blogPost-${slug}`,
      _type: "blogPost",
      title,
      slug: { _type: "slug", current: slug },
      excerpt,
      body,
      publishedAt: new Date(post.date).toISOString(),
      categories,
      coverImage,
      seo: {
        title: `${title} - AgileMorph Solutions`,
        description: excerpt.slice(0, 160),
        ogImage: coverImage,
      },
    });

    console.log(`  ✓ ${title}`);
  }

  return blogPosts;
}

async function buildServicePagesFromWp(manifest) {
  const servicePages = [];

  for (const mapping of SERVICE_PAGE_MAP) {
    const page = await wpFetch(`/pages/${mapping.wpId}`);
    const parsed = parseServicePage(page);

    const heroImageKeys = {
      "ai-automation": "2025/09/AI-Automation-Development-Services.jpg",
      "website-development": "2025/03/Website-Design-and-Development.svg",
      "digital-marketing": "2025/03/Social-Media-Marketing.svg",
      "virtual-assistance": "2025/03/Administrative-Support.svg",
      bookkeeping: "2025/03/Accurate-Bookkeeping.svg",
    };

    servicePages.push({
      _id: `servicePage-${mapping.sanitySlug}`,
      _type: "servicePage",
      ...parsed,
      title: mapping.title ?? parsed.title,
      slug: { _type: "slug", current: mapping.sanitySlug },
      heroImage: imageRef(
        manifest,
        heroImageKeys[mapping.sanitySlug],
        parsed.title,
      ),
      heroCta: cta(
        mapping.sanitySlug === "ai-automation"
          ? "Start Your AI Journey"
          : "Share Your Product Idea",
        "/contact",
      ),
    });

    console.log(
      `  ✓ ${parsed.title} (${parsed.capabilities.length} capabilities, ${parsed.whyUs.length} why-us)`,
    );
  }

  return servicePages;
}

async function deleteOrphanBlogPosts({ projectId, dataset, token, keepIds }) {
  const query = encodeURIComponent('*[_type == "blogPost"]._id');
  const response = await fetch(
    `https://${projectId}.api.sanity.io/v2021-06-07/data/query/${dataset}?query=${query}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const { result: ids } = await response.json();
  const keepSet = new Set(keepIds);
  const toDelete = (ids ?? []).filter((id) => !keepSet.has(id));

  if (!toDelete.length) return;

  console.log(`Removing ${toDelete.length} non-AgileMorph blog posts...`);
  const batchSize = 50;
  for (let i = 0; i < toDelete.length; i += batchSize) {
    const batch = toDelete.slice(i, i + batchSize);
    const mutateResponse = await fetch(
      `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mutations: batch.map((id) => ({ delete: { id } })),
        }),
      },
    );
    if (!mutateResponse.ok) {
      const text = await mutateResponse.text();
      throw new Error(`Blog cleanup failed: ${text}`);
    }
  }
}

async function mutateDocuments({ projectId, dataset, token, documents }) {
  const batchSize = 10;
  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);
    const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mutations: batch.map((doc) => ({ createOrReplace: doc })),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Mutate failed: ${response.status} ${text}`);
    }
  }
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getAuthToken({ preferCli: true });
  const manifest = loadManifest();

  console.log("Scraping service pages from WordPress...");
  const servicePages = await buildServicePagesFromWp(manifest);

  console.log("\nScraping blog posts from WordPress...");
  const blogPosts = await buildBlogPosts({ projectId, dataset, token, manifest });

  saveManifest(manifest);

  const documents = [...servicePages, ...blogPosts];
  const blogIds = blogPosts.map((post) => post._id);

  await deleteOrphanBlogPosts({ projectId, dataset, token, keepIds: blogIds });

  console.log(`\nSeeding ${documents.length} documents to Sanity...`);
  await mutateDocuments({ projectId, dataset, token, documents });
  console.log("Scrape and seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
