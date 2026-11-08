import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Shared section blocks for the Forward Deployed Engineering pages (homepage,
 * How we work, case studies, About). Each block is a plain content object so
 * the same component renders it wherever it appears.
 */

export const textCard = defineType({
  name: "textCard",
  title: "Card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "href",
      title: "Link URL",
      type: "string",
      description: "Optional. Makes the whole card a link.",
    }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const cardGridBlock = defineType({
  name: "cardGridBlock",
  title: "Card Grid Section",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 4 }),
    defineField({
      name: "items",
      title: "Cards",
      type: "array",
      of: [defineArrayMember({ type: "textCard" })],
    }),
    defineField({
      name: "closing",
      title: "Closing line",
      type: "text",
      rows: 2,
      description: "Optional line shown under the cards.",
    }),
  ],
});

export const comparisonRow = defineType({
  name: "comparisonRow",
  title: "Comparison Row",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Row label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "before", title: "Traditional column", type: "string" }),
    defineField({ name: "after", title: "Our column", type: "string" }),
  ],
  preview: { select: { title: "label", subtitle: "after" } },
});

export const comparisonBlock = defineType({
  name: "comparisonBlock",
  title: "Comparison Section",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 4 }),
    defineField({
      name: "beforeLabel",
      title: "Traditional column heading",
      type: "string",
    }),
    defineField({ name: "afterLabel", title: "Our column heading", type: "string" }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [defineArrayMember({ type: "comparisonRow" })],
    }),
  ],
});

export const phaseItem = defineType({
  name: "phaseItem",
  title: "Phase / Step",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 2 }),
    defineField({
      name: "details",
      title: "Detail points",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "decision",
      title: "Decision point",
      type: "string",
      description: "Optional. What the client decides at the end of this phase.",
    }),
    defineField({
      name: "humanInLoop",
      title: "A person decides at this step",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: { select: { title: "title", subtitle: "summary" } },
});

export const phaseBlock = defineType({
  name: "phaseBlock",
  title: "Phase Flow Section",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 4 }),
    defineField({
      name: "phases",
      title: "Phases",
      type: "array",
      of: [defineArrayMember({ type: "phaseItem" })],
    }),
    defineField({ name: "note", title: "Note", type: "string" }),
    defineField({
      name: "cta",
      title: "Link",
      type: "ctaButton",
      description: "Optional link under the flow.",
    }),
  ],
});

export const proseBlock = defineType({
  name: "proseBlock",
  title: "Text Section",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 8,
      description: "Separate paragraphs with a blank line.",
    }),
  ],
});

export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "Call To Action",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "button", title: "Primary button", type: "ctaButton" }),
    defineField({ name: "secondaryButton", title: "Secondary button", type: "ctaButton" }),
    defineField({
      name: "showEmail",
      title: "Show contact email",
      type: "boolean",
      initialValue: true,
    }),
  ],
});

export const engagementTrack = defineType({
  name: "engagementTrack",
  title: "Engagement Track",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "audience", title: "Who it is for", type: "string" }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [defineArrayMember({ type: "textCard" })],
    }),
    defineField({ name: "note", title: "Note", type: "text", rows: 2 }),
    defineField({ name: "cta", title: "Button", type: "ctaButton" }),
  ],
  preview: { select: { title: "name", subtitle: "audience" } },
});

export const engagementBlock = defineType({
  name: "engagementBlock",
  title: "Engagement Model Section",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
    defineField({
      name: "tracks",
      title: "Tracks",
      type: "array",
      of: [defineArrayMember({ type: "engagementTrack" })],
    }),
  ],
});

export const founderCard = defineType({
  name: "founderCard",
  title: "Founder",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({
      name: "tag",
      title: "Contrast tag",
      type: "string",
      description: "Short label, for example \"Build fast\" or \"Build right\".",
    }),
    defineField({ name: "bio", title: "Bio", type: "text", rows: 4 }),
    defineField({
      name: "points",
      title: "Background points",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});

export const foundersBlock = defineType({
  name: "foundersBlock",
  title: "Founders Section",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
    defineField({
      name: "members",
      title: "Founders",
      type: "array",
      of: [defineArrayMember({ type: "founderCard" })],
    }),
    defineField({ name: "note", title: "Note", type: "text", rows: 2 }),
  ],
});

export const caseStudyListBlock = defineType({
  name: "caseStudyListBlock",
  title: "Case Studies Section",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
    defineField({
      name: "items",
      title: "Case studies",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "caseStudy" }], weak: true }),
      ],
    }),
  ],
});

/* -------------------------------------------------------------------------- */
/* Documents                                                                   */
/* -------------------------------------------------------------------------- */

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Client (as shown)",
      type: "string",
      description:
        "Client name if the client approved naming, otherwise an anonymised descriptor such as \"A BSE-listed agro-processing company\".",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "anonymised",
      title: "Anonymised",
      type: "boolean",
      initialValue: true,
      description: "Leave on until the client has approved being named.",
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      initialValue: 10,
    }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "summary", title: "Card summary", type: "text", rows: 3 }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Short facts for the card, for example the region or the work type.",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["Complete", "In progress"] },
    }),
    defineField({ name: "context", title: "Context", type: "text", rows: 4 }),
    defineField({ name: "gap", title: "The gap", type: "text", rows: 4 }),
    defineField({ name: "howWeWorked", title: "How we worked", type: "text", rows: 4 }),
    defineField({
      name: "whatWeBuilt",
      title: "What we built",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "outcome", title: "Outcome", type: "text", rows: 3 }),
    defineField({
      name: "phases",
      title: "The five phases in this engagement",
      type: "array",
      of: [defineArrayMember({ type: "textCard" })],
    }),
    defineField({
      name: "stack",
      title: "Stack",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [
    { title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "headline" } },
});

export const howWeWorkPage = defineType({
  name: "howWeWorkPage",
  title: "How We Work Page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
        defineField({ name: "ctaPrimary", title: "Primary CTA", type: "ctaButton" }),
        defineField({ name: "ctaSecondary", title: "Secondary CTA", type: "ctaButton" }),
      ],
    }),
    defineField({ name: "problem", title: "The problem", type: "cardGridBlock" }),
    defineField({ name: "ourRead", title: "Our read", type: "proseBlock" }),
    defineField({ name: "comparison", title: "Comparison table", type: "comparisonBlock" }),
    defineField({ name: "phases", title: "Five phases", type: "phaseBlock" }),
    defineField({ name: "audit", title: "Discovery audit", type: "cardGridBlock" }),
    defineField({ name: "architecture", title: "Example architecture", type: "phaseBlock" }),
    defineField({ name: "adoption", title: "Adoption and governance", type: "cardGridBlock" }),
    defineField({ name: "engagement", title: "Engagement model", type: "engagementBlock" }),
    defineField({ name: "security", title: "Security and ownership", type: "cardGridBlock" }),
    defineField({ name: "cta", title: "Final CTA", type: "ctaBlock" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "How We Work Page" }) },
});

export const caseStudiesIndexPage = defineType({
  name: "caseStudiesIndexPage",
  title: "Case Studies Index Page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
      ],
    }),
    defineField({
      name: "founderTrack",
      title: "Founder-track experience",
      type: "cardGridBlock",
    }),
    defineField({ name: "cta", title: "Final CTA", type: "ctaBlock" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Case Studies Index Page" }) },
});

export const positioningSchemaTypes = [
  textCard,
  cardGridBlock,
  comparisonRow,
  comparisonBlock,
  phaseItem,
  phaseBlock,
  proseBlock,
  ctaBlock,
  engagementTrack,
  engagementBlock,
  founderCard,
  foundersBlock,
  caseStudyListBlock,
  caseStudy,
  howWeWorkPage,
  caseStudiesIndexPage,
];
