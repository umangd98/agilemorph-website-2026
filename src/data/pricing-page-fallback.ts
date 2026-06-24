import type { PricingPage } from "@/sanity/types";

/** Default pricing content — used when Sanity document is missing or cache is stale. */
export const pricingPageFallback: PricingPage = {
  _id: "pricingPage",
  _type: "pricingPage",
  hero: {
    eyebrow: "Pricing",
    heading: "Straightforward engagements.\nPredictable outcomes.",
    description:
      "Every engagement begins with a discovery audit. From there, you choose a fixed-scope project or an ongoing retainer — both structured around delivery, not hours.",
  },
  projectSection: {
    label: "Project pricing — four fixed-scope tiers",
    tiers: [
      {
        name: "Discovery audit",
        price: "Free",
        priceStrikethrough: "$500",
        priceBadge: "Free",
        limitedNote: "Limited time — book before spots fill.",
        timeline: "1–2 days",
        tagline: "Understand exactly what to build before committing to the build.",
        deliverables: [
          "Current-state workflow map",
          "Prioritized bottleneck analysis",
          "Recommended automation architecture",
          "Written scope for the build phase",
          "60-min walkthrough session with the founder",
        ],
        paymentNote:
          "Free for a limited time. Normally $500, credited toward your build invoice if you proceed.",
      },
      {
        name: "Single workflow",
        price: "$3K – $8K",
        timeline: "2–6 weeks",
        tagline: "One focused automation — scoped, built, and handed over production-ready.",
        deliverables: [
          "Workflow architecture document",
          "Production build in n8n, Make, or Zapier",
          "Integrations with your existing tools and CRM",
          "Error handling, monitoring, and retry logic",
          "Operator runbook and 30-day post-launch support",
        ],
        paymentNote: "50% at kickoff, 50% at production launch.",
      },
      {
        name: "Connected systems build",
        price: "$8K – $20K",
        timeline: "4–10 weeks",
        tagline: "Multiple workflows operating as one cohesive system across your stack.",
        featured: true,
        deliverables: [
          "Full operational architecture and data model",
          "3–8 workflows sharing a common data layer",
          "CRM integration and contact data design",
          "Custom API integrations and webhook handlers",
          "Observability, alerting, and error management",
          "60 days post-launch support",
        ],
        paymentNote: "40% at kickoff, 30% at mid-build review, 30% at launch.",
      },
      {
        name: "AI platform build",
        price: "$20K+",
        timeline: "2–5 months",
        tagline: "Custom AI infrastructure — agents, internal tools, or a full operations rebuild.",
        deliverables: [
          "Custom LLM agents built on Claude or GPT-4",
          "MCP server setup and AI tool infrastructure",
          "Full-stack development — Django, FastAPI, React",
          "Cloud deployment on AWS or DigitalOcean",
          "10+ connected workflows across teams",
          "90-day post-launch support and optimization",
        ],
        paymentNote:
          "Milestone-based. Typically 3–4 payment gates tied to delivery checkpoints.",
      },
    ],
  },
  retainerSection: {
    label: "Retainer pricing — three monthly tiers",
    description:
      "Month-to-month engagements structured around output, not seat time. Each tier reflects a different level of operational involvement.",
    tiers: [
      {
        name: "Maintain",
        price: "$2K",
        hours: "~8 hrs/month",
        tagline: "Your automations stay healthy and your team stays unblocked.",
        items: [
          "Workflow monitoring and uptime checks",
          "Credential rotations and API updates",
          "Monthly health-check report",
          "Up to 2 small enhancements per month",
        ],
      },
      {
        name: "Iterate",
        price: "$5K",
        hours: "~20 hrs/month",
        tagline: "Active improvement across your stack each month, not just upkeep.",
        featured: true,
        items: [
          "Everything in Maintain",
          "Quarterly ops review and roadmap session",
          "2–4 new workflows delivered per month",
          "Direct Slack or email channel with the team",
          "Same-business-day response on production issues",
        ],
      },
      {
        name: "Embed",
        price: "$10K",
        hours: "~40 hrs/month",
        tagline: "AgileMorph operates as part of your team, not alongside it.",
        items: [
          "Everything in Iterate",
          "Weekly working sessions with the team",
          "Continuous workflow delivery capacity",
          "CRM and tooling implementation included",
          "On-call coverage for business-critical workflows",
        ],
      },
    ],
  },
  engagementSection: {
    label: "How engagements work",
    steps: [
      {
        step: "Step 01",
        title: "Discovery first",
        description:
          "Every engagement starts with a paid audit. We map your current operations, identify the highest-leverage automation opportunities, and produce a written scope. You know exactly what you're getting before any build begins.",
      },
      {
        step: "Step 02",
        title: "Fixed scope, defined delivery",
        description:
          "The scope document from discovery becomes the contract. Deliverables, timelines, and payment milestones are agreed upfront. There are no change orders for work that falls within the original scope.",
      },
      {
        step: "Step 03",
        title: "Handed over, not dependent",
        description:
          "Every build includes full documentation and a runbook your team can operate. The goal is that you understand what we've built. Ongoing support is an option, not a requirement for the system to function.",
      },
    ],
  },
  cta: {
    heading: "Start with a free\ndiscovery audit.",
    headingAccent: "discovery audit.",
    primaryCta: { label: "Book a discovery call", href: "/contact#book" },
    secondaryCta: { label: "See what we build", href: "/services" },
  },
  seo: {
    title: "Pricing — AgileMorph Solutions",
    description:
      "Straightforward engagements and predictable outcomes. Fixed-scope project pricing and monthly retainer tiers for AI automation and digital operations.",
  },
};
