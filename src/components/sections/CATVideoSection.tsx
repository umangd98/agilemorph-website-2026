import Link from "next/link";

export function CATVideoSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-12 lg:gap-16">
          
          {/* LEFT CONTENT */}
          <div className="w-full md:w-[44%] lg:w-[43%]">
            <div className="max-w-xl">
              {/* Eyebrow */}
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#15803d]">
                AI Content Management
              </span>

              {/* Heading */}
              <h2 className="mt-4 text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-black sm:text-4xl lg:text-[42px]">
                A smarter way to manage your content workflow
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-lg text-base leading-7 text-black/60 sm:text-[17px]">
                See how CAT brings research, planning, content creation,
                reviews, revisions, and publishing together in one connected
                workflow.
              </p>

              {/* FEATURES */}
              <div className="mt-7 space-y-3">
                {/* Feature 1 */}
                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#15803d]/10">
                    <svg
                      className="h-3 w-3 text-[#15803d]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.416 0l-3.25-3.25a1 1 0 111.414-1.42l2.543 2.544 6.543-6.544a1 1 0 011.416 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>

                  <span className="text-sm font-medium text-black/70">
                    Centralized content workflow
                  </span>
                </div>

                {/* Feature 2 */}
                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#15803d]/10">
                    <svg
                      className="h-3 w-3 text-[#15803d]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.416 0l-3.25-3.25a1 1 0 111.414-1.42l2.543 2.544 6.543-6.544a1 1 0 011.416 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>

                  <span className="text-sm font-medium text-black/70">
                    AI-powered content production
                  </span>
                </div>

                {/* Feature 3 */}
                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#15803d]/10">
                    <svg
                      className="h-3 w-3 text-[#15803d]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.416 0l-3.25-3.25a1 1 0 111.414-1.42l2.543 2.544 6.543-6.544a1 1 0 011.416 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>

                  <span className="text-sm font-medium text-black/70">
                    Faster publishing and collaboration
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8">
                <Link
                  href="/products/ai-content-management"
                  className="inline-flex items-center rounded-lg bg-[#15803d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#166534]"
                >
                  Explore CAT
                  <span className="ml-2 text-base" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT VIDEO */}
          <div className="flex w-full items-center justify-center md:w-[56%] md:justify-end">
            <div className="w-full max-w-[620px]">
              <div className="overflow-hidden rounded-2xl border border-black/10 bg-black shadow-[0_12px_35px_rgba(15,23,42,0.10)]">
                <video
                  className="block aspect-video w-full object-cover"
                  src="/videos/cat-content-management.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="auto"
                  aria-label="CAT AI Content Management demonstration"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}