import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

export const metadata: Metadata = {
  title: "AI Content Management Platform for Agencies & Teams | AgileMorph",
  description:
    "Turn hours of content work into minutes with CAT, an AI-powered content automation system built for agencies and teams.",
};

/* ============================================================
   WORKFLOW DATA
============================================================ */

const workflowSteps = [
  {
    number: "01",
    title: "Research",
    description:
      "Turn your content goals, business priorities, audience needs, and search opportunities into actionable research.",
    icon: "research",
  },
  {
    number: "02",
    title: "Planning",
    description:
      "Turn your research and business priorities into structured content plans that keep your team focused.",
    icon: "planning",
  },
  {
    number: "03",
    title: "Outlines",
    description:
      "Generate detailed content outlines in seconds, giving your team a strong foundation before writing begins.",
    icon: "outlines",
  },
  {
    number: "04",
    title: "Drafts",
    description:
      "Generate high-quality, relevant content using your brand information, USPs, guidelines, and requirements.",
    icon: "drafts",
  },
  {
    number: "05",
    title: "Reviews",
    description:
      "Share content with decision-makers for review, feedback, and approval while keeping everything organized.",
    icon: "reviews",
  },
  {
    number: "06",
    title: "Feedback",
    description:
      "Keep comments, suggestions, and approval notes connected directly to the content being reviewed.",
    icon: "feedback",
  },
  {
    number: "07",
    title: "Revisions",
    description:
      "Turn feedback into focused revisions without repeating the entire content production process.",
    icon: "revisions",
  },
  {
    number: "08",
    title: "Publishing",
    description:
      "Move approved content toward publishing and keep your content activity organized from one platform.",
    icon: "publishing",
  },
];

const businessKnowledge = [
  "USPs",
  "Brand guidelines",
  "Do's and don’ts",
  "Content preferences",
  "Feedback",
];

const impactItems = [
  {
    title: "Save Time",
    description:
      "Reduce repetitive content tasks and manual coordination.",
    icon: "clock",
  },
  {
    title: "Create Faster",
    description:
      "Generate quality content in minutes, not hours.",
    icon: "bolt",
  },
  {
    title: "Maintain Quality",
    description:
      "Keep your brand, USPs, and guidelines in every workflow.",
    icon: "quality",
  },
  {
    title: "Scale Output",
    description:
      "Produce more content without increasing the workload.",
    icon: "scale",
  },
];

const faqs = [
  {
    question: "What is an AI content management platform?",
    answer:
      "It's a single system that handles the full content lifecycle, including keyword and outline planning, AI-assisted draft generation, quality review, and publishing status, for multiple clients or content lines at once, replacing scattered spreadsheets and documents.",
  },
  {
    question: "Does it replace human writers and editors?",
    answer:
      "No. It handles repetitive planning and drafting work, including outline structuring, first-draft generation, and SEO scoring. Hence, writers and editors spend their time refining and approving instead of starting from a blank page.",
  },
  {
    question: "Can each client have their own tone and style guidelines?",
    answer:
      "Yes. Each client profile stores its own voice, tone, target audience, markets, and content rules, which apply automatically to every outline and draft generated for that account.",
  },
  {
    question: "How is content quality measured?",
    answer:
      "Every outline and draft receives an AI SEO score based on factors like search intent match, depth, clarity, structure, and originality, so quality is measurable before publishing, not just judged after the fact.",
  },
  {
    question:
      "Is this built for agencies with multiple clients, or just one team?",
    answer:
      "Both. The platform is designed around multi-client management, including status tracking, monthly content commitments, and account-level dashboards, but works equally well for a single in-house content team.",
  },
];

/* ============================================================
   COMMON ICONS
============================================================ */

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12H19M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 12.2L10.7 15L16.2 9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================================
   WORKFLOW ICONS
============================================================ */

function WorkflowMiniIcon({
  type,
}: {
  type:
    | "research"
    | "planning"
    | "outlines"
    | "drafts"
    | "reviews"
    | "feedback"
    | "revisions"
    | "publishing";
}) {
  if (type === "research") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle
          cx="13.5"
          cy="13.5"
          r="7"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M19 19L25.5 25.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M11 13.5H16M13.5 11V16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "planning") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect
          x="6"
          y="7"
          width="20"
          height="19"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M10 5V9M22 5V9M6 12H26"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M11 17H15M18 17H22M11 21H15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "outlines") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M8 6H24V26H8V6Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M12 11H20M12 16H20M12 21H17"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="10" cy="11" r="0.8" fill="currentColor" />
        <circle cx="10" cy="16" r="0.8" fill="currentColor" />
        <circle cx="10" cy="21" r="0.8" fill="currentColor" />
      </svg>
    );
  }

  if (type === "drafts") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M7 23.5V26H9.5L24.5 11L21.5 8L6.5 23L7 23.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M19.5 10L22.5 13"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M10 13H16M10 17H14"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "reviews") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M6 7H26V22H15L9 26V22H6V7Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M11 12H21M11 17H18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M20 18L22 20L25 16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "feedback") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M7 8H25V21H15L10 25V21H7V8Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M11 13H21M11 17H18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle
          cx="22"
          cy="8"
          r="4"
          fill="white"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M20.5 8H23.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "revisions") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M8 9H22C24.2 9 26 10.8 26 13C26 15.2 24.2 17 22 17H12"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M12 13L8 17L12 21"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 22H10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M6 25H26"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9 22V8H23V22"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 18L16 14L19 16L24 11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 11H24V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================================
   IMPACT ICON
============================================================ */

function ImpactIcon({
  type,
}: {
  type: "clock" | "bolt" | "quality" | "scale";
}) {
  if (type === "clock") {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle
          cx="14"
          cy="14"
          r="9"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M14 9V14L17 16"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "bolt") {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M16 4L7 16H13L12 24L21 12H15L16 4Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "quality") {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M14 4L22 7V13C22 18.2 18.7 22.3 14 24C9.3 22.3 6 18.2 6 13V7L14 4Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M10 14L12.5 16.5L18 11"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        d="M6 21L11 16L15 19L22 11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 11H22V16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function AIContentManagementPage() {
  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <SiteNavbar />

      <main>
        {/* ============================================================
            HERO
        ============================================================ */}

        <section className="relative min-h-[680px] overflow-hidden border-b border-black/[0.06] bg-[#f5faf7]">
          <div
            className="absolute inset-0 opacity-80"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(17,17,17,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.045) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />

          <div
            className="absolute left-[12%] top-[-180px] h-[650px] w-[650px] rounded-full blur-3xl"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(circle, rgba(21,128,61,0.13) 0%, rgba(21,128,61,0.035) 52%, transparent 72%)",
            }}
          />

          <div
            className="absolute right-[-120px] top-[100px] h-[520px] w-[520px] rounded-full blur-3xl"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(circle, rgba(21,128,61,0.10) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:px-10 lg:pb-28 lg:pt-24">
            <div className="mb-10 flex items-center gap-2 font-body text-xs text-[#64748b]">
              <Link
                href="/services"
                className="transition-colors hover:text-[#15803d]"
              >
                Services
              </Link>

              <span>/</span>

              <span className="text-[#15803d]">
                AI Content Management
              </span>
            </div>

            <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
              <div className="relative z-10">
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#15803d]/20 bg-white/70 px-4 py-2 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-[#15803d] shadow-[0_0_0_5px_rgba(21,128,61,0.08)]" />

                  <span className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-[#15803d]">
                    AI Content Management
                  </span>
                </div>

                <h1 className="max-w-2xl font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[72px]">
                  Turn Hours of Content Work{" "}
                  <span className="text-[#15803d]">Into Minutes</span>
                </h1>

                <p className="mt-7 max-w-2xl font-body text-lg leading-8 text-[#475569] sm:text-xl">
                  Meet CAT, your AI-powered content automation system.
                </p>

                <p className="mt-3 max-w-2xl font-body text-base leading-7 text-[#64748b] sm:text-lg">
                  CAT handles the repetitive work behind content production,
                  helping your team create high-quality content faster, with
                  less effort and fewer manual steps.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="#cat-workflow"
                    className="group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-[#15803d] px-7 font-body text-sm font-semibold text-white shadow-[0_10px_25px_rgba(21,128,61,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#166534] hover:shadow-[0_15px_35px_rgba(21,128,61,0.24)]"
                  >
                    See CAT in Action

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowIcon />
                    </span>
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full border border-black/[0.12] bg-white/80 px-7 font-body text-sm font-semibold text-[#111111] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#15803d]/30 hover:text-[#15803d]"
                  >
                    Book a Demo
                    <ArrowIcon />
                  </Link>
                </div>
              </div>

              {/* RIGHT ANIMATED VISUAL */}

              <div className="relative z-10 mx-auto w-full max-w-[620px]">
                <div className="absolute -right-2 -top-7 z-20 hidden rounded-full border border-[#15803d]/15 bg-white px-4 py-2 shadow-[0_8px_25px_rgba(15,23,42,0.08)] sm:flex sm:items-center sm:gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#15803d]" />

                  <span className="font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-[#334155]">
                    CAT is working
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-[30px] border border-black/[0.09] bg-white/85 p-5 shadow-[0_25px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-7">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-50"
                    aria-hidden="true"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(21,128,61,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,0.045) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between border-b border-black/[0.07] pb-5">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#15803d]" />

                        <span className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-[#475569]">
                          CAT CONTENT AUTOMATION
                        </span>
                      </div>

                      <span className="rounded-full bg-[#15803d]/[0.08] px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[#15803d]">
                        AI Working
                      </span>
                    </div>

                    <div className="mt-7 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-3">
                      <div className="rounded-2xl border border-black/[0.08] bg-[#f8faf9] p-4 text-center">
                        <div className="font-body text-[10px] font-bold uppercase tracking-[0.15em] text-[#15803d]">
                          Your Input
                        </div>

                        <div className="mt-4 space-y-2">
                          {[
                            "Content Brief",
                            "Keywords",
                            "Brand Context",
                          ].map((item) => (
                            <div
                              key={item}
                              className="rounded-lg border border-black/[0.07] bg-white px-2 py-2 font-body text-xs text-[#475569]"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-1 text-[#15803d]">
                        <span className="workflow-dot h-2 w-2 rounded-full bg-[#15803d]" />
                        <ArrowIcon />
                      </div>

                      <div className="relative rounded-2xl border border-[#15803d]/20 bg-[#15803d]/[0.045] p-4 text-center">
                        <div className="font-body text-[10px] font-bold uppercase tracking-[0.15em] text-[#15803d]">
                          CAT AI
                        </div>

                        <div className="mt-4 space-y-2">
                          {["Plan", "Create", "SEO Score"].map((item) => (
                            <div
                              key={item}
                              className="rounded-lg border border-[#15803d]/15 bg-white px-2 py-2 font-body text-xs text-[#475569]"
                            >
                              {item}
                            </div>
                          ))}
                        </div>

                        <span className="absolute -right-1.5 -top-1.5 h-3 w-3 animate-ping rounded-full bg-[#15803d]/40" />
                        <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#15803d]" />
                      </div>

                      <div className="flex flex-col items-center gap-1 text-[#15803d]">
                        <span
                          className="workflow-dot h-2 w-2 rounded-full bg-[#15803d]"
                          style={{ animationDelay: "0.8s" }}
                        />
                        <ArrowIcon />
                      </div>

                      <div className="rounded-2xl border border-black/[0.08] bg-[#f8faf9] p-4 text-center">
                        <div className="font-body text-[10px] font-bold uppercase tracking-[0.15em] text-[#15803d]">
                          Your Output
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="rounded-lg border border-black/[0.07] bg-white px-2 py-2 font-body text-xs text-[#475569]">
                            AI Draft
                          </div>

                          <div className="rounded-lg border border-black/[0.07] bg-white px-2 py-2 font-body text-xs text-[#475569]">
                            Quality Score
                          </div>

                          <div className="rounded-lg border border-[#15803d]/20 bg-[#15803d]/[0.06] px-2 py-2 font-body text-xs font-semibold text-[#15803d]">
                            Review
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 rounded-xl border border-black/[0.07] bg-[#f8faf9] p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-body text-xs font-medium text-[#64748b]">
                          Content workflow
                        </span>

                        <span className="font-body text-xs font-semibold text-[#15803d]">
                          86% complete
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8eee9]">
                        <div className="workflow-progress h-full w-[86%] rounded-full bg-[#15803d]" />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-[#f8faf9] p-3 text-center">
                        <div className="font-heading text-lg font-semibold">
                          6
                        </div>

                        <div className="font-body text-[9px] uppercase tracking-[0.1em] text-[#64748b]">
                          Stages
                        </div>
                      </div>

                      <div className="rounded-xl bg-[#f8faf9] p-3 text-center">
                        <div className="font-heading text-lg font-semibold text-[#15803d]">
                          AI
                        </div>

                        <div className="font-body text-[9px] uppercase tracking-[0.1em] text-[#64748b]">
                          Powered
                        </div>
                      </div>

                      <div className="rounded-xl bg-[#f8faf9] p-3 text-center">
                        <div className="font-heading text-lg font-semibold">
                          Less
                        </div>

                        <div className="font-body text-[9px] uppercase tracking-[0.1em] text-[#64748b]">
                          Manual Work
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-4 hidden w-[210px] rounded-2xl border border-black/[0.08] bg-white p-4 shadow-[0_15px_40px_rgba(15,23,42,0.12)] sm:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#15803d]/[0.08] text-[#15803d]">
                      <CheckIcon />
                    </div>

                    <div>
                      <p className="font-body text-xs font-semibold text-[#111111]">
                        AI Draft ready
                      </p>

                      <p className="mt-0.5 font-body text-[10px] text-[#64748b]">
                        Ready for review
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            PROBLEM
        ============================================================ */}

        <section className="bg-white py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
            <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
              <div>
                <div className="mb-6 h-1 w-12 rounded-full bg-[#15803d]" />

                <h2 className="max-w-xl font-heading text-4xl font-semibold leading-[1.2] tracking-[-0.045em] sm:text-5xl">
                  Content Creation Takes More Time Than It Should
                </h2>
              </div>

              <div>
                <p className="font-body text-lg leading-8 text-[#475569]">
                  Creating quality content involves a long list of manual
                  tasks.
                </p>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    "Research",
                    "Planning",
                    "Outlines",
                    "Drafts",
                    "Reviews",
                    "Feedback",
                    "Revisions",
                    "Publishing",
                  ].map((item) => (
                    <div
                      key={item}
                      className="group flex min-h-[58px] items-center justify-center rounded-2xl border border-black/[0.08] bg-[#f7f9f7] px-3 py-3 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#15803d]/25 hover:bg-[#15803d]/[0.05]"
                    >
                      <span className="font-body text-sm font-medium text-[#475569] transition-colors group-hover:text-[#15803d]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-7 font-body text-lg leading-8 text-[#475569]">
                  CAT brings these steps into one AI-powered workflow,
                  reducing repetitive work and helping your team move from
                  idea to finished content faster.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            CAT VIDEO
        ============================================================ */}

        <section className="bg-white pb-20 sm:pb-24 lg:pb-28">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
            <div className="relative overflow-hidden rounded-[30px] border border-black/[0.08] bg-[#f5f8f6] p-3 shadow-[0_20px_60px_rgba(15,23,42,0.07)] sm:p-4 lg:p-5">
              {/* Decorative green glow */}
              <div
                className="pointer-events-none absolute -right-32 -top-32 h-[380px] w-[380px] rounded-full blur-3xl"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(circle, rgba(21,128,61,0.13), transparent 70%)",
                }}
              />

              <div
                className="pointer-events-none absolute -bottom-40 -left-32 h-[380px] w-[380px] rounded-full blur-3xl"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(circle, rgba(21,128,61,0.08), transparent 70%)",
                }}
              />

              <div className="relative overflow-hidden rounded-[24px] border border-black/[0.08] bg-black shadow-[0_15px_45px_rgba(15,23,42,0.10)]">
                <video
                  className="block aspect-video w-full object-cover"
                  src="/videos/cat-content-management.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>

                {/* Video label */}
                {/* <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2.5 backdrop-blur-md">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#15803d]" />

                  <span className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-black">
                    CAT in Action
                  </span>
                </div> */}
              </div>

              {/* Video information */}
              <div className="relative flex flex-col gap-4 px-2 pb-1 pt-5 sm:flex-row sm:items-center sm:justify-between sm:px-3 sm:pt-6">
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-[#15803d]">
                    See how CAT works
                  </p>

                  <p className="mt-1 max-w-3xl font-body text-sm leading-6 text-[#64748b]">
                    See how CAT brings research, planning, creation, review,
                    and publishing into one streamlined workflow.
                  </p>
                </div>

                <div className="shrink-0 rounded-full border border-[#15803d]/15 bg-white px-4 py-2.5 font-body text-xs font-semibold text-[#15803d]">
                  AI-powered content workflow
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            WORKFLOW
        ============================================================ */}

        <section
          id="cat-workflow"
          className="relative overflow-hidden bg-[#f5f8f6] py-20 sm:py-24 lg:py-28"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(21,128,61,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 flex justify-center">
                <span className="h-1 w-12 rounded-full bg-[#15803d]" />
              </div>

              <h2 className="font-heading text-4xl font-semibold leading-[1.2] tracking-[-0.045em] sm:text-5xl">
                One Platform for Your Entire Content Workflow
              </h2>

              <p className="mt-5 font-body text-lg leading-8 text-[#64748b]">
                CAT brings every stage of content production together.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {workflowSteps.map((step) => (
                <article
                  key={step.number}
                  className="group rounded-[24px] border border-black/[0.08] bg-white p-7 shadow-[0_8px_30px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[#15803d]/25 hover:shadow-[0_18px_45px_rgba(21,128,61,0.10)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#15803d]/[0.07] text-[#15803d] transition-all duration-300 group-hover:bg-[#15803d] group-hover:text-white">
                      <WorkflowMiniIcon
                        type={
                          step.icon as
                            | "research"
                            | "planning"
                            | "outlines"
                            | "drafts"
                            | "reviews"
                            | "feedback"
                            | "revisions"
                            | "publishing"
                        }
                      />
                    </div>

                    <span className="font-body text-xs font-bold tracking-[0.15em] text-[#15803d]/45">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-7 font-heading text-[18px] font-semibold leading-8 tracking-[-0.015em]">
                    {step.title}
                  </h3>

                  <p className="mt-3 font-body text-[15px] leading-7 text-[#64748b]">
                    {step.description}
                  </p>

                  <div className="mt-7 h-px w-10 bg-[#15803d]/25 transition-all duration-500 group-hover:w-full" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            BUSINESS KNOWLEDGE
        ============================================================ */}

        <section className="bg-white py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
              <div>
                <div className="mb-6 h-1 w-12 rounded-full bg-[#15803d]" />

                <h2 className="font-heading text-4xl font-semibold leading-[1.2] tracking-[-0.045em] sm:text-5xl">
                  AI That Knows{" "}
                  <span className="text-[#15803d]">Your Business</span>
                </h2>

                <p className="mt-6 max-w-xl font-body text-lg leading-8 text-[#475569]">
                  CAT works with your business context so content production
                  stays aligned with the requirements your team already uses.
                </p>
              </div>

              <div className="rounded-[28px] border border-black/[0.08] bg-[#f6faf7] p-6 sm:p-8">
                <p className="font-body text-xs font-bold uppercase tracking-[0.15em] text-[#15803d]">
                  CAT understands your
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {businessKnowledge.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-black/[0.07] bg-white px-4 py-4 transition-all duration-300 hover:border-[#15803d]/20 hover:shadow-sm"
                    >
                      <span className="text-[#15803d]">
                        <CheckIcon />
                      </span>

                      <span className="font-body text-sm font-medium text-[#334155]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            IMPACT
        ============================================================ */}

        <section className="relative overflow-hidden bg-[#111111] py-20 text-white sm:py-24 lg:py-28">
          <div
            className="pointer-events-none absolute left-1/2 top-[-250px] h-[600px] w-[800px] -translate-x-1/2 rounded-full blur-3xl"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(circle, rgba(21,128,61,0.22), transparent 68%)",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 flex justify-center">
                <span className="h-1 w-12 rounded-full bg-[#15803d]" />
              </div>

              <h2 className="font-heading text-4xl font-semibold leading-[1.2] tracking-[-0.045em] sm:text-5xl">
                The CAT Impact
              </h2>

              <p className="mt-5 font-body text-lg text-white/60">
                Save time. Create faster. Deliver better content.
              </p>
            </div>

            <div className="mt-14 grid overflow-hidden rounded-[26px] border border-white/[0.10] sm:grid-cols-2 lg:grid-cols-4">
              {impactItems.map((item) => (
                <article
                  key={item.title}
                  className="group border-white/[0.08] bg-[#111111] p-7 transition-all duration-300 hover:bg-[#15803d] lg:border-r last:border-r-0"
                >
                  <div className="mb-7 flex h-11 w-11 items-center justify-center rounded-xl bg-[#15803d]/10 text-[#15803d] transition-all duration-300 group-hover:bg-white group-hover:text-[#15803d]">
                    <ImpactIcon
                      type={
                        item.icon as "clock" | "bolt" | "quality" | "scale"
                      }
                    />
                  </div>

                  <h3 className="font-heading text-[18px] font-semibold leading-8 tracking-[-0.015em]">
                    {item.title}
                  </h3>

                  <p className="mt-4 font-body text-[15px] leading-7 text-white/55 group-hover:text-white/80">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            COLLABORATION
        ============================================================ */}

        <section className="bg-white py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
            <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
              <div className="relative">
                <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-[#15803d]/[0.07]" />

                <div className="relative rounded-[28px] border border-black/[0.08] bg-[#f5f8f6] p-6 shadow-[0_15px_45px_rgba(15,23,42,0.06)] sm:p-8">
                  <div className="flex items-center justify-between border-b border-black/[0.07] pb-5">
                    <div>
                      <p className="font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[#15803d]">
                        CAT Review
                      </p>

                      <p className="mt-1 font-heading text-xl font-semibold">
                        Content Approval
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#15803d] text-white">
                      <CheckIcon />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {[
                      "Content created",
                      "Team reviewed",
                      "Feedback added",
                      "Revisions completed",
                      "Approved for publishing",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3.5"
                      >
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                            index === 4
                              ? "bg-[#15803d] text-white"
                              : "bg-[#15803d]/[0.07] text-[#15803d]"
                          }`}
                        >
                          <CheckIcon />
                        </div>

                        <span className="font-body text-sm text-[#475569]">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-6 h-1 w-12 rounded-full bg-[#15803d]" />

                <h2 className="font-heading text-4xl font-semibold leading-[1.2] tracking-[-0.045em] sm:text-5xl">
                  Keep Everyone in the{" "}
                  <span className="text-[#15803d]">Loop</span>
                </h2>

                <p className="mt-6 max-w-xl font-body text-lg leading-8 text-[#475569]">
                  CAT brings your content team and decision-makers into the
                  same review workflow.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-2">
                  {["Review", "Comment", "Refine", "Approve"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-full border border-black/[0.08] bg-[#f7f9f7] px-4 py-2.5"
                      >
                        <span className="font-body text-sm font-medium text-[#334155]">
                          {item}
                        </span>

                        {index < 3 && (
                          <span className="text-[#15803d]">
                            <ArrowIcon />
                          </span>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            CTA
        ============================================================ */}

        <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-[30px] border border-black/[0.10] bg-[#f4f4f2]">
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(21,128,61,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,0.04) 1px, transparent 1px)",
                  backgroundSize: "42px 42px",
                }}
              />

              <div
                className="pointer-events-none absolute left-1/2 top-[-260px] h-[550px] w-[700px] -translate-x-1/2 rounded-full blur-3xl"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(circle, rgba(21,128,61,0.10), transparent 70%)",
                }}
              />

              <div className="relative px-6 py-16 text-center sm:px-12 sm:py-20 lg:px-20 lg:py-[72px]">
                <div className="mx-auto max-w-3xl">
                  <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-[#15803d]" />

                  <h2 className="font-heading text-4xl font-semibold leading-[1.2] tracking-[-0.045em] sm:text-5xl">
                    Ready To{" "}
                    <span className="text-[#15803d]">Transform</span> Your
                    Content Workflow?
                  </h2>

                  <p className="mx-auto mt-5 max-w-2xl font-body text-lg leading-8 text-[#475569]">
                    See how CAT can help your team reduce repetitive work,
                    create content faster, and keep your entire workflow in
                    one place.
                  </p>

                  <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                      href="/contact"
                      className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#15803d] px-7 font-body text-sm font-semibold text-white shadow-[0_10px_25px_rgba(21,128,61,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#166534] hover:shadow-[0_15px_35px_rgba(21,128,61,0.22)]"
                    >
                      Book Your Call

                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowIcon />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                "AI Agents",
                "CRM & Lead Automation",
                "MCP & AI Infrastructure",
                "Messaging Automation",
                "AI Audit",
                "Shopify Automation",
              ].map((item) => (
                <Link
                  key={item}
                  href="/services"
                  className="rounded-full border border-black/[0.09] bg-white px-4 py-2.5 font-body text-xs font-medium text-[#64748b] transition-all duration-200 hover:border-[#15803d]/25 hover:text-[#15803d]"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            FAQ
        ============================================================ */}

        <section className="bg-[#f5f8f6] py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-5xl px-6 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 flex justify-center">
                <span className="h-1 w-12 rounded-full bg-[#15803d]" />
              </div>

              <h2 className="font-heading text-4xl font-semibold leading-[1.2] tracking-[-0.045em] sm:text-5xl">
                FAQs
              </h2>

              <p className="mt-5 font-body text-lg leading-8 text-[#64748b]">
                Everything you need to know about CAT and AI-powered content
                management.
              </p>
            </div>

            <div className="mt-12 space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group overflow-hidden rounded-[20px] border border-black/[0.08] bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-6 sm:px-7">
                    <span className="font-heading text-[18px] font-semibold leading-8 tracking-[-0.015em]">
                      {faq.question}
                    </span>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/[0.08] text-[#15803d] transition-transform duration-300 group-open:rotate-45">
                      <span className="text-xl font-light">+</span>
                    </span>
                  </summary>

                  <div className="border-t border-black/[0.06] px-6 pb-6 pt-5 sm:px-7">
                    <p className="font-body text-[15px] leading-7 text-[#64748b]">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* ================================================================
          ANIMATIONS
      ================================================================= */}

      <style>{`
        @keyframes workflowPulse {
          0% {
            opacity: 0.35;
            transform: translateX(0) scale(0.85);
          }

          50% {
            opacity: 1;
            transform: translateX(8px) scale(1);
          }

          100% {
            opacity: 0.35;
            transform: translateX(0) scale(0.85);
          }
        }

        @keyframes progressMove {
          0% {
            width: 68%;
          }

          50% {
            width: 92%;
          }

          100% {
            width: 86%;
          }
        }

        .workflow-dot {
          animation: workflowPulse 1.8s ease-in-out infinite;
        }

        .workflow-progress {
          animation: progressMove 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .workflow-dot,
          .workflow-progress {
            animation: none;
          }
        }

        details summary::-webkit-details-marker {
          display: none;
        }

        details summary {
          list-style: none;
        }
      `}</style>
    </div>
  );
}