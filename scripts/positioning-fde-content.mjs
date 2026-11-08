/**
 * Copy for the Forward Deployed Engineering repositioning (brief of 8 Nov 2026).
 * Consumed by scripts/patch-positioning-fde.mjs, which writes it to Sanity as drafts.
 *
 * Defaults applied where the brief marks [CONFIRM] (brief section 11):
 * "40+ projects", every case study anonymised, "dedicated engineer" on Scale,
 * British spelling, Pricing folded into How we work.
 */

let keyCounter = 0;
export function key() {
  keyCounter += 1;
  return `fde${keyCounter.toString(36).padStart(4, "0")}`;
}

export const cta = (label, href, openInNewTab = false) => ({
  _type: "ctaButton",
  label,
  href,
  openInNewTab,
});

export const card = (title, description, href) => ({
  _type: "textCard",
  _key: key(),
  title,
  ...(description ? { description } : {}),
  ...(href ? { href } : {}),
});

const phase = (title, summary, extra = {}) => ({
  _type: "phaseItem",
  _key: key(),
  title,
  summary,
  ...extra,
});

export const BOOK = cta("Book a discovery call", "/contact#book");
export const SEE_HOW = cta("See how we work", "/how-we-work");

export const ONE_LINER =
  "Agilemorph is one of India's first forward deployed engineering firms. Our engineers embed with your teams, find where AI fits in your systems, workflows and processes, build it in production, and stay until it's used.";

export const FDE_EXPLAINER =
  "Forward Deployed Engineering means our engineers work inside your business, on your sites or alongside your teams, instead of building from a requirements document at a distance. We learn the real process, build AI into the systems you already run, measure whether people use it, and keep improving until they do.";

export const SITE_DESCRIPTION =
  "Agilemorph is one of India's first forward deployed engineering firms. Our engineers embed with your teams, find where AI fits in your systems and processes, build it in production, and stay until it's used.";

/* -------------------------------------------------------------------------- */
/* Shared blocks                                                               */
/* -------------------------------------------------------------------------- */

const symptomCards = () => [
  card(
    "Teams report in WhatsApp, not the system",
    "Updates go to chat groups, spreadsheets and phone calls because the official system is slow or awkward.",
  ),
  card(
    "Records don't match what happened",
    "The ERP or CRM says one thing. The floor, the site or the field says another.",
  ),
  card(
    "Updates land days late",
    "By the time the data reaches the system, the decision it was needed for has already been made.",
  ),
  card(
    "Leadership has no live view",
    "Reports are rebuilt by hand, so nobody sees the operation as it is today.",
  ),
];

const comparisonRows = () =>
  [
    ["Where the team works", "Offsite, from a requirements document", "On your sites, beside your people"],
    [
      "How scope is set",
      "Fixed upfront, before anyone sees the field",
      "From what we observe in the discovery audit",
    ],
    [
      "What ships",
      "A system, then a handover",
      "A working workflow in weeks, improved every week",
    ],
    ["Who owns adoption", "Your team, after go-live", "Us, until usage data proves it works"],
    [
      "How success is measured",
      "Delivered to spec",
      "Used on site, with accurate and current data",
    ],
  ].map(([label, before, after]) => ({
    _type: "comparisonRow",
    _key: key(),
    label,
    before,
    after,
  }));

const comparisonBlock = (extra) => ({
  _type: "comparisonBlock",
  beforeLabel: "Traditional IT vendor",
  afterLabel: "Forward Deployed Engineering",
  rows: comparisonRows(),
  ...extra,
});

const securityBlock = () => ({
  _type: "cardGridBlock",
  eyebrow: "Security and ownership",
  heading: "Your infrastructure, your system of record, your IP",
  items: [
    card(
      "Your infrastructure",
      "Cloud or on-premise. Models and hosting are agreed with your IT team.",
    ),
    card(
      "Your system stays the system of record",
      "We write into SAP, Salesforce or your ERP. No parallel database to maintain.",
    ),
    card(
      "A full audit trail on every write",
      "What changed, where it came from and who confirmed it, logged every time.",
    ),
    card("IP stays with you", "Code, workflows, documentation and data belong to you."),
  ],
});

const finalCta = (description) => ({
  _type: "ctaBlock",
  heading: "Let's pick one workflow and prove it on site.",
  description,
  button: BOOK,
  showEmail: true,
});

export function foundersBlock({ kaustumbhImage, umangImage }, extra = {}) {
  return {
    _type: "foundersBlock",
    eyebrow: "Who you'll work with",
    heading: "Build fast, build right",
    intro:
      "Two founders, two strengths. One brings AI-native speed, the other brings the delivery rigour that large, regulated organisations need. You work with both.",
    members: [
      {
        _type: "founderCard",
        _key: key(),
        name: "Kaustumbh Jaiswal",
        role: "Co-founder and CTO",
        tag: "Build fast",
        bio: "Former software engineer at Amazon and Sixt. Has shipped AI products end to end for US startups, including autonomous agents, retrieval systems and real-time voice AI. Works as a forward deployed engineer himself, and leads architecture and on-site engineering.",
        points: [
          "Ex-Amazon, ex-Sixt",
          "Python, TypeScript and Java",
          "LLM orchestration, evals on Langfuse, voice AI on Retell and Twilio",
        ],
        ...(kaustumbhImage ? { image: kaustumbhImage } : {}),
      },
      {
        _type: "founderCard",
        _key: key(),
        name: "Umang Dhandhania",
        role: "Co-founder",
        tag: "Build right",
        bio: "Master's from Northwestern University. Has delivered enterprise software for US healthcare, manufacturing, retail, e-commerce and insurance clients. Brings the process rigour that regulated, large organisations need.",
        points: [
          "Northwestern University",
          "Enterprise delivery in regulated domains",
          "Process rigour from scope to sign-off",
        ],
        ...(umangImage ? { image: umangImage } : {}),
      },
    ],
    ...extra,
  };
}

/* -------------------------------------------------------------------------- */
/* Homepage                                                                    */
/* -------------------------------------------------------------------------- */

export function homepageFields(images, caseStudyIds) {
  return {
    hero: {
      badge: "Forward Deployed Engineering",
      heading: "AI that actually gets used.",
      headingAccent: "Built inside the systems you already run.",
      tagline: [
        {
          _type: "block",
          _key: "heroTagline",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "span0",
              marks: [],
              text: "Agilemorph is one of India's first forward deployed engineering firms. Our engineers embed with your teams, find where AI fits in your systems, workflows and processes, build it in production, and stay until it's adopted.",
            },
          ],
        },
      ],
      ctaPrimary: BOOK,
      ctaSecondary: SEE_HOW,
      proofPoints: [
        "40+ projects delivered",
        "Ex-Amazon, ex-Sixt founders",
        "Engagements in India, the US and Africa",
      ],
      explainer: FDE_EXPLAINER,
    },
    problem: {
      _type: "cardGridBlock",
      eyebrow: "The problem",
      heading: "Work happens on site. The record of it lives somewhere else.",
      intro:
        "Teams fall back to WhatsApp, spreadsheets and phone calls because the official system is slow or awkward. The ERP or CRM goes stale, and leadership loses the live view.",
      items: symptomCards(),
      closing: "Most AI projects fail here. They are built offsite, handed over, and never adopted.",
    },
    fde: comparisonBlock({
      eyebrow: "Forward Deployed Engineering",
      heading: "What Forward Deployed Engineering means",
      intro:
        "Our engineers work inside your business instead of building from a document at a distance. Here is what that changes compared with a traditional IT vendor.",
    }),
    phases: {
      _type: "phaseBlock",
      eyebrow: "How we work",
      heading: "Five phases. You continue only if the last one delivered.",
      phases: [
        phase(
          "Discovery audit",
          "Fixed scope, fixed fee. On site with your teams, mapping every process, data flow and gap.",
        ),
        phase("Blueprint", "Ranked opportunities, target architecture and a pilot plan."),
        phase(
          "Pilot",
          "One workflow at one or two sites, live in production. Success criteria agreed upfront.",
        ),
        phase("Adopt", "We train, nudge and measure usage until the new way is the default."),
        phase(
          "Scale",
          "Roll out across sites and functions with a dedicated engineer on a monthly retainer.",
        ),
      ],
      note: "Every phase ends with a decision point.",
      cta: SEE_HOW,
    },
    caseStudies: {
      _type: "caseStudyListBlock",
      eyebrow: "Case studies",
      heading: "Proof from the field",
      intro:
        "Real engagements, told through the five phases. Client names stay private until each client approves them.",
      items: caseStudyIds.map((id) => ({
        _type: "reference",
        _key: key(),
        _ref: id,
        _weak: true,
      })),
    },
    founders: foundersBlock(images),
    capabilities: {
      _type: "cardGridBlock",
      eyebrow: "What we build",
      heading: "What we build during an engagement",
      intro:
        "The capabilities our engineers bring. Each one is built inside the systems you already run, and chosen to fit the workflow.",
      items: [
        card(
          "AI agents",
          "Agents that work inside your existing systems.",
          "/what-we-build/ai-agents",
        ),
        card(
          "Workflow automation",
          "Custom code, n8n, Make and Zapier.",
          "/what-we-build/workflow-automation",
        ),
        card(
          "CRM and lead automation",
          "Capture, route and follow up inside the CRM you run.",
          "/what-we-build/crm-lead-automation",
        ),
        card(
          "Messaging automation",
          "WhatsApp, email and chat, written into your systems.",
          "/what-we-build/messaging-automation",
        ),
        card(
          "MCP servers and self-hosted AI",
          "AI infrastructure on your cloud or on-premise.",
          "/what-we-build/mcp-ai-infrastructure",
        ),
        card(
          "Retrieval and document intelligence",
          "RAG over your documents, scans and records.",
          "/what-we-build/custom-ai-engineering",
        ),
        card(
          "Real-time voice AI",
          "Voice agents on Retell and Twilio.",
          "/what-we-build/custom-ai-engineering",
        ),
        card(
          "Evals and monitoring",
          "Langfuse evals, so you know the AI is right before people rely on it.",
          "/what-we-build/custom-ai-engineering",
        ),
        card(
          "Shopify and e-commerce automation",
          "Orders, inventory and store flows.",
          "/what-we-build/shopify-automation",
        ),
        card(
          "Custom AI engineering",
          "Python, TypeScript and Java, when no-code is the wrong fit.",
          "/what-we-build/custom-ai-engineering",
        ),
      ],
      closing:
        "Certified across Claude, Make, n8n, Zapier, Microsoft and Shopify, and able to write the code when no-code is the wrong fit.",
    },
    security: securityBlock(),
    clientTypes: {
      _type: "cardGridBlock",
      eyebrow: "Who we work with",
      heading: "Who we work with",
      items: [
        card(
          "Multi-site enterprises",
          "Manufacturing, agro-processing, EPC, mining, infrastructure and environment services.",
        ),
        card("Mid-size operations businesses", "In India, Africa and the US."),
        card(
          "Growing service, trades and e-commerce businesses",
          "Starting with an AI Audit. Same model, smaller scope.",
        ),
        card("AI-first startups", "That need an embedded engineering partner."),
      ],
    },
    finalCta: finalCta(
      "Book a discovery call. We'll tell you where AI fits in your operation and what a pilot would take.",
    ),
    seo: {
      _type: "seo",
      title: "Agilemorph | Forward Deployed Engineering for AI",
      description: SITE_DESCRIPTION,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* How we work                                                                 */
/* -------------------------------------------------------------------------- */

export function howWeWorkDoc() {
  return {
    _id: "howWeWorkPage",
    _type: "howWeWorkPage",
    hero: {
      eyebrow: "How we work",
      heading: "Close the gap between the floor and the system.",
      description: FDE_EXPLAINER,
      ctaPrimary: BOOK,
      ctaSecondary: cta("See the five phases", "/how-we-work#phases"),
    },
    problem: {
      _type: "cardGridBlock",
      eyebrow: "The problem",
      heading: "Work happens on site. The record of it lives somewhere else.",
      intro:
        "Work happens on the floor, on the site, in the field. Teams fall back to WhatsApp, spreadsheets and phone calls because the official system is slow or awkward, so the ERP or CRM is stale and inaccurate, and leadership has no live view.",
      items: symptomCards(),
      closing: "Most AI projects fail here. They are built offsite, handed over, and never adopted.",
    },
    ourRead: {
      _type: "proseBlock",
      eyebrow: "Our read",
      heading: "The system isn't the problem. The distance between the work and the system is.",
      body: "So we bring the system to where people already work. We put AI at the point where work happens: a WhatsApp update, a scanned document, a voice note, a machine log. We validate it, write it into the system of record, and keep a person in the loop for anything uncertain.\n\nThen we measure usage per site, per person, per week, until the new way is the default.",
    },
    comparison: comparisonBlock({
      eyebrow: "The difference",
      heading: "A traditional IT vendor, and how we work instead",
    }),
    phases: {
      _type: "phaseBlock",
      eyebrow: "Five phases",
      heading: "Five phases, each ending with a decision point",
      intro: "You continue only if the previous phase delivered.",
      phases: [
        phase("Discovery audit", "Fixed scope, fixed fee. On site with your teams.", {
          details: [
            "We map every process, data flow and gap",
            "We set a baseline per site: update lag, field completeness, duplicate rate and active users",
          ],
          decision: "You decide whether the findings justify a blueprint.",
        }),
        phase("Blueprint", "Ranked opportunities, target architecture and a pilot plan.", {
          details: ["Opportunities ranked for your operation", "A target architecture inside your stack", "A pilot plan with success criteria"],
          decision: "You choose the workflow to pilot.",
        }),
        phase("Pilot", "One workflow at one or two sites, live in production.", {
          details: [
            "Success criteria agreed upfront",
            "Error handling, retries, monitoring, audit logs and evals from the first build",
          ],
          decision: "You decide, against the agreed criteria, whether to adopt it.",
        }),
        phase("Adopt", "We train, nudge and measure usage until the new way is the default.", {
          details: [
            "Training with the people who use it",
            "Usage measured per site, per person, per week",
          ],
          decision: "You decide when it is ready to roll out.",
        }),
        phase(
          "Scale",
          "Roll out across sites and functions with a dedicated engineer on a monthly retainer.",
          {
            details: ["Same model, site by site and function by function", "A weekly review with your IT team"],
            decision: "You decide what comes next.",
          },
        ),
      ],
      note: "Every phase ends with a decision point.",
    },
    audit: {
      _type: "cardGridBlock",
      eyebrow: "Discovery audit",
      heading: "What the discovery audit covers",
      intro: "Fixed scope, fixed fee, on site with your teams.",
      items: [
        card("Shadow", "Site visits with operators, supervisors and back-office teams."),
        card(
          "Map",
          "Every data path, including chat groups, spreadsheets, calls and system objects.",
        ),
        card(
          "Measure",
          "A baseline per site: update lag, field completeness, duplicate rate and active users.",
        ),
        card("Deliver", "An audit report, ranked opportunities and a pilot recommendation."),
      ],
    },
    architecture: {
      _type: "phaseBlock",
      eyebrow: "Example architecture",
      heading: "From a WhatsApp message to the system of record",
      intro:
        "One pattern we build often. AI captures the update where it happens, and a person confirms anything uncertain.",
      phases: [
        phase("Field update", "A WhatsApp text, voice note or photo from the person doing the work."),
        phase("AI capture agent", "Extracts a structured record from the message."),
        phase("Validation", "The record is checked against the system of record."),
        phase("Supervisor confirms", "Uncertain entries go to a supervisor, who confirms in one tap.", {
          humanInLoop: true,
        }),
        phase("Written via API", "The record is written into your ERP or CRM."),
        phase("Live dashboards", "Leadership sees the current state, site by site."),
      ],
      note: "Amber marks the step where a person decides.",
    },
    adoption: {
      _type: "cardGridBlock",
      eyebrow: "Adoption and governance",
      heading: "Adoption is our job",
      intro:
        "We measure who uses it and how fresh the data is, and we stay until the numbers prove it works.",
      items: [
        card(
          "Adoption dashboard per site",
          "Who is using the new workflow, and who has fallen back to the old one.",
        ),
        card("Data-quality score per record", "Completeness and freshness for every record written."),
        card("Automatic nudges", "A reminder goes out when a record goes stale."),
        card("Escalation to a manager", "If a nudge is ignored, the right manager hears about it."),
        card(
          "Weekly review with your IT team",
          "We review usage and data quality together and agree what to fix next.",
        ),
      ],
    },
    engagement: {
      _type: "engagementBlock",
      eyebrow: "Engagement model",
      heading: "How engagements are structured",
      intro:
        "Two entry points, one model. We scope and quote after the audit. No long contract before you've seen results.",
      tracks: [
        {
          _type: "engagementTrack",
          _key: key(),
          name: "Enterprise engagement",
          audience: "For enterprises and multi-site businesses",
          steps: [
            card(
              "Discovery audit",
              "Fixed scope, fixed fee. On site with your teams. Ends with an audit report and a pilot recommendation.",
            ),
            card(
              "Pilot",
              "One workflow at one or two sites, live in production, against success criteria agreed upfront.",
            ),
            card(
              "Rollout",
              "Across sites and functions, with a dedicated engineer on a monthly retainer.",
            ),
          ],
          note: "Every phase ends with a decision point. You continue only if the previous phase delivered.",
          cta: BOOK,
        },
        {
          _type: "engagementTrack",
          _key: key(),
          name: "AI Audit",
          audience: "For growing businesses",
          steps: [
            card(
              "AI Audit",
              "Fixed scope, 1 to 2 weeks, remote or on site. Maps where AI and automation pay off in your operation.",
            ),
            card("First build", "Live within weeks of the audit."),
          ],
          note: "Same model, smaller scope.",
          cta: cta("Get an AI Audit", "/what-we-build/ai-audit"),
        },
      ],
    },
    security: securityBlock(),
    cta: finalCta(
      "Every engagement starts with a discovery audit. Book a call and we'll tell you what yours would cover.",
    ),
    seo: {
      _type: "seo",
      title: "How we work: Forward Deployed Engineering",
      description:
        "Forward Deployed Engineering, explained. Our engineers embed with your teams, build AI into the systems you already run, and stay until it's used.",
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Case studies                                                                */
/* -------------------------------------------------------------------------- */

const CONFIRM = "[CONFIRM]";

const phases5 = (discovery, blueprint, pilot, adopt, scale) =>
  [
    ["Discovery audit", discovery],
    ["Blueprint", blueprint],
    ["Pilot", pilot],
    ["Adopt", adopt],
    ["Scale", scale],
  ].map(([title, description]) => card(title, description ?? CONFIRM));

const seo = (title, description) => ({ _type: "seo", title, description });

export function caseStudyDocs() {
  return [
    {
      _id: "caseStudy-ai-coaching-platform",
      _type: "caseStudy",
      title: "An AI relationship-coaching platform in the US",
      slug: { _type: "slug", current: "ai-coaching-platform-mvp" },
      anonymised: true,
      order: 1,
      headline: "Embedded with the founders to build an AI product from the ground up.",
      summary:
        "The founders had a vision and no product. We worked as their forward deployed engineering team and built the MVP, the assessment framework and an evaluated report pipeline.",
      tags: ["US", "AI product"],
      context:
        "An early-stage AI relationship-coaching platform in the US. The founders had a vision and no product.",
      gap: "There was no product yet, and its core, advice on sensitive topics, could not trust an LLM's output without checks.",
      howWeWorked:
        "We embedded as the forward deployed engineering team, working directly with the founders and early users to turn their needs into working features.",
      whatWeBuilt: [
        "The MVP from the ground up on Next.js, Supabase and NestJS: magic-link sign-in, a structured assessment, free and paid report tiers and partner invitations",
        "A multi-dimension relationship assessment framework",
        "The report-generation pipeline, with evaluation and QA checks against transcripts, because sensitive advice can't trust the LLM blindly",
        "Retrieval and orchestration on Langfuse, Qdrant and OpenRouter, and the product's core AI agent",
        "Automated user reports through n8n and Zapier",
        "A retention loop of debriefs, regular check-ins and weekly reviews",
        "Onboarding flows, UX copy, email templates and user research",
      ],
      outcome: "[CONFIRM] a number (users, report accuracy, retention, time to MVP).",
      phases: phases5(
        "Worked directly with the founders and early users to turn their needs into features.",
        "Designed the assessment framework and the architecture for retrieval, orchestration and evaluation.",
        "Shipped the MVP to early users, with free and paid report tiers.",
        "Built onboarding, automated reports and the retention loop, and ran user research.",
        undefined,
      ),
      stack: ["Next.js", "Supabase", "NestJS", "Langfuse", "Qdrant", "OpenRouter", "n8n", "Zapier"],
      seo: seo(
        "AI coaching platform MVP: case study",
        "How our forward deployed engineers embedded with the founders of a US AI coaching platform and built the MVP, the assessment framework and an evaluated report pipeline.",
      ),
    },
    {
      _id: "caseStudy-manufacturer-africa",
      _type: "caseStudy",
      title: "A manufacturer with factories in Africa",
      slug: { _type: "slug", current: "manufacturer-africa-factory-floor" },
      anonymised: true,
      order: 2,
      status: "In progress",
      headline: "Embedded with factory users to find where AI fits into the systems already running.",
      summary:
        "Our team works directly with factory users, gathers requirements on the ground and identifies where AI fits into existing systems.",
      tags: ["Africa", "On the factory floor"],
      context: "A manufacturer with factories in Africa. [CONFIRM] what they make and which countries.",
      gap: CONFIRM,
      howWeWorked:
        "Our team embedded as the forward deployed engineering team, interacting directly with factory users, gathering requirements on the ground and identifying where AI fits into existing systems.",
      whatWeBuilt: [
        "[CONFIRM] the specific workflows (production reporting, quality, maintenance, inventory, compliance?).",
      ],
      outcome:
        "In progress. [CONFIRM] measured result: the baseline and first results until final numbers exist.",
      phases: phases5(
        "On the ground with factory users, gathering requirements and mapping where AI fits into existing systems.",
      ),
      stack: [],
      seo: seo(
        "Factory AI in Africa: case study",
        "How our forward deployed engineers work on the factory floor with a manufacturer in Africa to find where AI fits into the systems already running.",
      ),
    },
    {
      _id: "caseStudy-listed-agro-processor",
      _type: "caseStudy",
      title: "A BSE-listed agro-processing company",
      slug: { _type: "slug", current: "listed-agro-processing-company" },
      anonymised: true,
      order: 3,
      headline: "On-site discovery to find where AI fits into a listed processor's operations.",
      summary:
        "The same embedded model at a publicly listed company in India: on-site requirement discovery, then building and measuring where AI fits into existing operations.",
      tags: ["India", "Publicly listed"],
      context: "A publicly listed agro-processing company in India.",
      gap: CONFIRM,
      howWeWorked:
        "The same embedded model: on-site requirement discovery, identifying where AI integrates into existing operations, building, and measuring.",
      whatWeBuilt: ["[CONFIRM] specifics and numbers."],
      outcome: "[CONFIRM] specifics and numbers.",
      phases: phases5(
        "On-site requirement discovery with the teams who run operations.",
      ),
      stack: [],
      seo: seo(
        "Listed agro-processor: case study",
        "How our forward deployed engineers ran on-site discovery at a BSE-listed agro-processing company to find where AI fits into existing operations.",
      ),
    },
    {
      _id: "caseStudy-luxury-watch-marketplace",
      _type: "caseStudy",
      title: "A pre-owned luxury watch marketplace",
      slug: { _type: "slug", current: "luxury-watch-marketplace-ai-sales-agent" },
      anonymised: true,
      order: 4,
      headline: "An AI sales agent built inside the owner's existing sales channels.",
      summary:
        "Embedded with the owner, we rebuilt the website and built a WhatsApp and Telegram AI sales agent on Claude, inside the channels where sales already happen.",
      tags: ["E-commerce", "AI sales agent"],
      context:
        "A pre-owned luxury watch marketplace that sells through its website and messaging channels.",
      gap: CONFIRM,
      howWeWorked:
        "Embedded with the owner. We built inside the existing sales channels instead of adding a new one, and measured how the agent handled conversations.",
      whatWeBuilt: [
        "A website rebuild on Next.js, Sanity, FastAPI and Supabase",
        "A WhatsApp and Telegram AI sales agent on Claude, with a channel-adapter pattern so one agent serves both channels",
        "Inventory scraping and sync",
        "Webhook reliability, CDN and bot mitigation",
      ],
      outcome: "[CONFIRM] naming and an outcome number.",
      phases: phases5(
        "Worked with the owner on how sales conversations actually run.",
        "Chose a channel-adapter design so one agent serves WhatsApp and Telegram.",
        "Put the agent live in the existing sales channels.",
        "Measured how the agent handled conversations.",
      ),
      stack: ["Next.js", "Sanity", "FastAPI", "Supabase", "Claude", "WhatsApp", "Telegram"],
      seo: seo(
        "AI sales agent for a watch marketplace",
        "How we embedded with the owner of a luxury watch marketplace and built a WhatsApp and Telegram AI sales agent on Claude inside existing sales channels.",
      ),
    },
    {
      _id: "caseStudy-nyc-gas-contractor",
      _type: "caseStudy",
      title: "A New York City gas piping contractor",
      slug: { _type: "slug", current: "nyc-contractor-referral-rewards" },
      anonymised: true,
      order: 5,
      headline: "A referral rewards engine, with the owner's approval in the loop.",
      summary:
        "The small-scope version of our model: a referral rewards engine on the tools the contractor already runs, with every payout approved by the owner.",
      tags: ["US", "Small scope"],
      context: "A gas piping contractor in New York City that runs its jobs in Housecall Pro.",
      gap: CONFIRM,
      howWeWorked:
        "The same model at small scope: built inside the tools the business already runs, with the owner deciding every payout.",
      whatWeBuilt: [
        "A referral rewards engine connected to Housecall Pro",
        "A Google Sheets ledger of every referral and reward",
        "Tremendous payouts, released only after the owner approves",
      ],
      outcome: "[CONFIRM] naming and a number.",
      phases: phases5(
        undefined,
        undefined,
        "Owner approval in the loop for every payout.",
      ),
      stack: ["Housecall Pro", "Google Sheets", "Tremendous"],
      seo: seo(
        "Referral rewards engine for a contractor",
        "A referral rewards engine on Housecall Pro, Google Sheets and Tremendous, built for a New York City gas piping contractor with the owner approving every payout.",
      ),
    },
    {
      _id: "caseStudy-trades-speed-to-lead",
      _type: "caseStudy",
      title: "Speed-to-lead and booking for trades firms",
      slug: { _type: "slug", current: "trades-speed-to-lead" },
      anonymised: false,
      order: 6,
      headline: "A capability example: a speed-to-lead and booking system for trades firms.",
      summary:
        "A capability example, not a client case study: a GoHighLevel speed-to-lead and booking system designed for HVAC, roofing and remodelling firms.",
      tags: ["Capability example", "Trades"],
      context:
        "Designed for HVAC, roofing and remodelling firms that run ServiceTitan or Housecall Pro.",
      gap: CONFIRM,
      howWeWorked:
        "Built as a reusable system, ready to be fitted inside a firm's existing tools during an AI Audit and first build.",
      whatWeBuilt: [
        "A GoHighLevel speed-to-lead and booking system",
        "Designed to work alongside ServiceTitan and Housecall Pro",
      ],
      outcome: "A capability example. There is no client outcome to report until a client agrees to be named.",
      phases: [],
      stack: ["GoHighLevel", "ServiceTitan", "Housecall Pro"],
      seo: seo(
        "Speed-to-lead for trades firms",
        "A GoHighLevel speed-to-lead and booking system designed for HVAC, roofing and remodelling firms on ServiceTitan and Housecall Pro.",
      ),
    },
  ];
}

export const HOMEPAGE_CASE_STUDY_IDS = [
  "caseStudy-ai-coaching-platform",
  "caseStudy-manufacturer-africa",
  "caseStudy-listed-agro-processor",
];

export function caseStudiesIndexDoc() {
  return {
    _id: "caseStudiesIndexPage",
    _type: "caseStudiesIndexPage",
    hero: {
      eyebrow: "Case studies",
      heading: "Proof from the field",
      description:
        "Engagements where our engineers embedded with the team, found where AI fits, built it in production and measured whether people used it. Client names stay private until each client approves them.",
    },
    founderTrack: {
      _type: "cardGridBlock",
      eyebrow: "Founder-track experience",
      heading: "What our founders have built",
      intro:
        "Work our founders have built before and alongside Agilemorph. Cited as our founders' experience, not as Agilemorph client work.",
      items: [
        card("Autonomous retention agent", "For a consumer app, deciding when and how to make a save offer."),
        card("Real-time voice AI for pharmacies", "At a YC-backed health startup."),
        card("Business rule engine", "Built in Java and Quarkus to lift team productivity."),
        card("AWS cost optimisation", "A cost-reduction programme on AWS infrastructure."),
      ],
    },
    cta: finalCta(
      "Book a discovery call. We'll tell you where AI fits in your operation and what a pilot would take.",
    ),
    seo: seo(
      "Case studies",
      "How Agilemorph's engineers embed with a team, find where AI fits, build it in production and stay until it is used. Real engagements, told through five phases.",
    ),
  };
}

/* -------------------------------------------------------------------------- */
/* About                                                                       */
/* -------------------------------------------------------------------------- */

export const DIFFERENTIATORS = [
  [
    "Embedded, not outsourced",
    "We work on your sites or alongside your teams. Scope comes from what we observe, not from a document.",
  ],
  [
    "Inside your stack",
    "We extend SAP, Salesforce, your ERP, CRM and factory tools. No parallel systems to maintain.",
  ],
  [
    "Adoption is our job",
    "We measure who uses it and how fresh the data is, and we stay until the numbers prove it works.",
  ],
  [
    "Production from day one",
    "Error handling, retries, monitoring, audit logs and evals from the first build. A pilot is live in production, not a demo.",
  ],
  [
    "You own it",
    "Code, workflows, documentation and data belong to you. Self-hosted or on-premise when required; model choice agreed with your IT team.",
  ],
  [
    "Fast and rigorous",
    "Amazon-trained speed plus enterprise delivery discipline. We ship a working workflow in weeks and improve it every week.",
  ],
];

export function aboutFields(images) {
  return {
    hero: {
      heading: "One of India's first forward deployed engineering firms",
      tagline:
        "Our engineers embed with your teams, find where AI fits in your systems, workflows and processes, build it in production, and stay until it's used.",
      cta: SEE_HOW,
    },
    about: {
      heading: "Where we come from",
      body: "Agilemorph is based in Nagpur, India, with clients in India, the US and Africa. We are one of India's first forward deployed engineering firms: our work happens inside client businesses, on their sites and alongside their teams.\n\nWe are a services firm with an R&D arm. A share of what our engineering work earns funds the products we build, and CAT is the first one we have released.",
      promiseHeading: "Our promise",
      promise:
        "We stay until it's used. We measure who uses what we build and how fresh the data is, and we keep improving it until the numbers prove it works.",
    },
    founders: foundersBlock(images, {
      eyebrow: "The founders",
    }),
    cta: {
      heading: "Talk to the people who'll build it",
      description:
        "Book a discovery call. We'll map where AI fits in your operation and what a pilot would take.",
      button: BOOK,
    },
    seo: {
      _type: "seo",
      title: "About",
      description:
        "Agilemorph is one of India's first forward deployed engineering firms, based in Nagpur with clients in India, the US and Africa. Meet the founders.",
    },
  };
}
