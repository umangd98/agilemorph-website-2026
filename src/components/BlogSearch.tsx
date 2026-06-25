"use client";

import { Loader2, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const DEBOUNCE_MS = 300;

type BlogSearchProps = {
  initialQuery?: string;
};

export function BlogSearch({ initialQuery = "" }: BlogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const [isPending, startTransition] = useTransition();
  const pendingUrlQueryRef = useRef<string | null>(null);

  useEffect(() => {
    const urlQuery = searchParams.get("q") ?? "";

    if (pendingUrlQueryRef.current === urlQuery) {
      pendingUrlQueryRef.current = null;
      return;
    }

    setQuery((current) => (current === urlQuery ? current : urlQuery));
  }, [searchParams]);

  useEffect(() => {
    const nextQuery = debouncedQuery.trim();
    const currentQuery = (searchParams.get("q") ?? "").trim();

    if (nextQuery === currentQuery) {
      return;
    }

    pendingUrlQueryRef.current = nextQuery;

    const params = new URLSearchParams(searchParams.toString());

    if (nextQuery) {
      params.set("q", nextQuery);
    } else {
      params.delete("q");
    }

    params.delete("page");

    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `/blog?${qs}` : "/blog", { scroll: false });
    });
  }, [debouncedQuery, router, searchParams]);

  const showSpinner = query.trim() !== debouncedQuery.trim() || isPending;

  return (
    <div className="relative max-w-xl">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="text"
        role="searchbox"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search posts by title, excerpt, author, or category…"
        aria-label="Search blog posts"
        className="w-full rounded-xl border border-border bg-surface py-3 pr-11 pl-11 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {query ? (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-3 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : showSpinner ? (
        <Loader2
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
        />
      ) : null}
    </div>
  );
}
