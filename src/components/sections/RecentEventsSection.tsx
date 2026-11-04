import Image from "next/image";
import Link from "next/link";

import DigiMarConImage from "../../../media/events/DigiMarCon.png";
import MAICONImage from "../../../media/events/MAICON.png";

import { Container } from "@/components/ui";

const recentEvents = [
  {
    number: "01",
    label: "DigiMarCon",
    title: "DigiMarCon Mid-Atlantic & Northeast 2026",
    date: "October 8-9, 2026",
    location: "Philadelphia, Pennsylvania",
    description:
      "We’re joining DigiMarCon to connect with leaders in AI, automation, customer engagement, and digital growth.",
    image: DigiMarConImage,
    href: "https://digimarconmidatlantic.com/",
  },
  {
    number: "02",
    label: "MAICON",
    title: "MAICON 2026",
    date: "October 13-15, 2026",
    location: "Cleveland, Ohio",
    description:
      "We’re heading to MAICON to connect with leaders putting AI into practice across marketing and business operations.",
    image: MAICONImage,
    href: "https://www.marketingaiinstitute.com/events/marketing-artificial-intelligence-conference",
  },
];

export function RecentEventsSection() {
  return (
    <section
      className="scroll-mt-24 border-t border-line bg-bg py-20 sm:py-24 lg:py-28"
      aria-labelledby="recent-events-heading"
    >
      <Container>
        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="syslabel flex shrink-0 items-center gap-2">
                {/* <span className="tnum text-fg-muted">05</span> */}
                {/* <span aria-hidden className="text-fg-dim">
                  /
                </span> */}
                <span>Recent Events</span>
              </span>

              <span
                aria-hidden
                className="h-px flex-1 bg-line"
              />
            </div>

            <h2
              id="recent-events-heading"
              className="mt-6 text-balance font-heading text-3xl font-medium leading-[1.1] tracking-[-0.02em] text-fg sm:text-4xl lg:text-[2.75rem]"
            >
              Where AI Meets Business
            </h2>

            <p className="mt-5 max-w-2xl text-pretty font-body text-base leading-relaxed text-fg-muted sm:text-lg">
              Meet AgileMorph at the industry events shaping the future of AI,
              automation, and digital growth. Connect with our team, exchange
              ideas, and explore what&apos;s next.
            </p>
          </div>

          {/* View all events */}
          <Link
            href="/events"
            className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-line px-5 py-3 font-body text-sm font-medium text-fg transition-all duration-200 hover:border-signal hover:bg-bg-elevated hover:text-signal"
          >
            <span>View All Events</span>

            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path
                d="M5 12H19M13 6L19 12L13 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* Event Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {recentEvents.map((event) => (
            <article
              key={event.title}
              className="group overflow-hidden rounded-2xl border border-line bg-bg-elevated transition-all duration-300 hover:-translate-y-1 hover:border-signal/30 hover:bg-bg-raised"
            >
              {/* Image */}
              <div className="relative h-[250px] overflow-hidden sm:h-[290px]">
                <Image
                  src={event.image}
                  alt={`${event.label} event`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Event number */}
                <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 font-mono text-xs font-medium text-white backdrop-blur-md">
                  {event.number}
                </div>

                {/* Image content */}
                <div className="absolute bottom-5 left-5 right-5">
                  {/* <div className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#86efac]">
                    AI • Automation • Business
                  </div> */}

                  <h3 className="font-heading text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                    {event.label}
                  </h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-7">
                {/* Event details */}
                <div className="grid gap-4 border-b border-line pb-5 sm:grid-cols-2">
                  <div>
                    <div className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-dim">
                      Date
                    </div>

                    <div className="font-body text-sm font-medium text-fg">
                      {event.date}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-dim">
                      Location
                    </div>

                    <div className="font-body text-sm font-medium text-fg">
                      {event.location}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-5 font-body text-sm leading-7 text-fg-muted">
                  {event.description}
                </p>

                {/* CTA */}
                {/* <div className="mt-6">
                  <Link
                    href={event.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-2 rounded-full bg-signal px-5 py-3 font-body text-sm font-semibold text-white transition-all duration-200 hover:bg-signal-dim"
                  >
                    <span>Explore Event</span>

                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover/link:translate-x-0.5"
                    >
                      <path
                        d="M5 12H19M13 6L19 12L13 18"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div> */}
              </div>

              {/* Bottom hover accent */}
              {/* <div className="h-0.5 w-0 bg-signal transition-all duration-500 group-hover:w-full" /> */}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}