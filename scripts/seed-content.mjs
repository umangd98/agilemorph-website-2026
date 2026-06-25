#!/usr/bin/env node
/**
 * Seeds Sanity documents with scraped AgileMorph content.
 * Usage: node scripts/seed-content.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAiAutomationSubServicePages } from "./ai-automation-sub-services.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const MANIFEST_PATH = join(__dirname, "media-manifest.json");
const ENV_PATH = join(ROOT, ".env.local");
const HOMEPAGE_STATS = {
  eyebrow: "Metrics That Matter",
  heading: "Enjoy Tangible Results",
  items: [
    { value: "180+", label: "Projects Delivered" },
    { value: "100+", label: "Clients Across 4 Continents" },
    { value: "500K+", label: "Hours Saved via Automation" },
    { value: "98%", label: "Client Retention Rate" },
    { value: "15+", label: "AI Agents Built and Deployed" },
    { value: "4+", label: "Years Building AI Systems" },
  ],
};

function loadHomepageStats() {
  return {
    eyebrow: HOMEPAGE_STATS.eyebrow,
    heading: HOMEPAGE_STATS.heading,
    items: HOMEPAGE_STATS.items.map((item) => ({ _type: "stat", ...item })),
  };
}

function loadEnv() {
  return Object.fromEntries(
    readFileSync(ENV_PATH, "utf8")
      .split("\n")
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const [key, ...rest] = line.split("=");
        return [key.trim(), rest.join("=").trim()];
      }),
  );
}

function getAuthToken({ preferCli = false } = {}) {
  const configPath = join(process.env.HOME, ".config/sanity/config.json");
  const cliToken =
    existsSync(configPath) &&
    JSON.parse(readFileSync(configPath, "utf8")).authToken;

  if (preferCli && cliToken) return cliToken;

  const env = loadEnv();
  if (env.SANITY_API_WRITE_TOKEN) return env.SANITY_API_WRITE_TOKEN;
  if (cliToken) return cliToken;
  if (env.SANITY_API_READ_TOKEN) return env.SANITY_API_READ_TOKEN;

  throw new Error("No Sanity auth token found.");
}

function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    throw new Error(
      "media-manifest.json not found. Run scripts/upload-media.mjs first.",
    );
  }
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
}

function imageRef(manifest, key, alt = "") {
  const asset = manifest[key];
  if (!asset?.id) return undefined;
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset.id },
    alt,
  };
}

function techItem(manifest, name, logoKey) {
  const item = { _type: "technologyItem", name };
  const logo = logoKey ? imageRef(manifest, logoKey, `${name} logo`) : undefined;
  if (logo) item.logo = logo;
  return item;
}

function cta(label, href, openInNewTab = false) {
  return { _type: "ctaButton", label, href, openInNewTab };
}

function heroTaglineBlock(segments) {
  const markDefs = [];
  const children = segments.map((segment, index) => {
    const key = `span${index}`;
    if (typeof segment === "string") {
      return { _type: "span", _key: key, text: segment, marks: [] };
    }
    const linkKey = `link${markDefs.length}`;
    markDefs.push({ _key: linkKey, _type: "link", href: segment.href });
    return { _type: "span", _key: key, text: segment.text, marks: [linkKey] };
  });

  return [
    {
      _type: "block",
      _key: "heroTagline",
      style: "normal",
      markDefs,
      children,
    },
  ];
}

function whyUsItem({
  title,
  description,
  animationType = "generic",
  highlights = [],
  animationLabels = [],
}) {
  return {
    _type: "whyUsItem",
    title,
    description,
    animationType,
    ...(highlights.length ? { highlights } : {}),
    ...(animationLabels.length ? { animationLabels } : {}),
  };
}

const PROCESS_STEPS = [
  {
    title: "Kickstart Your Journey With a Thoughtful Plan",
    description:
      "We start by understanding your goals and planning the steps to bring them to life.",
    bullets: [
      "Collaborative Sprint: Work closely with your team to identify project objectives and scope.",
      "Intensive Planning: Focus on detailed planning and prioritization.",
      "Successful Groundwork: Lay the foundation for a successful agile transformation.",
    ],
    imageKey: "2025/01/WeWork_Illustration01.svg",
  },
  {
    title: "Innovate with every step forward.",
    description:
      "We build and refine your solution step by step, based on your feedback.",
    bullets: [
      "Iterative Development: Central to our process for continuous improvement.",
      "Agile Principles: Embrace the agile manifesto to adapt and refine solutions.",
      "Rapid Feedback Loops: Ensure every iteration aligns with your evolving needs.",
    ],
    imageKey: "2025/01/WeWork_Illustration02.svg",
  },
  {
    title: "Agility at Its Best, Results Guaranteed",
    description:
      "We deliver results quickly and adapt to your needs as they evolve.",
    bullets: [
      "Agile Principles: Leverage agile methodologies for prompt and efficient solutions.",
      "Adaptability: Address changes and challenges with a flexible approach.",
      "Seamless Evolution: Ensure the project evolves smoothly to meet milestones.",
    ],
    imageKey: "2025/01/WeWork_Illustration03.svg",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Umang has consistently demonstrated leadership qualities and a great positive attitude in working with others in team settings. I'm very happy to recommend Umang for any leadership roles in the fields of engineering.",
    name: "David Zaretsky",
    role: "Snips Media & Northwestern University",
    company: "Snips Media",
    imageKey: "2025/01/SuccessStories_David-Zaretsky.png",
  },
  {
    quote:
      "It was a pleasure working alongside Umang and his team at AgileMorph Solutions. Our collaboration resulted in the development of an in-house software solution that had a profound impact on our operational efficiency at Dhaninfo.",
    name: "Sarvesh Agrawal",
    role: "CEO",
    company: "Dhaninfo",
  },
  {
    quote:
      "Umang is a very dedicated, talented and hardworking coder. His passion for solving problems using computer science is unmatched.",
    name: "Shashi Bhushan Kumar",
    company: "Interview Kickstart",
  },
  {
    quote:
      "Umang and I worked together on a few projects, he consistently gave 100 percent effort to the team and played a significant role in the success of those projects.",
    name: "Nikhil Shendge",
    company: "Capgemini",
  },
  {
    quote:
      "Umang has a great potential to determine solutions for complex problems with perfect algorithms and data structures.",
    name: "Nilesh Dhoble",
    company: "Persistent Systems",
  },
  {
    quote:
      "Your commitment to learning and your ability to translate that knowledge into practical solutions left a lasting impression on me.",
    name: "Ashish Tiwari",
    company: "VNIT, India",
  },
  {
    quote:
      "AgileMorph Solutions' work made the client's permit application process smoother and hassle-free, resulting in time savings and error reduction.",
    name: "Christopher Calkins",
    company: "Digisist LLC",
  },
  {
    quote:
      "AgileMorph delivered good work and we have enjoyed working with them. Thorough and extremely helpful and flexible to our needs.",
    name: "Retirement Planning Simplified",
    company: "Matthews and Associates",
  },
];

function buildProcessSteps(manifest) {
  return PROCESS_STEPS.map((step) => ({
    _type: "processStep",
    title: step.title,
    description: step.description,
    bullets: step.bullets,
    image: imageRef(manifest, step.imageKey, step.title),
  }));
}

function buildTestimonials(manifest) {
  return TESTIMONIALS.map((item) => ({
    _type: "testimonial",
    quote: item.quote,
    name: item.name,
    role: item.role,
    company: item.company,
    image: item.imageKey
      ? imageRef(manifest, item.imageKey, item.name)
      : undefined,
  }));
}

function buildFeaturedLogos(manifest) {
  const logoKeys = [
    "2025/01/Logo-1.png",
    "2025/01/Logo-2.png",
    "2025/01/Logo-3.png",
    "2025/01/Logo-4.png",
    "2025/01/Logo-5.png",
    "2025/01/Logo-6.png",
    "2025/01/Logo-7.png",
    "2025/01/Logo-8.png",
    "2025/01/Logo-9.png",
    "2025/01/Logo-10.png",
    "2025/01/Logo-11.png",
    "2025/01/Logo-12.png",
    "2025/01/Logo-13.png",
    "2025/01/Logo-14.png",
    "2025/01/Logo-16.png",
  ];

  return logoKeys
    .map((key, index) => imageRef(manifest, key, `Partner logo ${index + 1}`))
    .filter(Boolean);
}

function buildHomepage(manifest) {
  return {
    _id: "homepage",
    _type: "homepage",
    hero: {
      heading: "Cut the Overhead.\nReclaim Your Time.",
      headingAccent: "Let AI Handle the Execution",
      tagline: heroTaglineBlock([
        "Bring absolute order to your operations with end-to-end ",
        { text: "AI business automation", href: "/services/ai-automation" },
        ". We architect your entire digital ecosystem, from integrating intelligent ",
        { text: "AI agents", href: "/services/ai-agents" },
        " to smart ",
        { text: "automated content flow", href: "/services/digital-marketing" },
        ". By upgrading your complete ",
        { text: "business processes", href: "/services/workflow-automation" },
        " from the ground up, we eliminate daily firefighting so you can lead with clarity.",
      ]),
      ctaPrimary: cta("Get in Touch", "/contact"),
      ctaSecondary: cta("Explore Our Services", "/services"),
      image: imageRef(
        manifest,
        "2026/06/ChatGPT-Image-May-28-2026-04_56_56-PM.png",
        "AgileMorph hero",
      ),
    },
    process: {
      heading: "The Way We Work",
      subheading:
        "We empower businesses to thrive with innovative digital solutions.",
      steps: buildProcessSteps(manifest),
    },
    services: {
      eyebrow: "Our Expertise",
      heading: "Discover Our Services",
      cards: [
        {
          _type: "serviceCard",
          title: "Digital Marketing",
          description:
            "Boost your online growth with our data-driven digital marketing, including SEO, content, and social media strategies.",
          href: "/services/digital-marketing",
          icon: imageRef(
            manifest,
            "2025/01/Services_Icon_03.svg",
            "Digital Marketing",
          ),
        },
        {
          _type: "serviceCard",
          title: "Virtual Assistance",
          description:
            "We are dedicated to providing top-tier virtual assistant services that cater to businesses of all sizes.",
          href: "/services/virtual-assistance",
          icon: imageRef(
            manifest,
            "2025/01/Services_Icon_04.svg",
            "Virtual Assistance",
          ),
        },
        {
          _type: "serviceCard",
          title: "Website",
          description:
            "Python, Django, FastAPI, and React builds that hold up in production.",
          href: "/services/website-development",
          icon: imageRef(manifest, "2025/01/Services_Icon_02.svg", "Website"),
        },
      ],
    },
    whyUs: {
      heading: "Why AgileMorph is Your Ideal Partner?",
      items: [
        whyUsItem({
          title: "Innovation",
          description:
            "Pioneering solutions that push boundaries and drive progress.",
          animationType: "innovation",
          highlights: ["Future-ready", "Bold ideas"],
          animationLabels: ["AI", "Web", "Auto"],
        }),
        whyUsItem({
          title: "Professionalism",
          description:
            "Delivering quality with integrity and a commitment to excellence.",
          animationType: "professionalism",
          highlights: ["Trusted delivery", "On every project"],
        }),
        whyUsItem({
          title: "Expertise",
          description:
            "Leveraging deep knowledge to create impactful, tailored solutions.",
          animationType: "expertise",
          highlights: ["Deep domain knowledge", "Tailored solutions"],
          animationLabels: ["Strategy", "Build", "Scale"],
        }),
      ],
      efficiencyCalculator: {
        heading: "Estimate your efficiency gain",
        description:
          "Adjust the sliders to see how much manual work AI automation could take off your team's plate.",
        disclaimer:
          "Estimates based on typical automation outcomes. Book a discovery call for a scoped audit tailored to your operations.",
        ctaLabel: "Book a discovery call",
      },
    },
    stats: loadHomepageStats(),
    featuredLogos: {
      heading: "We've been featured on",
      logos: buildFeaturedLogos(manifest),
    },
    testimonials: {
      eyebrow: "Client Feedback",
      heading: "Success Stories of Our Clients",
      items: buildTestimonials(manifest).slice(0, 6),
    },
    seo: {
      title: "AgileMorph Solutions - Custom Software Integration Services",
      description:
        "We improve operational efficiency with AI automation, build reliable web experiences, and support growth through digital marketing.",
      ogImage: imageRef(manifest, "2025/01/Herosection_Img.png", "AgileMorph"),
    },
  };
}

function buildAboutPage(manifest) {
  return {
    _id: "aboutPage",
    _type: "aboutPage",
    hero: {
      heading: "About Us",
      tagline:
        'Empowering businesses with agile solutions, innovative technology, and a customer-first approach to thrive in the digital era. Where agility meets transformation, so your next breakthrough isn\'t trapped in "someday."',
      cta: cta("Explore Our Services", "/services"),
    },
    about: {
      heading: "AgileMorph Solutions",
      body: "Agile because we sprint, iterate, and out-learn the market. Morph because we turn raw ideas into revenue-ready systems that keep adapting as you grow. Born out of AI research at Northwestern University, AgileMorph has become the execution partner for leaders who want operations that scale without adding headcount.\n\nThe result: marketing teams regain time, ops teams close the day without a backlog, and owners get systems that turn messy workflows into reliable automation. When you work with AgileMorph, you get a proven delivery process that converts inefficiency into momentum and ideas into measurable ROI.",
      promiseHeading: "Our Promise",
      promise:
        "Whether you need a landing page, a machine-learning workflow, or dozens of small automations that free up your team, we deliver on scope, on timeline, and with clear handoff documentation.",
      image: imageRef(manifest, "2025/01/Frame.png", "AgileMorph team"),
    },
    values: [
      {
        _type: "companyValue",
        title: "Dynamic Team",
        description:
          "A passionate team of tech enthusiasts, data specialists, and digital marketers committed to delivering impactful results.",
        icon: imageRef(manifest, "2025/01/UsersThree.svg", "Dynamic Team"),
      },
      {
        _type: "companyValue",
        title: "Digital Empowerment",
        description:
          "Helping businesses of all sizes harness the potential of the digital era through agile and innovative solutions.",
        icon: imageRef(manifest, "2025/01/HandFist.svg", "Digital Empowerment"),
      },
      {
        _type: "companyValue",
        title: "Quality-Driven Solutions",
        description:
          "Delivering high-quality, data-driven, and adaptable strategies to accelerate business growth and success.",
        icon: imageRef(
          manifest,
          "2025/01/SealCheck.svg",
          "Quality-Driven Solutions",
        ),
      },
      {
        _type: "companyValue",
        title: "Commitment to Innovation",
        description:
          "Staying ahead in the ever-changing digital landscape to provide cutting-edge solutions for modern challenges.",
        icon: imageRef(
          manifest,
          "2025/01/Brain.svg",
          "Commitment to Innovation",
        ),
      },
      {
        _type: "companyValue",
        title: "Tailored Partnerships",
        description:
          "Partnering with businesses to create meaningful impact and provide customized services that meet unique needs.",
        icon: imageRef(
          manifest,
          "2025/01/Handshake.svg",
          "Tailored Partnerships",
        ),
      },
      {
        _type: "companyValue",
        title: "Core Values",
        description:
          "Built on agility, adaptability, and customer-centricity, ensuring client satisfaction and long-term success.",
        icon: imageRef(manifest, "2025/01/SketchLogo.svg", "Core Values"),
      },
    ],
    process: {
      heading: "The Way We Work",
      subheading:
        "We empower businesses to thrive with innovative digital solutions.",
      steps: buildProcessSteps(manifest),
    },
    stats: [
      { _type: "stat", value: "100+", label: "Successful Projects" },
      { _type: "stat", value: "50+", label: "Satisfied clients and growing" },
      {
        _type: "stat",
        value: "10k+",
        label: "Hours of dedication and counting",
      },
      {
        _type: "stat",
        value: "5+",
        label: "Countries Represented by Our Talent",
      },
    ],
    cta: {
      heading: "Transforming Ideas into Impactful Journeys",
      description:
        "Partner with AgileMorph to unlock your organization's potential. From startups to enterprises, we're here to drive your digital transformation.",
      button: cta("Explore Our Services", "/services"),
    },
    teamLeads: {
      eyebrow: "Leadership",
      heading: "Meet Our Leadership",
      subheading:
        "The people steering strategy, engineering, and delivery, building automation that ships fast and scales with your business.",
      cardFooter: "AgileMorph leadership",
      members: [
        {
          _type: "teamLeadItem",
          name: "Umang Dhandhania",
          role: "CEO",
          bio: "A Northwestern-educated engineer who turns complex business problems into clear, revenue-lifting systems. Over the past decade he has guided more than 100 companies through launches, process overhauls, and market-ready builds that beat timelines and KPIs.",
          image: imageRef(
            manifest,
            "team-leads/umang-dhandhania.png",
            "Umang Dhandhania",
          ),
        },
        {
          _type: "teamLeadItem",
          name: "Kaustumbh Jaiswal",
          role: "CTO",
          bio: "Leads AgileMorph's engineering and product architecture, turning automation strategy into reliable, scalable systems. He pairs deep technical craft with a builder's mindset so every solution ships fast and holds up in production.",
          image: imageRef(
            manifest,
            "team-leads/kaustumbh-jaiswal.png",
            "Kaustumbh Jaiswal",
          ),
        },
        {
          _type: "teamLeadItem",
          name: "Muskan Agrawal",
          role: "COO",
          bio: "Keeps delivery sharp across client engagements, aligning teams, timelines, and outcomes so projects move from discovery to launch without friction. She brings operational rigor and a client-first lens to every engagement.",
          image: imageRef(
            manifest,
            "team-leads/muskan-agrawal.png",
            "Muskan Agrawal",
          ),
        },
      ],
    },
    founder: {
      eyebrow: "Meet Our Founder",
      heading: "Founder-led delivery with engineering depth",
      name: "Umang Dhandhania",
      role: "CEO at AgileMorph",
      bio: "A Northwestern-educated engineer who turns complex business problems into clear, revenue-lifting systems. Over the past decade he has guided more than 100 companies through launches, process overhauls, and market-ready builds that beat timelines and KPIs.\n\nHis focus at AgileMorph is practical: give ambitious teams the automation, software, and delivery support they need to move faster without sacrificing quality.\n\nWhen you work with AgileMorph, you work directly with leadership that understands both the business case and the technical build.",
      image: imageRef(
        manifest,
        "2025/03/umang-founder.png",
        "Umang Dhandhania",
      ),
    },
    featuredLogos: {
      heading: "We've been featured on",
      logos: buildFeaturedLogos(manifest),
    },
    testimonials: {
      heading: "Success Stories of Our Clients",
      items: buildTestimonials(manifest),
    },
    seo: {
      title: "About Us - AgileMorph Solutions",
      description:
        "Empowering businesses with agile solutions, innovative technology, and a customer-first approach to thrive in the digital era.",
      ogImage: imageRef(manifest, "2025/01/Frame.png", "About AgileMorph"),
    },
  };
}

function buildContactPage() {
  return {
    _id: "contactPage",
    _type: "contactPage",
    hero: {
      heading: "Contact Us",
      description:
        "Whether you have a question, need assistance, or want to explore how AgileMorph Solutions can empower your business.",
    },
    phone: "+1 209-432-7765",
    email: "info@theagilemorph.com",
    linkedinUrl: "https://www.linkedin.com/company/agilemorph-solutions",
    facebookUrl: "https://www.facebook.com/agilemorphsolutions",
    discoveryCall: {
      title: "Book a discovery call",
      subtitle: "15 Minute Discovery with Umang Dhandhania",
      description:
        "Pick a time that works for you. We'll discuss your goals and whether AgileMorph is the right fit.",
      availabilityNote:
        "We take on only 5 new client projects each month. Spots are limited, so book early if timing matters.",
      bullets: [
        "15-minute video call with our team",
        "Discuss goals, scope, and fit",
        "Leave with clear next steps",
      ],
      ctaLabel: "Book a slot",
    },
    faqs: [
      {
        _type: "faqItem",
        question: "How can I get a quote for my project?",
        answer:
          "You can request a quote by filling out the contact form on our website or emailing us directly with your project details.",
      },
      {
        _type: "faqItem",
        question: "What services does AgileMorph Solutions offer?",
        answer:
          "We offer AI Automation (AI Agents, Workflow Automation, CRM & Lead Automation, MCP & AI Infrastructure, Messaging Automation, and AI Audit), plus Digital Marketing, Virtual Assistance, and Website development.",
      },
      {
        _type: "faqItem",
        question: "Can I collaborate with AgileMorph on a long-term project?",
        answer:
          "Absolutely! We love building long-term partnerships and can scale with your business as your needs evolve.",
      },
      {
        _type: "faqItem",
        question: "How do you ensure project confidentiality?",
        answer:
          "We take confidentiality seriously. NDAs can be signed upon request, and we follow strict data security practices.",
      },
      {
        _type: "faqItem",
        question: "What if I encounter issues with the software you developed?",
        answer:
          "We offer a post-launch support window to fix any bugs or issues that arise after delivery.",
      },
      {
        _type: "faqItem",
        question: "Do you provide post-launch maintenance?",
        answer:
          "Yes. We provide ongoing maintenance packages to keep your systems running smoothly.",
      },
      {
        _type: "faqItem",
        question: "Do you work with international clients?",
        answer:
          "Yes, we work with clients across the globe and can accommodate different time zones.",
      },
    ],
    seo: {
      title: "Contact Us - AgileMorph Solutions",
      description:
        "Get in touch with AgileMorph Solutions for AI automation, web development, and digital marketing services.",
    },
  };
}

function buildServicePages(manifest) {
  return [
    {
      _id: "servicePage-ai-automation",
      _type: "servicePage",
      title: "AI Automation Development",
      slug: { _type: "slug", current: "ai-automation" },
      tagline: "Transforming Your Vision into Intelligent Automation",
      description:
        "We design, build, and run AI systems that remove manual work from your business. Agents that act, workflows that never sleep, and infrastructure built to scale. From first audit to live production.",
      heroImage: imageRef(
        manifest,
        "2025/09/AI-Automation-Development-Services.jpg",
        "AI Automation",
      ),
      heroCta: cta("Start Your AI Journey", "/contact"),
      capabilitiesHeading: "Core Capabilities",
      capabilities: [
        {
          _type: "capabilityItem",
          title: "AI Automation",
          slug: "ai-automation",
          featured: true,
          description:
            "Our core practice, end-to-end AI workflows, agents, and integrations that cut manual work across your business.",
          icon: "⚡",
        },
        {
          _type: "capabilityItem",
          title: "Workflow Automation",
          slug: "workflow-automation",
          description:
            "n8n, Make, and Zapier pipelines that eliminate repetitive work.",
          icon: "⟳",
        },
        {
          _type: "capabilityItem",
          title: "CRM & Lead Automation",
          slug: "crm-lead-automation",
          description:
            "Capture, enrich, route, and follow up on every lead automatically.",
          icon: "◎",
        },
        {
          _type: "capabilityItem",
          title: "MCP & AI Infrastructure",
          slug: "mcp-ai-infrastructure",
          description:
            "Self-hosted pipelines, MCP servers, and production-grade deployments.",
          icon: "⧉",
        },
        {
          _type: "capabilityItem",
          title: "Messaging Automation",
          slug: "messaging-automation",
          description:
            "WhatsApp, email, and chat automations that respond and convert.",
          icon: "✉",
        },
        {
          _type: "capabilityItem",
          title: "AI Audit",
          slug: "ai-audit",
          description:
            "A fixed-scope review that maps where AI saves you the most time and money.",
          icon: "◷",
        },
        {
          _type: "capabilityItem",
          title: "Shopify Automation",
          slug: "shopify-automation",
          description:
            "Automate orders, inventory, fulfillment, and customer flows across your Shopify store.",
          icon: "🛍",
        },
      ],
      whyUsHeading: "Why Choose Us",
      whyUs: [
        whyUsItem({
          title: "Expert Automation Team",
          description: "Solving complex challenges with precision and ease.",
          animationType: "expertise",
          highlights: ["AI specialists", "Production-ready"],
        }),
        whyUsItem({
          title: "Client-Focused",
          description:
            "We focus on understanding your business needs and delivering tailored solutions.",
          animationType: "partnership",
          highlights: ["Aligned goals", "Transparent process"],
          animationLabels: ["Discover", "Build", "Grow"],
        }),
        whyUsItem({
          title: "Agile Methodology",
          description:
            "We use agile methodologies to deliver results quickly and adapt to change.",
          animationType: "innovation",
          highlights: ["Fast iteration", "Adapt to change"],
        }),
        whyUsItem({
          title: "End-to-End Services",
          description:
            "From concept to deployment and beyond, we support your automation journey.",
          animationType: "generic",
          highlights: ["Full lifecycle", "Ongoing support"],
        }),
        whyUsItem({
          title: "Quality Assurance",
          description:
            "Rigorous testing processes ensure reliable, production-ready automations.",
          animationType: "professionalism",
          highlights: ["Rigorous testing", "Reliable delivery"],
        }),
      ],
      technologiesHeading: "Technologies that power our solutions",
      technologies: [
        ["n8n", "integrations/n8n.svg"],
        ["Zapier", "integrations/zapier.svg"],
        ["Make.com", "integrations/make.svg"],
        ["OpenAI", "integrations/openai.svg"],
        ["Google Cloud", "integrations/googlecloud.svg"],
        ["AWS", "integrations/aws.svg"],
        ["Python", "integrations/python.svg"],
        ["WordPress", "integrations/wordpress.svg"],
        ["Shopify", "integrations/shopify.svg"],
        ["HubSpot", "integrations/hubspot.svg"],
        ["Pipedrive", "integrations/pipedrive.svg"],
        ["Notion", "integrations/notion.svg"],
        ["Salesforce", "integrations/salesforce.svg"],
      ].map(([name, logoKey]) => techItem(manifest, name, logoKey)),
      cta: {
        heading: "Ready to Automate your Success?",
        description:
          "Let's shape your business future with intelligent AI-driven automations.",
        button: cta("Get in Touch", "/contact"),
      },
      seo: {
        title: "AI Automation Development | AgileMorph Solutions",
        description:
          "Powerful AI automation solutions to streamline your workflow, eliminate manual tasks, and boost business growth.",
      },
    },
    {
      _id: "servicePage-website-development",
      _type: "servicePage",
      title: "Website Development",
      slug: { _type: "slug", current: "website-development" },
      tagline:
        "Transform Your Digital Presence with Custom Website Development",
      description:
        "Python, Django, FastAPI, and React builds that hold up in production.",
      heroImage: imageRef(
        manifest,
        "2025/03/Website-Design-and-Development.svg",
        "Website Development",
      ),
      heroCta: cta("Share Your Product Idea", "/contact"),
      capabilitiesHeading: "Services We Can Help You With",
      capabilities: [
        {
          _type: "capabilityItem",
          title: "Website Optimization & Performance",
          description:
            "We prioritize the performance and speed of your website to ensure it delivers the best possible experience.",
        },
        {
          _type: "capabilityItem",
          title: "Custom Web Development",
          description:
            "We build fully customized websites designed to match your business goals, branding, and user needs.",
        },
        {
          _type: "capabilityItem",
          title: "E-Commerce Solutions",
          description:
            "We develop powerful, user-friendly e-commerce platforms that drive sales and customer satisfaction.",
        },
        {
          _type: "capabilityItem",
          title: "Content Management Systems (CMS)",
          description:
            "Our CMS development services empower businesses to easily manage and update website content.",
        },
        {
          _type: "capabilityItem",
          title: "Web Application Development",
          description:
            "We develop custom web applications that are dynamic, responsive, and tailored to your business.",
        },
        {
          _type: "capabilityItem",
          title: "UI/UX Design",
          description:
            "We create intuitive and visually compelling user interfaces that delight your customers.",
        },
      ],
      whyUsHeading: "Why Choose Us",
      whyUs: [
        whyUsItem({
          title: "Expert Developers",
          description:
            "Our team of skilled web developers has extensive experience across modern stacks.",
          animationType: "expertise",
          highlights: ["Modern stacks", "Proven experience"],
          animationLabels: ["Design", "Build", "Launch"],
        }),
        whyUsItem({
          title: "Custom-Tailored Solutions",
          description:
            "We don't believe in one-size-fits-all. Every project is built for your unique needs.",
          animationType: "generic",
          highlights: ["Tailored builds", "Your goals first"],
        }),
        whyUsItem({
          title: "SEO-Optimized Websites",
          description:
            "We develop websites with SEO best practices in mind from day one.",
          animationType: "innovation",
          highlights: ["SEO-first", "Performance focused"],
        }),
        whyUsItem({
          title: "Agile Methodology",
          description:
            "Utilizing agile project management for faster, more flexible delivery.",
          animationType: "partnership",
          highlights: ["Flexible delivery", "Collaborative"],
        }),
        whyUsItem({
          title: "Ongoing Support",
          description:
            "Our partnership doesn't end at launch, we provide continued support and maintenance.",
          animationType: "professionalism",
          highlights: ["Post-launch care", "Long-term support"],
        }),
      ],
      technologiesHeading: "Technologies",
      technologies: [
        "API",
        "JavaScript",
        "HTML",
        "PHP",
        "WordPress",
        "Joomla",
      ].map((name) => ({
        _type: "technologyItem",
        name,
      })),
      cta: {
        heading: "Ready to Build Your Website?",
        description:
          "Let's create a digital presence that drives growth for your business.",
        button: cta("Get in Touch", "/contact"),
      },
      seo: {
        title: "Website Development - AgileMorph Solutions",
        description:
          "Custom website development services designed to grow your business and enhance your online presence.",
      },
    },
    {
      _id: "servicePage-digital-marketing",
      _type: "servicePage",
      title: "Digital Marketing Services",
      slug: { _type: "slug", current: "digital-marketing" },
      tagline:
        "Elevate Your Brand with Our Comprehensive Digital Marketing Solutions",
      description:
        "SEO, content, and social strategy driven by data, not guesswork.",
      heroImage: imageRef(
        manifest,
        "2025/03/Social-Media-Marketing.svg",
        "Digital Marketing",
      ),
      heroCta: cta("Get in Touch", "/contact"),
      capabilitiesHeading: "Our Digital Marketing Services",
      capabilities: [
        {
          _type: "capabilityItem",
          title: "YouTube Marketing",
          description:
            "We've elevated our clients' YouTube presence through strategic content creation and optimization.",
        },
        {
          _type: "capabilityItem",
          title: "Search Engine Optimization (SEO)",
          description:
            "We've transformed our clients' online presence by driving significant organic traffic growth.",
        },
        {
          _type: "capabilityItem",
          title: "Pay-Per-Click (PPC) Advertising",
          description:
            "By developing hyper-targeted PPC campaigns, we've maximized ROI for our clients.",
        },
        {
          _type: "capabilityItem",
          title: "Social Media Marketing",
          description:
            "We've built strong, loyal communities for our clients across social media platforms.",
        },
        {
          _type: "capabilityItem",
          title: "Content Marketing",
          description:
            "Our content marketing efforts have set our clients apart as thought leaders in their industries.",
        },
        {
          _type: "capabilityItem",
          title: "Email Marketing",
          description:
            "With our personalized email marketing strategies, we've consistently boosted customer retention.",
        },
        {
          _type: "capabilityItem",
          title: "Website Design and Development",
          description:
            "We've designed and developed websites that captivate visitors and convert them into customers.",
        },
        {
          _type: "capabilityItem",
          title: "Analytics and Reporting",
          description:
            "We've empowered our clients to make informed decisions with comprehensive analytics and reporting.",
        },
      ],
      whyUsHeading: "Why Choose Us",
      whyUs: [
        whyUsItem({
          title: "Customized Strategies",
          description:
            "Tailored marketing solutions that fit your specific needs.",
          animationType: "generic",
          highlights: ["Tailored plans", "Your audience"],
        }),
        whyUsItem({
          title: "Data-Driven Insights",
          description:
            "Leverage analytics to refine and optimize your campaigns.",
          animationType: "expertise",
          highlights: ["Analytics-led", "Measurable ROI"],
        }),
        whyUsItem({
          title: "Experienced Team",
          description:
            "Work with industry experts who are committed to your success.",
          animationType: "professionalism",
          highlights: ["Industry experts", "Proven results"],
        }),
        whyUsItem({
          title: "End-to-End Services",
          description:
            "Comprehensive digital marketing services from strategy to execution.",
          animationType: "partnership",
          highlights: ["Strategy to execution", "Full funnel"],
          animationLabels: ["Plan", "Launch", "Scale"],
        }),
      ],
      technologiesHeading: "Technologies",
      technologies: [
        "Google Ads",
        "Canva",
        "YouTube",
        "Google Search",
        "Moz",
        "Google Analytics",
        "Semrush",
        "Hootsuite",
        "Ahrefs",
      ].map((name) => ({ _type: "technologyItem", name })),
      cta: {
        heading: "Ready to Grow Your Brand?",
        description:
          "Let's build a digital marketing strategy that delivers measurable results.",
        button: cta("Get in Touch", "/contact"),
      },
      seo: {
        title: "Digital Marketing Services - AgileMorph Solutions",
        description:
          "Comprehensive digital marketing services including SEO, PPC, social media, and content marketing.",
      },
    },
    {
      _id: "servicePage-virtual-assistance",
      _type: "servicePage",
      title: "Virtual Assistance Services",
      slug: { _type: "slug", current: "virtual-assistance" },
      tagline:
        "Maximize Efficiency with Our Comprehensive Virtual Assistant Solutions",
      description:
        "Trained assistants who handle the operational load you shouldn't.",
      heroImage: imageRef(
        manifest,
        "2025/03/Administrative-Support.svg",
        "Virtual Assistance",
      ),
      heroCta: cta("Get in Touch", "/contact"),
      capabilitiesHeading: "Our Virtual Assistance Services",
      capabilities: [
        {
          _type: "capabilityItem",
          title: "Content Creation and Management",
          description:
            "Content creation is an essential part of today's digital landscape, we handle it for you.",
        },
        {
          _type: "capabilityItem",
          title: "Administrative Support",
          description:
            "Our virtual assistant services handle tasks like email management, document organization, and data entry.",
        },
        {
          _type: "capabilityItem",
          title: "Customer Service",
          description:
            "Deliver exceptional customer experiences without adding to your in-house team.",
        },
        {
          _type: "capabilityItem",
          title: "Social Media Management",
          description:
            "Keeping up with social media demands can be time-consuming, we manage it for you.",
        },
        {
          _type: "capabilityItem",
          title: "Calendar and Scheduling",
          description:
            "Staying organized is crucial for running a successful business, we keep your schedule on track.",
        },
        {
          _type: "capabilityItem",
          title: "Research and Data Entry",
          description:
            "Need comprehensive research or reliable data entry services? Our team delivers accurate results.",
        },
      ],
      whyUsHeading: "Why Choose Us",
      whyUs: [
        whyUsItem({
          title: "Cost-Effective Solutions",
          description:
            "Eliminate the overhead costs associated with hiring full-time staff.",
          animationType: "generic",
          highlights: ["Lower overhead", "Flexible staffing"],
        }),
        whyUsItem({
          title: "Increased Business Productivity",
          description:
            "Our virtual assistants take on daily tasks so you can focus on growth.",
          animationType: "innovation",
          highlights: ["More focus", "Less busywork"],
        }),
        whyUsItem({
          title: "Expertise Across Industries",
          description:
            "Our virtual assistants are experienced across a wide range of industries.",
          animationType: "expertise",
          highlights: ["Cross-industry", "Skilled VAs"],
        }),
        whyUsItem({
          title: "24/7 Availability",
          description:
            "With a global team, our services are available around the clock.",
          animationType: "partnership",
          highlights: ["Global team", "Always on"],
          animationLabels: ["Morning", "Day", "Night"],
        }),
      ],
      technologiesHeading: "Tools We Use",
      technologies: [
        "Notion",
        "Google Workspace",
        "Slack",
        "Trello",
        "Asana",
      ].map((name) => ({
        _type: "technologyItem",
        name,
      })),
      cta: {
        heading: "Ready to Boost Your Productivity?",
        description:
          "Let our virtual assistants handle the tasks so you can focus on what matters.",
        button: cta("Get in Touch", "/contact"),
      },
      seo: {
        title: "Virtual Assistance Services - AgileMorph Solutions",
        description:
          "Comprehensive virtual assistant services to streamline operations and boost productivity.",
      },
    },
    ...buildAiAutomationSubServicePages(manifest, { cta, whyUsItem, imageRef }),
  ];
}

function buildBlogPosts(manifest) {
  return [
    {
      _id: "blogPost-newsletter-consistency",
      _type: "blogPost",
      title: "How to Stay Consistent with Newsletters Without Burning Out",
      slug: {
        _type: "slug",
        current: "newsletter-consistency-without-burning-out",
      },
      excerpt:
        "Introduction: Why Newsletter Consistency is Harder Than It Looks. When I first started running a newsletter, I believed the hardest part would be writing.",
      publishedAt: "2025-09-01T10:00:00.000Z",
      categories: ["Business Process Optimization"],
      coverImage: imageRef(
        manifest,
        "2025/09/Automated-Newsletter-Workflow.png",
        "Newsletter workflow",
      ),
    },
    {
      _id: "blogPost-intent-based-prospecting",
      _type: "blogPost",
      title:
        "The Future of Lead Generation: Why Intent-Based Prospecting Beats Volume Every Time",
      slug: { _type: "slug", current: "intent-based-prospecting-beats-volume" },
      excerpt:
        "For years, B2B lead generation was treated as a numbers game. Buy a big list. Send thousands of emails.",
      publishedAt: "2025-09-15T10:00:00.000Z",
      categories: ["Artificial Intelligence", "Data Analytics"],
      coverImage: imageRef(
        manifest,
        "2025/09/AI-Driven-Lead-Generation.png",
        "Lead generation",
      ),
    },
    {
      _id: "blogPost-crm-integrations",
      _type: "blogPost",
      title: "The Benefits of CRM Integrations for Your Business",
      slug: { _type: "slug", current: "benefits-of-crm-integrations" },
      excerpt:
        "In today's fast-paced business environment, customer relationship management (CRM) tools have become essential for companies of all sizes.",
      publishedAt: "2025-08-01T10:00:00.000Z",
      categories: ["Customer Relationship Management (CRM)"],
      coverImage: imageRef(
        manifest,
        "2025/09/Custom-Software-Integration-Services.jpg",
        "CRM integrations",
      ),
    },
  ];
}

function buildPricingPage() {
  return {
    _id: "pricingPage",
    _type: "pricingPage",
    hero: {
      eyebrow: "Pricing",
      heading: "Straightforward engagements.\nPredictable outcomes.",
      description:
        "Every engagement begins with a discovery audit. From there, you choose a fixed-scope project or an ongoing retainer, both structured around delivery, not hours.",
    },
    projectSection: {
      label: "Project pricing, four fixed-scope tiers",
      tiers: [
        {
          _type: "pricingProjectTier",
          name: "Discovery audit",
          price: "Free",
          priceStrikethrough: "$500",
          priceBadge: "Free",
          limitedNote: "Limited time, book before spots fill.",
          timeline: "1–2 days",
          tagline:
            "Understand exactly what to build before committing to the build.",
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
          _type: "pricingProjectTier",
          name: "Single workflow",
          price: "$3K – $8K",
          timeline: "2–6 weeks",
          tagline:
            "One focused automation, scoped, built, and handed over production-ready.",
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
          _type: "pricingProjectTier",
          name: "Connected systems build",
          price: "$8K – $20K",
          timeline: "4–10 weeks",
          tagline:
            "Multiple workflows operating as one cohesive system across your stack.",
          featured: true,
          deliverables: [
            "Full operational architecture and data model",
            "3–8 workflows sharing a common data layer",
            "CRM integration and contact data design",
            "Custom API integrations and webhook handlers",
            "Observability, alerting, and error management",
            "60 days post-launch support",
          ],
          paymentNote:
            "40% at kickoff, 30% at mid-build review, 30% at launch.",
        },
        {
          _type: "pricingProjectTier",
          name: "AI platform build",
          price: "$20K+",
          timeline: "2–5 months",
          tagline:
            "Custom AI infrastructure, agents, internal tools, or a full operations rebuild.",
          deliverables: [
            "Custom LLM agents built on Claude or GPT-4",
            "MCP server setup and AI tool infrastructure",
            "Full-stack development, Django, FastAPI, React",
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
      label: "Retainer pricing, three monthly tiers",
      description:
        "Month-to-month engagements structured around output, not seat time. Each tier reflects a different level of operational involvement.",
      tiers: [
        {
          _type: "pricingRetainerTier",
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
          _type: "pricingRetainerTier",
          name: "Iterate",
          price: "$5K",
          hours: "~20 hrs/month",
          tagline:
            "Active improvement across your stack each month, not just upkeep.",
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
          _type: "pricingRetainerTier",
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
          _type: "pricingEngagementStep",
          step: "Step 01",
          title: "Discovery first",
          description:
            "Every engagement starts with a paid audit. We map your current operations, identify the highest-leverage automation opportunities, and produce a written scope. You know exactly what you're getting before any build begins.",
        },
        {
          _type: "pricingEngagementStep",
          step: "Step 02",
          title: "Fixed scope, defined delivery",
          description:
            "The scope document from discovery becomes the contract. Deliverables, timelines, and payment milestones are agreed upfront. There are no change orders for work that falls within the original scope.",
        },
        {
          _type: "pricingEngagementStep",
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
      primaryCta: cta("Book a discovery call", "/contact#book"),
      secondaryCta: cta("See what we build", "/services"),
    },
    seo: {
      title: "Pricing, AgileMorph Solutions",
      description:
        "Straightforward engagements and predictable outcomes. Fixed-scope project pricing and monthly retainer tiers for AI automation and digital operations.",
    },
  };
}

function buildBlogIndexPage() {
  return {
    _id: "blogIndexPage",
    _type: "blogIndexPage",
    eyebrow: "Startups, Design, Technology",
    heading: "AgileMorph Blogs",
    description:
      "View the latest stories, insights and our development experiences.",
    seo: {
      title: "Blog",
      description:
        "View the latest stories, insights and development experiences from AgileMorph.",
    },
  };
}

function buildServicesIndexPage() {
  return {
    _id: "servicesIndexPage",
    _type: "servicesIndexPage",
    hero: {
      eyebrow: "What we do",
      heading: "Services built for modern operations",
      description:
        "AI automation is our core practice, with seven specializations plus marketing, virtual assistance, and web development when you need the full stack.",
    },
    cta: {
      heading: "Not sure where to start?",
      description:
        "Book a discovery call and we'll map the highest-impact automation and supporting services for your team.",
      button: cta("Get in Touch", "/contact#book"),
    },
    seo: {
      title: "Services | AgileMorph Solutions",
      description:
        "Explore AgileMorph services, AI automation, agents, workflow integrations, digital marketing, virtual assistance, and web development.",
    },
  };
}

function buildSiteSettings() {
  return {
    _id: "siteSettings",
    _type: "siteSettings",
    siteTitle: "AGILEMORPH | Digital Accelerators",
    siteDescription:
      "We improve operational efficiency with AI automation, build reliable websites, and support growth through digital marketing and virtual assistance.",
    navLinks: [
      { _type: "navLink", label: "About", href: "/about" },
      { _type: "navLink", label: "Blogs", href: "/blog" },
      { _type: "navLink", label: "Pricing", href: "/pricing" },
      { _type: "navLink", label: "Contact", href: "/contact" },
    ],
    footerQuickLinks: [
      { _type: "navLink", label: "About Us", href: "/about" },
      { _type: "navLink", label: "Contact Us", href: "/contact" },
    ],
    socialLinks: [
      {
        _type: "socialLink",
        label: "LinkedIn",
        url: "https://www.linkedin.com/company/agilemorph/",
        platform: "linkedin",
      },
      {
        _type: "socialLink",
        label: "Instagram",
        url: "https://www.instagram.com/agilemorph/",
        platform: "instagram",
      },
      {
        _type: "socialLink",
        label: "Facebook",
        url: "https://www.facebook.com/agilemorph",
        platform: "facebook",
      },
    ],
    newsletterHeading: "Stay in the loop",
    newsletterDescription:
      "Get insights on AI automation, digital operations, and product delivery.",
  };
}

async function mutateDocuments({ projectId, dataset, token, documents }) {
  const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mutations: documents.map((doc) => ({
        createOrReplace: doc,
      })),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Seed failed: ${response.status} ${text}`);
  }
}

async function main() {
  const env = loadEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = getAuthToken({ preferCli: true });
  const manifest = loadManifest();

  const documents = [
    buildHomepage(manifest),
    buildAboutPage(manifest),
    buildContactPage(),
    buildPricingPage(),
    buildBlogIndexPage(),
    buildServicesIndexPage(),
    buildSiteSettings(),
    ...buildServicePages(manifest),
    ...buildBlogPosts(manifest),
  ];

  console.log(`Seeding ${documents.length} documents...`);
  await mutateDocuments({ projectId, dataset, token, documents });
  console.log("Seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
