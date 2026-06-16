import Link from "next/link";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
import type { BlogPostSummary } from "@/sanity/types";

type BlogListSectionProps = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  posts?: BlogPostSummary[];
};

export function BlogListSection({
  eyebrow = "Startups, Design, Technology",
  heading = "AgileMorph Blogs",
  description = "View the latest stories, insights and our development experiences.",
  posts = [],
}: BlogListSectionProps) {
  return (
    <section className="bg-background py-section max-sm:py-section-sm" aria-labelledby="blog-heading">
      <Container>
        <AnimateOnScroll className="mb-12 max-w-3xl">
          {eyebrow ? (
            <p className="mb-3 font-body text-xs font-bold uppercase tracking-widest text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 id="blog-heading" className="mb-4 font-heading text-5xl font-extrabold text-foreground">
            {heading}
          </h1>
          {description ? (
            <p className="font-body text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <AnimateOnScroll key={post._id} delay={index * 80}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:border-primary/20 hover:shadow-lg">
                {post.coverImage ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-background">
                    <SanityImage
                      image={post.coverImage}
                      alt={post.coverImage.alt ?? post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-6">
                  {post.categories?.length ? (
                    <p className="mb-3 font-body text-xs font-bold uppercase tracking-widest text-primary">
                      {post.categories[0]}
                    </p>
                  ) : null}
                  <h2 className="mb-3 font-heading text-xl font-bold text-foreground">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt ? (
                    <p className="mb-4 flex-1 font-body text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                  ) : null}
                  {post.publishedAt ? (
                    <time
                      dateTime={post.publishedAt}
                      className="font-body text-xs text-muted-foreground"
                    >
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  ) : null}
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
