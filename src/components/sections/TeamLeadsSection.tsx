"use client";

import { Sparkles } from "lucide-react";

import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Container } from "@/components/Container";
import { SanityImage } from "@/components/SanityImage";
import type { TeamLeadItem } from "@/sanity/types";

type TeamLeadCardProps = TeamLeadItem & {
  index: number;
  cardFooter?: string;
  delay?: number;
};

function TeamLeadCard({
  name,
  role,
  bio,
  image,
  index,
  cardFooter,
  delay = 0,
}: TeamLeadCardProps) {
  const cardNumber = String(index + 1).padStart(2, "0");

  return (
    <AnimateOnScroll delay={delay} className="h-full">
      <article className="group relative mx-auto flex h-full w-full max-w-88 flex-col transition-transform duration-500 ease-out hover:-translate-y-2">
        <div
          className="pointer-events-none absolute -inset-x-4 top-8 h-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto mb-[-7.5rem] h-70 w-60 sm:mb-[-8rem] sm:h-74 sm:w-62">
          <div
            className="absolute inset-x-6 bottom-2 h-8 rounded-full bg-foreground/10 blur-xl transition-all duration-500 group-hover:inset-x-4 group-hover:bg-primary/20"
            aria-hidden="true"
          />
          {image ? (
            <SanityImage
              image={image}
              alt={image.alt ?? name}
              fill
              sizes="(max-width: 768px) 240px, 248px"
              className="object-contain object-bottom drop-shadow-[0_20px_32px_rgba(15,23,42,0.18)] transition-transform duration-500 group-hover:scale-[1.03]"
              priority={index === 0}
            />
          ) : null}
        </div>

        <div className="relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-border/70 bg-linear-to-b from-background via-mint/80 to-mint p-px shadow-[0_22px_50px_rgba(15,23,42,0.08)] transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-[0_28px_60px_rgba(34,197,94,0.12)]">
          <div
            className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/15 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative flex min-h-92 flex-1 flex-col rounded-[calc(1.5rem-1px)] bg-linear-to-b from-background/95 via-mint/40 to-mint px-6 pb-8 pt-34 sm:min-h-92 sm:px-7 sm:pb-9 sm:pt-36">
            <span
              className="pointer-events-none absolute right-5 top-5 font-heading text-5xl font-extrabold leading-none text-primary/10 transition-colors duration-500 group-hover:text-primary/20"
              aria-hidden="true"
            >
              {cardNumber}
            </span>

            <span className="mb-3 inline-flex w-fit items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-body text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
              {role}
            </span>

            <h3 className="mb-3 font-heading text-2xl font-extrabold text-foreground transition-colors group-hover:text-primary">
              {name}
            </h3>

            <p className="flex-1 font-body text-sm leading-relaxed text-muted-foreground">{bio}</p>

            {cardFooter ? (
              <div className="mt-auto pt-6 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                {cardFooter}
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </AnimateOnScroll>
  );
}

function splitHeading(heading: string) {
  const words = heading.trim().split(/\s+/);
  if (words.length <= 1) {
    return { prefix: heading, accent: "" };
  }

  return {
    prefix: words.slice(0, -1).join(" "),
    accent: words[words.length - 1] ?? "",
  };
}

type TeamLeadsSectionProps = {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  cardFooter?: string;
  members?: TeamLeadItem[];
};

export function TeamLeadsSection({
  eyebrow,
  heading,
  subheading,
  cardFooter,
  members = [],
}: TeamLeadsSectionProps) {
  if (!heading || !members.length) return null;

  const { prefix, accent } = splitHeading(heading);

  return (
    <section
      className="relative overflow-hidden bg-background py-section max-sm:py-section-sm"
      aria-labelledby="team-leads-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/8 via-background to-surface"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--color-primary) 18%, transparent) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-primary/8 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative">
        <AnimateOnScroll className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
          {eyebrow ? (
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-body text-[10px] font-bold uppercase tracking-widest text-primary sm:text-xs">
              <Sparkles size={12} aria-hidden />
              {eyebrow}
            </span>
          ) : null}
          <h2
            id="team-leads-heading"
            className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl"
          >
            {prefix}{" "}
            {accent ? (
              <span className="bg-linear-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                {accent}
              </span>
            ) : null}
          </h2>
          {subheading ? (
            <p className="mx-auto mt-4 max-w-2xl font-body text-base leading-relaxed text-muted-foreground">
              {subheading}
            </p>
          ) : null}
        </AnimateOnScroll>

        <div className="relative">
          <div
            className="pointer-events-none absolute left-[8%] right-[8%] top-1/2 hidden h-px bg-linear-to-r from-transparent via-primary/25 to-transparent lg:block"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 items-stretch gap-16 md:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-8 xl:gap-10">
            {members.map((lead, index) => (
              <TeamLeadCard
                key={lead.name}
                {...lead}
                index={index}
                cardFooter={cardFooter}
                delay={index * 120}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
