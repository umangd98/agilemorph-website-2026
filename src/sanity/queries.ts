const imageProjection = `{
  ...,
  asset->,
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions
}`;

const ctaProjection = `{
  label,
  href,
  openInNewTab
}`;

const statProjection = `{
  value,
  label
}`;

const testimonialProjection = `{
  quote,
  name,
  role,
  company,
  image ${imageProjection}
}`;

const processStepProjection = `{
  title,
  description,
  bullets,
  image ${imageProjection}
}`;

const serviceCardProjection = `{
  title,
  description,
  href,
  icon ${imageProjection}
}`;

const whyUsItemProjection = `{
  title,
  description,
  icon ${imageProjection}
}`;

const capabilityItemProjection = `{
  title,
  description,
  icon,
  image ${imageProjection}
}`;

const technologyItemProjection = `{
  name,
  logo ${imageProjection}
}`;

const faqItemProjection = `{
  question,
  answer
}`;

const companyValueProjection = `{
  title,
  description,
  icon ${imageProjection}
}`;

const seoProjection = `{
  title,
  description,
  ogImage ${imageProjection}
}`;

export const homepageQuery = `*[_type == "homepage"][0]{
  _id,
  _type,
  hero {
    badge,
    heading,
    tagline,
    ctaPrimary ${ctaProjection},
    ctaSecondary ${ctaProjection},
    image ${imageProjection}
  },
  process {
    heading,
    subheading,
    steps[] ${processStepProjection}
  },
  services {
    eyebrow,
    heading,
    cards[] ${serviceCardProjection}
  },
  whyUs {
    heading,
    items[] ${whyUsItemProjection}
  },
  stats {
    eyebrow,
    heading,
    items[] ${statProjection}
  },
  featuredLogos {
    heading,
    logos[] ${imageProjection}
  },
  testimonials {
    eyebrow,
    heading,
    items[] ${testimonialProjection}
  },
  seo ${seoProjection}
}`;

export const aboutPageQuery = `*[_type == "aboutPage"][0]{
  _id,
  _type,
  hero {
    heading,
    tagline,
    cta ${ctaProjection},
    image ${imageProjection}
  },
  about {
    heading,
    body,
    promiseHeading,
    promise,
    image ${imageProjection}
  },
  values[] ${companyValueProjection},
  process {
    heading,
    subheading,
    steps[] ${processStepProjection}
  },
  stats[] ${statProjection},
  cta {
    heading,
    description,
    button ${ctaProjection}
  },
  founder {
    eyebrow,
    heading,
    name,
    role,
    bio,
    image ${imageProjection}
  },
  featuredLogos {
    heading,
    logos[] ${imageProjection}
  },
  testimonials {
    heading,
    items[] ${testimonialProjection}
  },
  seo ${seoProjection}
}`;

export const servicePageQuery = `*[_type == "servicePage" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  "slug": slug.current,
  tagline,
  description,
  heroImage ${imageProjection},
  heroCta ${ctaProjection},
  capabilitiesHeading,
  capabilities[] ${capabilityItemProjection},
  whyUsHeading,
  whyUs[] ${whyUsItemProjection},
  technologiesHeading,
  technologies[] ${technologyItemProjection},
  cta {
    heading,
    description,
    button ${ctaProjection}
  },
  seo ${seoProjection}
}`;

export const allServiceSlugsQuery = `*[_type == "servicePage" && defined(slug.current)]{
  "slug": slug.current
}`;

export const contactPageQuery = `*[_type == "contactPage"][0]{
  _id,
  _type,
  hero {
    heading,
    description
  },
  phone,
  email,
  linkedinUrl,
  facebookUrl,
  faqs[] ${faqItemProjection},
  seo ${seoProjection}
}`;

export const allBlogPostsQuery = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  categories,
  author,
  coverImage ${imageProjection}
}`;

export const blogPostsCountQuery = `count(*[_type == "blogPost"])`;

export const pagedBlogPostsQuery = `*[_type == "blogPost"] | order(publishedAt desc) [$start...$end] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  categories,
  author,
  coverImage ${imageProjection}
}`;

export const allBlogSlugsQuery = `*[_type == "blogPost" && defined(slug.current)]{
  "slug": slug.current
}`;

export const blogPostQuery = `*[_type == "blogPost" && slug.current == $slug][0]{
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
