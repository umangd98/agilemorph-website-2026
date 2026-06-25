/**
 * AI automation sub-service page content sourced from the services reference design.
 * Used by scripts/seed-content.mjs when seeding Sanity servicePage documents.
 */

import {
  SUB_SERVICE_PROCESS_STEPS,
  SUB_SERVICE_RICH_FIELDS_BY_SLUG,
} from "./sub-service-rich-fields.mjs";

export const AI_AUTOMATION_SUB_SERVICES = [
  {
    id: "ai-agents",
    slug: "ai-agents",
    title: "AI Agents",
    tagline: "AI Automation",
    description:
      "We build autonomous AI agents that read context, make decisions, and take action across your tools without a human in the loop. Classification, routing, drafting, and execution, running the moment work arrives.",
    heroCta: { label: "Book a Discovery Call", href: "https://calendly.com/agilemorph/15-minute-discovery" },
    capabilitiesHeading: "What's Included",
    capabilities: [
      {
        title: "Intent Classification",
        description:
          "Every inbound message tagged by type, urgency, and next action in real time.",
        icon: "⬡",
      },
      {
        title: "Smart Drafting",
        description: "Replies and summaries written in your voice, grounded in your own data.",
        icon: "✎",
      },
      {
        title: "Tool Execution",
        description: "Agents that write to your systems, not just read from them.",
        icon: "⤳",
      },
    ],
    whyUsHeading: "Where An Agent Beats A Workflow",
    whyUs: [
      {
        title: "Unstructured input",
        description:
          "Reads unstructured input: emails, chats, documents, and voice notes.",
        highlights: ["Emails & chats", "Documents", "Voice notes"],
      },
      {
        title: "Smart routing",
        description:
          "Classifies intent and urgency, then routes to the right path automatically.",
        highlights: ["Intent detection", "Priority routing"],
      },
      {
        title: "Context-aware replies",
        description:
          "Drafts and sends context-aware replies for your approval or fully autonomously.",
        highlights: ["Your voice", "Human-in-the-loop optional"],
      },
      {
        title: "Direct tool access",
        description:
          "Calls your tools directly: CRM, calendar, databases, and payment systems.",
        highlights: ["CRM & calendar", "Databases", "Payments"],
      },
      {
        title: "Human escalation",
        description: "Escalates edge cases to a human with full context attached.",
        highlights: ["Full context", "Confidence thresholds"],
      },
    ],
    cta: {
      heading: "Ready To Automate This?",
      description:
        "Book a 15-minute discovery call. We'll tell you straight whether automation makes sense for your case, and what it would take.",
      button: { label: "Book Your Call", href: "https://calendly.com/agilemorph/15-minute-discovery" },
    },
    seo: {
      title: "AI Agents | AgileMorph Solutions",
      description:
        "Autonomous AI agents that classify, decide, and act across your tools without a human in the loop.",
    },
  },
  {
    id: "workflow-automation",
    slug: "workflow-automation",
    title: "Workflow Automation",
    tagline: "AI Automation",
    description:
      "We turn the manual processes draining your team into reliable automated pipelines. Built on n8n, Make, and Zapier, connected to the tools you already use, monitored so they keep running.",
    heroCta: { label: "Book a Discovery Call", href: "https://calendly.com/agilemorph/15-minute-discovery" },
    capabilitiesHeading: "What's Included",
    capabilities: [
      {
        title: "Process Mapping",
        description: "We document the manual flow first, then automate the version worth keeping.",
        icon: "⟳",
      },
      {
        title: "Reliable Pipelines",
        description: "Retries, logging, and fallbacks built in, not bolted on later.",
        icon: "⛭",
      },
      {
        title: "Data Sync",
        description: "Keep your tools in agreement without manual exports and imports.",
        icon: "▦",
      },
    ],
    whyUsHeading: "Automation That Survives Contact With Reality",
    whyUs: [
      {
        title: "Self-hosted n8n",
        description: "Self-hosted n8n for full control and no per-task billing surprises.",
        highlights: ["Full control", "No per-task billing"],
      },
      {
        title: "Error handling",
        description: "Error handling and retries so one bad record doesn't stop everything.",
        highlights: ["Retries", "Graceful failures"],
      },
      {
        title: "Proactive alerting",
        description: "Alerting when something needs a human, instead of silent failure.",
        highlights: ["Real-time alerts", "No silent failures"],
      },
      {
        title: "Clear documentation",
        description: "Clean documentation so your team can see exactly what runs and when.",
        highlights: ["Runbooks", "Team visibility"],
      },
      {
        title: "Certified n8n partner",
        description: "Certified n8n partner team building production-ready pipelines.",
        highlights: ["Certified partner", "Production-ready"],
      },
    ],
    cta: {
      heading: "Ready To Automate This?",
      description:
        "Book a 15-minute discovery call. We'll tell you straight whether automation makes sense for your case, and what it would take.",
      button: { label: "Book Your Call", href: "https://calendly.com/agilemorph/15-minute-discovery" },
    },
    seo: {
      title: "Workflow Automation | AgileMorph Solutions",
      description:
        "n8n, Make, and Zapier pipelines that eliminate repetitive work and keep running reliably.",
    },
  },
  {
    id: "crm-lead-automation",
    slug: "crm-lead-automation",
    title: "CRM & Lead Automation",
    tagline: "AI Automation",
    description:
      "Stop losing leads to slow manual handling. We automate the full cycle: capture from any channel, enrich with real data, route to the right person, and trigger follow-up before the lead goes cold.",
    heroCta: { label: "Book a Discovery Call", href: "https://calendly.com/agilemorph/15-minute-discovery" },
    capabilitiesHeading: "What's Included",
    capabilities: [
      {
        title: "Multi-Channel Capture",
        description: "One pipeline for leads from every source you run.",
        icon: "◎",
      },
      {
        title: "Data Enrichment",
        description: "Turn a name and email into a full, verified profile.",
        icon: "⊕",
      },
      {
        title: "Smart Routing",
        description: "The right lead to the right rep, instantly and by rule.",
        icon: "⇲",
      },
    ],
    whyUsHeading: "Speed-To-Lead Is The Whole Game",
    whyUs: [
      {
        title: "Every channel",
        description: "Capture leads from forms, ads, email, chat, and LinkedIn into one place.",
        highlights: ["Forms & ads", "Email & chat", "LinkedIn"],
      },
      {
        title: "Verified enrichment",
        description: "Enrich with verified contact data via Apollo, Lusha, and NeverBounce.",
        highlights: ["Apollo & Lusha", "Email verification"],
      },
      {
        title: "Automatic scoring",
        description: "Score and segment automatically so reps work the best leads first.",
        highlights: ["Lead scoring", "Smart segments"],
      },
      {
        title: "Instant follow-up",
        description: "Trigger instant first-touch follow-up by email or message.",
        highlights: ["Seconds, not hours", "Multi-channel"],
      },
      {
        title: "CRM sync",
        description: "Sync cleanly to HubSpot, Pipedrive, Salesforce, or your CRM of choice.",
        highlights: ["HubSpot", "Pipedrive", "Salesforce"],
      },
    ],
    cta: {
      heading: "Ready To Automate This?",
      description:
        "Book a 15-minute discovery call. We'll tell you straight whether automation makes sense for your case, and what it would take.",
      button: { label: "Book Your Call", href: "https://calendly.com/agilemorph/15-minute-discovery" },
    },
    seo: {
      title: "CRM & Lead Automation | AgileMorph Solutions",
      description:
        "Capture, enrich, route, and follow up on every lead automatically before they go cold.",
    },
  },
  {
    id: "mcp-ai-infrastructure",
    slug: "mcp-ai-infrastructure",
    title: "MCP & AI Infrastructure",
    tagline: "AI Automation",
    description:
      "For teams past the prototype stage. We build self-hosted pipelines, MCP servers, and deployed systems that connect AI directly to your data and tools, securely, observably, and built to scale.",
    heroCta: { label: "Book a Discovery Call", href: "https://calendly.com/agilemorph/15-minute-discovery" },
    capabilitiesHeading: "What's Included",
    capabilities: [
      {
        title: "MCP Servers",
        description: "A clean, governed bridge between your systems and any AI model.",
        icon: "⧉",
      },
      {
        title: "Self-Hosted Deploys",
        description: "Pipelines on your cloud, with no per-task surprise billing.",
        icon: "⚙",
      },
      {
        title: "Observability",
        description: "Langfuse tracing so nothing the AI does is a black box.",
        icon: "◴",
      },
    ],
    whyUsHeading: "When A No-Code Tool Isn't Enough",
    whyUs: [
      {
        title: "Governed MCP access",
        description: "MCP servers that expose your data and tools to AI models safely.",
        highlights: ["Secure access", "Governed tools"],
      },
      {
        title: "Your infrastructure",
        description: "Self-hosted deployments on AWS or DigitalOcean, under your control.",
        highlights: ["AWS", "DigitalOcean"],
      },
      {
        title: "Full observability",
        description: "Observability with Langfuse so you can see every call, cost, and failure.",
        highlights: ["Langfuse tracing", "Cost visibility"],
      },
      {
        title: "PII handling",
        description: "PII handling and local redaction to keep sensitive data off third-party clouds.",
        highlights: ["Local redaction", "Privacy-first"],
      },
      {
        title: "Built to scale",
        description: "Built to scale from first user to high volume without a rebuild.",
        highlights: ["Production-grade", "Scales with you"],
      },
    ],
    cta: {
      heading: "Ready To Automate This?",
      description:
        "Book a 15-minute discovery call. We'll tell you straight whether automation makes sense for your case, and what it would take.",
      button: { label: "Book Your Call", href: "https://calendly.com/agilemorph/15-minute-discovery" },
    },
    seo: {
      title: "MCP & AI Infrastructure | AgileMorph Solutions",
      description:
        "Self-hosted pipelines, MCP servers, and production-grade AI deployments you control.",
    },
  },
  {
    id: "messaging-automation",
    slug: "messaging-automation",
    title: "Messaging Automation",
    tagline: "AI Automation",
    description:
      "We automate the channels your customers actually use. WhatsApp, email, and chat, with AI that reads, classifies, and responds in real time, captures structured data, and routes anything that needs a human.",
    heroCta: { label: "Book a Discovery Call", href: "https://calendly.com/agilemorph/15-minute-discovery" },
    capabilitiesHeading: "What's Included",
    capabilities: [
      {
        title: "WhatsApp Pipelines",
        description: "Production WhatsApp automation, classified and logged in real time.",
        icon: "✉",
      },
      {
        title: "AI Replies",
        description: "Context-aware responses in your voice, on your terms.",
        icon: "⌯",
      },
      {
        title: "Data Capture",
        description: "Every conversation turned into clean, structured records.",
        icon: "▤",
      },
    ],
    whyUsHeading: "Built On Real Production Pipelines",
    whyUs: [
      {
        title: "WhatsApp automation",
        description: "WhatsApp automation via Whapi and self-hosted n8n, no platform lock-in.",
        highlights: ["Whapi", "Self-hosted n8n"],
      },
      {
        title: "AI classification",
        description: "AI classification of every message by type, intent, and urgency.",
        highlights: ["Intent detection", "Urgency scoring"],
      },
      {
        title: "Structured extraction",
        description: "Structured data extraction straight into Airtable, a CRM, or a database.",
        highlights: ["Airtable", "CRM sync"],
      },
      {
        title: "Reliable architecture",
        description: "Buffered, multi-path architecture so nothing is dropped under load.",
        highlights: ["Buffered queues", "Multi-path routing"],
      },
      {
        title: "Human handoff",
        description: "Human handoff with full context when a conversation needs it.",
        highlights: ["Full context", "Seamless escalation"],
      },
    ],
    cta: {
      heading: "Ready To Automate This?",
      description:
        "Book a 15-minute discovery call. We'll tell you straight whether automation makes sense for your case, and what it would take.",
      button: { label: "Book Your Call", href: "https://calendly.com/agilemorph/15-minute-discovery" },
    },
    seo: {
      title: "Messaging Automation | AgileMorph Solutions",
      description:
        "WhatsApp, email, and chat automations that respond, convert, and log every conversation.",
    },
  },
  {
    id: "ai-audit",
    slug: "ai-audit",
    title: "AI Audit",
    tagline: "AI Automation",
    description:
      "Before you spend on automation, know what's worth automating. Our fixed-scope AI Audit maps your processes, identifies the highest-ROI opportunities, and gives you a prioritized, costed roadmap you can act on, with or without us.",
    heroCta: { label: "Book a Discovery Call", href: "https://calendly.com/agilemorph/15-minute-discovery" },
    capabilitiesHeading: "What's Included",
    capabilities: [
      {
        title: "Process Mapping",
        description: "We document how work actually flows today, end to end.",
        icon: "◷",
      },
      {
        title: "ROI Scoring",
        description: "Each opportunity ranked by return against effort.",
        icon: "⊿",
      },
      {
        title: "Action Roadmap",
        description: "A sequenced plan, not a vague list of ideas.",
        icon: "▣",
      },
    ],
    whyUsHeading: "Clarity Before Spend",
    whyUs: [
      {
        title: "Real workflow review",
        description: "A structured review of your real workflows, not a generic checklist.",
        highlights: ["Your processes", "Not generic"],
      },
      {
        title: "ROI scoring",
        description: "Every opportunity scored by time saved, cost, and implementation effort.",
        highlights: ["Time saved", "Effort vs return"],
      },
      {
        title: "Prioritized roadmap",
        description: "A prioritized roadmap: what to automate first, second, and later.",
        highlights: ["Sequenced plan", "Clear priorities"],
      },
      {
        title: "Honest recommendations",
        description: "Honest calls on what is not worth automating yet.",
        highlights: ["No overselling", "Practical advice"],
      },
      {
        title: "Yours to keep",
        description: "A document your team owns and can act on with any provider.",
        highlights: ["You own it", "Provider-agnostic"],
      },
    ],
    cta: {
      heading: "Ready To Automate This?",
      description:
        "Book a 15-minute discovery call. We'll tell you straight whether automation makes sense for your case, and what it would take.",
      button: { label: "Book Your Call", href: "https://calendly.com/agilemorph/15-minute-discovery" },
    },
    seo: {
      title: "AI Audit | AgileMorph Solutions",
      description:
        "A fixed-scope review that maps where AI saves you the most time and money.",
    },
  },
  {
    id: "shopify-automation",
    slug: "shopify-automation",
    title: "Shopify Automation",
    tagline: "AI Automation",
    description:
      "We automate the operational load behind your Shopify store, order routing, inventory sync, fulfillment updates, and customer notifications, connected to the rest of your stack through n8n, Make, or custom pipelines.",
    heroCta: { label: "Book a Discovery Call", href: "https://calendly.com/agilemorph/15-minute-discovery" },
    capabilitiesHeading: "What's Included",
    capabilities: [
      {
        title: "Order & Fulfillment Flows",
        description: "Route orders, update statuses, and trigger fulfillment without manual handoffs.",
        icon: "🛍",
      },
      {
        title: "Inventory Sync",
        description: "Keep stock levels aligned across Shopify, warehouses, and your other tools.",
        icon: "▦",
      },
      {
        title: "Customer Notifications",
        description: "Automated emails and messages for shipping, returns, and post-purchase follow-up.",
        icon: "✉",
      },
    ],
    whyUsHeading: "Built For Real Shopify Operations",
    whyUs: [
      {
        title: "Admin API integrations",
        description: "Connect to Shopify Admin GraphQL for products, orders, inventory, and customers.",
        highlights: ["Orders", "Inventory", "Customers"],
      },
      {
        title: "Workflow tooling",
        description: "Pipelines on n8n, Make, or self-hosted infrastructure you control.",
        highlights: ["n8n", "Make", "Self-hosted"],
      },
      {
        title: "Cross-stack sync",
        description: "Bridge Shopify with CRM, ERP, shipping, and support tools automatically.",
        highlights: ["CRM sync", "ERP ready"],
      },
      {
        title: "Error handling",
        description: "Retries, logging, and alerts so failed webhooks don't silently break ops.",
        highlights: ["Retries", "Alerts"],
      },
      {
        title: "Production experience",
        description: "We've shipped Shopify automations alongside our broader AI automation work.",
        highlights: ["Production-ready", "Proven stack"],
      },
    ],
    cta: {
      heading: "Ready To Automate This?",
      description:
        "Book a 15-minute discovery call. We'll tell you straight whether automation makes sense for your case, and what it would take.",
      button: { label: "Book Your Call", href: "https://calendly.com/agilemorph/15-minute-discovery" },
    },
    seo: {
      title: "Shopify Automation | AgileMorph Solutions",
      description:
        "Automate orders, inventory, fulfillment, and customer flows across your Shopify store.",
    },
  },
];

export function buildAiAutomationSubServicePages(manifest, { cta, whyUsItem, imageRef }) {
  const heroImage = imageRef(
    manifest,
    "2025/09/AI-Automation-Development-Services.jpg",
    "AI Automation",
  );

  return AI_AUTOMATION_SUB_SERVICES.map((service) => {
    const rich = SUB_SERVICE_RICH_FIELDS_BY_SLUG[service.slug];

    return {
      _id: `servicePage-${service.id}`,
      _type: "servicePage",
      layout: "subService",
      title: service.title,
      slug: { _type: "slug", current: service.slug },
      tagline: service.tagline,
      description: service.description,
      headline: rich?.headline,
      flow: rich?.flow?.map((step) => ({ _type: "flowStep", ...step })),
      stats: rich?.stats?.map((stat) => ({ _type: "statItem", ...stat })),
      whyTitle: rich?.whyTitle,
      whyHighlight: rich?.whyHighlight,
      whyText: rich?.whyText,
      checks: rich?.checks,
      useCases: rich?.useCases?.map((item) => ({ _type: "useCaseItem", ...item })),
      pricing: rich?.pricing,
      faq: rich?.faq?.map((item) => ({ _type: "faqItem", ...item })),
      processSteps: SUB_SERVICE_PROCESS_STEPS.map((step) => ({
        _type: "processStep",
        title: step.title,
        description: step.description,
      })),
      heroImage,
      heroCta: cta(service.heroCta.label, service.heroCta.href, true),
      capabilitiesHeading: service.capabilitiesHeading,
      capabilities: service.capabilities.map((capability) => ({
        _type: "capabilityItem",
        title: capability.title,
        description: capability.description,
        icon: capability.icon,
      })),
      whyUsHeading: service.whyUsHeading,
      whyUs: service.whyUs.map((item) =>
        whyUsItem({
          title: item.title,
          description: item.description,
          animationType: "generic",
          highlights: item.highlights,
        }),
      ),
      technologiesHeading: "Tools & Technologies",
      technologies: [
        "n8n",
        "Make.com",
        "Zapier",
        "Shopify",
        "Claude",
        "OpenAI",
        "HubSpot",
        "Pipedrive",
      ].map((name) => ({ _type: "technologyItem", name })),
      cta: {
        heading: service.cta.heading,
        description: service.cta.description,
        button: cta(service.cta.button.label, service.cta.button.href, true),
      },
      seo: service.seo,
    };
  });
}
