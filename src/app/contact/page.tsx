import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { NetlifyContactFormDetector } from "@/components/NetlifyContactFormDetector";
import { BookButton } from "@/components/site/Button";
import { ContactForm } from "@/components/site/ContactForm";
import { PageShell } from "@/components/site/PageShell";
import { COMPANY } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a discovery call with Agilemorph, or email info@theagilemorph.com. We'll tell you where AI fits in your operation and what a pilot would take.",
  alternates: { canonical: "/contact" },
};

const ON_THE_CALL = [
  "You tell us how the work flows today, and where the system falls behind it.",
  "We tell you where AI would fit, and where it wouldn't.",
  "You leave knowing what a discovery audit or an AI Audit would cover.",
];

export default function ContactPage() {
  return (
    <PageShell>
      <NetlifyContactFormDetector />
      <section id="book" className="scroll-mt-20 pt-14 pb-20 sm:pt-20">
        <Container className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-24">
          <div>
            <h1 className="type-display">Book a discovery call</h1>
            <ol className="mt-10 flex flex-col border-b border-rule">
              {ON_THE_CALL.map((item, i) => (
                <li key={item} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-t border-rule py-4">
                  <span className="font-display font-semibold text-green tabular-nums">{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex flex-col items-start gap-4">
              <BookButton>Pick a time</BookButton>
              <p className="text-ink-muted">
                Or email{" "}
                <a href={`mailto:${COMPANY.email}`} className="text-ink underline decoration-rule underline-offset-4 hover:decoration-green">
                  {COMPANY.email}
                </a>
              </p>
            </div>
          </div>

          <div className="lg:pt-4">
            <h2 className="type-heading">Prefer to write it down?</h2>
            <p className="mt-2 mb-8 text-ink-muted">Tell us what isn&apos;t working. We read every message.</p>
            <ContactForm />
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
