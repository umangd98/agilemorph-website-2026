import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/StructuredData";
import { PageShell } from "@/components/site/PageShell";
import { BlogPostSection } from "@/components/sections/BlogPostSection";
import { coverUrl } from "@/lib/blog-cover";
import { extractFaq } from "@/lib/blog-faq";
import { seoToMetadata } from "@/lib/seo";
import { blogPostingSchema, breadcrumbSchema, faqPageSchema } from "@/lib/structured-data";
import { urlForImage } from "@/sanity/image";
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

  return seoToMetadata(
    post.seo,
    {
      title: post.title,
      description: post.excerpt,
      alternates: { canonical: `/blog/${slug}` },
    },
    shareImageFor(post, slug),
  );
}

// Share previews use the post's own cover when it has one, and the generated
// cover otherwise, so no post is ever shared without an image.
function shareImageFor(post: BlogPost, slug: string) {
  return post.coverImage?.asset
    ? urlForImage(post.coverImage).width(1200).height(630).url()
    : coverUrl(slug);
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

  const path = `/blog/${slug}`;
  const faq = faqPageSchema(extractFaq(post.body), path);
  const schema = [
    blogPostingSchema({
      slug,
      title: post.title,
      description: post.seo?.description ?? post.excerpt,
      image: shareImageFor(post, slug),
      publishedAt: post.publishedAt,
      updatedAt: post._updatedAt,
      author: post.author,
    }),
    breadcrumbSchema([
      { name: "Blog", path: "/blog" },
      { name: post.title, path },
    ]),
    ...(faq ? [faq] : []),
  ];

  return (
    <PageShell>
      <StructuredData data={schema} />
      <BlogPostSection post={post} />
    </PageShell>
  );
}
