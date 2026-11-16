import type { Metadata } from "next";

import { PageShell } from "@/components/site/PageShell";
import { BlogListSection } from "@/components/sections/BlogListSection";
import {
  getBlogSortOrder,
  parseBlogSort,
  sortCategoryLabels,
} from "@/lib/blog-list";
import { sanityFetch } from "@/sanity/fetch";
import {
  blogCategoriesQuery,
  blogPostsCountQuery,
  buildPagedBlogPostsQuery,
} from "@/sanity/queries";
import type { BlogPostSummary } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
  description:
    "Notes from embedding with teams: where AI fits in a business, how to build it into existing systems, and how to get it used.",
};

const POSTS_PER_PAGE = 9;

export default async function BlogPageRoute({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; category?: string; sort?: string }>;
}) {
  const { page: pageParam, q: searchParam, category: categoryParam, sort: sortParam } =
    await searchParams;
  const searchQuery = searchParam?.trim() ?? "";
  const category = categoryParam?.trim() ?? "";
  const sort = parseBlogSort(sortParam);
  const requestedPage = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const [total, categories] = await Promise.all([
    sanityFetch<number>({
      query: blogPostsCountQuery,
      params: { term: searchQuery, category },
      tags: ["blogPost"],
    }),
    sanityFetch<string[]>({
      query: blogCategoriesQuery,
      tags: ["blogPost"],
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  const posts = await sanityFetch<BlogPostSummary[]>({
    query: buildPagedBlogPostsQuery(getBlogSortOrder(sort)),
    params: { start, end, term: searchQuery, category },
    tags: ["blogPost"],
  });

  return (
    <PageShell>
        <BlogListSection
          posts={posts}
          categories={sortCategoryLabels(categories ?? [])}
          currentPage={currentPage}
          totalPages={totalPages}
          searchQuery={searchQuery}
          activeCategory={category}
          activeSort={sort}
        />
    </PageShell>
  );
}
