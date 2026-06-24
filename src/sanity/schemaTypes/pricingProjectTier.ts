import { defineField, defineType } from "sanity";

export const pricingProjectTier = defineType({
  name: "pricingProjectTier",
  title: "Project Pricing Tier",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      description: "Main price display, e.g. $3K – $8K",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priceStrikethrough",
      title: "Strikethrough Price",
      type: "string",
      description: "Optional crossed-out price, e.g. $500",
    }),
    defineField({
      name: "priceBadge",
      title: "Price Badge",
      type: "string",
      description: "Optional badge next to price, e.g. Free",
    }),
    defineField({
      name: "limitedNote",
      title: "Limited Time Note",
      type: "string",
    }),
    defineField({
      name: "timeline",
      title: "Timeline",
      type: "string",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "paymentLabel",
      title: "Payment Label",
      type: "string",
      initialValue: "Payment",
    }),
    defineField({
      name: "paymentNote",
      title: "Payment Note",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "featuredLabel",
      title: "Featured Label",
      type: "string",
      initialValue: "Most common",
      hidden: ({ parent }) => !parent?.featured,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "price" },
  },
});
