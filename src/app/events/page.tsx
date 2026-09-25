import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import DigiMarConImage from "../../../media/events/DigiMarCon.png";
import MAICONConImage from "../../../media/events/MAICON.png";


export const metadata: Metadata = {
  title: "Events | AgileMorph",
  description:
    "Meet AgileMorph at the events shaping the future of AI, automation, and digital marketing.",
};

const events = [
  {
    title: "DIGIMARCON MID-ATLANTIC & NORTHEAST 2026",
    date: "October 8-9, 2026",
    location: "Philadelphia, Pennsylvania",
    venue: "Live! Casino & Hotel Philadelphia",
    description:
      "We’re joining DigiMarCon to connect with marketing and technology leaders exploring AI, automation, customer engagement, and digital growth.",
    secondaryDescription:
      "Let’s talk about how AI is changing the way businesses market, engage, and grow.",
    href: "https://digimarconmidatlantic.com/",
    label: "DigiMarCon",
    number: "01",
    image: DigiMarConImage.src,
  },
  {
    title: "MAICON 2026",
    date: "October 13-15, 2026",
    location: "Cleveland, Ohio",
    venue: "Huntington Convention Center of Cleveland",
    description:
      "We’re heading to MAICON to connect with leaders putting AI into practice across marketing and business operations.",
    secondaryDescription:
      "Let’s talk AI agents, workflow automation, and practical ways to turn AI into business solutions.",
    href: "https://www.marketingaiinstitute.com/events/marketing-artificial-intelligence-conference",
    label: "MAICON",
    number: "02",
    image: MAICONConImage.src,

  },
];

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4.5"
        width="18"
        height="17"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 2.5V6.5M16 2.5V6.5M3 9H21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M7.5 13H9.5M11.5 13H13.5M15.5 13H17.5M7.5 17H9.5M11.5 17H13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 10.2C20 15.2 12 21 12 21S4 15.2 4 10.2C4 5.9 7.58 3 12 3C16.42 3 20 5.9 20 10.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="12"
        cy="10"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function VenueIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 21V9L12 4L20 9V21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M8 21V14H16V21M3 21H21M8 9H8.01M12 9H12.01M16 9H16.01"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

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

function ExternalLinkIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 5H19V10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M19 5L12 12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M19 14V18C19 19.1 18.1 20 17 20H6C4.9 20 4 19.1 4 18V7C4 5.9 4.9 5 6 5H10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <SiteNavbar />

      <main>
        {/* =========================================================
            HERO
        ========================================================== */}
        <section className="relative overflow-hidden bg-[#0b1710] text-white">
          {/* Background grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          {/* Green glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-[-250px] h-[700px] w-[900px] -translate-x-1/2 rounded-full blur-3xl"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(circle, rgba(21,128,61,0.38) 0%, rgba(21,128,61,0.12) 40%, transparent 72%)",
            }}
          />

          {/* Decorative circles */}
          <div
            className="pointer-events-none absolute -left-52 top-1/2 h-[620px] w-[620px] -translate-y-1/2 rounded-full border border-white/[0.06]"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -right-52 top-1/2 h-[620px] w-[620px] -translate-y-1/2 rounded-full border border-white/[0.06]"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-32">
            <div className="grid items-center gap-14 lg:grid-cols-[1fr_420px]">
              {/* Hero content */}
              <div className="max-w-4xl">
                {/* Eyebrow */}
                <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#4ade80]/25 bg-[#4ade80]/10 px-4 py-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ade80] opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
                  </span>

                  <span className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-[#d1fae5]">
                    Meet AgileMorph
                  </span>
                </div>

                {/* Heading */}
                <h1 className="font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[82px]">
                  Where{" "}
                  <span className="text-[#4ade80]">AI</span> Meets
                  <br />
                  <span className="text-white">Business.</span>
                </h1>

                <p className="mt-8 max-w-2xl font-body text-lg leading-8 text-[#cbd5d1] sm:text-xl">
                  Join us at the industry events bringing together the people,
                  ideas, and technologies shaping the next era of AI,
                  automation, and digital growth.
                </p>

                {/* Hero event indicators */}
                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
                    <span className="font-body text-sm font-medium text-white">
                      Philadelphia
                    </span>
                  </div>

                  <div className="hidden h-5 w-px bg-white/15 sm:block" />

                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
                    <span className="font-body text-sm font-medium text-white">
                      Cleveland
                    </span>
                  </div>

                  <div className="hidden h-5 w-px bg-white/15 sm:block" />

                  <div className="font-body text-sm font-medium text-[#94a3a0]">
                    October 2026
                  </div>
                </div>
              </div>

              {/* Hero event visual */}
              <div className="relative hidden lg:block">
                <div className="relative mx-auto aspect-square max-w-[390px]">
                  {/* Outer circle */}
                  <div className="absolute inset-0 rounded-full border border-[#4ade80]/20" />

                  <div className="absolute inset-[32px] rounded-full border border-white/[0.08]" />

                  <div className="absolute inset-[70px] rounded-full border border-[#4ade80]/15" />

                  {/* Center */}
                  <div className="absolute inset-[105px] flex flex-col items-center justify-center rounded-full bg-[#13241a] shadow-[0_0_80px_rgba(74,222,128,0.12)]">
                    <span className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-[#4ade80]">
                      Events
                    </span>

                    <span className="mt-2 font-heading text-5xl font-semibold tracking-[-0.05em] text-white">
                      2026
                    </span>

                    <span className="mt-2 text-xs text-[#94a3a0]">
                      AI • Automation • Growth
                    </span>
                  </div>

                  {/* Floating labels */}
                  <div className="absolute right-0 top-[18%] rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 backdrop-blur-md">
                    <span className="font-body text-xs font-medium text-white">
                      DigiMarCon
                    </span>
                  </div>

                  <div className="absolute bottom-[18%] left-0 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 backdrop-blur-md">
                    <span className="font-body text-xs font-medium text-white">
                      MAICON
                    </span>
                  </div>

                  {/* Dots */}
                  <span className="absolute left-[20%] top-[20%] h-2 w-2 rounded-full bg-[#4ade80]" />

                  <span className="absolute bottom-[22%] right-[24%] h-1.5 w-1.5 rounded-full bg-[#4ade80]" />

                  <span className="absolute bottom-[12%] left-[42%] h-1.5 w-1.5 rounded-full bg-white/40" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#15803d] to-transparent" />
        </section>

        {/* =========================================================
            EVENTS
        ========================================================== */}
        <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
            {/* Section intro */}
            <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-1 w-12 rounded-full bg-[#15803d]" />

                  <span className="font-body text-xs font-bold uppercase tracking-[0.18em] text-[#15803d]">
                    Upcoming Events
                  </span>
                </div>

                <h2 className="font-heading text-4xl font-semibold tracking-[-0.045em] text-[#111111] sm:text-5xl lg:text-6xl">
                  See You in October
                </h2>

                <p className="mt-5 max-w-2xl font-body text-lg leading-8 text-[#64748b]">
                  We’re heading to Philadelphia and Cleveland to connect with
                  industry leaders, share ideas, and explore what’s next in AI
                  and automation.
                </p>
              </div>

              <div className="shrink-0">
                <span className="font-heading text-7xl font-semibold leading-none tracking-[-0.06em] text-[#15803d]/10 sm:text-8xl">
                  02
                </span>
              </div>
            </div>

            {/* =====================================================
                EVENT CARDS
            ====================================================== */}
            <div className="space-y-18">
              {events.map((event) => (
                <article
                  key={event.title}
                  className="group relative overflow-hidden rounded-[28px] border border-black/[0.09] bg-white shadow-[0_10px_45px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#15803d]/25 hover:shadow-[0_20px_60px_rgba(21,128,61,0.11)]"
                >
                  <div className="grid lg:grid-cols-[42%_58%]">
                    {/* Image side */}
                    <div className="relative min-h-[330px] overflow-hidden lg:min-h-[470px]">
                      <img
                        src={event.image}
                        alt={`${event.label} event`}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07110a]/90 via-[#07110a]/25 to-transparent" />

                      {/* Number */}
                      <div className="absolute left-7 top-7 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20 font-body text-sm font-semibold text-white backdrop-blur-md">
                        {event.number}
                      </div>

                      {/* Image label */}
                      <div className="absolute bottom-7 left-7 right-7">
                        <div className="mb-3 font-body text-[10px] font-bold uppercase tracking-[0.22em] text-[#86efac]">
                          AI • Automation • Business
                        </div>

                        <div className="font-heading text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl">
                          {event.label}
                        </div>
                      </div>
                    </div>

                    {/* Content side */}
                    <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-11">
                      <div>
                        {/* Event type */}
                        <div className="mb-5 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[#15803d]" />

                          <span className="font-body text-xs font-bold uppercase tracking-[0.17em] text-[#15803d]">
                            Upcoming Event
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="max-w-2xl font-heading text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#111111] sm:text-4xl">
                          {event.title}
                        </h3>

                        {/* Event details */}
                        <div className="mt-8 grid gap-5 border-y border-black/[0.07] py-7 sm:grid-cols-2">
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 shrink-0 text-[#15803d]">
                              <CalendarIcon />
                            </span>

                            <div>
                              <div className="mb-1 font-body text-[10px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
                                Date
                              </div>

                              <div className="font-body text-[15px] font-medium leading-6 text-[#334155]">
                                {event.date}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 shrink-0 text-[#15803d]">
                              <LocationIcon />
                            </span>

                            <div>
                              <div className="mb-1 font-body text-[10px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
                                Location
                              </div>

                              <div className="font-body text-[15px] font-medium leading-6 text-[#334155]">
                                {event.location}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 sm:col-span-2">
                            <span className="mt-0.5 shrink-0 text-[#15803d]">
                              <VenueIcon />
                            </span>

                            <div>
                              <div className="mb-1 font-body text-[10px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
                                Venue
                              </div>

                              <div className="font-body text-[15px] font-medium leading-6 text-[#334155]">
                                {event.venue}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="mt-7 space-y-4">
                          <p className="font-body text-[15px] leading-7 text-[#64748b]">
                            {event.description}
                          </p>

                          <p className="font-body text-[15px] font-medium leading-7 text-[#334155]">
                            {event.secondaryDescription}
                          </p>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-9">
                        <Link
                          href={event.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[#15803d] px-6 py-3.5 font-body text-sm font-semibold text-white transition-all duration-200 hover:bg-[#166534] hover:shadow-[0_8px_25px_rgba(21,128,61,0.25)]"
                        >
                          <span>Explore the Event</span>
                          <ArrowIcon />
                          <ExternalLinkIcon />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Bottom hover accent */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#15803d] transition-all duration-500 group-hover:w-full" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            LET'S CONNECT
        ========================================================== */}
        <section className="px-6 pb-20 sm:px-8 sm:pb-24 lg:px-10 lg:pb-28">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[26px] bg-[#0d1b12]">
            {/* Background glow */}
            <div
              className="pointer-events-none absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full blur-3xl"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(circle, rgba(21,128,61,0.32) 0%, rgba(21,128,61,0.08) 50%, transparent 72%)",
              }}
            />

            <div
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              aria-hidden="true"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
              }}
            />

            <div className="relative flex flex-col gap-8 px-7 py-12 sm:px-10 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:px-14">
              {/* Text */}
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#4ade80]" />

                  <span className="font-body text-xs font-bold uppercase tracking-[0.17em] text-[#86efac]">
                    Let’s Connect
                  </span>
                </div>

                <h2 className="font-heading text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                  Going to DigiMarCon or MAICON?
                </h2>

                <p className="mt-4 max-w-2xl font-body text-base leading-7 text-[#a7b5ad] sm:text-lg">
                  Let’s meet, exchange ideas, and talk about what AI and
                  automation could mean for your business.
                </p>
              </div>

              {/* CTA */}
              <div className="shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 rounded-full bg-[#4ade80] px-7 py-4 font-body text-sm font-bold text-[#09200f] transition-all duration-200 hover:bg-[#86efac] hover:shadow-[0_10px_30px_rgba(74,222,128,0.2)]"
                >
                  <span>Get In Touch</span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            {/* Bottom line */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#4ade80]/40 to-transparent" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}