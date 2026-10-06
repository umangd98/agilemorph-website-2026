import { Shell } from "@/components/marketing/Shell";
import { PageIntro, Section } from "@/components/marketing/Elements";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Privacy Notice",
  "How the AgileMorph website handles contact enquiries, scheduling, and chat.",
  "/privacy",
);
export default function Privacy() {
  return (
    <Shell>
      <PageIntro
        eyebrow="Privacy notice"
        title="Information you share with us."
        description="This notice describes information handled through the AgileMorph Solutions website and the services used to respond to enquiries."
      />
      <Section title="Contact enquiries">
        <p className="text-fg-muted max-w-3xl leading-relaxed">
          The contact form requests your name, email address, company, an
          optional phone number, and a message. We use these details to respond
          to your enquiry and discuss potential work. The form is configured to
          submit through Netlify Forms. Please avoid sending passwords,
          confidential client records, or sensitive personal information in an
          initial enquiry.
        </p>
      </Section>
      <Section title="Scheduling and website chat" tinted>
        <div className="text-fg-muted max-w-3xl space-y-5 leading-relaxed">
          <p>
            Booking a call opens Calendly, which handles the details you provide
            to schedule the meeting. The website also loads Tidio to provide
            chat; information shared in chat is handled through that service.
            These third-party services may process device information and use
            cookies or similar technologies under their own policies.
          </p>
          <p>
            Read the provider notices for{" "}
            <a
              className="text-signal underline"
              href="https://www.netlify.com/privacy/"
            >
              Netlify
            </a>
            ,{" "}
            <a
              className="text-signal underline"
              href="https://calendly.com/privacy"
            >
              Calendly
            </a>
            , and{" "}
            <a
              className="text-signal underline"
              href="https://www.tidio.com/privacy-policy/"
            >
              Tidio
            </a>
            .
          </p>
        </div>
      </Section>
      <Section title="Preferences and questions">
        <div className="text-fg-muted max-w-3xl space-y-5 leading-relaxed">
          <p>
            The website stores your selected display theme in your browser.
            Hosting and service providers may process request logs to operate
            their services.
          </p>
          <p>
            For questions about information you have shared, or to request a
            correction or deletion, contact{" "}
            <a
              className="text-signal underline"
              href="mailto:info@theagilemorph.com"
            >
              info@theagilemorph.com
            </a>
            . This website notice does not replace data-handling arrangements
            agreed for a client project.
          </p>
        </div>
      </Section>
    </Shell>
  );
}
