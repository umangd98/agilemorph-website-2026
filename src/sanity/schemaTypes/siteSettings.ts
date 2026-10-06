import { versionField } from "./reviewedFields";
import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    versionField,
    defineField({
      name: "credentials",
      title: "Documented credentials",
      type: "array",
      of: [{ type: "partnerItem" }],
    }),
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
      description: "Default title for pages without SEO title",
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      type: "text",
      rows: 2,
      description: "Default meta description",
    }),
    defineField({
      name: "navLinks",
      title: "Navigation Links",
      type: "array",
      of: [{ type: "navLink" }],
      description:
        "Main navigation. Service links come from the primary service documents.",
    }),
    defineField({
      name: "footerQuickLinks",
      title: "Footer Quick Links",
      type: "array",
      of: [{ type: "navLink" }],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [{ type: "socialLink" }],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
