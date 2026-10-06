import { FeedbackGrid, Section } from "@/components/marketing/Elements";
import type { Feedback } from "@/lib/content-types";
export function TestimonialsSection({
  eyebrow = "Recommendations",
  heading = "From people we have worked with",
  items = [],
}: {
  eyebrow?: string;
  heading?: string;
  items?: Feedback[];
}) {
  return items.length ? (
    <Section eyebrow={eyebrow} title={heading}>
      <FeedbackGrid items={items} />
    </Section>
  ) : null;
}
