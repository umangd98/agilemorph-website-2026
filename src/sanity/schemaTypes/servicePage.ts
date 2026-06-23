import { defineField, defineType } from "sanity";

const isSubService = ({ document }: { document?: Record<string, unknown> }) =>
  document?.layout === "subService";

export const servicePage = defineType({
  name: "servicePage",
  title: "Service Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "layout",
      title: "Page Layout",
      type: "string",
      options: {
        list: [
          { title: "Standard", value: "standard" },
          { title: "Sub-service (rich template)", value: "subService" },
        ],
        layout: "radio",
      },
      initialValue: "standard",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "object",
      hidden: ({ document }) => !isSubService({ document }),
      fields: [
        defineField({ name: "before", title: "Before highlight", type: "string" }),
        defineField({ name: "highlight", title: "Highlighted text", type: "string" }),
        defineField({ name: "after", title: "After highlight", type: "string" }),
      ],
    }),
    defineField({
      name: "flow",
      title: "Hero Flow Steps",
      type: "array",
      of: [{ type: "flowStep" }],
      hidden: ({ document }) => !isSubService({ document }),
    }),
    defineField({
      name: "stats",
      title: "Stats Strip",
      type: "array",
      of: [{ type: "statItem" }],
      hidden: ({ document }) => !isSubService({ document }),
    }),
    defineField({
      name: "whyTitle",
      title: "Why Section Title",
      type: "string",
      hidden: ({ document }) => !isSubService({ document }),
    }),
    defineField({
      name: "whyHighlight",
      title: "Why Title Highlight",
      type: "string",
      hidden: ({ document }) => !isSubService({ document }),
    }),
    defineField({
      name: "whyText",
      title: "Why Section Text",
      type: "text",
      rows: 4,
      hidden: ({ document }) => !isSubService({ document }),
    }),
    defineField({
      name: "checks",
      title: "Checklist Items",
      type: "array",
      of: [{ type: "string" }],
      hidden: ({ document }) => !isSubService({ document }),
    }),
    defineField({
      name: "useCases",
      title: "Use Cases",
      type: "array",
      of: [{ type: "useCaseItem" }],
      hidden: ({ document }) => !isSubService({ document }),
    }),
    defineField({
      name: "pricing",
      title: "Pricing Band",
      type: "object",
      hidden: ({ document }) => !isSubService({ document }),
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "detail", title: "Detail", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [{ type: "faqItem" }],
      hidden: ({ document }) => !isSubService({ document }),
    }),
    defineField({
      name: "processSteps",
      title: "Process Steps",
      type: "array",
      of: [{ type: "processStep" }],
      hidden: ({ document }) => !isSubService({ document }),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "heroCta",
      title: "Hero CTA",
      type: "ctaButton",
    }),
    defineField({
      name: "capabilitiesHeading",
      title: "Capabilities Heading",
      type: "string",
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities",
      type: "array",
      of: [{ type: "capabilityItem" }],
    }),
    defineField({
      name: "whyUsHeading",
      title: "Why Us Heading",
      type: "string",
    }),
    defineField({
      name: "whyUs",
      title: "Why Choose Us",
      type: "array",
      of: [{ type: "whyUsItem" }],
    }),
    defineField({
      name: "technologiesHeading",
      title: "Technologies Heading",
      type: "string",
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [{ type: "technologyItem" }],
    }),
    defineField({
      name: "cta",
      title: "CTA Section",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "button",
          title: "Button",
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
    select: {
      title: "title",
      subtitle: "slug.current",
      layout: "layout",
    },
    prepare({ title, subtitle, layout }) {
      return {
        title,
        subtitle: `${subtitle ?? ""}${layout === "subService" ? " · sub-service" : ""}`,
      };
    },
  },
});
