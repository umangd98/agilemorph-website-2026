import { RETIRED_BLOG_SLUGS } from "@/data/retired-blog-posts";

/** Sanity holds the blog only. Marketing page copy lives in src/content. */

const imageProjection = `{
  ...,
  asset->,
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions
}`;

const seoProjection = `{
  title,
  description,
  ogImage ${imageProjection}
}`;

/** Posts that belong to the current positioning. */

const liveBlogPost = `_type == "blogPost" && !(slug.current in ${JSON.stringify(RETIRED_BLOG_SLUGS)})`;

export const blogPostQuery = `*[${liveBlogPost} && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  body,
  publishedAt,
  categories,
  author,
  coverImage ${imageProjection},
  seo ${seoProjection}
}`;


const blogPostSearchFilter = `$term == "" || (
  lower(title) match "*" + lower($term) + "*" ||
  lower(excerpt) match "*" + lower($term) + "*" ||
  lower(author) match "*" + lower($term) + "*" ||
  count((categories)[lower(@) match "*" + lower($term) + "*"]) > 0
)`;

const blogPostCategoryFilter = `$category == "" || $category in categories`;

const blogPostListFilter = `(${blogPostSearchFilter}) && (${blogPostCategoryFilter})`;

const blogPostSummaryProjection = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  categories,
  author,
  coverImage ${imageProjection}
}`;

export const blogCategoriesQuery = `array::unique(*[${liveBlogPost}].categories[]) | order(@ asc)`;

export const blogPostsCountQuery = `count(*[${liveBlogPost} && (${blogPostListFilter})])`;

export function buildPagedBlogPostsQuery(orderBy: string) {
  return `*[${liveBlogPost} && (${blogPostListFilter})] | order(${orderBy}) [$start...$end] ${blogPostSummaryProjection}`;
}

export const allBlogSlugsQuery = `*[${liveBlogPost} && defined(slug.current)]{
  "slug": slug.current
}`;
