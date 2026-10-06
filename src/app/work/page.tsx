import Link from "next/link";
import { Container } from "@/components/Container";
import { Shell } from "@/components/marketing/Shell";
import {
  ClosingCTA,
  PageIntro,
  Section,
} from "@/components/marketing/Elements";
import { Portfolio } from "@/components/marketing/Portfolio";
import { getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Our Work",
  "Explore AgileMorph client projects and clearly attributed previous work by our team, from software platforms to production AI and automation.",
  "/work",
);
export default async function Work() {
  return (
    <Shell>
      <PageIntro
        eyebrow="Our work"
        title="Real problems. Working systems."
        description="Explore what AgileMorph has delivered and the experience our team brings from previous client engagements. Every project states the relationship, contribution, and delivery status."
      />
      <Container>
        <Portfolio projects={await getProjects()} />
      </Container>
      <Section
        eyebrow="Insights"
        title="More from our delivery notes."
        intro="Read the existing articles for their project context. These stories are not assumed to describe the anonymous engagements above."
        tinted
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            className="border-line bg-background rounded-xl border p-6 text-lg"
            href="/blog/client-reporting-for-agencies"
          >
            Client reporting for agencies →
          </Link>
          <Link
            className="border-line bg-background rounded-xl border p-6 text-lg"
            href="/blog/billion-dollar-manufacturer-paper-registers"
          >
            A manufacturer’s reporting pipeline →
          </Link>
        </div>
      </Section>
      <ClosingCTA />
    </Shell>
  );
}
