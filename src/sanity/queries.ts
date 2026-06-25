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

const flowStepProjection = `{
  label,
  text
}`;

const statItemProjection = `{
  value,
  label
}`;

const useCaseItemProjection = `{
  title,
  description
}`;

const subServiceProcessStepProjection = `{
  title,
  description
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
  icon ${imageProjection},
  highlights,
  animationType,
  animationLabels
}`;

const capabilityItemProjection = `{
  title,
  description,
  icon,
  slug,
  featured,
  image ${imageProjection}
}`;

const technologyItemProjection = `{
  name,
  logo ${imageProjection}
}`;

const teamLeadItemProjection = `{
  name,
  role,
  bio,
  image ${imageProjection}
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

const partnerItemProjection = `{
  name,
  label,
  url,
  logo ${imageProjection}
}`;

const integrationItemProjection = `{
  name,
  url,
  logo ${imageProjection}
}`;

export const homepageQuery = `*[_type == "homepage"][0]{
  _id,
  _type,
  hero {
    badge,
    heading,
    headingAccent,
    tagline[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          href
        }
      }
    },
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
    heading
  },
  whyUs {
    heading,
    items[] ${whyUsItemProjection},
    efficiencyCalculator {
      heading,
      description,
      disclaimer,
      ctaLabel
    }
  },
  stats {
    eyebrow,
    heading,
    items[] ${statProjection}
  },
  integrations {
    heading,
    items[] ${integrationItemProjection}
  },
  partners {
    heading,
    items[] ${partnerItemProjection}
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
  stats {
    eyebrow,
    heading,
    items[] ${statProjection}
  },
  cta {
    heading,
    description,
    button ${ctaProjection}
  },
  teamLeads {
    eyebrow,
    heading,
    subheading,
    cardFooter,
    members[] ${teamLeadItemProjection}
  },
  founder {
    eyebrow,
    heading,
    name,
    role,
    bio,
    image ${imageProjection}
  },
  integrations {
    heading,
    items[] ${integrationItemProjection}
  },
  partners {
    heading,
    items[] ${partnerItemProjection}
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
  layout,
  tagline,
  description,
  headline {
    before,
    highlight,
    after
  },
  flow[] ${flowStepProjection},
  stats[] ${statItemProjection},
  whyTitle,
  whyHighlight,
  whyText,
  checks,
  useCases[] ${useCaseItemProjection},
  pricing {
    headline,
    detail
  },
  faq[] ${faqItemProjection},
  processSteps[] ${subServiceProcessStepProjection},
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

export const subServicePagesListQuery = `*[_type == "servicePage" && layout == "subService"] | order(title asc) {
  title,
  "slug": slug.current
}`;

export const allServicePagesListQuery = `*[_type == "servicePage" && defined(slug.current)] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  tagline,
  description,
  heroImage ${imageProjection},
  capabilities[] ${capabilityItemProjection}
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
  discoveryCall {
    title,
    subtitle,
    description,
    availabilityNote,
    bullets,
    ctaLabel
  },
  faqs[] ${faqItemProjection},
  seo ${seoProjection}
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

const pricingProjectTierProjection = `{
  name,
  price,
  priceStrikethrough,
  priceBadge,
  limitedNote,
  timeline,
  tagline,
  deliverables,
  paymentLabel,
  paymentNote,
  featured,
  featuredLabel
}`;

const pricingRetainerTierProjection = `{
  name,
  price,
  hours,
  tagline,
  items,
  featured
}`;

const pricingEngagementStepProjection = `{
  step,
  title,
  description
}`;

const navLinkProjection = `{
  label,
  href
}`;

const socialLinkProjection = `{
  label,
  url,
  platform
}`;

export const pricingPageQuery = `*[_type == "pricingPage"][0]{
  _id,
  _type,
  hero {
    eyebrow,
    heading,
    description
  },
  projectSection {
    label,
    tiers[] ${pricingProjectTierProjection}
  },
  retainerSection {
    label,
    description,
    tiers[] ${pricingRetainerTierProjection}
  },
  engagementSection {
    label,
    steps[] ${pricingEngagementStepProjection}
  },
  cta {
    heading,
    headingAccent,
    primaryCta ${ctaProjection},
    secondaryCta ${ctaProjection}
  },
  seo ${seoProjection}
}`;

export const blogIndexPageQuery = `*[_type == "blogIndexPage"][0]{
  _id,
  _type,
  eyebrow,
  heading,
  description,
  seo ${seoProjection}
}`;

export const servicesIndexPageQuery = `*[_type == "servicesIndexPage"][0]{
  _id,
  _type,
  hero {
    eyebrow,
    heading,
    description
  },
  cta {
    heading,
    description,
    button ${ctaProjection}
  },
  seo ${seoProjection}
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  _id,
  _type,
  siteTitle,
  siteDescription,
  navLinks[] ${navLinkProjection},
  footerQuickLinks[] ${navLinkProjection},
  socialLinks[] ${socialLinkProjection},
  newsletterHeading,
  newsletterDescription
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

export const blogCategoriesQuery = `array::unique(*[_type == "blogPost"].categories[]) | order(@ asc)`;

export const blogPostsCountQuery = `count(*[_type == "blogPost" && (${blogPostListFilter})])`;

export function buildPagedBlogPostsQuery(orderBy: string) {
  return `*[_type == "blogPost" && (${blogPostListFilter})] | order(${orderBy}) [$start...$end] ${blogPostSummaryProjection}`;
}

export const allBlogSlugsQuery = `*[_type == "blogPost" && defined(slug.current)]{
  "slug": slug.current
}`;
