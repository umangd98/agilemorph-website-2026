"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";

const singletonTypes = new Set([
  "homepage",
  "aboutPage",
  "contactPage",
  "pricingPage",
  "blogIndexPage",
  "servicesIndexPage",
  "siteSettings",
]);

export default defineConfig({
  name: "agilemorph-site",
  title: "AgileMorph",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Homepage")
              .id("homepage")
              .child(
                S.document()
                  .schemaType("homepage")
                  .documentId("homepage")
                  .title("Homepage"),
              ),
            S.listItem()
              .title("About Page")
              .id("aboutPage")
              .child(
                S.document()
                  .schemaType("aboutPage")
                  .documentId("aboutPage")
                  .title("About Page"),
              ),
            S.listItem()
              .title("Contact Page")
              .id("contactPage")
              .child(
                S.document()
                  .schemaType("contactPage")
                  .documentId("contactPage")
                  .title("Contact Page"),
              ),
            S.listItem()
              .title("Pricing Page")
              .id("pricingPage")
              .child(
                S.document()
                  .schemaType("pricingPage")
                  .documentId("pricingPage")
                  .title("Pricing Page"),
              ),
            S.listItem()
              .title("Blog Index Page")
              .id("blogIndexPage")
              .child(
                S.document()
                  .schemaType("blogIndexPage")
                  .documentId("blogIndexPage")
                  .title("Blog Index Page"),
              ),
            S.listItem()
              .title("Services Index Page")
              .id("servicesIndexPage")
              .child(
                S.document()
                  .schemaType("servicesIndexPage")
                  .documentId("servicesIndexPage")
                  .title("Services Index Page"),
              ),
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Site Settings"),
              ),
            S.divider(),
            S.documentTypeListItem("servicePage").title("Service Pages"),
            S.documentTypeListItem("blogPost").title("Blog Posts"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
