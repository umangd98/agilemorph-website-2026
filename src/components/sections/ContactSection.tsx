"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  HelpCircle,
  Mail,
  MessageSquare,
  Share2,
  Phone,
} from "lucide-react";

import { CalendlyBookButton } from "@/components/CalendlyBookButton";
import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { openCalendlyPopup } from "@/lib/calendly-widget";
import { CONTACT_FORM_NAME, submitNetlifyForm } from "@/lib/netlify-forms";
import type { ContactPage, FaqItem } from "@/sanity/types";

type DiscoveryCallContent = NonNullable<ContactPage["discoveryCall"]>;

type ContactSectionProps = {
  heading: string;
  description?: string;
  phone?: string;
  email?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  discoveryCall?: DiscoveryCallContent;
  faqs?: FaqItem[];
};

const defaultDiscoveryCall: Required<DiscoveryCallContent> = {
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
};

const inputClassName =
  "w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-body text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span className="text-primary" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

function SectionCardHeader({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border px-6 py-5 sm:px-7">
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 font-body text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

function ContactMethodCard({
  href,
  icon,
  label,
  value,
  external,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
      className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-all hover:border-primary/35 hover:bg-mint/40"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-body text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className="mt-1 block truncate font-body text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {value}
        </span>
      </span>
    </a>
  );
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
    >
      {children}
    </a>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
    </svg>
  );
}

export function ContactSection({
  heading,
  description,
  phone,
  email,
  linkedinUrl,
  facebookUrl,
  discoveryCall,
  faqs = [],
}: ContactSectionProps) {
  const booking = { ...defaultDiscoveryCall, ...discoveryCall };
  const bookingBullets = booking.bullets?.length ? booking.bullets : defaultDiscoveryCall.bullets;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [formError, setFormError] = useState<string | null>(null);
  const formId = useId();

  useEffect(() => {
    if (window.location.hash !== "#book") return;
    void openCalendlyPopup();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("submitted") === "true") {
      setFormStatus("success");
    }
  }, []);

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("submitting");
    setFormError(null);

    const result = await submitNetlifyForm(event.currentTarget);

    if (result.ok) {
      event.currentTarget.reset();
      setFormStatus("success");
      return;
    }

    setFormStatus("error");
    setFormError(result.error);
  }

  const hasSocial = Boolean(linkedinUrl || facebookUrl);

  return (
    <section
      className="relative overflow-hidden bg-background py-section max-sm:py-section-sm"
      aria-labelledby="contact-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-background to-primary/5"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative">
        <AnimateOnScroll className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-body text-xs font-bold uppercase tracking-widest text-primary">
            Get in touch
          </p>
          <h1
            id="contact-heading"
            className="mb-5 font-heading text-4xl font-extrabold text-foreground sm:text-5xl"
          >
            {heading}
          </h1>
          {description ? (
            <p className="font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
        </AnimateOnScroll>

        <div className="mt-10 space-y-8 sm:mt-12 lg:space-y-10">
          {(phone || email || hasSocial) && (
            <AnimateOnScroll delay={80}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {phone ? (
                  <ContactMethodCard
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    icon={<Phone size={18} />}
                    label="Call us"
                    value={phone}
                  />
                ) : null}
                {email ? (
                  <ContactMethodCard
                    href={`mailto:${email}`}
                    icon={<Mail size={18} />}
                    label="Email us"
                    value={email}
                  />
                ) : null}
                {hasSocial ? (
                  <div className="flex h-full items-center gap-4 rounded-2xl border border-border bg-surface p-5 md:col-span-2 xl:col-span-1">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Share2 size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="block font-body text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Follow us
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {linkedinUrl ? (
                          <SocialButton href={linkedinUrl} label="LinkedIn">
                            <LinkedInIcon />
                          </SocialButton>
                        ) : null}
                        {facebookUrl ? (
                          <SocialButton href={facebookUrl} label="Facebook">
                            <FacebookIcon />
                          </SocialButton>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </AnimateOnScroll>
          )}

          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
            <AnimateOnScroll className="flex min-w-0 lg:col-span-7">
              <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <SectionCardHeader
                  icon={<MessageSquare size={18} />}
                  title="Send a message"
                  subtitle="We typically respond within one business day."
                />

                <form
                  id={formId}
                  name={CONTACT_FORM_NAME}
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  className="flex flex-1 flex-col space-y-5 px-6 py-6 sm:px-7 sm:py-7"
                  onSubmit={handleContactSubmit}
                >
                  <input type="hidden" name="form-name" value={CONTACT_FORM_NAME} />
                  <p className="hidden" aria-hidden="true">
                    <label>
                      Don&apos;t fill this out if you&apos;re human:{" "}
                      <input name="bot-field" tabIndex={-1} autoComplete="off" />
                    </label>
                  </p>

                  {formStatus === "success" ? (
                    <div
                      className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 font-body text-sm text-foreground"
                      role="status"
                      aria-live="polite"
                    >
                      Thanks for reaching out. We&apos;ll get back to you within one business day.
                    </div>
                  ) : null}

                  {formStatus === "error" && formError ? (
                    <div
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-foreground"
                      role="alert"
                      aria-live="assertive"
                    >
                      {formError}
                    </div>
                  ) : null}

                  <fieldset
                    className="contents"
                    disabled={formStatus === "submitting" || formStatus === "success"}
                  >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField label="First name" required>
                      <input
                        type="text"
                        name="firstName"
                        autoComplete="given-name"
                        required
                        placeholder="Jane"
                        className={inputClassName}
                      />
                    </FormField>
                    <FormField label="Last name" required>
                      <input
                        type="text"
                        name="lastName"
                        autoComplete="family-name"
                        required
                        placeholder="Smith"
                        className={inputClassName}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField label="Email address" required>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        placeholder="you@company.com"
                        className={inputClassName}
                      />
                    </FormField>
                    <FormField label="Phone number">
                      <input
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        placeholder="+1 (555) 000-0000"
                        className={inputClassName}
                      />
                    </FormField>
                  </div>

                  <FormField label="Company name" required>
                    <input
                      type="text"
                      name="company"
                      autoComplete="organization"
                      required
                      placeholder="Your company"
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField label="How can we help?">
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="Tell us about your project, goals, or timeline."
                      className={`${inputClassName} min-h-32 resize-y`}
                    />
                  </FormField>
                  </fieldset>

                  <div className="mt-auto flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-body text-xs text-muted-foreground">
                      Fields marked with <span className="text-primary">*</span> are required.
                    </p>
                    {formStatus === "success" ? (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-body text-sm font-bold text-foreground transition-colors hover:border-primary/35 hover:bg-primary/5"
                        onClick={() => setFormStatus("idle")}
                      >
                        Send another message
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={formStatus === "submitting"}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-body text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {formStatus === "submitting" ? "Sending…" : "Send message"}
                        <ArrowRight size={15} />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={120} className="flex min-w-0 lg:col-span-5">
              <div
                id="book"
                className="scroll-mt-28 flex w-full flex-col overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-primary/8 via-surface to-mint/50 shadow-sm"
              >
                <SectionCardHeader
                  icon={<CalendarDays size={18} />}
                  title={booking.title}
                  subtitle={booking.subtitle}
                />

                <div className="flex flex-1 flex-col space-y-5 px-6 py-6 sm:px-7 sm:py-7">
                  <p className="font-body text-sm leading-relaxed text-muted-foreground">
                    {booking.description}
                  </p>

                  {booking.availabilityNote ? (
                    <p className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 font-body text-sm font-medium text-foreground">
                      {booking.availabilityNote}
                    </p>
                  ) : null}

                  <ul className="space-y-3">
                    {bookingBullets.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 font-body text-sm text-foreground"
                      >
                        <Clock3 size={15} className="mt-0.5 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto border-t border-primary/10 pt-5">
                    <CalendlyBookButton className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-body text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark active:scale-[0.99]">
                      {booking.ctaLabel}
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </CalendlyBookButton>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {faqs.length ? (
            <AnimateOnScroll delay={160}>
              <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <SectionCardHeader
                  icon={<HelpCircle size={18} />}
                  title="FAQs"
                  subtitle="Quick answers before you reach out."
                />

                <div className="divide-y divide-border px-6 sm:px-7">
                  {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    const panelId = `contact-faq-panel-${index}`;

                    return (
                      <div key={faq.question}>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between gap-4 py-4 text-left font-heading text-base font-semibold text-foreground transition-colors hover:text-primary"
                          onClick={() => setOpenIndex(isOpen ? null : index)}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            size={18}
                            className={`shrink-0 text-primary transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isOpen ? (
                          <div
                            id={panelId}
                            className="pb-4 font-body text-sm leading-relaxed text-muted-foreground"
                          >
                            {faq.answer}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimateOnScroll>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
