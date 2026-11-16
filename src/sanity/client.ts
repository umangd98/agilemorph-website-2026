import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, readToken } from "./env";

/**
 * Set SANITY_PREVIEW_DRAFTS=true (with SANITY_API_READ_TOKEN) to render
 * unpublished drafts. Used to review CMS copy on a branch before anyone
 * publishes it. Never set this on the production deploy.
 */
export const previewDrafts =
  process.env.SANITY_PREVIEW_DRAFTS === "true" && Boolean(readToken);

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !previewDrafts,
  perspective: previewDrafts ? "previewDrafts" : "published",
  token: previewDrafts ? readToken : undefined,
  stega: {
    enabled: false,
  },
});
