import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/Container";
import { FOUNDERS, PARTNER_STRIP, TRUST } from "@/content/site";
import { cn } from "@/lib/utils";

import { PartnerMark } from "./PartnerMark";

/*
 * Trust points placed down the homepage. Each sits beside the claim it backs:
 * partners under the hero, the team after the comparison, the track record
 * before the questions.
 */

function Marks({ dark }: { dark?: boolean }) {
  return (
    <ul aria-label="Partners" className="grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-10">
      {PARTNER_STRIP.map(([name, level]) => (
        <li key={name} className={cn("flex items-center gap-2.5", dark ? "text-white/55" : "text-ink-faint")}>
          <PartnerMark name={name} mono className="h-5 w-5 shrink-0" />
          <span className="text-[0.8125rem] leading-tight">
            <span className={cn("block font-medium", dark ? "text-white/90" : "text-ink-muted")}>{name}</span>
            {level}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Partner marks in a quiet row directly under the hero. */
export function PartnerStrip() {
  return (
    <section className="border-t border-rule">
      <Container className="flex flex-col gap-4 py-7 lg:flex-row lg:items-center lg:gap-10">
        <p className="shrink-0 text-[0.875rem] text-ink-faint">Certified with</p>
        <Marks />
      </Container>
    </section>
  );
}

export function Faces({ size = "md", ring = "border-paper" }: { size?: "sm" | "md"; ring?: string }) {
  const px = size === "sm" ? 40 : 64;
  return (
    <span className="flex shrink-0 items-center">
      {FOUNDERS.map((founder, i) => (
        <Image
          key={founder.name}
          src={founder.photo}
          alt={founder.name}
          width={px}
          height={px}
          className={cn(
            "rounded-full border-[3px] bg-panel object-cover object-top",
            ring,
            size === "sm" ? "h-10 w-10" : "h-16 w-16",
            i > 0 && (size === "sm" ? "-ml-3" : "-ml-4"),
          )}
        />
      ))}
      <span
        className={cn(
          "grid place-items-center rounded-full border-[3px] bg-ink px-3.5 font-medium whitespace-nowrap text-white",
          ring,
          size === "sm" ? "-ml-3 h-10 text-[0.75rem]" : "-ml-4 h-16 text-[0.8125rem]",
        )}
      >
        + team
      </span>
    </span>
  );
}

/** Who the engineers are, shown under the comparison that says they work inside your business. */
export function TeamStrip() {
  return (
    <div className="mt-14 grid items-center gap-6 rounded-panel bg-white p-6 ring-1 ring-rule sm:p-8 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8">
      <Faces />
      <div>
        <h3 className="type-heading">{TRUST.team.heading}</h3>
        <p className="mt-2 max-w-2xl text-ink-muted">{TRUST.team.body}</p>
      </div>
      <p className="flex items-center gap-3 self-start rounded-xl bg-paper px-4 py-3 ring-1 ring-rule lg:self-center">
        <PartnerMark name="Toptal" className="h-6 w-6" />
        <span className="text-[0.875rem] leading-snug text-ink-muted">
          <span className="block font-semibold text-ink">Top 3% talent</span>
          Team vetted by Toptal
        </span>
      </p>
    </div>
  );
}

/** The track record in one bold band before the questions. */
export function ProofBand() {
  const track = (
    <>
      {TRUST.work.map(([label, slug]) => (
        <Link key={slug} href={`/case-studies/${slug}`} className="flex items-center gap-2.5 hover:text-white">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#3fbf6e]" />
          {label}
        </Link>
      ))}
    </>
  );
  return (
    <section className="overflow-hidden bg-ink text-white">
      <Container className="pt-16 sm:pt-20">
        <dl className="grid border-b border-white/10 md:grid-cols-3">
          {TRUST.band.map(([title, note], i) => (
            <div
              key={title}
              className={cn(
                "pb-8 md:pr-8",
                i > 0 && "border-t border-white/10 pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-8",
              )}
            >
              <dt className="type-heading">{title}</dt>
              <dd className="mt-2 text-white/60">{note}</dd>
            </div>
          ))}
        </dl>
        <div className="py-7">
          <Marks dark />
        </div>
      </Container>
      <div className="flex overflow-hidden border-t border-white/10 py-4 text-[0.9375rem] text-white/70 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 gap-12 pr-12 whitespace-nowrap motion-safe:animate-[marquee_45s_linear_infinite]"
          >
            {track}
          </div>
        ))}
      </div>
    </section>
  );
}
