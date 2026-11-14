/**
 * Site copy. The marketing pages are written here, in code, so the site can be
 * read and reviewed as one piece. Only the blog lives in Sanity.
 *
 * House rules: spell the name "Agilemorph" (lowercase m). No em dashes. British
 * spelling. No figures beyond the approved ones (40+ projects). Every page
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

export const SITE_TITLE = "Agilemorph | Forward Deployed Engineering for AI";

export const ONE_LINER =
  "Agilemorph is one of India's first forward deployed engineering firms. Our engineers embed with your teams, find where AI fits in your systems, workflows and processes, build it in production, and stay until it's used.";

export const SITE_DESCRIPTION =
  "Agilemorph is one of India's first forward deployed engineering firms. Our engineers embed with your teams, find where AI fits in your systems and processes, build it in production, and stay until it's used.";

export const FDE_EXPLAINER =
  "Forward Deployed Engineering means our engineers work inside your business, on your sites or alongside your teams, instead of building from a requirements document at a distance. We learn the real process, build AI into the systems you already run, measure whether people use it, and keep improving until they do.";

export const FOOTER_TAGLINE =
  "Forward Deployed Engineering, built in India. AI inside your systems, adopted by your people, owned by you.";

export const NAV = [
  { label: "How we work", href: "/how-we-work" },
  { label: "Case studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
] as const;

export const PROOF = [
  "40+ projects delivered",
  "Founders from Amazon and Sixt",
  "Engagements in India, the US and Africa",
] as const;

/* -------------------------------------------------------------------------- */
/* The floor-to-system example used in the hero and on How we work            */
/* -------------------------------------------------------------------------- */

export const FIELD_EXAMPLE = {
  messages: [
    {
      from: "Shift supervisor, packing",
      kind: "Text",
      body: "Packing line B stopped again. Bearing on the conveyor drive. Replaced it, running now.",
    },
    {
      from: "Maintenance fitter",
      kind: "Voice note, transcribed",
      body: "Used the last spare bearing from the store. Somebody needs to reorder.",
    },
    {
      from: "Shift supervisor, packing",
      kind: "Photo",
      body: "Job card, signed off by the fitter.",
    },
  ],
  record: {
    title: "Downtime record",
    system: "Written to your ERP",
    fields: [
      { label: "Asset", value: "Packing line B, conveyor drive" },
      { label: "Status", value: "Running" },
      { label: "Cause", value: "Bearing failure" },
      { label: "Action", value: "Bearing replaced" },
      { label: "Follow-up", value: "Spare bearing reorder raised" },
      { label: "Evidence", value: "Job card photo attached" },
    ],
    confirm: {
      pending: "Supervisor to confirm the cause",
      done: "Confirmed by the shift supervisor",
    },
  },
  steps: ["Captured", "Validated", "Confirmed", "Written"],
  caption:
    "A pattern we build often. AI captures the update where it happens, checks it against the system of record, asks a person to confirm anything uncertain, and writes the record through the API.",
} as const;

/* -------------------------------------------------------------------------- */
/* Shared sections                                                             */
/* -------------------------------------------------------------------------- */

export const GAP = {
  heading: "Work happens on site. The record of it lives somewhere else.",
  body: "Teams fall back to WhatsApp, spreadsheets and phone calls because the official system is slow or awkward. So the ERP or CRM goes stale, and leadership has no live view of what is actually happening.",
  symptoms: [
    "Teams report in WhatsApp instead of the system.",
    "Records don't match what happened on the floor.",
    "Updates land days late.",
    "Leadership has no live view.",
  ],
  closing: "Most AI projects fail here. They are built offsite, handed over, and never adopted.",
} as const;

export const COMPARISON = {
  heading: "What changes when the engineers sit with you",
  before: "A traditional IT vendor",
  after: "Agilemorph",
  rows: [
    ["Where the team works", "Offsite, from a requirements document", "On your sites, beside your people"],
    ["How scope is set", "Fixed upfront, before anyone sees the field", "From what we observe in the discovery audit"],
    ["What ships", "A system, then a handover", "A working workflow in weeks, improved every week"],
    ["Who owns adoption", "Your team, after go-live", "We do, until usage data proves it works"],
    ["How success is measured", "Delivered to spec", "Used on site, with accurate and current data"],
  ],
} as const;

export const PHASES = [
  {
    name: "Discovery audit",
    summary: "Fixed scope, fixed fee. On site with your teams, mapping every process, data flow and gap.",
    details: [
      "Every process, data flow and gap mapped with the people who do the work",
      "A baseline per site: update lag, field completeness, duplicate rate and active users",
    ],
    decision: "Do the findings justify a blueprint?",
  },
  {
    name: "Blueprint",
    summary: "Ranked opportunities, a target architecture and a pilot plan.",
    details: [
      "Opportunities ranked for your operation",
      "A target architecture inside your existing stack",
      "A pilot plan with success criteria agreed upfront",
    ],
    decision: "Which workflow do we pilot?",
  },
  {
    name: "Pilot",
    summary: "One workflow at one or two sites, live in production.",
    details: [
      "Error handling, retries, monitoring, audit logs and evals from the first build",
      "Measured against the success criteria you agreed",
    ],
    decision: "Did it meet the criteria?",
  },
  {
    name: "Adopt",
    summary: "We train, nudge and measure usage until the new way is the default.",
    details: [
      "Training with the people who use it, where they work",
      "Usage measured per site, per person, per week",
    ],
    decision: "Is it ready to roll out?",
  },
  {
    name: "Scale",
    summary: "Roll out across sites and functions with a dedicated engineer on a monthly retainer.",
    details: [
      "Site by site and function by function, on the same model",
      "A weekly review with your IT team",
    ],
    decision: "What do we take on next?",
  },
] as const;

export const OWNERSHIP = {
  heading: "Yours, not ours",
  items: [
    ["Your infrastructure", "Cloud or on-premise. Models and hosting are agreed with your IT team."],
    ["Your system of record", "We write into SAP, Salesforce or your ERP. No parallel database to maintain."],
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
    bio: "Former software engineer at Amazon and Sixt. Has shipped AI products end to end for US startups, including autonomous agents, retrieval systems and real-time voice AI. Works as a forward deployed engineer himself, and leads architecture and on-site engineering.",
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
    "A vendor builds offsite from a document, fixes scope before seeing the field, hands over a system and counts success as delivered to spec. We work on your sites, set scope from what we observe, ship a working workflow in weeks, and own adoption until usage data proves it works.",
  ],
  [
    "Do you work on site?",
    "Yes, for enterprise engagements in India. For clients abroad we work remote-embedded, with daily working sessions with your team.",
  ],
  [
    "What systems do you work with?",
    "SAP, Salesforce, ERPs, CRMs, factory and field tools, WhatsApp Business, Shopify and custom software.",
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
  ["How long until something is live?", "A pilot is usually live in production within weeks of the audit."],
  [
    "Do you only use no-code tools?",
    "No. We use Make, n8n and Zapier where they fit and write code in Python, TypeScript and Java where they don't.",
  ],
  ["Do you work with smaller businesses?", "Yes, through the AI Audit. Same model, smaller scope."],
] as const;

export const CLIENT_TYPES = [
  ["Multi-site enterprises", "Manufacturing, agro-processing, EPC, mining, infrastructure and environment services."],
  ["Mid-size operations businesses", "In India, Africa and the US."],
  ["Growing service, trades and e-commerce businesses", "Starting with an AI Audit. Same model, smaller scope."],
  ["AI-first startups", "That need an embedded engineering partner."],
] as const;

/* -------------------------------------------------------------------------- */
/* How we work                                                                 */
/* -------------------------------------------------------------------------- */

export const OUR_READ = {
  heading: "The system isn't the problem. The distance between the work and the system is.",
  paragraphs: [
    "So we bring the system to where people already work. We put AI at the point where work happens: a WhatsApp update, a scanned document, a voice note, a machine log. We validate it, write it into the system of record, and keep a person in the loop for anything uncertain.",
    "Then we measure usage per site, per person, per week, until the new way is the default.",
  ],
} as const;

export const DISCOVERY_AUDIT = [
  ["Shadow", "Site visits with operators, supervisors and back-office teams."],
  ["Map", "Every data path, including chat groups, spreadsheets, calls and system objects."],
  ["Measure", "A baseline per site: update lag, field completeness, duplicate rate and active users."],
  ["Deliver", "An audit report, ranked opportunities and a pilot recommendation."],
] as const;

export const ADOPTION = [
  ["Adoption dashboard per site", "Who is using the new workflow, and who has gone back to the old one."],
  ["Data-quality score per record", "Completeness and freshness for every record written."],
  ["Automatic nudges", "A reminder goes out when a record goes stale."],
  ["Escalation to a manager", "If a nudge is ignored, the right manager hears about it."],
  ["Weekly review with your IT team", "Usage and data quality, reviewed together, with the next fix agreed."],
] as const;

export const CAPABILITIES = [
  {
    name: "Field capture into your system of record",
    body: "WhatsApp messages, voice notes, photos and email turned into validated records in your ERP or CRM.",
    tools: "WhatsApp Business, Claude, n8n, your ERP or CRM API",
  },
  {
    name: "AI agents inside your systems",
    body: "Agents that read enquiries, tickets and documents, act through your tools, and hand anything unusual to a person with the context attached.",
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
    forWhom: "For enterprises and multi-site businesses",
    steps: [
      ["Discovery audit", "Fixed scope, fixed fee, on site. Ends with an audit report and a pilot recommendation."],
      ["Pilot", "One workflow at one or two sites, live in production, against criteria agreed upfront."],
      ["Rollout", "Across sites and functions, with a dedicated engineer on a monthly retainer."],
    ],
    note: "Every phase ends with a decision point. You continue only if the previous phase delivered.",
    cta: "Book a discovery call",
  },
  {
    name: "AI Audit",
    forWhom: "For growing businesses",
    steps: [
      ["AI Audit", "Fixed scope, 1 to 2 weeks, remote or on site. Maps where AI and automation pay off in your operation."],
      ["First build", "Live within weeks of the audit."],
    ],
    note: "Same model, smaller scope.",
    cta: "Book an AI Audit call",
  },
] as const;

export const CERTIFICATIONS = [
  ["Claude", "Service Partner"],
  ["Make", "Platinum Partner"],
  ["n8n", "Integration Partner"],
  ["Zapier", "Certified Expert"],
  ["Microsoft", "Partner"],
  ["Shopify", "Partner"],
  ["Upwork", "Top Rated"],
] as const;
