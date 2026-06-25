import { defineField, defineType } from "sanity";

export const teamLeadItem = defineType({
  name: "teamLeadItem",
  title: "Team Lead",
  type: "object",
  fields: [
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
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "image" },
  },
});
