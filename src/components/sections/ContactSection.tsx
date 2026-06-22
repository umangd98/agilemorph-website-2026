"use client";

import { useState } from "react";
import { Mail, Phone } from "lucide-react";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import type { FaqItem } from "@/sanity/types";

type ContactSectionProps = {
  heading: string;
  description?: string;
  phone?: string;
  email?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  faqs?: FaqItem[];
};

export function ContactSection({
  heading,
  description,
  phone,
  email,
  linkedinUrl,
  facebookUrl,
  faqs = [],
}: ContactSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-background py-section max-sm:py-section-sm" aria-labelledby="contact-heading">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14">
          <AnimateOnScroll className="min-w-0">
            <h1 id="contact-heading" className="mb-4 font-heading text-5xl font-extrabold text-foreground">
              {heading}
            </h1>
            {description ? (
              <p className="mb-8 max-w-xl font-body text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}

            <div className="mb-10 space-y-4">
              {phone ? (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 font-body text-foreground transition-colors hover:text-primary"
                >
                  <Phone size={18} className="text-primary" />
                  {phone}
                </a>
              ) : null}
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 font-body text-foreground transition-colors hover:text-primary"
                >
                  <Mail size={18} className="text-primary" />
                  {email}
                </a>
              ) : null}
            </div>

            <div className="flex gap-4">
              {linkedinUrl ? (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border px-4 py-2 font-body text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  LinkedIn
                </a>
              ) : null}
              {facebookUrl ? (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border px-4 py-2 font-body text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  Facebook
                </a>
              ) : null}
            </div>

            <form
              className="mt-10 space-y-4 rounded-2xl border border-border bg-surface p-6"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="First Name *"
                  className="rounded-lg border border-border bg-background px-4 py-3 font-body text-sm"
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  className="rounded-lg border border-border bg-background px-4 py-3 font-body text-sm"
                />
              </div>
              <input
                type="email"
                placeholder="Email Address *"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-sm"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-sm"
              />
              <input
                type="text"
                placeholder="Company Name *"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-sm"
              />
              <textarea
                placeholder="Message"
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-sm"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-6 py-3 font-body text-sm font-bold text-white transition-colors hover:bg-primary-dark"
              >
                Send Message
              </button>
            </form>
          </AnimateOnScroll>

          {faqs.length ? (
            <AnimateOnScroll delay={150}>
              <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">FAQs</h2>
              <div className="space-y-3">
                {faqs.map((faq, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div key={faq.question} className="rounded-xl border border-border bg-surface">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-5 py-4 text-left font-heading text-base font-semibold text-foreground"
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                      >
                        {faq.question}
                        <span className="text-primary">{isOpen ? "−" : "+"}</span>
                      </button>
                      {isOpen ? (
                        <div className="border-t border-border px-5 py-4 font-body text-sm leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </AnimateOnScroll>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
