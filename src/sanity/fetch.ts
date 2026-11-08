import type { QueryParams } from "next-sanity";

import { client } from "./client";

type SanityFetchOptions = {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
};

/**
 * Development-only content review: when SANITY_LOCAL_PREVIEW points at a
 * dataset file written by `scripts/patch-positioning-fde.mjs --emit-preview`,
 * queries run against that file instead of Sanity. Ignored in production.
 */
const localPreviewPath =
  process.env.NODE_ENV !== "production" ? process.env.SANITY_LOCAL_PREVIEW : undefined;

async function localPreviewFetch<T>(query: string, params: QueryParams): Promise<T> {
  const [{ readFile }, { join }, { parse, evaluate }] = await Promise.all([
    import("node:fs/promises"),
    import("node:path"),
    import("groq-js"),
  ]);
  const dataset = JSON.parse(
    await readFile(join(process.cwd(), localPreviewPath as string), "utf8"),
  );
  const result = await evaluate(parse(query, { params }), { dataset, params });
  return (await result.get()) as T;
}

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: SanityFetchOptions): Promise<T> {
  if (localPreviewPath) return localPreviewFetch<T>(query, params);

  const isDev = process.env.NODE_ENV === "development";

  return client.fetch<T>(query, params, {
    next: {
      revalidate: tags.length > 0 ? (isDev ? 0 : 3600) : revalidate,
      tags,
    },
  });
}
