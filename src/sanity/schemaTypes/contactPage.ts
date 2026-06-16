import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
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
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook URL",
      type: "url",
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [{ type: "faqItem" }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contact Page" };
    },
  },
});
