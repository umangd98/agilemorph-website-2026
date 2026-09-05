# SEO fixes — `seo-fixes` branch

Changes from the page audit of `https://agilemorph.in/` (homepage). Target
keyword: **AI automation agency**. This branch fixes everything that lives in
code. The highest-impact copy lives in Sanity CMS and must be changed there;
those exact values are listed at the bottom.

---

## What changed in code

### 1. Fixed the broken H1 (crawlability + accessibility)

`HeroSection.tsx` rendered each heading word as an inline-block `<span>` with
no whitespace between spans. CSS margin faked the visual gap, so the H1 *looked*
fine but crawlers and screen readers read `CutTheOverhead.ReclaimYourTime...`
as one string with no keyword.

- `src/components/sections/HeroSection.tsx` — `WordReveal` now emits a real
  whitespace text node between words.
- `src/app/globals.css` — removed the horizontal `.word` margin (the real
  space now provides word spacing; visual result is unchanged).

### 2. Added JSON-LD structured data (none existed before)

- `src/lib/structured-data.ts` — builders for `Organization`, `WebSite`, and
  `FAQPage` schema.
- `src/components/StructuredData.tsx` — renders JSON-LD script tags (server
  component, no client JS).
- `src/app/layout.tsx` — injects `Organization` + `WebSite` site-wide, with
  socials pulled from Sanity `siteSettings` (falls back to known profiles).

**Note on AggregateRating:** deliberately NOT emitted. Google requires an
aggregate rating to be backed by reviews visible on the same page with a real
review count. The site shows a "4.9" badge but no review count or on-page
reviews, so marking it up now risks a manual action. Enable it once a real
`reviewCount` is available (e.g. surfaced from Clutch or Upwork) by adding an
`aggregateRating` node to `organizationSchema`.

### 3. Enriched metadata

- `src/app/layout.tsx` — added `metadataBase`, canonical, `openGraph`
  (type/url/siteName), `twitter` card, and keyword-aligned fallback title and
  description.
- `src/app/page.tsx` — keyword-aligned homepage fallback metadata + canonical.
- `src/lib/seo.ts` — per-page SEO (`seoToMetadata`, used by every page) now
  emits OG type/siteName and a Twitter card in addition to the image.

### 4. Added `robots.ts` and `sitemap.ts` (both were missing)

- `src/app/robots.ts` — allows crawling, disallows `/studio` and `/api/`,
  points to the sitemap.
- `src/app/sitemap.ts` — static routes plus service and blog pages fetched
  from Sanity. Dynamic fetches are wrapped in try/catch so a Sanity outage at
  build time still yields a valid sitemap.

### 5. Added the homepage FAQ + FAQPage schema (biggest structural gap)

All three top competitors (axeautomation.co, theaiautomationagency.ai,
prismetric.com) run a FAQ; the homepage had none. This closes the core semantic
gaps they cover and the homepage skipped: implementation timeline, cost model,
data ownership / self-hosting, AI-agent-vs-automation, ROI, team training, and
support.

- `src/data/homepage-faq.ts` — 10 curated Q&A (answers reuse only the
  company's own stated metrics; no invented numbers or pricing).
- `src/components/sections/FaqSection.tsx` — renders the FAQ and emits matching
  `FAQPage` JSON-LD (visible content and schema always match, per Google's
  rule). Makes the page eligible for FAQ rich results and citable by AI answer
  engines (ChatGPT Search, Perplexity, Google AI Overviews).
- Wired into `src/app/page.tsx` after Testimonials.

**Follow-up to make the FAQ CMS-editable:** add a `faq` (array of
`{question, answer}`) field to the `homepage` schema in Sanity, project it in
`homepageBelowFoldQuery`, and pass it as `<FaqSection items={homepage?.faq} />`.
The component already accepts an `items` prop and falls back to the curated set
when it is empty, so no component change is needed.

---

## Verification

- `npx tsc --noEmit` — passes.
- `npx eslint` on all changed files — passes (0 errors, 0 warnings).
- `npx next build` — compiles past all changed files; fails only when fetching
  Google Fonts and Sanity content, which need network access and env vars
  (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`) not present in
  the CI sandbox. Run the build in an environment with those to confirm.

---

## Must be changed in Sanity Studio (cannot be done from code)

The live title, meta description, and H1 text come from Sanity. Code only sets
the fallbacks. Update these in Studio for the fixes to take effect on the live
site.

### Title tag
- **Current:** `AgileMorph Solutions - Custom Software Integration Services`
- **Change to:** `AI Automation Agency for Growing SMBs | AgileMorph` (50 chars)
- **Where:** `siteSettings.siteTitle` (or homepage `seo.title`).
- **Why:** the current title targets the wrong term. The whole page sells AI
  automation. This is the single highest-impact SEO change.

### Meta description
- **Current:** `We revolutionize efficiency with AI Automation, craft impactful experiences through Web Development, and amplify influence via Digital Marketing.`
- **Change to:** `We build done-for-you AI automation that saves SMB teams 500K+ hours and counting. Claude & Make certified. Book a free discovery call.` (134 chars)
- **Where:** `siteSettings.siteDescription` (or homepage `seo.description`).

### H1 (hero heading)
- **Current:** heading = `Cut the overhead.\nReclaim your time.` + accent
  `Let AI handle the execution` (no target keyword).
- **Change to:** put the keyword in the heading, e.g.
  heading = `AI automation that cuts the overhead\nand reclaims your time`,
  accent = `Let AI handle the execution.`
- **Where:** homepage `hero.heading` and `hero.headingAccent` in Studio.
- The spacing bug is already fixed in code regardless of the text.

---

## Recommended next (from the audit, not in this PR)

1. Publish 3 named case studies with quantified outcomes.
2. Add more results-based testimonials (only one exists today) near the CTA.
3. Build industry landing pages for the ICP (marketing agencies, B2B services).
4. Add a named founder bio on the homepage or About page for E-E-A-T.
