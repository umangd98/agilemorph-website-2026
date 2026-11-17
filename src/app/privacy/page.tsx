import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { PageShell } from "@/components/site/PageShell";
import { COMPANY } from "@/content/site";
import { pageMetadata } from "@/lib/page-metadata";

const UPDATED = "17 November 2026";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Agilemorph collects, uses and protects personal data from this website: the contact form, discovery call bookings, chat and analytics.",
  path: "/privacy",
  share: "privacy",
});

type Block = { heading: string; body: Array<string | string[]> };

/**
 * Written for the services this site actually runs: Netlify (hosting and the
 * contact form), Calendly (bookings), Tidio (chat) and Google Analytics. Update
 * it, and UPDATED, whenever one of those changes.
 */
const SECTIONS: Block[] = [
  {
    heading: "Who we are",
    body: [
      `This policy covers theagilemorph.com, run by ${COMPANY.name} (registered as ${COMPANY.legalName}), based in Nagpur, Maharashtra, India. We decide how the personal data collected through this website is used, so we are responsible for it.`,
      `Questions or requests about your data go to ${COMPANY.email}.`,
    ],
  },
  {
    heading: "What we collect, and why",
    body: [
      "We only collect what you give us or what is needed to run the site:",
      [
        "Contact form: your first and last name, work email, company and message. We use them to reply to your enquiry and, if you go ahead, to discuss the work. Submissions are stored by Netlify, which hosts this site, and arrive in our email.",
        "Discovery call bookings: these run on Calendly. Calendly collects the details you enter when you book, such as your name, email and answers, and shares them with us so we can hold the call.",
        "Chat: the chat window is provided by Tidio. Anything you type there, and any details you share, are stored by Tidio so we can reply. Tidio may also show a sign-up for updates; if you subscribe, we keep your email to send them, and you can unsubscribe at any time.",
        "Analytics: we use Google Analytics to see which pages are read, how visitors arrive and on what kind of device. It records things like pages viewed, approximate location, browser and referring site. We use it in aggregate to improve the site, not to identify you.",
        "Server logs: Netlify processes your IP address and basic request details to deliver the site and protect it from abuse.",
      ],
      "We do not sell personal data, and we do not use advertising or retargeting trackers on this site.",
    ],
  },
  {
    heading: "Cookies",
    body: [
      "Google Analytics and Tidio set cookies in your browser so they can recognise repeat visits and keep a chat going. You can block or delete cookies in your browser settings, and Google offers a browser add-on to opt out of Google Analytics. The site still works without them, though the chat may not.",
    ],
  },
  {
    heading: "Who we share data with",
    body: [
      "Only the services that run the site for us: Netlify, Google, Tidio and Calendly. Each processes data under its own privacy policy. We may also disclose data where the law requires it. Otherwise we do not share it.",
      "These services may store or process data outside India, including in the United States and the European Union.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "We keep enquiries and correspondence for as long as we need them to respond and, if we work together, for the length of that relationship and any record-keeping the law requires. Analytics data is kept for the retention period set in our Google Analytics account. You can ask us to delete your data sooner.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "You can ask us to tell you what personal data we hold about you, correct it, delete it, or stop using it, and you can withdraw any consent you have given. These rights come from India's Digital Personal Data Protection Act, 2023, and, if you are in the European Union or the United Kingdom, from the GDPR.",
      `Email ${COMPANY.email} with your request. We will reply within 30 days. If you are not satisfied with our reply, you can complain to the data protection authority where you live.`,
    ],
  },
  {
    heading: "Security",
    body: [
      "The site is served only over HTTPS, and we limit who in our team can see enquiries. No method of storing or sending data online is completely secure, but we take reasonable steps to protect what you share with us.",
    ],
  },
  {
    heading: "Children",
    body: ["This site is for businesses and is not aimed at anyone under 18. We do not knowingly collect their data."],
  },
  {
    heading: "Changes to this policy",
    body: ["If we change how we handle personal data, we will update this page and the date at the top."],
  },
];

export default function PrivacyPage() {
  return (
    <PageShell>
      <section className="pt-14 pb-20 sm:pt-20">
        <Container>
          <h1 className="type-display max-w-4xl">Privacy policy</h1>
          <p className="mt-6 text-[0.9375rem] text-ink-faint">Last updated {UPDATED}</p>

          <div className="mt-12 max-w-2xl">
            {SECTIONS.map((section) => (
              <section key={section.heading} className="border-t border-rule py-8">
                <h2 className="type-heading">{section.heading}</h2>
                {section.body.map((part, i) =>
                  Array.isArray(part) ? (
                    <ul key={i} className="mt-4 list-disc space-y-3 pl-5 text-lg text-ink-muted">
                      {part.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i} className="mt-4 text-lg text-ink-muted">
                      {part}
                    </p>
                  ),
                )}
              </section>
            ))}
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
