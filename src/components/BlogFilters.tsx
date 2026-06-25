"use client";

import { Loader2 } from "lucide-react";

import { useBlogListParams } from "@/hooks/useBlogListParams";
import {
  BLOG_SORT_OPTIONS,
  decodeCategoryLabel,
  parseBlogSort,
  type BlogSort,
} from "@/lib/blog-list";

type BlogFiltersProps = {
  categories: string[];
  activeCategory?: string;
  activeSort?: BlogSort;
};

const selectClassName =
  "w-full appearance-none rounded-xl border border-border bg-surface py-3 pr-10 pl-4 font-body text-sm text-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20";

export function BlogFilters({
  categories,
  activeCategory = "",
  activeSort = "newest",
}: BlogFiltersProps) {
  const { replaceParams, isPending } = useBlogListParams();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative min-w-0 flex-1 lg:max-w-md">
        <label htmlFor="blog-category-filter" className="sr-only">
          Filter by category
        </label>
        <select
          id="blog-category-filter"
          value={activeCategory}
          onChange={(event) => {
            replaceParams({ category: event.target.value || null });
          }}
          className={selectClassName}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {decodeCategoryLabel(category)}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-body text-xs text-muted-foreground"
        >
          ▾
        </span>
      </div>

      <div className="relative w-full lg:w-56">
        <label htmlFor="blog-sort-filter" className="sr-only">
          Sort posts
        </label>
        <select
          id="blog-sort-filter"
          value={activeSort}
          onChange={(event) => {
            const nextSort = parseBlogSort(event.target.value);
            replaceParams({ sort: nextSort === "newest" ? null : nextSort });
          }}
          className={selectClassName}
        >
          {BLOG_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-body text-xs text-muted-foreground"
        >
          ▾
        </span>
      </div>

      {isPending ? (
        <div className="inline-flex items-center gap-2 font-body text-xs text-muted-foreground lg:ml-2">
          <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
          Updating results…
        </div>
      ) : null}
    </div>
  );
}
