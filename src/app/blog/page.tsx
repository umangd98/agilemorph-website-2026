import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { BlogListSection } from "@/components/sections";
import { sanityFetch } from "@/sanity/fetch";
import { blogPostsCountQuery, pagedBlogPostsQuery } from "@/sanity/queries";
import type { BlogPostSummary } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "View the latest stories, insights and development experiences from AgileMorph.",
};

const POSTS_PER_PAGE = 9;

export default async function BlogPageRoute({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const requestedPage = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const total = await sanityFetch<number>({
    query: blogPostsCountQuery,
    tags: ["blogPost"],
  });

  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  const posts = await sanityFetch<BlogPostSummary[]>({
    query: pagedBlogPostsQuery,
    params: { start, end },
    tags: ["blogPost"],
  });

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <BlogListSection posts={posts} currentPage={currentPage} totalPages={totalPages} />
      </main>
      <Footer />
    </>
  );
}
