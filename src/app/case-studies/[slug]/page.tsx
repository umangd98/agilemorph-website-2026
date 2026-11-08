import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { Reveal } from "@/components/Reveal";
import { Container, StackTag } from "@/components/ui";
import {
  CardGridSection,
  FdeExplainer,
  FdePageHero,
  FdeSection,
  FinalCtaSection,
} from "@/components/sections/fde";
import { seoToMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import {
  caseStudiesIndexPageQuery,
  caseStudiesListQuery,
  caseStudyQuery,
} from "@/sanity/queries";
import type { CaseStudiesIndexPage, CaseStudy, CaseStudySummary } from "@/sanity/types";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

async function getCaseStudy(slug: string) {
  return sanityFetch<CaseStudy | null>({
    query: caseStudyQuery,
    params: { slug },
    tags: ["caseStudy", `caseStudy:${slug}`],
  });
}

export async function generateStaticParams() {
  const studies = await sanityFetch<CaseStudySummary[]>({
    query: caseStudiesListQuery,
    tags: ["caseStudy"],
  });
  return (studies ?? []).map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return { title: "Not Found", robots: { index: false } };

  return seoToMetadata(study.seo, {
    title: `${study.title}: case study`,
    description: study.summary ?? study.headline,
    alternates: { canonical: `/case-studies/${slug}` },
  });
}

function TextBlock({ label, body }: { label: string; body?: string }) {
  if (!body) return null;
  return (
    <Reveal className="grid gap-3 border-t border-line py-8 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
      <h2 className="syslabel pt-1">{label}</h2>
      <div className="flex max-w-3xl flex-col gap-4">
        {body
          .split(/\n\s*\n/)
          .filter(Boolean)
          .map((paragraph) => (
            <p key={paragraph} className="text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              {paragraph}
            </p>
          ))}
      </div>
    </Reveal>
  );
}

export default async function CaseStudyRoute({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const [study, indexPage] = await Promise.all([
    getCaseStudy(slug),
    sanityFetch<CaseStudiesIndexPage | null>({
      query: caseStudiesIndexPageQuery,
      tags: ["caseStudiesIndexPage"],
    }),
  ]);

  if (!study) notFound();

  return (
    <>
      <SiteNavbar />
      <main className="flex-1">
        <FdePageHero
          eyebrow={study.anonymised ? "Case study, client anonymised" : "Case study"}
          heading={study.title}
          description={study.headline}
          align="left"
        >
          <div className="flex flex-col gap-6">
            {study.status || study.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {study.status ? <StackTag>{study.status}</StackTag> : null}
                {(study.tags ?? []).map((tag) => (
                  <StackTag key={tag}>{tag}</StackTag>
                ))}
              </div>
            ) : null}
            <FdeExplainer align="left" className="mx-0" />
          </div>
        </FdePageHero>

        <FdeSection index="01" eyebrow="The engagement" heading="The engagement">
          <div className="border-b border-line">
            <TextBlock label="Context" body={study.context} />
            <TextBlock label="The gap" body={study.gap} />
            <TextBlock label="How we worked" body={study.howWeWorked} />
            {study.whatWeBuilt?.length ? (
              <Reveal className="grid gap-3 border-t border-line py-8 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
                <h2 className="syslabel pt-1">What we built</h2>
                <ul className="flex max-w-3xl flex-col gap-3">
                  {study.whatWeBuilt.map((item) => (
                    <li key={item} className="flex gap-3 text-base leading-relaxed text-fg-muted sm:text-lg">
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
            <TextBlock label="Outcome" body={study.outcome} />
            {study.stack?.length ? (
              <Reveal className="grid gap-3 border-t border-line py-8 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
                <h2 className="syslabel pt-1">Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {study.stack.map((item) => (
                    <StackTag key={item}>{item}</StackTag>
                  ))}
                </div>
              </Reveal>
            ) : null}
          </div>
        </FdeSection>

        <CardGridSection
          index="02"
          block={
            study.phases?.length
              ? {
                  eyebrow: "The five phases",
                  heading: "How the five phases played out",
                  items: study.phases,
                }
              : undefined
          }
          columns={3}
        />

        <section className="border-t border-line py-10">
          <Container>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-sm font-medium text-fg-muted hover:text-signal"
            >
              <ArrowLeft size={15} aria-hidden />
              All case studies
            </Link>
          </Container>
        </section>

        <FinalCtaSection block={indexPage?.cta} />
      </main>
      <SiteFooter />
    </>
  );
}
