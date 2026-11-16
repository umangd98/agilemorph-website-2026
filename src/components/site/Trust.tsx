import Image from "next/image";

import { Container } from "@/components/Container";
import { FOUNDERS, PARTNER_STRIP, TRUST } from "@/content/site";
import { cn } from "@/lib/utils";

import { PartnerMark } from "./PartnerMark";

/*
 * Trust points placed down the homepage. Each sits beside the claim it backs:
 * partners under the hero and the team after the comparison.
 */

function Marks() {
  return (
    <ul aria-label="Partners" className="grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-10">
      {PARTNER_STRIP.map(([name, level]) => (
        <li key={name} className="flex items-center gap-2.5 text-ink-faint">
          <PartnerMark name={name} mono className="h-5 w-5 shrink-0" />
          <span className="text-[0.8125rem] leading-tight">
            <span className="block font-medium text-ink-muted">{name}</span>
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
    <section>
      <Container className="flex flex-col gap-4 pt-1 pb-10 lg:flex-row lg:items-center lg:gap-10">
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
