import type { QueryParams } from "next-sanity";

import { client } from "./client";

type SanityFetchOptions = {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
};

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: SanityFetchOptions): Promise<T> {
  const isDev = process.env.NODE_ENV === "development";

  return client.fetch<T>(query, params, {
    next: {
      revalidate: tags.length > 0 ? (isDev ? 0 : 3600) : revalidate,
      tags,
    },
  });
}
