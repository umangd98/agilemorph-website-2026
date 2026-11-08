# Forward Deployed Engineering repositioning: content handoff

The page copy for this branch lives in Sanity. It has **not** been written yet:
the `SANITY_API_WRITE_TOKEN` in `.env.local` was refused with
`Insufficient permissions; permission "create" required`.

- `positioning-fde-copy-diff.md` lists every Sanity string that changes, before and after, document by document.
- `scripts/patch-positioning-fde.mjs` applies exactly that diff as **unpublished drafts**. Its copy is in `scripts/positioning-fde-content.mjs`.

## Review the branch locally before any CMS write

```bash
node scripts/patch-positioning-fde.mjs --emit-preview   # needs only the read token
SANITY_LOCAL_PREVIEW=content-review/preview-dataset.json npm run dev
```

## Apply to Sanity

1. Put a token with Editor (create) rights in `SANITY_API_WRITE_TOKEN`.
2. `node scripts/patch-positioning-fde.mjs` writes drafts only. Nothing goes live.
3. Review with `SANITY_PREVIEW_DRAFTS=true npm run dev`, or in Studio.
4. Resolve every `[CONFIRM]` item, then publish from Studio.

## Launch order

Publish the drafts before or at the same time as deploying this branch.
`/how-we-work` returns a 404, and the new homepage sections stay hidden, until
the `howWeWorkPage` and homepage drafts are published. Publish case studies
one at a time, as each client approves.
