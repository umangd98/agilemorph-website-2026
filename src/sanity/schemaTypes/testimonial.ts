import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "object",
  fields: [
    defineField({
      name: "relationship",
      title: "Relationship",
      type: "string",
      options: {
        list: [
          { title: "Client feedback", value: "client" },
          { title: "Professional recommendation", value: "professional" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "sourceUrl", title: "Public source URL", type: "url" }),
    defineField({
      name: "caseStudy",
      title: "Related case study",
      type: "reference",
      to: [{ type: "caseStudy" }],
    }),
    defineField({
      name: "rating",
      title: "Sourced rating (optional)",
      type: "number",
      validation: (r) =>
        r
          .min(1)
          .max(5)
          .custom((v, c) =>
            v && !(c.parent as { sourceUrl?: string })?.sourceUrl
              ? "A rating needs a public source URL"
              : true,
          ),
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Photo",
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
  ],
  preview: {
    select: { title: "name", subtitle: "company" },
  },
});
