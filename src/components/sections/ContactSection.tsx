"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Mail, Phone } from "lucide-react";

import { CalendlyBookButton } from "@/components/CalendlyBookButton";
import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import {
  CALENDLY_DISCOVERY_DESCRIPTION,
  CALENDLY_DISCOVERY_TITLE,
} from "@/lib/calendly";
import { openCalendlyPopup } from "@/lib/calendly-widget";
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

  useEffect(() => {
    if (window.location.hash !== "#book") return;
    void openCalendlyPopup();
  }, []);

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

          <AnimateOnScroll delay={150} className="min-w-0">
            <div id="book" className="scroll-mt-28">
              <div className="mb-6 flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    Book a discovery call
                  </h2>
                  <p className="mt-1 font-body text-sm font-semibold text-primary">
                    {CALENDLY_DISCOVERY_TITLE}
                  </p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                    {CALENDLY_DISCOVERY_DESCRIPTION}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-8 text-center">
                <CalendlyBookButton className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-body text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-95">
                  Book a slot
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </CalendlyBookButton>
                <p className="mt-4 font-body text-xs text-muted-foreground">
                  Opens the Calendly booking screen in a popup.
                </p>
              </div>
            </div>

            {faqs.length ? (
              <div className="mt-12">
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
              </div>
            ) : null}
          </AnimateOnScroll>
        </div>
      </Container>
    </section>
  );
}
