import type { FaqItem } from "@/sanity/types";

import { FDE_EXPLAINER } from "./positioning";

/**
 * Homepage FAQ, written around Forward Deployed Engineering.
 *
 * These render on the page AND feed the FAQPage JSON-LD, so the two always
 * match (a Google requirement for FAQ rich results). When a `homepage.faq`
 * field is added in Sanity, that content takes precedence over this fallback.
 */
export const HOMEPAGE_FAQ_HEADING = "Frequently asked questions";
export const HOMEPAGE_FAQ_EYEBROW = "Answers";

export const homepageFaq: FaqItem[] = [
  {
    question: "What is Forward Deployed Engineering?",
    answer: FDE_EXPLAINER,
  },
  {
    question: "How is this different from hiring an IT vendor or an automation agency?",
    answer:
      "A traditional vendor works offsite from a requirements document, fixes scope before anyone has seen the field, ships a system and hands it over, and counts success as delivered to spec. We work on your sites or beside your people, set scope from what we observe in the discovery audit, ship a working workflow in weeks and improve it every week, and own adoption until usage data proves it works. Success means it is used on site, with accurate and current data.",
  },
  {
    question: "Do you work on site?",
    answer:
      "Yes, for enterprise engagements in India. For clients abroad we work remote-embedded, with daily working sessions with your team.",
  },
  {
    question: "What systems do you work with?",
    answer:
      "SAP, Salesforce, ERPs, CRMs, factory and field tools, WhatsApp Business, Shopify, and custom software. We build inside the systems you already run rather than adding a parallel one.",
  },
  {
    question: "Can you deploy in our own cloud or on-premise?",
    answer:
      "Yes. Model choice and hosting are agreed with your IT team, and we can run everything in your cloud account or on your own servers.",
  },
  {
    question: "Who owns what you build?",
    answer: "You do: code, workflows, documentation and data.",
  },
  {
    question: "How do engagements start?",
    answer:
      "With a fixed-scope discovery audit for enterprises, or an AI Audit for growing businesses. No long contract before you've seen results.",
  },
  {
    question: "How long until something is live?",
    answer: "A pilot is usually live in production within weeks of the audit.",
  },
  {
    question: "Do you only use no-code tools?",
    answer:
      "No. We use Make, n8n and Zapier where they fit and write custom code in Python, TypeScript and Java where they don't.",
  },
  {
    question: "Do you work with smaller businesses?",
    answer: "Yes, through the AI Audit. Same model, smaller scope.",
  },
];
