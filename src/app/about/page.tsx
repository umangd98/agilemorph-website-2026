import { Shell } from "@/components/marketing/Shell";
import {
  ClosingCTA,
  FeedbackGrid,
  PageIntro,
  Section,
  TeamGrid,
} from "@/components/marketing/Elements";
import { getContent } from "@/lib/content";
import type { AboutContent, HomeContent } from "@/lib/content-types";
import { pageMetadata, seoToMetadata } from "@/lib/seo";
const fallbackMetadata = pageMetadata(
  "About AgileMorph",
  "Meet AgileMorph’s leadership and the software, AI, and enterprise delivery experience behind the company.",
  "/about",
);
export async function generateMetadata() {
  const document = await getContent<AboutContent>("aboutPage");
  return seoToMetadata(document.seo, fallbackMetadata);
}
export default async function About() {
  const [about, home] = await Promise.all([
    getContent<AboutContent>("aboutPage"),
    getContent<HomeContent>("homepage"),
  ]);
  return (
    <Shell>
      <PageIntro
        eyebrow="About AgileMorph"
        title={about.heading}
        description={about.introduction}
      />
      <Section title={about.teamLeads.heading} intro={about.body}>
        <TeamGrid members={about.teamLeads.members} />
      </Section>
      <Section
        eyebrow="Working together"
        title="Leadership and delivery, connected."
        tinted
      >
        <div className="grid gap-8 md:grid-cols-2">
          <p className="text-fg-muted text-base leading-relaxed">
            We agree who leads discovery, architecture, implementation, and
            client communication as part of each scope. Working sessions and
            delivery reviews keep the people building the system close to the
            people using it.
          </p>
          <p className="text-fg-muted text-base leading-relaxed">
            {about.founderProduct}
          </p>
        </div>
      </Section>
      <Section title="What delivery looks like">
        <div className="grid gap-6 md:grid-cols-2">
          {home.process.map((p) => (
            <article key={p.title}>
              <h3 className="text-xl font-medium">{p.title}</h3>
              <p className="text-fg-muted mt-3 text-sm leading-relaxed">
                {p.description}
              </p>
            </article>
          ))}
        </div>
      </Section>
      {!!about.endorsements?.length && (
        <Section
          eyebrow="Professional recommendations"
          title="People who have worked alongside our leadership."
          intro="These recommendations describe individual professional experience. The organizations listed are the recommenders’ affiliations, not a list of AgileMorph clients."
          tinted
        >
          <FeedbackGrid items={about.endorsements} />
        </Section>
      )}
      <ClosingCTA />
    </Shell>
  );
}
