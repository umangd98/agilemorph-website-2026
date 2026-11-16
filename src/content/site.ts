/**
 * Site copy. The marketing pages are written here, in code, so the site can be
 * read and reviewed as one piece. Only the blog lives in Sanity.
 *
 * House rules: spell the name "Agilemorph" (lowercase m). No em dashes. British
 * spelling. No figures beyond the approved ones (40+ projects, Toptal's top 3%). Every page
 * that names Forward Deployed Engineering shows FDE_EXPLAINER in its first
 * screen.
 */

export const COMPANY = {
  name: "Agilemorph",
  /** Registered name, used only in the copyright line. */
  legalName: "AgileMorph Digital Accelerators",
  email: "info@theagilemorph.com",
  location: "Nagpur, India",
  bookingHref: "/contact#book",
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/agilemorph/" },
    { label: "Instagram", href: "https://www.instagram.com/agilemorph/" },
    { label: "Facebook", href: "https://www.facebook.com/agilemorph" },
  ],
} as const;

export const SITE_TITLE = "Forward Deployed Engineering for AI | Agilemorph";

export const ONE_LINER =
  "We're one of India's first forward deployed engineering firms. We work out where AI fits in your business, build it into the systems you already run or from scratch, ship it, make sure your people use it, and keep improving it from their feedback.";

export const SITE_DESCRIPTION =
  "Agilemorph is a forward deployed engineering firm in India. Our engineers embed with your teams, build AI into the systems you run, and stay until it's used.";

export const FDE_EXPLAINER =
  "Forward Deployed Engineering means our engineers work inside your business, alongside your teams, instead of building from a requirements document at a distance. We learn how the work really happens, build AI into the systems you already run or build new ones where nothing fits, measure whether people use it, and keep improving it until they do.";

export const FOOTER_TAGLINE =
  "Forward Deployed Engineering, built in India. AI built around how you work, adopted by your people, owned by you.";

export const NAV = [
  { label: "How we work", href: "/how-we-work" },
  { label: "Case studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
] as const;

export const PROOF = [
  "40+ projects delivered",
  "Engineers from Amazon and YC-backed startups",
  "On site or remote, wherever you are",
] as const;

/* -------------------------------------------------------------------------- */
/* Shared sections                                                             */
/* -------------------------------------------------------------------------- */

export const GAP = {
  heading: "Most AI projects stall between the demo and daily use.",
  body: "The demo works. Then the tool sits beside the systems people actually use, nobody changes how they work, and it is quietly switched off. The model is rarely the problem. Nobody stayed to make it fit.",
  symptoms: [
    "A pilot that never reached production.",
    "A tool that lives outside the systems your team uses.",
    "People drift back to the old way.",
    "Nobody can say whether it paid off.",
  ],
  closing: "We close that gap by working inside your business until the new way is the default.",
} as const;

export const COMPARISON = {
  heading: "What changes when the engineers sit with you",
  before: "A traditional IT vendor",
  after: "Agilemorph",
  rows: [
    ["Where the team works", "Offsite, from a requirements document", "Inside your business, beside your people"],
    ["How scope is set", "Fixed upfront, before anyone sees the work", "From what we observe with your teams"],
    ["What gets built", "A generic tool for people to learn", "Built around the work, in your systems or from scratch"],
    ["Who owns adoption", "Your team, after go-live", "We do, until usage data proves it works"],
    ["What happens after launch", "A handover and a support contract", "Improved every week from user feedback"],
  ],
} as const;

/** The loop we run on every engagement. The hero, the homepage and How we work all tell it. */
export const PHASES = [
  {
    name: "Find",
    verb: "We find where AI fits",
    summary: "We embed with your teams, see how the work really gets done, and find where AI pays off.",
    details: [
      "A fixed-scope discovery audit with the people who do the work",
      "Opportunities ranked, with success criteria agreed upfront",
    ],
    decision: "Which workflow do we build first?",
  },
  {
    name: "Build",
    verb: "We build what fits",
    summary: "Built into the stack you already run, like your CRM, ERP, helpdesk or inbox, or built from scratch when nothing you have fits the work.",
    details: [
      "Error handling, monitoring, audit logs and evals from the first build",
      "A person in the loop for anything uncertain",
    ],
    decision: "Is it ready for real users?",
  },
  {
    name: "Ship",
    verb: "We ship it to production",
    summary: "Live with one team within weeks, in real work, measured against the criteria you agreed.",
    details: [
      "Rolled out to a single team first, so problems surface early",
      "Measured against the success criteria from day one",
    ],
    decision: "Did it meet the criteria?",
  },
  {
    name: "Adopt",
    verb: "We make sure it gets used",
    summary: "We train, nudge and measure usage until the new way is the default. Adoption is our job, not yours.",
    details: [
      "Training with the people who use it, where they work",
      "Usage measured per team, per person, per week",
    ],
    decision: "Is it ready to roll out?",
  },
  {
    name: "Iterate",
    verb: "We improve it from feedback",
    summary: "Every week we change it based on what users tell us, then take the same loop to the next team or workflow.",
    details: [
      "A weekly review of usage, feedback and data quality",
      "A dedicated engineer on a monthly retainer as it scales",
    ],
    decision: "What do we take on next?",
  },
] as const;

/**
 * Hero examples: the same loop run in different parts of a business. Each one
 * names the system it was built into. Illustrative, not client data.
 */
export const LOOP_EXAMPLES = [
  {
    team: "Sales",
    system: "HUBSPOT",
    systemName: "HubSpot",
    stages: [
      "Reps spend their mornings updating deals instead of selling.",
      "An assistant that turns call notes and emails into deal updates in HubSpot.",
      "Live with one sales team, with reps approving each update.",
      "We sit with the reps, see who uses it, and fix what slows them down.",
      "Reps asked for follow-up drafts. They shipped the next week.",
    ],
  },
  {
    team: "Support",
    system: "ZENDESK",
    systemName: "Zendesk",
    stages: [
      "Agents search several tools for an order before they can reply.",
      "An agent that drafts replies inside Zendesk, with the order history attached.",
      "Live on one queue, with a person approving every reply.",
      "We track which drafts get rewritten and coach the team on the rest.",
      "Refund requests came next, straight from the team's feedback.",
    ],
  },
  {
    team: "Finance",
    system: "SAP",
    systemName: "SAP",
    stages: [
      "Supplier invoices are keyed in by hand and checked twice.",
      "Invoice capture that matches each bill to its purchase order in SAP.",
      "Live for one business unit, with finance approving every exception.",
      "We track which invoices still go the manual way, and why.",
      "Credit notes followed, once the team trusted the matching.",
    ],
  },
  {
    team: "Operations",
    system: "ERP",
    systemName: "your ERP",
    stages: [
      "Updates arrive on WhatsApp and never reach the ERP.",
      "Voice notes and photos turned into validated records in the ERP.",
      "Live with one team, with a supervisor confirming anything unclear.",
      "We see who still reports in chat and help them switch.",
      "Daily summaries for managers, because they asked for them.",
    ],
  },
] as const;

/**
 * Where in a business we usually find AI that pays off, each shown as one piece
 * of work moving through. Some land in a system the client already runs, some
 * in something we build new. Illustrative, not client data. Shown on the homepage.
 */
export const FUNCTIONS = [
  {
    name: "Sales",
    find: "Reps re-typing calls and emails into the CRM, and leads that wait too long for a reply.",
    input: ["Call notes", "Wants a demo for their operations team. Budget is approved. Follow up on Friday."],
    action: "Updates the deal and drafts Friday's follow-up",
    lands: { name: "Salesforce", built: false },
    record: [
      ["Stage", "Demo booked"],
      ["Next step", "Follow-up, Friday"],
      ["Draft", "Ready for the rep"],
    ],
  },
  {
    name: "Customer support",
    find: "Agents hunting across tools for context, and the same questions answered by hand every day.",
    input: ["Email from a customer", "My order arrived damaged. Can I get a replacement?"],
    action: "Pulls up the order and drafts a reply for the agent",
    lands: { name: "Zendesk", built: false },
    record: [
      ["Type", "Replacement"],
      ["Order history", "Attached"],
      ["Reply", "Waiting for approval"],
    ],
  },
  {
    name: "Finance",
    find: "Invoices, receipts and statements keyed in by hand, and month-end spent reconciling.",
    input: ["Supplier invoice, PDF", "Last month's packaging invoice, attached to an email."],
    action: "Reads it and matches it to the purchase order",
    lands: { name: "SAP", built: false },
    record: [
      ["Match", "Purchase order found"],
      ["Status", "Posted"],
      ["Exceptions", "None"],
    ],
  },
  {
    name: "Operations",
    find: "Updates that live in chat and spreadsheets while the official system goes stale.",
    input: ["Voice note from the floor", "North warehouse order is loaded, but two pallets short."],
    action: "Checks it and writes the update into the ERP",
    lands: { name: "Your ERP", built: false },
    record: [
      ["Dispatch", "Loaded"],
      ["Shortage", "Flagged to the manager"],
      ["Source", "Voice note, kept"],
    ],
  },
  {
    name: "People and HR",
    find: "Policy questions answered by hand, and approvals chased by email because no tool covers them.",
    input: ["Message from an employee", "Can unused leave carry over to next year?"],
    action: "Answers from your leave policy and starts the request",
    lands: { name: "An HR assistant we built for you", built: true },
    record: [
      ["Answer", "Sent, with the policy section"],
      ["Request", "Routed for approval"],
      ["Owner", "HR team"],
    ],
  },
  {
    name: "Leadership",
    find: "Reports assembled by hand from several systems, already out of date when they arrive.",
    input: ["Question from the COO", "Which region slipped on collections this month?"],
    action: "Answers from your own data, with the source",
    lands: { name: "A reporting assistant we built for you", built: true },
    record: [
      ["Answer", "West region"],
      ["Source", "ERP collections report"],
      ["Updated", "This morning"],
    ],
  },
] as const;

export const OWNERSHIP = {
  heading: "Yours, not ours",
  items: [
    ["Your infrastructure", "Cloud or on-premise. Models and hosting are agreed with your IT team."],
    ["Your systems", "Built into your CRM, ERP or helpdesk, or as new software that runs on your stack."],
    ["A full audit trail", "Every write is logged: what changed, where it came from and who confirmed it."],
    ["Your IP", "Code, workflows, documentation and data belong to you."],
  ],
} as const;

export const FOUNDERS = [
  {
    trait: "Build fast",
    name: "Kaustumbh Jaiswal",
    role: "Co-founder and CTO",
    photo: "/team/kaustumbh-jaiswal.png",
    bio: "Former software engineer at Amazon. Has shipped AI products end to end for YC-backed startups, including autonomous agents, retrieval systems and real-time voice AI. Works as a forward deployed engineer himself, and leads architecture and on-site engineering.",
    stack: "Python, TypeScript and Java. LLM orchestration, evals on Langfuse, voice AI on Retell and Twilio.",
  },
  {
    trait: "Build right",
    name: "Umang Dhandhania",
    role: "Co-founder",
    photo: "/team/umang-dhandhania.png",
    bio: "Master's from Northwestern University. Has delivered enterprise software for US healthcare, manufacturing, retail, e-commerce and insurance clients. Brings the process rigour that regulated, large organisations need.",
    stack: "Enterprise delivery in regulated domains, from scope to sign-off.",
  },
] as const;

export const FAQ = [
  ["What is Forward Deployed Engineering?", FDE_EXPLAINER],
  [
    "How is this different from hiring an IT vendor or an automation agency?",
    "A vendor builds offsite from a document, fixes scope before seeing the work, hands over a system and counts success as delivered to spec. We work inside your business, set scope from what we observe, ship a working workflow in weeks, own adoption, and keep improving it from user feedback.",
  ],
  [
    "Do you work on site?",
    "Yes, when the work needs it. Otherwise we work remote-embedded, with daily working sessions with your team.",
  ],
  [
    "What systems do you work with?",
    "SAP, Salesforce, HubSpot, Zendesk, ERPs, CRMs, helpdesks, Microsoft 365, Google Workspace, WhatsApp Business, Shopify and custom software.",
  ],
  [
    "Can you deploy in our own cloud or on-premise?",
    "Yes. Model choice and hosting are agreed with your IT team.",
  ],
  ["Who owns what you build?", "You do: code, workflows, documentation and data."],
  [
    "How do engagements start?",
    "With a fixed-scope discovery audit for enterprises, or an AI Audit for growing businesses. No long contract before you've seen results.",
  ],
  ["How long until something is live?", "The first workflow is usually live in production within weeks of the audit."],
  [
    "What happens after it ships?",
    "We stay. We measure who uses it, collect feedback from the people using it, and ship improvements every week until it is the default way of working.",
  ],
  [
    "Do you only use no-code tools?",
    "No. We use Make, n8n and Zapier where they fit and write code in Python, TypeScript and Java where they don't.",
  ],
  ["Do you work with smaller businesses?", "Yes, through the AI Audit. Same model, smaller scope."],
] as const;

/** Who we work with, and how an engagement usually starts for each. Shown on the homepage. */
export const CLIENT_TYPES = [
  {
    name: "Enterprises",
    line: "Many teams, complex systems.",
    start: "a discovery audit",
    cta: "Book a discovery call",
    href: COMPANY.bookingHref,
    example: ["A listed agro-processing company", "listed-agro-processing-company"],
  },
  {
    name: "Mid-size businesses",
    line: "Ready to work a new way.",
    start: "an AI Audit",
    cta: "Book an AI Audit call",
    href: COMPANY.bookingHref,
    example: ["A manufacturer running its own factories", "manufacturer-africa-factory-floor"],
  },
  {
    name: "AI-first startups",
    line: "Building an AI product, fast.",
    start: "embedded engineers",
    cta: "Talk to us",
    href: "/contact",
    example: ["An AI relationship-coaching platform", "ai-coaching-platform-mvp"],
  },
] as const;

/* -------------------------------------------------------------------------- */
/* How we work                                                                 */
/* -------------------------------------------------------------------------- */

export const OUR_READ = {
  heading: "Your systems aren't the problem. The distance between the work and the system is.",
  paragraphs: [
    "So we bring AI to where people already work: an email, a WhatsApp message, a call, a document, a form. We validate what it produces, write it into your system of record, and keep a person in the loop for anything uncertain. Where no system fits the work, we build one from scratch.",
    "Then we measure usage per team, per person, per week, and keep improving it from what users tell us until the new way is the default.",
  ],
} as const;

export const DISCOVERY_AUDIT = [
  ["Shadow", "Time with the people who do the work, from the front line to the back office."],
  ["Map", "Every data path, including email, chat, spreadsheets, calls and the systems you run."],
  ["Measure", "A baseline per team: time spent, update lag, data quality and active users."],
  ["Deliver", "An audit report, ranked opportunities and a recommendation for what to build first."],
] as const;

export const ADOPTION = [
  ["Adoption dashboard per team", "Who is using the new workflow, and who has gone back to the old one."],
  ["Data-quality score per record", "Completeness and freshness for every record written."],
  ["Automatic nudges", "A reminder goes out when a record goes stale."],
  ["Escalation to a manager", "If a nudge is ignored, the right manager hears about it."],
  ["Weekly review with your IT team", "Usage and data quality, reviewed together, with the next fix agreed."],
] as const;

export const CAPABILITIES = [
  {
    name: "Capture into your system of record",
    body: "WhatsApp messages, voice notes, photos and email turned into validated records in your ERP or CRM.",
    tools: "WhatsApp Business, Claude, n8n, your ERP or CRM API",
  },
  {
    name: "AI agents and custom software",
    body: "Agents that read enquiries, tickets and documents, act through your tools, and hand anything unusual to a person. Where nothing you run fits, we build the application from scratch.",
    tools: "Claude, OpenAI, Python, TypeScript",
  },
  {
    name: "Workflow automation and integration",
    body: "The repeated steps between SAP, Salesforce, your ERP, CRM and store, automated. No-code where it fits, code where it doesn't.",
    tools: "n8n, Make, Zapier, Salesforce, HubSpot, Shopify, Java",
  },
  {
    name: "Retrieval and document intelligence",
    body: "Answers grounded in your contracts, manuals and records, and scanned documents turned into structured data.",
    tools: "Python, Qdrant, Claude",
  },
  {
    name: "Real-time voice AI",
    body: "Voice agents that answer, qualify and route calls, with every outcome written into your systems.",
    tools: "Retell, Twilio",
  },
  {
    name: "Evals, monitoring and self-hosted AI",
    body: "MCP servers for governed access to your data, Langfuse evals so you can see quality and cost, and hosting in your cloud or on-premise.",
    tools: "MCP, Langfuse, AWS, on-premise",
  },
] as const;

export const ENGAGEMENTS = [
  {
    name: "Enterprise engagement",
    forWhom: "For enterprises and larger organisations",
    steps: [
      ["Discovery audit", "Fixed scope, fixed fee, with your teams. Ends with an audit report and a pilot recommendation."],
      ["Pilot", "One workflow with one team, live in production, against criteria agreed upfront."],
      ["Rollout", "Across teams and functions, improved every week, with a dedicated engineer on a monthly retainer."],
    ],
    note: "Every phase ends with a decision point. You continue only if the previous phase delivered.",
    cta: "Book a discovery call",
  },
  {
    name: "AI Audit",
    forWhom: "For growing businesses",
    steps: [
      ["AI Audit", "Fixed scope, 1 to 2 weeks, remote or on site. Maps where AI and automation pay off in your business."],
      ["First build", "Live within weeks of the audit."],
    ],
    note: "Same model, smaller scope.",
    cta: "Book an AI Audit call",
  },
] as const;

/** Partner marks shown in the strip under the homepage hero. The full list is on About. */
export const PARTNER_STRIP = [
  ["Claude", "Service Partner"],
  ["Make", "Platinum Partner"],
  ["Microsoft", "Partner"],
  ["n8n", "Integration Partner"],
  ["Zapier", "Certified Expert"],
  ["Shopify", "Partner"],
] as const;

/** Trust points placed down the homepage, each beside the claim it backs. */
export const TRUST = {
  team: {
    heading: "The engineers who sit with your team",
    body: "A team of engineers from Amazon and YC-backed startups, led by the founders. The engineers you meet are the ones who build it.",
  },
  cta: "A call with our engineers, not a sales team.",
} as const;

export const CERTIFICATIONS = [
  ["Claude", "Service Partner"],
  ["Make", "Platinum Partner"],
  ["n8n", "Integration Partner"],
  ["Zapier", "Certified Expert"],
  ["Microsoft", "Partner"],
  ["Shopify", "Partner"],
  ["Upwork", "Top Rated"],
  ["Toptal", "Team vetted as top 3% talent"],
] as const;
