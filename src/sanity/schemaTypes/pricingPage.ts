import { defineField, defineType } from "sanity";

export const pricingPage = defineType({
  name: "pricingPage",
  title: "Pricing Page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
        }),
        defineField({
          name: "heading",
          title: "Heading",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 3,
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "projectSection",
      title: "Project Pricing Section",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Section Label",
          type: "string",
        }),
        defineField({
          name: "tiers",
          title: "Project Tiers",
          type: "array",
          of: [{ type: "pricingProjectTier" }],
        }),
      ],
    }),
    defineField({
      name: "retainerSection",
      title: "Retainer Pricing Section",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Section Label",
          type: "string",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "tiers",
          title: "Retainer Tiers",
          type: "array",
          of: [{ type: "pricingRetainerTier" }],
        }),
      ],
    }),
    defineField({
      name: "engagementSection",
      title: "How Engagements Work",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Section Label",
          type: "string",
        }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [{ type: "pricingEngagementStep" }],
        }),
      ],
    }),
    defineField({
      name: "cta",
      title: "CTA Band",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "headingAccent",
          title: "Heading Accent",
          type: "string",
          description: "Rendered in primary color, e.g. discovery audit.",
        }),
        defineField({
          name: "primaryCta",
          title: "Primary CTA",
          type: "ctaButton",
        }),
        defineField({
          name: "secondaryCta",
          title: "Secondary CTA",
          type: "ctaButton",
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Pricing Page" };
    },
  },
});
