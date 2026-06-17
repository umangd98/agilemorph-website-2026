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
  currentPage?: number;
  totalPages?: number;
};

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const page = sorted[index];
    if (page === undefined) continue;

    const previous = sorted[index - 1];

    if (previous !== undefined && page - previous > 1) {
      result.push("ellipsis");
    }

    result.push(page);
  }

  return result;
}

function pageHref(page: number) {
  return page === 1 ? "/blog" : `/blog?page=${page}`;
}

export function BlogListSection({
  eyebrow = "Startups, Design, Technology",
  heading = "AgileMorph Blogs",
  description = "View the latest stories, insights and our development experiences.",
  posts = [],
  currentPage = 1,
  totalPages = 1,
}: BlogListSectionProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const showPagination = totalPages > 1;

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
              <article className="hover-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:border-primary/20 hover:shadow-lg">
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
                  <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-xs text-muted-foreground">
                    {post.publishedAt ? (
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    ) : null}
                    {post.author ? (
                      <>
                        {post.publishedAt ? <span aria-hidden="true">·</span> : null}
                        <span>By {post.author}</span>
                      </>
                    ) : null}
                  </div>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>

        {showPagination ? (
          <nav
            className="mt-12 flex flex-wrap items-center justify-center gap-2"
            aria-label="Blog pagination"
          >
            {currentPage > 1 ? (
              <Link
                href={pageHref(currentPage - 1)}
                className="inline-flex min-w-24 items-center justify-center rounded-lg border border-border bg-surface px-4 py-2 font-body text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:text-primary"
              >
                Previous
              </Link>
            ) : (
              <span className="inline-flex min-w-24 cursor-not-allowed items-center justify-center rounded-lg border border-border bg-surface px-4 py-2 font-body text-sm font-medium text-muted-foreground opacity-60">
                Previous
              </span>
            )}

            {pageNumbers.map((page, index) =>
              page === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 font-body text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  …
                </span>
              ) : (
                <Link
                  key={page}
                  href={pageHref(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={
                    page === currentPage
                      ? "inline-flex h-10 min-w-10 items-center justify-center rounded-lg bg-primary px-3 font-body text-sm font-semibold text-primary-foreground"
                      : "inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-border bg-surface px-3 font-body text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:text-primary"
                  }
                >
                  {page}
                </Link>
              ),
            )}

            {currentPage < totalPages ? (
              <Link
                href={pageHref(currentPage + 1)}
                className="inline-flex min-w-24 items-center justify-center rounded-lg border border-border bg-surface px-4 py-2 font-body text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:text-primary"
              >
                Next
              </Link>
            ) : (
              <span className="inline-flex min-w-24 cursor-not-allowed items-center justify-center rounded-lg border border-border bg-surface px-4 py-2 font-body text-sm font-medium text-muted-foreground opacity-60">
                Next
              </span>
            )}
          </nav>
        ) : null}
      </Container>
    </section>
  );
}
