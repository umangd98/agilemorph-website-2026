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
    throw new Error("media-manifest.json not found. Run scripts/upload-media.mjs first.");
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
    description: "We deliver results quickly and adapt to your needs as they evolve.",
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
    image: item.imageKey ? imageRef(manifest, item.imageKey, item.name) : undefined,
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
        { text: "AI business automation", href: "/services" },
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
      image: imageRef(manifest, "2026/06/ChatGPT-Image-May-28-2026-04_56_56-PM.png", "AgileMorph hero"),
    },
    process: {
      heading: "The Way We Work",
      subheading: "We empower businesses to thrive with innovative digital solutions.",
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
          icon: imageRef(manifest, "2025/01/Services_Icon_03.svg", "Digital Marketing"),
        },
        {
          _type: "serviceCard",
          title: "Virtual Assistance",
          description:
            "We are dedicated to providing top-tier virtual assistant services that cater to businesses of all sizes.",
          href: "/services/virtual-assistance",
          icon: imageRef(manifest, "2025/01/Services_Icon_04.svg", "Virtual Assistance"),
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
    },
    stats: {
      eyebrow: "By The Numbers",
      heading: "Results You Can Measure",
      items: [
        { _type: "stat", value: "100+", label: "Successful Projects" },
        { _type: "stat", value: "50+", label: "Satisfied clients and growing" },
        { _type: "stat", value: "3+", label: "Years of experience" },
        { _type: "stat", value: "5+", label: "Countries Represented by Our Talent" },
        { _type: "stat", value: "10,000+", label: "Hours of dedication and counting" },
        { _type: "stat", value: "100,000+", label: "Cups of coffee and counting" },
      ],
    },
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
        "We revolutionize efficiency with AI Automation, craft impactful experiences through Web Development, and amplify influence via Digital Marketing.",
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
        "Empowering businesses with agile solutions, innovative technology, and a customer-first approach to thrive in the digital era. Where agility meets transformation—so your next breakthrough isn't trapped in \"someday.\"",
      cta: cta("Explore Our Services", "/services"),
    },
    about: {
      heading: "AgileMorph Solutions",
      body:
        "Agile because we sprint, iterate and out‑learn the market. Morph because we turn raw ideas into living, revenue‑ready systems that keep adapting as you grow. Born out of the AI research labs at Northwestern University, AgileMorph Solutions has become the execution partner for leaders who refuse to let operational chaos cap their growth.\n\nThe result? Marketing teams regain mornings, ops teams end days with zero backlog, and owners rediscover their excitement as the AI we build turns yesterday's messy workflows into today's autonomous engines. When you choose AgileMorph, you're not buying code—you're investing in a proven system that converts inefficiency into momentum and curiosity into measurable ROI.",
      promiseHeading: "Our Promise",
      promise:
        "Whether you need a lightning‑fast landing page, a machine‑learning engine, or 100 tiny automations that quietly triple team capacity, we will deliver more, deliver earlier, and keep morphing until it feels like magic.",
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
        icon: imageRef(manifest, "2025/01/SealCheck.svg", "Quality-Driven Solutions"),
      },
      {
        _type: "companyValue",
        title: "Commitment to Innovation",
        description:
          "Staying ahead in the ever-changing digital landscape to provide cutting-edge solutions for modern challenges.",
        icon: imageRef(manifest, "2025/01/Brain.svg", "Commitment to Innovation"),
      },
      {
        _type: "companyValue",
        title: "Tailored Partnerships",
        description:
          "Partnering with businesses to create meaningful impact and provide customized services that meet unique needs.",
        icon: imageRef(manifest, "2025/01/Handshake.svg", "Tailored Partnerships"),
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
      subheading: "We empower businesses to thrive with innovative digital solutions.",
      steps: buildProcessSteps(manifest),
    },
    stats: [
      { _type: "stat", value: "100+", label: "Successful Projects" },
      { _type: "stat", value: "50+", label: "Satisfied clients and growing" },
      { _type: "stat", value: "10k+", label: "Hours of dedication and counting" },
      { _type: "stat", value: "5+", label: "Countries Represented by Our Talent" },
    ],
    cta: {
      heading: "Transforming Ideas into Impactful Journeys",
      description:
        "Partner with AgileMorph to unlock your organization's potential. From startups to enterprises, we're here to drive your digital transformation.",
      button: cta("Explore Our Services", "/services"),
    },
    founder: {
      eyebrow: "Meet Our Founder",
      heading: "Behind the Wonder - full ideas and Brilliant Breakthrough Innovations",
      name: "Umang Dhandhania",
      role: "CEO at AgileMorph",
      bio:
        "A Northwestern‑educated engineer renowned for turning complex business puzzles into clear, revenue‑lifting systems. Known for pairing analytical rigor with infectious energy, over the past decade he has guided more than 100 companies through streamlined launches, process overhauls, and market‑ready product builds that routinely beat timelines and KPIs.\n\nHis mission for AgileMorph is simple: give every ambitious team—regardless of size—the tools to move faster, think bigger, and compete on a global stage.\n\nWhen you work with AgileMorph, you're tapping into the curiosity of a researcher, the precision of an engineer, and the drive of a founder who lives to turn complexity into compounding growth.",
      image: imageRef(manifest, "2025/03/umang-founder.png", "Umang Dhandhania"),
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
      heroImage: imageRef(manifest, "2025/09/AI-Automation-Development-Services.jpg", "AI Automation"),
      heroCta: cta("Start Your AI Journey", "/contact"),
      capabilitiesHeading: "Core Capabilities",
      capabilities: [
        {
          _type: "capabilityItem",
          title: "AI Agents",
          description:
            "Autonomous agents that classify, decide, and act across your tools.",
          icon: "⬡",
        },
        {
          _type: "capabilityItem",
          title: "Workflow Automation",
          description: "n8n, Make, and Zapier pipelines that eliminate repetitive work.",
          icon: "⟳",
        },
        {
          _type: "capabilityItem",
          title: "CRM & Lead Automation",
          description: "Capture, enrich, route, and follow up on every lead automatically.",
          icon: "◎",
        },
        {
          _type: "capabilityItem",
          title: "MCP & AI Infrastructure",
          description: "Self-hosted pipelines, MCP servers, and production-grade deployments.",
          icon: "⧉",
        },
        {
          _type: "capabilityItem",
          title: "Messaging Automation",
          description: "WhatsApp, email, and chat automations that respond and convert.",
          icon: "✉",
        },
        {
          _type: "capabilityItem",
          title: "AI Audit",
          description:
            "A fixed-scope review that maps where AI saves you the most time and money.",
          icon: "◷",
        },
        {
          _type: "capabilityItem",
          title: "Shopify Automation",
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
      technologiesHeading: "Automation Tools & Technologies",
      technologies: [
        "n8n",
        "Zapier",
        "Make.com",
        "OpenAI",
        "Google Cloud",
        "AWS",
        "Python",
        "WordPress",
        "Shopify",
        "HubSpot",
        "Pipedrive",
        "Notion",
        "SalesForce",
      ].map((name) => ({ _type: "technologyItem", name })),
      cta: {
        heading: "Ready to Automate your Success?",
        description: "Let's shape your business future with intelligent AI-driven automations.",
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
      tagline: "Transform Your Digital Presence with Custom Website Development",
      description:
        "Python, Django, FastAPI, and React builds that hold up in production.",
      heroImage: imageRef(manifest, "2025/03/Website-Design-and-Development.svg", "Website Development"),
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
          description: "We develop websites with SEO best practices in mind from day one.",
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
            "Our partnership doesn't end at launch—we provide continued support and maintenance.",
          animationType: "professionalism",
          highlights: ["Post-launch care", "Long-term support"],
        }),
      ],
      technologiesHeading: "Technologies",
      technologies: ["API", "JavaScript", "HTML", "PHP", "WordPress", "Joomla"].map((name) => ({
        _type: "technologyItem",
        name,
      })),
      cta: {
        heading: "Ready to Build Your Website?",
        description: "Let's create a digital presence that drives growth for your business.",
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
      tagline: "Elevate Your Brand with Our Comprehensive Digital Marketing Solutions",
      description: "SEO, content, and social strategy driven by data, not guesswork.",
      heroImage: imageRef(manifest, "2025/03/Social-Media-Marketing.svg", "Digital Marketing"),
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
          description: "Tailored marketing solutions that fit your specific needs.",
          animationType: "generic",
          highlights: ["Tailored plans", "Your audience"],
        }),
        whyUsItem({
          title: "Data-Driven Insights",
          description: "Leverage analytics to refine and optimize your campaigns.",
          animationType: "expertise",
          highlights: ["Analytics-led", "Measurable ROI"],
        }),
        whyUsItem({
          title: "Experienced Team",
          description: "Work with industry experts who are committed to your success.",
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
        description: "Let's build a digital marketing strategy that delivers measurable results.",
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
      tagline: "Maximize Efficiency with Our Comprehensive Virtual Assistant Solutions",
      description:
        "Trained assistants who handle the operational load you shouldn't.",
      heroImage: imageRef(manifest, "2025/03/Administrative-Support.svg", "Virtual Assistance"),
      heroCta: cta("Get in Touch", "/contact"),
      capabilitiesHeading: "Our Virtual Assistance Services",
      capabilities: [
        {
          _type: "capabilityItem",
          title: "Content Creation and Management",
          description:
            "Content creation is an essential part of today's digital landscape—we handle it for you.",
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
            "Keeping up with social media demands can be time-consuming—we manage it for you.",
        },
        {
          _type: "capabilityItem",
          title: "Calendar and Scheduling",
          description:
            "Staying organized is crucial for running a successful business—we keep your schedule on track.",
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
          description: "With a global team, our services are available around the clock.",
          animationType: "partnership",
          highlights: ["Global team", "Always on"],
          animationLabels: ["Morning", "Day", "Night"],
        }),
      ],
      technologiesHeading: "Tools We Use",
      technologies: ["Notion", "Google Workspace", "Slack", "Trello", "Asana"].map((name) => ({
        _type: "technologyItem",
        name,
      })),
      cta: {
        heading: "Ready to Boost Your Productivity?",
        description: "Let our virtual assistants handle the tasks so you can focus on what matters.",
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
      slug: { _type: "slug", current: "newsletter-consistency-without-burning-out" },
      excerpt:
        "Introduction: Why Newsletter Consistency is Harder Than It Looks. When I first started running a newsletter, I believed the hardest part would be writing.",
      publishedAt: "2025-09-01T10:00:00.000Z",
      categories: ["Business Process Optimization"],
      coverImage: imageRef(manifest, "2025/09/Automated-Newsletter-Workflow.png", "Newsletter workflow"),
    },
    {
      _id: "blogPost-intent-based-prospecting",
      _type: "blogPost",
      title: "The Future of Lead Generation: Why Intent-Based Prospecting Beats Volume Every Time",
      slug: { _type: "slug", current: "intent-based-prospecting-beats-volume" },
      excerpt:
        "For years, B2B lead generation was treated as a numbers game. Buy a big list. Send thousands of emails.",
      publishedAt: "2025-09-15T10:00:00.000Z",
      categories: ["Artificial Intelligence", "Data Analytics"],
      coverImage: imageRef(manifest, "2025/09/AI-Driven-Lead-Generation.png", "Lead generation"),
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
      coverImage: imageRef(manifest, "2025/09/Custom-Software-Integration-Services.jpg", "CRM integrations"),
    },
  ];
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
