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

  return seoToMetadata(post?.seo, {
    title: post?.title ?? "Blog Post",
    description: post?.excerpt,
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
