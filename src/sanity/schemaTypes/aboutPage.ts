import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
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
          name: "tagline",
          title: "Tagline",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "cta",
          title: "Call to Action",
          type: "ctaButton",
        }),
        defineField({
          name: "image",
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
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "about",
      title: "Company Story",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "body",
          title: "Body",
          type: "text",
          rows: 8,
        }),
        defineField({
          name: "promiseHeading",
          title: "Promise Heading",
          type: "string",
        }),
        defineField({
          name: "promise",
          title: "Promise",
          type: "text",
          rows: 4,
        }),
        defineField({
          name: "image",
          title: "Illustration",
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
    }),
    defineField({
      name: "values",
      title: "Company Values",
      type: "array",
      of: [{ type: "companyValue" }],
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
      name: "partners",
      title: "Partners Section",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "items",
          title: "Partners",
          type: "array",
          of: [{ type: "partnerItem" }],
        }),
      ],
    }),
    defineField({ name: "founders", title: "Founders", type: "foundersBlock" }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
