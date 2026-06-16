import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BlogPostBody } from "@/components/BlogPostBody";
import { Container } from "@/components/Container";
import { SanityImage } from "@/components/SanityImage";
import type { BlogPost } from "@/sanity/types";

type BlogPostSectionProps = {
  post: BlogPost;
};

export function BlogPostSection({ post }: BlogPostSectionProps) {
  return (
    <article className="bg-background py-section max-sm:py-section-sm">
      <Container>
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 font-body text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        {post.categories?.length ? (
          <p className="mb-4 font-body text-xs font-bold uppercase tracking-widest text-primary">
            {post.categories[0]}
          </p>
        ) : null}

        <h1 className="mb-6 max-w-4xl font-heading text-4xl font-extrabold text-foreground sm:text-5xl">
          {post.title}
        </h1>

        {post.publishedAt ? (
          <time
            dateTime={post.publishedAt}
            className="mb-8 block font-body text-sm text-muted-foreground"
          >
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        ) : null}

        {post.coverImage ? (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-surface">
            <SanityImage
              image={post.coverImage}
              alt={post.coverImage.alt ?? post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>
        ) : null}

        {post.excerpt ? (
          <p className="mb-8 max-w-3xl font-body text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        ) : null}

        <div className="max-w-3xl">
          <BlogPostBody body={post.body as Parameters<typeof BlogPostBody>[0]["body"]} />
        </div>
      </Container>
    </article>
  );
}
