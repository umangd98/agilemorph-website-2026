/**
 * Case studies. Every client is anonymised until they approve being named.
 * Nothing here is invented: where a fact has not been supplied yet (an outcome
 * figure, the exact workflows), the field is left out and the page says the
 * detail is being confirmed with the client.
 */

export type CaseStudy = {
  slug: string;
  client: string;
  headline: string;
  region: string;
  status?: "In progress";
  context: string;
  gap?: string;
  howWeWorked: string;
  built?: string[];
  outcome?: string;
  phases: Partial<Record<"Find" | "Build" | "Ship" | "Adopt" | "Iterate", string>>;
  stack?: string[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "ai-coaching-platform-mvp",
    client: "An AI relationship-coaching platform in the US",
    headline: "Embedded with the founders to build an AI product from the ground up.",
    region: "US",
    context: "An early-stage AI relationship-coaching platform. The founders had a vision and no product.",
    gap: "There was no product yet, and its core, advice on sensitive topics, could not trust an LLM's output without checks.",
    howWeWorked:
      "We worked as the founders' embedded engineering team, directly with them and with early users, turning needs into working features.",
    built: [
      "The MVP from the ground up on Next.js, Supabase and NestJS: magic-link sign-in, a structured assessment, free and paid report tiers and partner invitations",
      "A multi-dimension relationship assessment framework",
      "The report-generation pipeline, with evaluation and QA checks against transcripts, because sensitive advice can't trust the LLM blindly",
      "Retrieval and orchestration on Langfuse, Qdrant and OpenRouter, and the product's core AI agent",
      "Automated user reports through n8n and Zapier",
      "A retention loop of debriefs, regular check-ins and weekly reviews",
      "Onboarding flows, UX copy, email templates and user research",
    ],
    phases: {
      Find: "Worked directly with the founders and early users to turn their needs into features.",
      Build: "Designed the assessment framework and the architecture for retrieval, orchestration and evaluation.",
      Ship: "Shipped the MVP to early users, with free and paid report tiers.",
      Adopt: "Built onboarding, automated reports and the retention loop, and ran user research.",
    },
    stack: ["Next.js", "Supabase", "NestJS", "Langfuse", "Qdrant", "OpenRouter", "n8n", "Zapier"],
  },
  {
    slug: "luxury-watch-marketplace-ai-sales-agent",
    client: "A pre-owned luxury watch marketplace",
    headline: "An AI sales agent built inside the owner's existing sales channels.",
    region: "E-commerce",
    context: "A pre-owned luxury watch marketplace that sells through its website and messaging channels.",
    howWeWorked:
      "Embedded with the owner. We built inside the existing sales channels instead of adding a new one, and measured how the agent handled conversations.",
    built: [
      "A website rebuild on Next.js, Sanity, FastAPI and Supabase",
      "A WhatsApp and Telegram AI sales agent on Claude, with a channel-adapter pattern so one agent serves both channels",
      "Inventory scraping and sync",
      "Webhook reliability, CDN and bot mitigation",
    ],
    phases: {
      Find: "Worked with the owner on how sales conversations actually run.",
      Build: "Chose a channel-adapter design so one agent serves WhatsApp and Telegram.",
      Ship: "Put the agent live in the existing sales channels.",
      Adopt: "Measured how the agent handled conversations.",
    },
    stack: ["Next.js", "Sanity", "FastAPI", "Supabase", "Claude", "WhatsApp", "Telegram"],
  },
  {
    slug: "nyc-contractor-referral-rewards",
    client: "A New York City gas piping contractor",
    headline: "A referral rewards engine, with the owner's approval in the loop.",
    region: "US",
    context: "A gas piping contractor in New York City that runs its jobs in Housecall Pro.",
    howWeWorked:
      "The same model at small scope: built inside the tools the business already runs, with the owner deciding every payout.",
    built: [
      "A referral rewards engine connected to Housecall Pro",
      "A Google Sheets ledger of every referral and reward",
      "Tremendous payouts, released only after the owner approves",
    ],
    phases: {
      Ship: "Owner approval in the loop for every payout.",
    },
    stack: ["Housecall Pro", "Google Sheets", "Tremendous"],
  },
  {
    slug: "manufacturer-africa-factory-floor",
    client: "A Dubai-based owner of several businesses, with factories in Africa",
    headline: "Embedded with factory users to find where AI fits into the systems already running.",
    region: "UAE and Africa",
    status: "In progress",
    context: "An entrepreneur based in Dubai who runs several businesses, including factories in Africa.",
    howWeWorked:
      "Our engineers work directly with factory users, gathering requirements on the ground and identifying where AI fits into the existing systems.",
    phases: {
      Find:
        "On the ground with factory users, gathering requirements and mapping where AI fits into existing systems.",
    },
  },
  {
    slug: "listed-agro-processing-company",
    client: "A BSE-listed agro-processing company",
    headline: "A sales dashboard and AI assistant that turn a manual sales process into data the owner can forecast from.",
    region: "India",
    status: "In progress",
    context: "A publicly listed agro-processing company in India whose sales process runs by hand.",
    gap: "Because sales were tracked manually, the owner had no dependable way to attribute sales or forecast future demand.",
    howWeWorked:
      "The same embedded model: on-site discovery with the people who run sales, then a digital way to track the manual process they already follow. We are still building with them.",
    built: [
      "A sales dashboard that tracks the manual sales process in digital form",
      "An AI chatbot the owner can ask about sales, to attribute them and forecast future demand",
    ],
    phases: {
      Find: "On-site discovery with the teams who run sales.",
      Build: "Digitised sales tracking and a dashboard, with an AI chatbot for the owner.",
      Iterate: "Still building with the client as the system is used.",
    },
  },
];

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

/** Work our founders did before and alongside Agilemorph. Not Agilemorph client work. */
export const FOUNDER_TRACK = [
  ["Autonomous retention agent", "For a consumer app, deciding when and how to make a save offer."],
  ["Real-time voice AI for pharmacies", "At a YC-backed health startup."],
  ["Business rule engine", "Built in Java and Quarkus to lift team productivity."],
  ["AWS cost optimisation", "A cost-reduction programme on AWS infrastructure."],
] as const;
