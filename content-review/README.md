# Content handoff

The marketing pages are written in code: `src/content/site.ts` and
`src/content/case-studies.ts`. Edit copy there. Sanity holds the blog only.

## Before launch

- **Case studies** are anonymised. To name a client, change `client` in
  `src/content/case-studies.ts`. Outcome figures appear only once supplied;
  until then each page says the figures are being confirmed with the client.
- **Founder bios** in `src/content/site.ts` need both founders' sign-off.
- **Blog spelling fixes.** `node scripts/patch-blog-copy.mjs` saves "AgileMorph",
  em dash and unverified-metric fixes to 8 live posts as Sanity drafts. It needs
  a token with Editor rights; the current one can't create documents. Publish
  the drafts from Studio. `--dry-run` writes `blog-copy-diff.md` only.

## Retired content

- Service pages, What we build, Pricing, the CAT product page, the Peak Week
  Calculator and Events 301 to the closest page. See `next.config.ts`.
- 40 blog posts written for the old positioning are hidden and 301 to `/blog`
  (`src/data/retired-blog-posts.ts`). They are still in Sanity. Delete them in
  Studio once you agree with the list.
- The old Sanity page documents (homepage, about, contact, pricing, service
  pages, site settings) are no longer in the schema and can be deleted.
