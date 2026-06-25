import { defineField, defineType } from "sanity";

export const pricingEngagementStep = defineType({
  name: "pricingEngagementStep",
  title: "Engagement Step",
  type: "object",
  fields: [
    defineField({
      name: "step",
      title: "Step Label",
      type: "string",
      description: "e.g. Step 01",
      validation: (rule) => rule.required(),
    }),
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
  ],
  preview: {
    select: { title: "title", subtitle: "step" },
  },
});
