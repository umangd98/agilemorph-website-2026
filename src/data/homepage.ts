export const heroData = {
  heading: "Let AI seamlessly elevate your brand.",
  body: "We put AI at the core of how your business operates, with",
  highlightTags: [
    { label: "AI Automation", href: "/services/ai-automation" },
    { label: "Web Development", href: "/services/web-development" },
    { label: "AI Agents", href: "/services/ai-agents" },
  ],
  bodySuffix:
    "that handle the decisions your team shouldn't have to make twice.",
  ctaPrimary: { label: "Get in Touch", href: "/contact" },
  ctaSecondary: { label: "Explore Our Services", href: "/services" },
  imagePlaceholder: "Hero — AI-themed team at a digital table",
};

export const processSteps = [
  {
    number: "01",
    title: "Kickstart Your Journey With a Thoughtful Plan",
    description:
      "We start by understanding your goals and planning the steps to bring them to life.",
    bullets: [
      "Collaborative Sprint: Work closely with your team to identify project objectives and scope.",
      "Intensive Planning: Focus on detailed planning and prioritization.",
      "Successful Groundwork: Lay the foundation for a successful agile transformation.",
    ],
    illustrationLabel: "Illustration: Person planning at a digital board",
  },
  {
    number: "02",
    title: "Innovate with every step forward.",
    description:
      "We build and refine your solution step by step, based on your feedback.",
    bullets: [
      "Iterative Development: Central to our process for continuous improvement.",
      "Agile Principles: Embrace the agile manifesto to adapt and refine solutions.",
      "Rapid Feedback Loops: Ensure every iteration aligns with your evolving needs.",
    ],
    illustrationLabel: "Illustration: Person working at a large desk",
  },
  {
    number: "03",
    title: "Agility at Its Best, Results Guaranteed",
    description:
      "We deliver results quickly and adapt to your needs as they evolve.",
    bullets: [
      "Agile Principles: Leverage agile methodologies for prompt and efficient solutions.",
      "Adaptibility: Address changes and challenges with a flexible approach.",
      "Seamless Evolution: Ensure the project evolves smoothly to meet milestones.",
    ],
    illustrationLabel: "Illustration: Rocket launching from a digital screen",
  },
];

export const valueProps = [
  {
    icon: "lightbulb",
    title: "Innovation",
    body: "Pioneering solutions that push boundaries and drive progress.",
  },
  {
    icon: "handshake",
    title: "Professionalism",
    body: "Delivering quality with integrity and a commitment to excellence.",
  },
  {
    icon: "user-check",
    title: "Expertise",
    body: "Leveraging deep knowledge to create impactful, tailored solutions.",
  },
];

export const stats = [
  { value: "100+", label: "Successful Projects" },
  { value: "50+", label: "Satisfied clients and growing" },
  { value: "3+", label: "Years of experience" },
  { value: "5+", label: "Countries Represented by Our Talent" },
  { value: "10,000+", label: "Hours of dedication and counting" },
  { value: "100,000+", label: "Cups of coffee and counting" },
];

export const testimonials = [
  {
    id: "t1",
    quote:
      "It was a pleasure working alongside Umang and his team at AgileMorph Solutions. Our collaboration resulted in the development of an in-house software solution that had a profound impact on our operational efficiency at Dhaninfo. Collaborating with AgileMorph Solutions has been an enriching experience, and I wholeheartedly recommend their services to any company seeking transformative solutions.",
    name: "Sarvesh Agrawal",
    company: "Dhaninfo",
    avatarPlaceholder: "Sarvesh Agrawal headshot",
  },
  {
    id: "t2",
    quote:
      "Umang has consistently demonstrated leadership qualities and a great positive attitude in working with others in team settings. I'm very happy to recommend Umang for any leadership roles in the fields of engineering.",
    name: "David Zaretsky",
    company: "Snips Media & Northwestern University",
    avatarPlaceholder: "David Zaretsky headshot",
  },
  {
    id: "t3",
    quote:
      "Umang is a very dedicated, talented and hardworking coder. His passion for solving problems using computer science is unmatched.",
    name: "Shashi Bhushan Kumar",
    company: "Interview Kickstart",
    avatarPlaceholder: "Shashi Bhushan Kumar headshot",
  },
];

export const featuredService = {
  eyebrow: "+ PRIMARY SERVICE",
  title: "AI Automation",
  description:
    "We design, build, and run AI systems that remove manual work from your business. Agents that act, workflows that never sleep, and infrastructure built to scale. From first audit to live production.",
  stats: [
    { value: "10,000+", label: "Hours of automation shipped" },
    { value: "40%+", label: "Average reduction in manual operations time" },
    { value: "24/7", label: "Systems running continuously without downtime" },
  ],
};

export const services = [
  {
    id: "content-pipelines",
    title: "Content Pipelines",
    description:
      "Queued generation workflows for marketing content, structured for AEO and GEO visibility.",
    href: "/services/ai-automation",
    featured: false,
  },
  {
    id: "ai-agents",
    title: "AI Agents",
    description:
      "Production-ready agents built on Claude, OpenClaw, Hermes, NemoClaw, and other model stacks.",
    href: "/services/ai-automation",
    featured: true,
  },
  {
    id: "mcp-servers",
    title: "Custom MCP Servers",
    description:
      "Model Context Protocol integrations built directly into your apps and workflows.",
    href: "/services/ai-automation",
    featured: false,
  },
  {
    id: "workflow-automation",
    title: "Workflow Automation",
    description:
      "No-code and low-code pipelines with n8n, Make, and Zapier that connect your stack.",
    href: "/services/ai-automation",
    featured: false,
  },
];

export const servicesCallout = {
  value: "24/7",
  label: "Systems running continuously without downtime",
};

export const additionalServices = [
  {
    id: "web-dev",
    title: "Web Development",
    description:
      "Python, Django, FastAPI, and React builds that hold up in production.",
    href: "/services/web-development",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description: "SEO, content, and social strategy driven by data, not guesswork.",
    href: "/services/digital-marketing",
  },
  {
    id: "virtual-assistance",
    title: "Virtual Assistance",
    description: "Trained assistants who handle the operational load you shouldn't.",
    href: "/services/virtual-assistance",
  },
  {
    id: "bookkeeping",
    title: "Bookkeeping",
    description: "Reliable, partially automated financial management you can trust.",
    href: "/services/bookkeeping",
  },
];
