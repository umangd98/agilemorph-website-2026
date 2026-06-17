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
      name: "process",
      title: "Process Section",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "subheading",
          title: "Subheading",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [{ type: "processStep" }],
        }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Statistics",
      type: "array",
      of: [{ type: "stat" }],
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
      name: "founder",
      title: "Founder",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
        }),
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "name",
          title: "Name",
          type: "string",
        }),
        defineField({
          name: "role",
          title: "Role",
          type: "string",
        }),
        defineField({
          name: "bio",
          title: "Bio",
          type: "text",
          rows: 8,
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
    }),
    defineField({
      name: "integrations",
      title: "Integrations Marquee",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "items",
          title: "Integration Tools",
          type: "array",
          of: [{ type: "integrationItem" }],
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
    defineField({
      name: "featuredLogos",
      title: "Featured Logos",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "logos",
          title: "Logos",
          type: "array",
          of: [
            {
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "items",
          title: "Items",
          type: "array",
          of: [{ type: "testimonial" }],
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
    prepare() {
      return { title: "About Page" };
    },
  },
});
