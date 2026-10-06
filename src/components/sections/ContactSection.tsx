"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
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
  title: "Book A Discovery Call",
  subtitle: "Free 15-minute introduction with Umang Dhandhania",
  description:
    "Pick a time that works for you. We'll discuss your goals and whether AgileMorph is the right fit.",
  availabilityNote:
    "The introductory 15-minute call is free. Further work is quoted to scope.",
  bullets: [
    "15-minute video call with our team",
    "Discuss goals, scope, and fit",
    "Leave with clear next steps",
  ],
  ctaLabel: "Book A Slot",
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
      <span className="font-body text-foreground text-sm font-medium">
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
    <div className="border-border flex items-start gap-3 border-b px-6 py-5 sm:px-7">
      <span className="bg-primary/10 text-primary mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
        {icon}
      </span>
      <div className="min-w-0">
        <h2 className="font-heading text-foreground text-xl font-bold sm:text-2xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="font-body text-muted-foreground mt-1 text-sm">
            {subtitle}
          </p>
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
      className="group border-border bg-surface hover:border-primary/35 hover:bg-mint/40 flex h-full items-start gap-4 rounded-2xl border p-5 transition-all"
    >
      <span className="bg-primary/10 text-primary group-hover:bg-primary/15 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-body text-muted-foreground block text-xs font-bold tracking-widest uppercase">
          {label}
        </span>
        <span className="font-body text-foreground group-hover:text-primary mt-1 flex min-h-9 items-center text-sm leading-5 font-semibold transition-colors">
          {value}
        </span>
      </span>
    </a>
  );
}

function ContactSocialCard({
  linkedinUrl,
  facebookUrl,
}: {
  linkedinUrl?: string;
  facebookUrl?: string;
}) {
  return (
    <div className="border-border bg-surface flex h-full items-start gap-4 rounded-2xl border p-5">
      <span className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
        <Share2 size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <span className="font-body text-muted-foreground block text-xs font-bold tracking-widest uppercase">
          Follow us
        </span>
        <div className="mt-1 flex min-h-9 flex-wrap items-center gap-2">
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
      className="border-border bg-background text-muted-foreground hover:border-primary hover:bg-primary/5 hover:text-primary inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors"
    >
      {children}
    </a>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
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
  const bookingBullets = booking.bullets?.length
    ? booking.bullets
    : defaultDiscoveryCall.bullets;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const formId = useId();

  useEffect(() => {
    if (window.location.hash !== "#book") return;
    void openCalendlyPopup();
  }, []);

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("submitting");
    setFormError(null);

    const form = event.currentTarget;
    const result = await submitNetlifyForm(form);

    if (result.ok) {
      form.reset();
      setFormStatus("success");
      return;
    }

    setFormStatus("error");
    setFormError(result.error);
  }

  const hasSocial = Boolean(linkedinUrl || facebookUrl);

  return (
    <section
      className="border-line relative scroll-mt-24 overflow-hidden border-t py-24 sm:py-32"
      aria-labelledby="contact-heading"
    >
      <div
        className="from-primary/10 via-background to-primary/5 pointer-events-none absolute inset-0 bg-linear-to-br"
        aria-hidden="true"
      />
      <div
        className="bg-primary/10 pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative">
        <AnimateOnScroll className="mx-auto max-w-3xl text-center">
          <p className="font-body text-primary mb-4 text-xs font-bold tracking-widest uppercase">
            Get In Touch
          </p>
          <h1
            id="contact-heading"
            className="font-heading text-foreground mb-5 text-4xl font-extrabold sm:text-5xl"
          >
            {heading}
          </h1>
          {description ? (
            <p className="font-body text-muted-foreground text-base leading-relaxed sm:text-lg">
              {description}
            </p>
          ) : null}
        </AnimateOnScroll>

        <div className="mt-10 space-y-8 sm:mt-12 lg:space-y-10">
          {(phone || email || hasSocial) && (
            <AnimateOnScroll delay={80}>
              <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">
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
                  <ContactSocialCard
                    linkedinUrl={linkedinUrl}
                    facebookUrl={facebookUrl}
                  />
                ) : null}
              </div>
            </AnimateOnScroll>
          )}

          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
            <AnimateOnScroll className="flex min-w-0 lg:col-span-7">
              <div className="border-border bg-surface flex w-full flex-col overflow-hidden rounded-2xl border shadow-sm">
                <SectionCardHeader
                  icon={<MessageSquare size={18} />}
                  title="Send A Message"
                  subtitle="Share the business context and the outcome you need."
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
                  <input
                    type="hidden"
                    name="form-name"
                    value={CONTACT_FORM_NAME}
                  />
                  <p className="hidden" aria-hidden="true">
                    <label>
                      Don&apos;t fill this out if you&apos;re human:{" "}
                      <input
                        name="bot-field"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </label>
                  </p>

                  {formStatus === "success" ? (
                    <div
                      className="border-primary/25 bg-primary/10 font-body text-foreground rounded-xl border px-4 py-3 text-sm"
                      role="status"
                      aria-live="polite"
                    >
                      Thanks for reaching out. Your message has been submitted.
                    </div>
                  ) : null}

                  {formStatus === "error" && formError ? (
                    <div
                      className="font-body text-foreground rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm"
                      role="alert"
                      aria-live="assertive"
                    >
                      {formError}
                    </div>
                  ) : null}

                  <fieldset
                    className="contents"
                    disabled={
                      formStatus === "submitting" || formStatus === "success"
                    }
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
                        placeholder="Tell us about the business problem, current tools, desired outcome, and timeline."
                        className={`${inputClassName} min-h-32 resize-y`}
                      />
                    </FormField>
                  </fieldset>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    We use these details to respond to your enquiry. Please
                    avoid sensitive project data.{" "}
                    <Link href="/privacy" className="text-primary underline">
                      Read our privacy notice.
                    </Link>
                  </p>

                  <div className="border-border mt-auto flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-body text-muted-foreground text-xs">
                      Fields marked with <span className="text-primary">*</span>{" "}
                      are required.
                    </p>
                    {formStatus === "success" ? (
                      <button
                        type="button"
                        className="border-border bg-background font-body text-foreground hover:border-primary/35 hover:bg-primary/5 inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-bold transition-colors"
                        onClick={() => setFormStatus("idle")}
                      >
                        Send another message
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={formStatus === "submitting"}
                        className="bg-signal font-body text-bg inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {formStatus === "submitting"
                          ? "Sending…"
                          : "Send message"}
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
                className="border-primary/20 from-primary/8 via-surface to-mint/50 flex w-full scroll-mt-28 flex-col overflow-hidden rounded-2xl border bg-linear-to-br shadow-sm"
              >
                <SectionCardHeader
                  icon={<CalendarDays size={18} />}
                  title={booking.title}
                  subtitle={booking.subtitle}
                />

                <div className="flex flex-1 flex-col space-y-5 px-6 py-6 sm:px-7 sm:py-7">
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    {booking.description}
                  </p>

                  {booking.availabilityNote ? (
                    <p className="border-primary/20 bg-primary/5 font-body text-foreground rounded-lg border px-4 py-3 text-sm font-medium">
                      {booking.availabilityNote}
                    </p>
                  ) : null}

                  <ul className="space-y-3">
                    {bookingBullets.map((item) => (
                      <li
                        key={item}
                        className="font-body text-foreground flex items-start gap-2.5 text-sm"
                      >
                        <Clock3
                          size={15}
                          className="text-primary mt-0.5 shrink-0"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="border-primary/10 mt-auto border-t pt-5">
                    <CalendlyBookButton className="group bg-signal font-body text-bg shadow-primary/20 inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-bold shadow-lg transition-all hover:opacity-90 active:scale-[0.99]">
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
              <div className="border-border bg-surface overflow-hidden rounded-2xl border shadow-sm">
                <SectionCardHeader
                  icon={<HelpCircle size={18} />}
                  title="FAQs"
                  subtitle="Quick answers before you reach out."
                />

                <div className="divide-border divide-y px-6 sm:px-7">
                  {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    const panelId = `contact-faq-panel-${index}`;

                    return (
                      <div key={faq.question}>
                        <button
                          type="button"
                          className="font-heading text-foreground hover:text-primary flex w-full items-center justify-between gap-4 py-4 text-left text-base font-semibold transition-colors"
                          onClick={() => setOpenIndex(isOpen ? null : index)}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            size={18}
                            className={`text-primary shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isOpen ? (
                          <div
                            id={panelId}
                            className="font-body text-muted-foreground pb-4 text-sm leading-relaxed"
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
