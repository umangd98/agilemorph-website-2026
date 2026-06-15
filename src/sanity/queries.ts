const imageProjection = `{
  ...,
  asset->,
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions
}`;

export const homepageQuery = `*[_type == "homepage"][0]{
  _id,
  _type,
  hero {
    heading,
    subheading,
    cta {
      label,
      href,
      openInNewTab
    },
    image ${imageProjection}
  },
  sections[] {
    _key,
    eyebrow,
    heading,
    body,
    cta {
      label,
      href,
      openInNewTab
    },
    image ${imageProjection}
  },
  seo {
    title,
    description,
    ogImage ${imageProjection}
  }
}`;
