import type { ReactNode } from "react";

import { Reveal } from "@/components/Reveal";
import type { ComparisonBlock } from "@/sanity/types";

import { FdeSection } from "./FdeSection";

type ComparisonSectionProps = {
  id?: string;
  index: string;
  block?: ComparisonBlock;
  /** Rendered above the table, for example the FDE explainer. */
  lead?: ReactNode;
};

/**
 * Traditional vendor vs Forward Deployed Engineering. A real table from the
 * small breakpoint up; stacked row cards on phones so nothing scrolls sideways.
 */
export function ComparisonSection({ id, index, block, lead }: ComparisonSectionProps) {
  const rows = block?.rows ?? [];
  if (!rows.length) return null;

  const beforeLabel = block?.beforeLabel ?? "Traditional IT vendor";
  const afterLabel = block?.afterLabel ?? "Forward Deployed Engineering";

  return (
    <FdeSection
      id={id}
      index={index}
      eyebrow={block?.eyebrow}
      heading={block?.heading}
      intro={block?.intro}
    >
      {lead ? <Reveal className="mb-10">{lead}</Reveal> : null}

      <Reveal>
        <div className="hidden overflow-hidden rounded-2xl border border-line sm:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              {beforeLabel} compared with {afterLabel}
            </caption>
            <thead>
              <tr className="border-b border-line bg-bg-elevated">
                <th scope="col" className="w-[24%] px-5 py-4">
                  <span className="sr-only">Question</span>
                </th>
                <th scope="col" className="w-[38%] px-5 py-4">
                  <span className="syslabel inline-flex items-center gap-2">
                    <span aria-hidden className="h-2 w-2 rounded-full bg-fail/70" />
                    {beforeLabel}
                  </span>
                </th>
                <th scope="col" className="w-[38%] bg-signal/[0.06] px-5 py-4">
                  <span className="syslabel inline-flex items-center gap-2 text-signal">
                    <span aria-hidden className="h-2 w-2 rounded-full bg-signal" />
                    {afterLabel}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-b-0">
                  <th
                    scope="row"
                    className="px-5 py-5 align-top text-sm font-medium leading-snug text-fg"
                  >
                    {row.label}
                  </th>
                  <td className="px-5 py-5 align-top text-[0.9375rem] leading-relaxed text-fg-muted">
                    {row.before}
                  </td>
                  <td className="bg-signal/[0.06] px-5 py-5 align-top text-[0.9375rem] font-medium leading-relaxed text-fg">
                    {row.after}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="flex flex-col gap-3 sm:hidden">
          {rows.map((row) => (
            <li key={row.label} className="rounded-2xl border border-line bg-bg-elevated p-5">
              <p className="text-sm font-medium text-fg">{row.label}</p>
              <dl className="mt-3 flex flex-col gap-3">
                <div>
                  <dt className="syslabel inline-flex items-center gap-2">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-fail/70" />
                    {beforeLabel}
                  </dt>
                  <dd className="mt-1 text-[0.9375rem] leading-relaxed text-fg-muted">
                    {row.before}
                  </dd>
                </div>
                <div className="rounded-xl bg-signal/[0.07] p-3">
                  <dt className="syslabel inline-flex items-center gap-2 text-signal">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal" />
                    {afterLabel}
                  </dt>
                  <dd className="mt-1 text-[0.9375rem] font-medium leading-relaxed text-fg">
                    {row.after}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </Reveal>
    </FdeSection>
  );
}
