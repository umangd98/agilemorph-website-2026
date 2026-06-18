import { defineField, defineType } from "sanity";

export const capabilityItem = defineType({
  name: "capabilityItem",
  title: "Capability",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon Label",
      type: "string",
      description: "Optional emoji or short label for the capability icon.",
    }),
    defineField({
      name: "image",
      title: "Icon Image",
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
    select: { title: "title" },
  },
});
