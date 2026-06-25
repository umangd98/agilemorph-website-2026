"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

type BlogListParamUpdates = {
  q?: string | null;
  category?: string | null;
  sort?: string | null;
  page?: string | null;
};

export function useBlogListParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const replaceParams = useCallback(
    (updates: BlogListParamUpdates, options?: { resetPage?: boolean }) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates) as [keyof BlogListParamUpdates, string | null | undefined][]) {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      if (options?.resetPage !== false) {
        params.delete("page");
      }

      const qs = params.toString();

      startTransition(() => {
        router.replace(qs ? `/blog?${qs}` : "/blog", { scroll: false });
      });
    },
    [router, searchParams],
  );

  return {
    searchParams,
    replaceParams,
    isPending,
  };
}
