import { getBlogPost, getProjects, selectProjects } from "@/lib/content";
import { ProjectGrid, Section } from "@/components/marketing/Elements";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { BlogPostSection } from "@/components/sections/BlogPostSection";
import { pageMetadata, seoToMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import { allBlogSlugsQuery } from "@/sanity/queries";

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
  const post = await getBlogPost(slug);

  return seoToMetadata(
    post?.seo,
    pageMetadata(
      post?.title ?? "Insights",
      post?.excerpt ??
        "Engineering insights and delivery notes from AgileMorph.",
      `/blog/${slug}`,
    ),
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const related = selectProjects(await getProjects(), post.relatedProjects);

  return (
    <>
      <SiteNavbar />
      <main className="flex-1">
        <BlogPostSection post={post} />
        {related.length > 0 && (
          <Section title="Related project evidence">
            <ProjectGrid projects={related} />
          </Section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
