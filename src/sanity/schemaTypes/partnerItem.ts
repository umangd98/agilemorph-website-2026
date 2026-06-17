import { defineField, defineType } from "sanity";

export const partnerItem = defineType({
  name: "partnerItem",
  title: "Partner Item",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: 'e.g. "SERVICES PARTNER"',
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
    defineField({
      name: "logo",
      title: "Logo",
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
    select: {
      title: "name",
      subtitle: "label",
      media: "logo",
    },
  },
});
