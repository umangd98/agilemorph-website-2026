import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { BlogPostSection } from "@/components/sections/BlogPostSection";
import { seoToMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import { allBlogSlugsQuery, blogPostQuery } from "@/sanity/queries";
import type { BlogPost } from "@/sanity/types";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await sanityFetch<Array<{ slug: string }>>({
    query: allBlogSlugsQuery,
    tags: ["blogPost"],
  });

  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<BlogPost | null>({
    query: blogPostQuery,
    params: { slug },
    tags: ["blogPost", `blogPost:${slug}`],
  });

  // A missing post still renders (notFound() below), but the hosting layer
  // serves it as 200 rather than 404, so it reads to a crawler as a thin
  // real page. Mark it noindex so a soft 404 can never be indexed.
  if (!post) {
    return { title: "Not found", robots: { index: false, follow: false } };
  }

  return seoToMetadata(post.seo, {
    title: post.title,
    description: post.excerpt,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await sanityFetch<BlogPost | null>({
    query: blogPostQuery,
    params: { slug },
    tags: ["blogPost", `blogPost:${slug}`],
  });

  if (!post) {
    notFound();
  }

  return (
    <>
      <SiteNavbar />
      <main className="flex-1">
        <BlogPostSection post={post} />
      </main>
      <SiteFooter />
    </>
  );
}
