# Website overhaul: preview and release

The revised site positions AgileMorph as a software and AI engineering partner. It includes 21 project entries, eight detailed case studies, four primary service groups, six additional service/engagement pages, reviewed company and leadership content, and scoped engagement pricing.

## Preview

```sh
nvm use # Node 22; install it first if needed
npm ci
npm run dev:reviewed -- --port 3100
```

Open http://localhost:3100. `CONTENT_SOURCE=reviewed` selects `src/data/reviewed-content.json`; it does not modify Sanity. Blog articles continue to load from the configured published CMS; three reviewed body corrections are overlaid in fixture preview to remove unsupported aggregate claims and guarantees. Their titles, metadata, URLs, and other fields stay in the CMS. The workspace's gitignored `.env.local` selects this preview mode. For an isolated build preview use `npm run build:reviewed` then `npm start -- --port 3100`.

Production defaults to `CONTENT_SOURCE=sanity`. Marketing documents must have `contentVersion: 2`. The application deliberately fails with an actionable server error if the singleton migration has not been applied; it does not silently render the old claims. Run the content migration before building the production release with the Sanity source.

## Content editing

Sanity Studio includes Projects & Case Studies. Project references control homepage/service ordering. A detailed page requires a problem, contribution, and outcome. Summary-only entries appear on the portfolio without invented detail pages. Existing technology assets appear in a compact supporting row, distinct from credentials. Results are only rendered for delivered work.

Company work and previous team engagements have separate attribution and status fields. Use public client descriptors for anonymous company projects. Never upload internal source documents, confidential client names, or approval notes to the public dataset. Local portrait paths are provided; an editor can clear that path and select a CMS image instead.

Shared engagements live on Engagements & Pricing; homepage, pricing, contact, and diagnostic audit read the same entries. Home FAQs, audiences, delivery process, client quotes, and project references are editable. Company profile content lives on About. Navigation, public credentials, and social links live in Site Settings. Blog posts support workflow/comparison diagrams and optional related-project references.

## Validation

```sh
npm run test:content
npx tsc --noEmit
npm run lint
npm run build:reviewed
npx playwright install chromium
npm run test:browser
```

Browser tests expect the preview on port 3100, or `TEST_BASE_URL` set to a different preview origin. `PLAYWRIGHT_CHROMIUM_EXECUTABLE` optionally selects an existing Chromium executable. Tests cover public routes, canonicals, sitemap, redirects, filters, themes, reduced motion, responsive overflow, keyboard focus, and mocked form failure/retry/success. Screenshots and results are saved under `.context/overhaul/`.

No browser test sends a real enquiry. A successful mocked form submission does not establish that a deployed form reaches the team.

### Completed review checks (6 October 2026)

- Production fixture build: passed, including TypeScript checking and 77 generated pages.
- Content, migration, draft/concurrency protection, rollback, and webhook tests: 15 passed.
- Browser checks against the production preview: 31 routes passed; 390px, 768px, and 1440px; both themes; reduced motion; keyboard navigation; project filters; FAQs; image loading; redirects; sitemap; canonical URLs; controlled contact failure/retry/success; existing Calendly destination.
- Sanity schema validation: zero errors and zero warnings.
- ESLint: zero errors, eight warnings in legacy scripts, logo image markup, script placement rules, and an unused legacy query projection.
- Read-only migration preview: 41 affected documents (33 creates, eight patches), with no visible pending drafts. Unrelated documents are excluded. No content migration was applied.

The production preview for this workspace is running at http://localhost:3101. Screenshots and machine-readable browser results are in `.context/overhaul/`; the exact proposed CMS diff is `.context/reviewed-migration-plan.json`. The preview uses reviewed fixtures and does not demonstrate published CMS changes or actual Netlify enquiry delivery.

## Visual refinement

The homepage now pairs its introduction with an interactive, explicitly labeled workflow illustration. Featured projects use larger visual previews; additional portfolio experience uses compact rows. Services, delivery, leadership, feedback, engagements, and closing calls to action have distinct layouts while retaining the existing logo, typography, green palette, and both themes.

All eight detailed case studies share a visual overview, visible attribution and status, chapter navigation, engineering decisions, and scoped results. Illustrations describe documented workflows; they are not product screenshots. This refinement does not change the reviewed content fixtures or CMS migration.

The production preview remains at http://localhost:3101. Updated screenshots and browser results are under `.context/design/`, including `homepage.png`, `homepage-mobile.png`, `home-1440-dark.png`, and `publisher-desktop.png`. Set `TEST_OUTPUT_DIR=.context/design` to reproduce this output location. Browser coverage also checks keyboard selection of the homepage workflows, their case-study destinations, actual FAQ controls, and motion preferences.

The refined production build and all 15 content/migration/webhook tests passed. Browser checks passed across 31 routes at 390px, 768px, and 1440px in both themes. ESLint has zero errors and the same eight legacy warnings. Contact responses were controlled in tests; production submission delivery remains a staging release check.

## Reviewable migration

Configure `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`. Read-only runs can use the public dataset or an explicit `SANITY_API_READ_TOKEN`. Use a read token to include unpublished drafts in the preview; an unauthenticated public read cannot necessarily see them. Apply and rollback use the write token to check for drafts and stop if target documents have unpublished edits.

```sh
node --env-file=.env.local scripts/migrate-reviewed-content.mjs --output .context/reviewed-migration-plan.json
```

This performs reads and writes a local plan only. Inspect each document's `set` and `unset` list. Historical marketing seed/patch scripts now stop before writing; they must not restore the old offers or claims.

For an authorized content release, provide `SANITY_API_WRITE_TOKEN` through the environment and apply the reviewed plan:

```sh
node --env-file=.env.local scripts/migrate-reviewed-content.mjs --apply --plan .context/reviewed-migration-plan.json
```

The migration validates project/dataset identity, source content hash, plan integrity, and document revisions. It refuses to publish over pending draft edits; resolve those edits and regenerate the plan first. It saves the before-state before any write, then applies one atomic transaction with revision guards. New documents use deterministic IDs. Only managed fields change, including explicit removal of retired marketing fields. The unrelated `singleton-aboutPage` and other non-target documents are untouched. Three existing blog documents receive reviewed body corrections; their SEO and other unrelated fields are preserved. Missing correction targets stop the migration instead of creating incomplete articles.

A fresh dry run after migration should contain no changes. If content or CMS revisions change after a dry run, generate and review a new plan. Receipts containing before-state and post-migration revisions are stored in `.context/content-backups/` and must be retained securely for rollback.

## Rollback

Preview a rollback using the exact receipt printed by the apply command:

```sh
node --env-file=.env.local scripts/migrate-reviewed-content.mjs --rollback .context/content-backups/RECEIPT.json
```

Apply it with the same arguments plus `--apply`. Rollback restores managed fields, removes documents created by the migration, and refuses to overwrite subsequent edits. Restore the matching previous application deployment together with its previous content. An interrupted network response after a mutation needs transaction-history inspection before retrying; the pre-write backup remains available, but an unconfirmed receipt must not be treated as a successful apply.

## Release sequence

1. Review the fixture preview and migration diff. Retain the generated before-state backup.
2. Validate the reviewed schemas in the embedded Studio on a supported Node version. The application manifest requires Node 22.12+ for compatibility with the installed Sanity tooling; `.nvmrc` selects Node 22.
3. Apply the migration during the coordinated release window, then run a read-only dry run to confirm no pending changes.
4. Build and deploy with `CONTENT_SOURCE=sanity`. Do not deploy the preview source accidentally.
5. Configure the authenticated Sanity revalidation webhook for all marketing types, including `caseStudy`. The handler invalidates the shared `reviewedContent` tag so project edits refresh portfolio, homepage, and service references.
6. Configure hosting for `theagilemorph.com`, certificates, and permanent redirects from alternative domains while preserving path/query. DNS and cross-domain redirects have not been changed by this implementation.
7. On staging, verify that Netlify Forms recognizes the `contact` form and use an explicitly authorized test submission to confirm receipt. The existing handler assumes Netlify form processing; a different hosting provider requires a working backend before form delivery can be claimed.
8. Confirm Calendly opens the existing 15-minute discovery calendar, and review the Tidio chat configuration and privacy notice against the production account settings.
9. Smoke-test navigation, canonical URLs, representative case studies, sitemap, and form behavior after publication. Monitor hosting errors and form deliveries.

## Deliberately omitted evidence

- Aggregate totals, overall retention, unsourced star ratings, guaranteed performance, and additional partner badges.
- Client logos, product screenshots, and individual profile links that were not provided.
- Quantified results for company projects whose reference supplies none.
- A company certification inferred from a client's HIPAA/SOC 2 program.
- A completed transfer of Chronoseconds from Quido.
- New definitive case studies derived solely from unreconciled agency/manufacturing blog stories.

Workflow illustrations are explicitly labeled and based on documented systems. Anonymous company projects remain anonymous. The privacy notice describes observed website tools; it does not promise retention periods or project-specific compliance arrangements.
