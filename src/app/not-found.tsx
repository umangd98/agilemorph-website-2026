import { Shell } from "@/components/marketing/Shell";
import { Action, PageIntro } from "@/components/marketing/Elements";
export default function NotFound() {
  return (
    <Shell>
      <PageIntro
        eyebrow="404 · Page not found"
        title="This page could not be found."
        description="The link may have changed, or this project does not have a published page. Explore our work or get in touch."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Action href="/work">Explore our work</Action>
          <Action href="/contact" secondary>
            Contact the team
          </Action>
        </div>
      </PageIntro>
    </Shell>
  );
}
