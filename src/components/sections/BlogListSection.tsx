import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";

import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { BlogFilters } from "@/components/BlogFilters";
import { BlogSearch } from "@/components/BlogSearch";
import { Container } from "@/components/Container";
import { SanityImage } from "@/components/SanityImage";
import {
  buildBlogListHref,
  BLOG_SORT_OPTIONS,
  decodeCategoryLabel,
  type BlogSort,
} from "@/lib/blog-list";
import type { BlogPostSummary } from "@/sanity/types";

type BlogListSectionProps = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  posts?: BlogPostSummary[];
  categories?: string[];
  currentPage?: number;
  totalPages?: number;
  searchQuery?: string;
  activeCategory?: string;
  activeSort?: BlogSort;
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

function pageHref({
  page,
  searchQuery,
  activeCategory,
  activeSort,
}: {
  page: number;
  searchQuery?: string;
  activeCategory?: string;
  activeSort?: BlogSort;
}) {
  return buildBlogListHref({
    page,
    q: searchQuery,
    category: activeCategory,
    sort: activeSort,
  });
}

export function BlogListSection({
  eyebrow = "Insights & Stories",
  heading = "Blog",
  description = "Explore our latest stories, industry insights, and development experiences.",
  posts = [],
  categories = [],
  currentPage = 1,
  totalPages = 1,
  searchQuery = "",
  activeCategory = "",
  activeSort = "newest",
}: BlogListSectionProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const showPagination = totalPages > 1;
  const hasSearchQuery = searchQuery.length > 0;
  const hasActiveCategory = activeCategory.length > 0;
  const hasActiveFilters = hasSearchQuery || hasActiveCategory || activeSort !== "newest";
  const paginationParams = { searchQuery, activeCategory, activeSort };
  const activeSortLabel =
    BLOG_SORT_OPTIONS.find((option) => option.value === activeSort)?.label ?? "Newest first";

  const [featuredPost, ...remainingPosts] = posts;
  const showFeatured = !hasActiveFilters && currentPage === 1 && featuredPost != null;
  const gridPosts = showFeatured ? remainingPosts : posts;

  return (
    <>
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-background pb-0 pt-20 max-sm:pt-14" aria-label="Blog header">
        {/* Decorative orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-32 size-[480px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 right-0 size-[360px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 h-px w-full -translate-x-1/2"
          style={{ background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.18), transparent)" }}
        />

        <Container>
          <AnimateOnScroll className="relative z-10 max-w-2xl pb-14 max-sm:pb-10">
            {eyebrow ? (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5">
                <span className="size-1.5 rounded-full bg-primary" />
                <p className="font-body text-xs font-bold uppercase tracking-widest text-primary">
                  {eyebrow}
                </p>
              </div>
            ) : null}
            <h1
              id="blog-heading"
              className="mb-4 font-heading text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl"
            >
              {heading}
            </h1>
            {description ? (
              <p className="font-body text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </AnimateOnScroll>
        </Container>
      </section>

      {/* Search + filters sticky bar */}
      <div className="sticky top-(--header-height,4rem) z-20 border-b border-border bg-background/90 backdrop-blur-md">
        <Container>
          <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:gap-4">
            <div className="flex-1">
              <Suspense
                fallback={
                  <div className="h-[46px] max-w-xl animate-pulse rounded-xl border border-border bg-surface" />
                }
              >
                <BlogSearch initialQuery={searchQuery} />
              </Suspense>
            </div>

            {categories.length ? (
              <div className="shrink-0 lg:w-auto">
                <Suspense
                  fallback={
                    <div className="h-[46px] w-64 animate-pulse rounded-xl border border-border bg-surface" />
                  }
                >
                  <BlogFilters
                    categories={categories}
                    activeCategory={activeCategory}
                    activeSort={activeSort}
                  />
                </Suspense>
              </div>
            ) : null}
          </div>
        </Container>
      </div>

      {/* Main content */}
      <section className="bg-background py-12 max-sm:py-8" aria-labelledby="blog-heading">
        <Container>
          {/* Active filters */}
          {hasActiveFilters ? (
            <AnimateOnScroll className="mb-8 flex flex-wrap items-center gap-2">
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Active filters
              </span>
              {hasSearchQuery ? (
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-body text-xs font-medium text-primary">
                  Search: {searchQuery}
                </span>
              ) : null}
              {hasActiveCategory ? (
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-body text-xs font-medium text-primary">
                  {decodeCategoryLabel(activeCategory)}
                </span>
              ) : null}
              {activeSort !== "newest" ? (
                <span className="rounded-full border border-border bg-surface px-3 py-1 font-body text-xs font-medium text-foreground">
                  {activeSortLabel}
                </span>
              ) : null}
              <Link
                href="/blog"
                className="font-body text-xs font-semibold text-primary underline-offset-4 hover:underline"
              >
                Clear all
              </Link>
            </AnimateOnScroll>
          ) : null}

          {/* Empty state */}
          {posts.length === 0 ? (
            <AnimateOnScroll>
              <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-border bg-background">
                  <span className="text-2xl">✍️</span>
                </div>
                <p className="font-heading text-xl font-bold text-foreground">
                  {hasActiveFilters ? "No posts match your filters" : "No posts yet"}
                </p>
                <p className="mt-2 font-body text-sm text-muted-foreground">
                  {hasActiveFilters
                    ? "Try adjusting your search, category, or sort options."
                    : "Check back soon for new stories and insights."}
                </p>
                {hasActiveFilters ? (
                  <Link
                    href="/blog"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 font-body text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    Clear filters
                  </Link>
                ) : null}
              </div>
            </AnimateOnScroll>
          ) : (
            <>
              {/* Featured post */}
              {showFeatured ? (
                <AnimateOnScroll className="mb-12">
                  <article className="group relative overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition-all hover:border-primary/20 hover:shadow-xl">
                    <div className="grid lg:grid-cols-2">
                      {featuredPost.coverImage ? (
                        <div className="relative aspect-16/10 overflow-hidden bg-muted lg:aspect-auto lg:min-h-[380px]">
                          <SanityImage
                            image={featuredPost.coverImage}
                            alt={featuredPost.coverImage.alt ?? featuredPost.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent lg:bg-linear-to-r lg:from-transparent lg:to-transparent" />
                        </div>
                      ) : (
                        <div className="hidden lg:block lg:min-h-[380px] bg-linear-to-br from-mint to-mint-dark" />
                      )}
                      <div className="flex flex-col justify-center p-8 lg:p-12">
                        <div className="mb-3 flex items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-body text-xs font-bold uppercase tracking-widest text-primary">
                            <span className="size-1.5 rounded-full bg-primary" />
                            Featured
                          </span>
                          {featuredPost.categories?.length ? (
                            <span className="font-body text-xs font-medium uppercase tracking-widest text-muted-foreground">
                              {decodeCategoryLabel(featuredPost.categories[0] ?? "")}
                            </span>
                          ) : null}
                        </div>
                        <h2 className="mb-4 font-heading text-2xl font-extrabold leading-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">
                          <Link href={`/blog/${featuredPost.slug}`} className="after:absolute after:inset-0">
                            {featuredPost.title}
                          </Link>
                        </h2>
                        {featuredPost.excerpt ? (
                          <p className="mb-6 font-body text-base leading-relaxed text-muted-foreground line-clamp-3">
                            {featuredPost.excerpt}
                          </p>
                        ) : null}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-sm text-muted-foreground">
                            {featuredPost.publishedAt ? (
                              <time dateTime={featuredPost.publishedAt}>
                                {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </time>
                            ) : null}
                            {featuredPost.author ? (
                              <>
                                {featuredPost.publishedAt ? <span aria-hidden="true">·</span> : null}
                                <span>{featuredPost.author}</span>
                              </>
                            ) : null}
                          </div>
                          <span className="relative z-10 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-body text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
                            Read more <ArrowRight className="size-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </AnimateOnScroll>
              ) : null}

              {/* Grid */}
              {gridPosts.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {gridPosts.map((post, index) => (
                    <AnimateOnScroll key={post._id} delay={index * 60}>
                      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg">
                        {post.coverImage ? (
                          <div className="relative aspect-video overflow-hidden bg-muted">
                            <SanityImage
                              image={post.coverImage}
                              alt={post.coverImage.alt ?? post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-linear-to-br from-mint to-mint-dark" />
                        )}
                        <div className="flex flex-1 flex-col p-6">
                          {post.categories?.length ? (
                            <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full border border-primary/15 bg-primary/8 px-2.5 py-0.5 font-body text-xs font-bold uppercase tracking-widest text-primary">
                              {decodeCategoryLabel(post.categories[0] ?? "")}
                            </span>
                          ) : null}
                          <h2 className="mb-3 font-heading text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                            <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                              {post.title}
                            </Link>
                          </h2>
                          {post.excerpt ? (
                            <p className="mb-5 flex-1 font-body text-sm leading-relaxed text-muted-foreground line-clamp-3">
                              {post.excerpt}
                            </p>
                          ) : null}
                          <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-body text-xs text-muted-foreground">
                              {post.publishedAt ? (
                                <time dateTime={post.publishedAt}>
                                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </time>
                              ) : null}
                              {post.author ? (
                                <>
                                  {post.publishedAt ? <span aria-hidden="true">·</span> : null}
                                  <span>{post.author}</span>
                                </>
                              ) : null}
                            </div>
                            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
                          </div>
                        </div>
                      </article>
                    </AnimateOnScroll>
                  ))}
                </div>
              ) : null}
            </>
          )}

          {/* Pagination */}
          {showPagination ? (
            <nav
              className="mt-14 flex flex-wrap items-center justify-center gap-2"
              aria-label="Blog pagination"
            >
              {currentPage > 1 ? (
                <Link
                  href={pageHref({ page: currentPage - 1, ...paginationParams })}
                  className="inline-flex min-w-24 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2.5 font-body text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  ← Previous
                </Link>
              ) : (
                <span className="inline-flex min-w-24 cursor-not-allowed items-center justify-center rounded-xl border border-border bg-surface px-4 py-2.5 font-body text-sm font-medium text-muted-foreground opacity-50">
                  ← Previous
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
                    href={pageHref({ page, ...paginationParams })}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={
                      page === currentPage
                        ? "inline-flex h-10 min-w-10 items-center justify-center rounded-xl bg-primary px-3 font-body text-sm font-semibold text-white shadow-sm shadow-primary/30"
                        : "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-border bg-surface px-3 font-body text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                    }
                  >
                    {page}
                  </Link>
                ),
              )}

              {currentPage < totalPages ? (
                <Link
                  href={pageHref({ page: currentPage + 1, ...paginationParams })}
                  className="inline-flex min-w-24 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2.5 font-body text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  Next →
                </Link>
              ) : (
                <span className="inline-flex min-w-24 cursor-not-allowed items-center justify-center rounded-xl border border-border bg-surface px-4 py-2.5 font-body text-sm font-medium text-muted-foreground opacity-50">
                  Next →
                </span>
              )}
            </nav>
          ) : null}
        </Container>
      </section>
    </>
  );
}
