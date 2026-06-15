import { defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "heroSection",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Content Sections",
      type: "array",
      of: [{ type: "contentSection" }],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Homepage",
      };
    },
  },
});
