import Link from "next/link";
import { PageIntro, Section } from "@/components/marketing/Elements";
import type { ServicePageListItem } from "@/sanity/types";
export function ServicesCatalogSection({
  pages,
  heroEyebrow = "Services",
  heroHeading = "Software and AI for your business.",
  heroDescription = "Explore our engineering capabilities.",
}: {
  pages: ServicePageListItem[];
  heroEyebrow?: string;
  heroHeading?: string;
  heroDescription?: string;
}) {
  return (
    <>
      <PageIntro
        eyebrow={heroEyebrow}
        title={heroHeading}
        description={heroDescription}
      />
      <Section title="Explore our services">
        <div className="grid gap-5 md:grid-cols-2">
          {pages.map((p) => (
            <Link
              key={p._id}
              href={`/services/${p.slug}`}
              className="border-line rounded-xl border p-6"
            >
              <h3 className="text-xl font-medium">{p.title}</h3>
              <p className="text-fg-muted mt-3 text-sm">{p.description}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
