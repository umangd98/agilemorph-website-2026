import { defineField, defineType } from "sanity";
import {
  versionField,
  textField,
  strings,
  engagementField,
} from "./reviewedFields";
export const pricingPage = defineType({
  name: "pricingPage",
  title: "Engagements & pricing",
  type: "document",
  fields: [
    versionField,
    textField("heading", "Heading"),
    textField("description", "Description", "text"),
    engagementField,
    strings("costDrivers", "Cost drivers"),
    textField("costNote", "Third-party cost explanation", "text"),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
