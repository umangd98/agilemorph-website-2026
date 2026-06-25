import type { Metadata } from "next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { BlogListSection } from "@/components/sections";
import {
  getBlogSortOrder,
  parseBlogSort,
  sortCategoryLabels,
} from "@/lib/blog-list";
import { seoToMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import {
  blogCategoriesQuery,
  blogIndexPageQuery,
  blogPostsCountQuery,
  buildPagedBlogPostsQuery,
} from "@/sanity/queries";
import type { BlogIndexPage, BlogPostSummary } from "@/sanity/types";

const fallbackMetadata: Metadata = {
  title: "Blog",
  description:
    "View the latest stories, insights and development experiences from AgileMorph.",
};

export async function generateMetadata(): Promise<Metadata> {
  const blogIndex = await sanityFetch<BlogIndexPage | null>({
    query: blogIndexPageQuery,
    tags: ["blogIndexPage"],
  });

  return seoToMetadata(blogIndex?.seo, fallbackMetadata);
}

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

  const [blogIndex, total, categories] = await Promise.all([
    sanityFetch<BlogIndexPage | null>({
      query: blogIndexPageQuery,
      tags: ["blogIndexPage"],
    }),
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
    <>
      <SiteNavbar />
      <main className="flex-1">
        <BlogListSection
          eyebrow={blogIndex?.eyebrow}
          heading={blogIndex?.heading}
          description={blogIndex?.description}
          posts={posts}
          categories={sortCategoryLabels(categories ?? [])}
          currentPage={currentPage}
          totalPages={totalPages}
          searchQuery={searchQuery}
          activeCategory={category}
          activeSort={sort}
        />
      </main>
      <SiteFooter />
    </>
  );
}
