import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { BlogListSection } from "@/components/sections";
import { sanityFetch } from "@/sanity/fetch";
import { allBlogPostsQuery } from "@/sanity/queries";
import type { BlogPostSummary } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "View the latest stories, insights and development experiences from AgileMorph.",
};

export default async function BlogPageRoute() {
  const posts = await sanityFetch<BlogPostSummary[]>({
    query: allBlogPostsQuery,
    tags: ["blogPost"],
  });

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <BlogListSection posts={posts} />
      </main>
      <Footer />
    </>
  );
}
