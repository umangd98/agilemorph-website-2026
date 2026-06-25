/** Shared process steps for all AI automation sub-service pages */
export const SUB_SERVICE_PROCESS_STEPS = [
  {
    title: "Discovery",
    description: "A short call to understand your process, tools, and goals.",
  },
  {
    title: "Scope & Quote",
    description: "A fixed scope and price. No open-ended billing surprises.",
  },
  {
    title: "Build",
    description: "Iterative delivery with rapid feedback loops and your approval.",
  },
  {
    title: "Launch & Support",
    description: "Go live with monitoring and documentation you own.",
  },
];

/** Rich template fields sourced from the services reference HTML */
export const SUB_SERVICE_RICH_FIELDS_BY_SLUG = {
  "ai-agents": {
    headline: {
      before: "Agents that don't just answer. They ",
      highlight: "act",
      after: ".",
    },
    flow: [
      { label: "Trigger", text: "New message / event" },
      { label: "Agent", text: "Claude classifies + decides" },
      { label: "Action", text: "Updates CRM, replies, routes" },
    ],
    stats: [
      { value: "<2s", label: "Decision latency" },
      { value: "95%+", label: "Classification accuracy" },
      { value: "24/7", label: "Always-on operation" },
      { value: "0", label: "Manual triage needed" },
    ],
    whyTitle: "Where an agent beats a workflow",
    whyHighlight: "beats",
    whyText:
      "A standard automation follows fixed rules. An agent reasons. When the input is messy, ambiguous, or human, an agent decides what to do, the way a trained team member would, at a fraction of the cost.",
    checks: [
      "Reads unstructured input: emails, chats, documents, voice notes",
      "Classifies intent and urgency, then routes to the right path",
      "Drafts and sends context-aware replies for your approval or fully autonomously",
      "Calls your tools directly: CRM, calendar, databases, payment systems",
      "Escalates edge cases to a human with full context attached",
    ],
    useCases: [
      { title: "Inbound lead qualification", description: "Agent reads the enquiry, scores it, and books or routes it." },
      { title: "Support triage", description: "Tickets classified and answered or escalated automatically." },
      { title: "Document processing", description: "Invoices, contracts, and forms parsed into structured data." },
      { title: "Inbox management", description: "High-volume inboxes sorted, drafted, and prioritized." },
    ],
    pricing: {
      headline: "Agent builds typically start at a 5–10 day scoped engagement",
      detail:
        "Most production agents land in the 5–15 day range depending on tool integrations and approval gates. We quote a fixed scope after a short discovery call.",
    },
    faq: [
      {
        question: "What models do you use?",
        answer:
          "We work with Claude, GPT, and Gemini, chosen per task. Classification, drafting, and reasoning each have a best-fit model and we route accordingly.",
      },
      {
        question: "Will the agent act without my approval?",
        answer:
          "Your choice. We can run fully autonomous, or hold every action behind a one-click approval until you trust it.",
      },
      {
        question: "How do you prevent mistakes?",
        answer:
          "Confidence thresholds, human-in-the-loop fallbacks, and full logging. Low-confidence cases always escalate with context.",
      },
    ],
  },
  "workflow-automation": {
    headline: { before: "The repetitive work, ", highlight: "gone", after: "." },
    flow: [
      { label: "Source", text: "Form / app / sheet" },
      { label: "Pipeline", text: "Transform + enrich" },
      { label: "Destination", text: "CRM / DB / Slack" },
    ],
    stats: [
      { value: "40%+", label: "Time reclaimed" },
      { value: "100+", label: "Integrations supported" },
      { value: "0", label: "Copy-paste tasks" },
      { value: "24/7", label: "Hands-off running" },
    ],
    whyTitle: "Automation that survives contact with reality",
    whyHighlight: "reality",
    whyText:
      "Plenty of automations work in a demo and break in week two. We build with error handling, retries, logging, and alerts from day one, so the pipeline keeps working when an API changes or data comes in messy.",
    checks: [
      "Self-hosted n8n for full control and no per-task billing surprises",
      "Error handling and retries so one bad record doesn't stop everything",
      "Alerting when something needs a human, instead of silent failure",
      "Clean documentation so your team can see exactly what runs and when",
      "Certified n8n partner team building it",
    ],
    useCases: [
      { title: "Lead-to-CRM sync", description: "New leads enriched and pushed to your CRM instantly." },
      { title: "Reporting automation", description: "Daily and weekly reports compiled and delivered automatically." },
      { title: "Data scraping", description: "Structured data pulled from sites and marketplaces on schedule." },
      { title: "Onboarding flows", description: "New customers walked through setup without manual steps." },
    ],
    pricing: {
      headline: "Most workflow builds run 3–8 days per process",
      detail:
        "Simple single-process automations start small; multi-step pipelines with enrichment and error handling scale from there. Fixed scope, quoted up front.",
    },
    faq: [
      {
        question: "n8n, Make, or Zapier, which?",
        answer:
          "Depends on volume, control needs, and budget. We're a certified n8n partner and usually recommend self-hosted n8n for serious volume, but we build on all three.",
      },
      {
        question: "Do I own the automation?",
        answer:
          "Yes. Self-hosted builds live on your infrastructure. You keep full access and we hand over documentation.",
      },
      {
        question: "What if it breaks?",
        answer:
          "We build in alerting and offer monitoring retainers so issues get caught and fixed before they cost you.",
      },
    ],
  },
  "crm-lead-automation": {
    headline: { before: "Every lead captured, enriched, and ", highlight: "followed up", after: "." },
    flow: [
      { label: "Capture", text: "Web / ads / inbox" },
      { label: "Enrich", text: "Apollo / Lusha / verify" },
      { label: "Route", text: "CRM + follow-up" },
    ],
    stats: [
      { value: "<60s", label: "Lead response time" },
      { value: "3x", label: "Faster qualification" },
      { value: "100%", label: "Leads logged" },
      { value: "0", label: "Leads forgotten" },
    ],
    whyTitle: "Speed-to-lead is the whole game",
    whyHighlight: "game",
    whyText:
      "A lead contacted in the first five minutes converts far better than one contacted an hour later. We close that gap to seconds: the moment a lead arrives, it's enriched, scored, assigned, and followed up, without anyone touching it.",
    checks: [
      "Capture leads from forms, ads, email, chat, and LinkedIn into one place",
      "Enrich with verified contact data via Apollo, Lusha, and NeverBounce",
      "Score and segment automatically so reps work the best leads first",
      "Trigger instant first-touch follow-up by email or message",
      "Sync cleanly to HubSpot, Pipedrive, Salesforce, or your CRM of choice",
    ],
    useCases: [
      { title: "Speed-to-lead", description: "First contact triggered within seconds of a new lead." },
      { title: "Enriched lead lists", description: "Daily verified, enriched CSV or CRM delivery." },
      { title: "Pipeline hygiene", description: "Stale deals flagged, duplicates merged automatically." },
      { title: "Re-engagement", description: "Dormant leads re-activated on a schedule." },
    ],
    pricing: {
      headline: "Lead automation engagements typically start at 4–8 days",
      detail:
        "Scope depends on the number of channels, your CRM, and enrichment depth. We quote a fixed price after mapping your current funnel.",
    },
    faq: [
      {
        question: "Which CRMs do you support?",
        answer:
          "HubSpot, Pipedrive, Salesforce, and most others with an API. We've built production flows on all three.",
      },
      {
        question: "Where does enrichment data come from?",
        answer:
          "Apollo, Lusha, and similar providers, with NeverBounce verification so you're not paying for bad contacts.",
      },
      {
        question: "Can you fix our messy existing CRM?",
        answer:
          "Yes. Deduplication, field cleanup, and re-segmentation are common first steps before automation goes live.",
      },
    ],
  },
  "mcp-ai-infrastructure": {
    headline: { before: "Production-grade AI ", highlight: "infrastructure", after: "." },
    flow: [
      { label: "Data", text: "Your DB / files / APIs" },
      { label: "MCP Server", text: "Secure tool layer" },
      { label: "AI", text: "Models query + act" },
    ],
    stats: [
      { value: "100%", label: "Self-hosted control" },
      { value: "Full", label: "Observability built in" },
      { value: "SOC-ready", label: "Security practices" },
      { value: "∞", label: "Scales with you" },
    ],
    whyTitle: "When a no-code tool isn't enough",
    whyHighlight: "enough",
    whyText:
      "No-code platforms hit a ceiling: cost per task, data privacy, custom logic, and volume. When you cross it, you need real infrastructure. We build MCP servers and self-hosted pipelines that give AI safe, structured access to your systems, on infrastructure you own.",
    checks: [
      "MCP servers that expose your data and tools to AI models safely",
      "Self-hosted deployments on AWS or DigitalOcean, under your control",
      "Observability with Langfuse so you can see every call, cost, and failure",
      "PII handling and local redaction to keep sensitive data off third-party clouds",
      "Built to scale from first user to high volume without a rebuild",
    ],
    useCases: [
      { title: "Natural-language data search", description: "Ask your database questions in plain English." },
      { title: "Secure AI access", description: "Models that query internal data without exposing it." },
      { title: "Cost + quality monitoring", description: "Track token spend and output quality per workflow." },
      { title: "Custom AI pipelines", description: "Multi-stage model orchestration for complex tasks." },
    ],
    pricing: {
      headline: "Infrastructure engagements are scoped per project, typically multi-week",
      detail:
        "These are senior builds. We scope precisely after a technical discovery and quote a fixed plan with milestones.",
    },
    faq: [
      {
        question: "What is MCP?",
        answer:
          "Model Context Protocol, a standard way to give AI models secure, structured access to your tools and data. It's how serious AI systems connect to the real world.",
      },
      {
        question: "Where is it hosted?",
        answer: "Your infrastructure: AWS, DigitalOcean, or your existing cloud. You own and control it.",
      },
      {
        question: "How do you keep our data private?",
        answer:
          "Local PII redaction with tools like Microsoft Presidio, self-hosting, and keeping sensitive data out of third-party model calls entirely where required.",
      },
    ],
  },
  "messaging-automation": {
    headline: { before: "Conversations that run ", highlight: "themselves", after: "." },
    flow: [
      { label: "Inbound", text: "WhatsApp / email / chat" },
      { label: "AI", text: "Classify + extract + reply" },
      { label: "System", text: "Logged to Airtable / CRM" },
    ],
    stats: [
      { value: "<5s", label: "Reply time" },
      { value: "24/7", label: "Always responding" },
      { value: "100%", label: "Conversations logged" },
      { value: "0", label: "Missed messages" },
    ],
    whyTitle: "Built on real production pipelines",
    whyHighlight: "production",
    whyText:
      "This isn't theory. We run live WhatsApp-to-database pipelines today: messages classified by AI, structured into records, and synced automatically, on self-hosted infrastructure with buffering and two-path routing for reliability.",
    checks: [
      "WhatsApp automation via Whapi and self-hosted n8n, no platform lock-in",
      "AI classification of every message by type, intent, and urgency",
      "Structured data extraction straight into Airtable, a CRM, or a database",
      "Buffered, multi-path architecture so nothing is dropped under load",
      "Human handoff with full context when a conversation needs it",
    ],
    useCases: [
      { title: "Dealer / order intake", description: "Inbound messages parsed into structured deal records." },
      { title: "Lead capture on WhatsApp", description: "Enquiries qualified and logged without manual entry." },
      { title: "Booking + scheduling", description: "Appointments handled conversationally end to end." },
      { title: "Broadcast + follow-up", description: "Targeted outbound that respects each customer's history." },
    ],
    pricing: {
      headline: "Messaging builds typically run 5–12 days",
      detail:
        "Cost depends on channels, classification complexity, and where data needs to land. Fixed scope after a discovery call.",
    },
    faq: [
      {
        question: "Is WhatsApp automation allowed?",
        answer:
          "Yes, via approved API providers like Whapi. We build within platform rules so your number stays safe.",
      },
      {
        question: "What happens to the data?",
        answer:
          "It's structured and synced to wherever you want it: Airtable, a CRM, or your database. You own all of it.",
      },
      {
        question: "Can a human still step in?",
        answer:
          "Always. Anything the AI isn't confident about is handed to a person with the full conversation attached.",
      },
    ],
  },
  "ai-audit": {
    headline: { before: "Find out exactly where AI ", highlight: "pays off", after: "." },
    flow: [
      { label: "Discover", text: "Map your processes" },
      { label: "Analyze", text: "Score ROI + effort" },
      { label: "Deliver", text: "Prioritized roadmap" },
    ],
    stats: [
      { value: "Fixed", label: "Scope + price" },
      { value: "1 week", label: "Typical turnaround" },
      { value: "ROI-ranked", label: "Every opportunity" },
      { value: "Yours", label: "To keep + act on" },
    ],
    whyTitle: "Clarity before spend",
    whyHighlight: "spend",
    whyText:
      "Most automation money is wasted on the wrong things first. The audit removes the guesswork: a clear, honest map of where AI saves you the most time and money, ranked by effort and return, so your first project is the one that pays for the rest.",
    checks: [
      "A structured review of your real workflows, not a generic checklist",
      "Every opportunity scored by time saved, cost, and implementation effort",
      "A prioritized roadmap: what to automate first, second, and later",
      "Honest calls on what is not worth automating yet",
      "A document your team owns and can act on with any provider",
    ],
    useCases: [
      { title: "First-time automation", description: "Know where to start before you commit budget." },
      { title: "Stalled AI efforts", description: "Diagnose why past attempts didn't stick." },
      { title: "Tool consolidation", description: "Find overlap and waste across your current stack." },
      { title: "Board-ready case", description: "A costed plan you can take to decision-makers." },
    ],
    pricing: {
      headline: "Fixed-fee engagement, typically delivered within a week",
      detail:
        "One flat price, one clear deliverable. If you move forward on a build with us, the audit fee is credited toward it.",
    },
    faq: [
      {
        question: "What do I actually get?",
        answer:
          "A written roadmap: your mapped processes, ranked automation opportunities with ROI and effort scores, and a recommended sequence.",
      },
      {
        question: "Do I have to build with you afterward?",
        answer:
          "No. The roadmap is yours to act on however you like. If you do build with us, the audit fee is credited.",
      },
      {
        question: "How long does it take?",
        answer: "Most audits are delivered within a week of the discovery call.",
      },
    ],
  },
  "shopify-automation": {
    headline: { before: "Shopify ops that run ", highlight: "on autopilot", after: "." },
    flow: [
      { label: "Order", text: "Shopify webhook" },
      { label: "Pipeline", text: "Route + enrich" },
      { label: "Fulfill", text: "CRM / 3PL / notify" },
    ],
    stats: [
      { value: "0", label: "Manual order routing" },
      { value: "Real-time", label: "Inventory sync" },
      { value: "24/7", label: "Customer updates" },
      { value: "100%", label: "Webhook reliability" },
    ],
    whyTitle: "Built for real Shopify operations",
    whyHighlight: "operations",
    whyText:
      "Shopify stores generate a constant stream of orders, inventory changes, and customer events. We automate the handoffs between Shopify, your warehouse, CRM, and support tools so nothing slips through when volume spikes.",
    checks: [
      "Connect to Shopify Admin GraphQL for products, orders, inventory, and customers",
      "Pipelines on n8n, Make, or self-hosted infrastructure you control",
      "Bridge Shopify with CRM, ERP, shipping, and support tools automatically",
      "Retries, logging, and alerts so failed webhooks don't silently break ops",
      "Production experience shipping Shopify automations alongside AI workflows",
    ],
    useCases: [
      { title: "Order routing", description: "Route orders to the right warehouse or fulfillment partner automatically." },
      { title: "Inventory sync", description: "Keep stock aligned across Shopify, warehouses, and marketplaces." },
      { title: "Customer notifications", description: "Shipping, returns, and post-purchase messages on autopilot." },
      { title: "Returns handling", description: "Structured return flows logged to your CRM and support stack." },
    ],
    pricing: {
      headline: "Shopify automation builds typically run 5–10 days",
      detail:
        "Scope depends on integrations, order volume, and fulfillment complexity. Fixed price after mapping your current ops flow.",
    },
    faq: [
      {
        question: "Which Shopify plans do you support?",
        answer: "Any plan with API access. We use the Admin GraphQL API for reliable, scalable integrations.",
      },
      {
        question: "Can you connect to our 3PL or ERP?",
        answer: "Yes. We bridge Shopify with shipping, warehouse, CRM, and ERP systems via API or middleware.",
      },
      {
        question: "What if a webhook fails?",
        answer: "We build retries, dead-letter queues, and alerting so failures are caught and replayed automatically.",
      },
    ],
  },
};
