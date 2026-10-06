import { defineField, defineType } from "sanity";

export const teamLeadItem = defineType({
  name: "teamLeadItem",
  title: "Team Lead",
  type: "object",
  fields: [
    defineField({
      name: "portrait",
      title: "Local portrait path",
      type: "string",
    }),
    defineField({ name: "focus", title: "Delivery focus", type: "string" }),
    defineField({
      name: "profileUrl",
      title: "Verified professional profile",
      type: "url",
    }),
    defineField({
      name: "projectSlugs",
      title: "Related project slugs",
      type: "array",
      of: [{ type: "string" }],
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
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
    select: { title: "name", subtitle: "role", media: "image" },
  },
});
