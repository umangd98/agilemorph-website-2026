export const BLOG_SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title-asc", label: "Title (A–Z)" },
  { value: "title-desc", label: "Title (Z–A)" },
] as const;

export type BlogSort = (typeof BLOG_SORT_OPTIONS)[number]["value"];

const BLOG_SORT_SET = new Set<string>(BLOG_SORT_OPTIONS.map((option) => option.value));

export function parseBlogSort(value?: string | null): BlogSort {
  if (value && BLOG_SORT_SET.has(value)) {
    return value as BlogSort;
  }

  return "newest";
}

export function getBlogSortOrder(sort: BlogSort): string {
  switch (sort) {
    case "oldest":
      return "publishedAt asc";
    case "title-asc":
      return "title asc";
    case "title-desc":
      return "title desc";
    default:
      return "publishedAt desc";
  }
}

export type BlogListParams = {
  page?: number;
  q?: string;
  category?: string;
  sort?: BlogSort;
};

export function buildBlogListHref({
  page = 1,
  q = "",
  category = "",
  sort = "newest",
}: BlogListParams = {}) {
  const params = new URLSearchParams();
  const trimmedQuery = q.trim();
  const trimmedCategory = category.trim();

  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  }

  if (trimmedCategory) {
    params.set("category", trimmedCategory);
  }

  if (sort !== "newest") {
    params.set("sort", sort);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const qs = params.toString();
  return qs ? `/blog?${qs}` : "/blog";
}

export function decodeCategoryLabel(category: string) {
  return category
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

export function sortCategoryLabels(categories: string[]) {
  const unique = [...new Set(categories.map((category) => category.trim()).filter(Boolean))];

  return unique.sort((a, b) => {
    const aLabel = decodeCategoryLabel(a).toLowerCase();
    const bLabel = decodeCategoryLabel(b).toLowerCase();

    if (aLabel === "uncategorized") return 1;
    if (bLabel === "uncategorized") return -1;

    return aLabel.localeCompare(bLabel);
  });
}
