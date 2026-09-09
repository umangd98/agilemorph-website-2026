import type { FaqItem } from "@/sanity/types";

/**
 * Default homepage FAQ. Written to close the semantic gaps top competitors
 * cover and the homepage did not: implementation timeline, cost model, data
 * ownership / self-hosting, AI agent vs automation, ROI, team training, and
 * support. Answers reuse the company's own stated metrics only.
 *
 * These render on the page AND feed the FAQPage JSON-LD, so the two always
 * match (a Google requirement for FAQ rich results). When a `homepage.faq`
 * field is added in Sanity, that content takes precedence over this fallback.
 */
export const HOMEPAGE_FAQ_HEADING = "Frequently asked questions";
export const HOMEPAGE_FAQ_EYEBROW = "Answers";

export const homepageFaq: FaqItem[] = [
  {
    question: "What does an AI automation agency actually do?",
    answer:
      "We find the repetitive, manual work draining your team, then design, build, and deploy AI workflows and agents that run it for you. That covers lead capture and follow-up, CRM updates, messaging across WhatsApp and email, order and inventory flows, reporting, and custom AI agents. You get working systems in production, not slide decks or advice.",
  },
  {
    question:
      "How is this different from setting up Zapier or Make myself?",
    answer:
      "DIY tools handle simple, linear tasks. We build production-grade systems: multi-step workflows with error handling, AI agents that make decisions, self-hosted infrastructure when you need control, and integrations across 500+ platforms that keep working as your business changes. We are certified across Anthropic (Claude), Make.com (Platinum Partner), n8n, and Zapier, so we pick the right tool for the job instead of forcing everything into one.",
  },
  {
    question: "How long does it take to build and deploy automations?",
    answer:
      "Most engagements start with a focused planning sprint, then move into iterative builds with rapid feedback. Smaller automations ship in one to two weeks. Larger, multi-system builds run in phases so you see value early instead of waiting months for one big launch.",
  },
  {
    question: "How much does it cost to work with AgileMorph?",
    answer:
      "Pricing depends on scope and the outcome you need, and we favor value-based pricing over billing by the hour. The fastest way to a real number is a discovery call or our fixed-scope AI Audit, which maps your highest-ROI automations before you commit to a build. See the pricing page for current engagement options.",
  },
  {
    question:
      "Do I own the automations you build, and where does my data live?",
    answer:
      "You own what we build. For teams that need full control, we deploy self-hosted AI and MCP infrastructure so your workflows and data stay on your own systems rather than locked inside a third-party platform. We scope data handling and access with you up front.",
  },
  {
    question: "What is an AI agent, and do I need one?",
    answer:
      "An AI agent is software that can reason over a task and take actions on its own, such as reading an inbound message, deciding how to route it, updating your CRM, and drafting a reply. You need one when a task requires judgment rather than a fixed if-this-then-that rule. When a task is predictable, a standard workflow is cheaper and more reliable, and we will tell you which one fits.",
  },
  {
    question: "What kind of ROI can I expect, and how fast?",
    answer:
      "The gain shows up as hours returned to your team and lower cost per task. Across our work we have saved clients 500,000+ hours through automation. Use the efficiency calculator on this page to estimate your own annual savings from team size, weekly manual hours, and hourly cost.",
  },
  {
    question: "Will you train my team to run the automations?",
    answer:
      "Yes. We hand over clear documentation and walk your team through how each system works, how to monitor it, and what to do if something needs a change. The goal is systems your team can trust and operate, not a black box that only we understand.",
  },
  {
    question: "What happens if an automation breaks?",
    answer:
      "We build in error handling and monitoring so problems surface before they cost you. We also offer ongoing support and maintenance, and our 98% client retention rate reflects that we stay accountable after launch, not just through go-live.",
  },
  {
    question: "What kinds of businesses do you work with?",
    answer:
      "We work with growing SMBs and service businesses, including digital marketing agencies, B2B service firms, and e-commerce brands on Shopify. We have delivered 180+ projects for 100+ clients across four continents over 4+ years of building AI systems.",
  },
];
