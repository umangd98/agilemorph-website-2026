import { Fragment } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";

type DiagramStep = {
  _key?: string;
  label?: string;
  detail?: string;
  flagged?: boolean;
};

type DiagramColumn = {
  heading?: string;
  items?: string[];
};

export type DiagramValue = {
  _type: "diagram";
  _key?: string;
  variant?: "chain" | "ladder" | "layers" | "compare";
  title?: string;
  caption?: string;
  steps?: DiagramStep[];
  left?: DiagramColumn;
  right?: DiagramColumn;
};

// Everything here is div/span on purpose: .prose-blog styles p, h2 and h3 as
// unlayered CSS, which would override these utilities inside the article body.

const LADDER_INDENT = ["md:ml-0", "md:ml-6", "md:ml-12", "md:ml-18", "md:ml-24", "md:ml-30"];

function Chain({ steps }: { steps: DiagramStep[] }) {
  return (
    <div className="flex flex-col items-stretch gap-2 md:flex-row">
      {steps.map((step, index) => (
        <Fragment key={step._key ?? index}>
          <div
            className={`flex flex-1 flex-col rounded-xl border p-4 ${
              step.flagged
                ? "border-amber-500/40 bg-amber-500/5"
                : "border-border bg-surface-elevated"
            }`}
          >
            <span className="font-body text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Step {index + 1}
            </span>
            <span className="mt-1 font-heading text-base font-bold leading-snug text-foreground">
              {step.label}
            </span>
            {step.detail ? (
              <span className="mt-1 font-body text-sm leading-snug text-muted-foreground">
                {step.detail}
              </span>
            ) : null}
            {step.flagged ? (
              <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-500/10 px-2 py-0.5 font-body text-[11px] font-semibold text-amber-600">
                <span className="size-1.5 rounded-full bg-amber-500" />
                Breaks here
              </span>
            ) : null}
          </div>
          {index < steps.length - 1 ? (
            <div className="flex items-center justify-center text-muted-foreground" aria-hidden="true">
              <ArrowDown className="size-4 md:hidden" />
              <ArrowRight className="hidden size-4 md:block" />
            </div>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

function Ladder({ steps }: { steps: DiagramStep[] }) {
  return (
    <div role="list" className="flex flex-col gap-3">
      {steps.map((step, index) => {
        const isTop = index === steps.length - 1;
        return (
          <div
            role="listitem"
            key={step._key ?? index}
            className={`flex items-start gap-4 rounded-xl border p-4 ${
              LADDER_INDENT[Math.min(index, LADDER_INDENT.length - 1)]
            } ${isTop ? "border-primary/30 bg-primary/10" : "border-border bg-surface-elevated"}`}
          >
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold ${
                isTop ? "bg-primary text-white" : "bg-primary/10 text-primary"
              }`}
            >
              {index + 1}
            </span>
            <span className="flex flex-col">
              <span className="font-heading text-base font-bold leading-snug text-foreground">
                {step.label}
              </span>
              {step.detail ? (
                <span className="mt-0.5 font-body text-sm leading-snug text-muted-foreground">
                  {step.detail}
                </span>
              ) : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Layers({ steps }: { steps: DiagramStep[] }) {
  // Stored foundation first; drawn with the foundation at the bottom.
  return (
    <div className="flex flex-col-reverse gap-2">
      {steps.map((step, index) => {
        const isTop = index === steps.length - 1;
        return (
          <div
            key={step._key ?? index}
            style={{ marginInline: `${index * 3}%` }}
            className={`flex flex-col gap-1 rounded-xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
              isTop ? "border-primary/30 bg-primary/10" : "border-border bg-surface-elevated"
            }`}
          >
            <span
              className={`font-heading text-base font-bold leading-snug ${
                isTop ? "text-primary" : "text-foreground"
              }`}
            >
              {step.label}
            </span>
            {step.detail ? (
              <span className="font-body text-sm leading-snug text-muted-foreground sm:text-right">
                {step.detail}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function Compare({ left, right }: { left?: DiagramColumn; right?: DiagramColumn }) {
  const columns = [left, right];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {columns.map((column, index) => {
        if (!column?.heading && !column?.items?.length) return null;
        const isRight = index === 1;
        return (
          <div
            key={index}
            className={`rounded-xl border p-5 ${
              isRight ? "border-primary/30 bg-primary/5" : "border-border bg-surface-elevated"
            }`}
          >
            {column.heading ? (
              <span
                className={`mb-3 block font-heading text-base font-bold ${
                  isRight ? "text-primary" : "text-foreground"
                }`}
              >
                {column.heading}
              </span>
            ) : null}
            <div role="list" className="flex flex-col gap-2">
              {(column.items ?? []).map((item, itemIndex) => (
                <div
                  role="listitem"
                  key={itemIndex}
                  className="flex gap-2.5 font-body text-sm leading-snug text-muted-foreground"
                >
                  <span
                    className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                      isRight ? "bg-primary" : "bg-muted-foreground/50"
                    }`}
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DiagramBlock({ value }: { value: DiagramValue }) {
  const steps = (value.steps ?? []).filter((step) => step?.label);
  const variant = value.variant ?? "chain";

  let content: React.ReactNode = null;
  if (variant === "compare") {
    if (value.left?.items?.length || value.right?.items?.length) {
      content = <Compare left={value.left} right={value.right} />;
    }
  } else if (steps.length) {
    if (variant === "ladder") content = <Ladder steps={steps} />;
    else if (variant === "layers") content = <Layers steps={steps} />;
    else content = <Chain steps={steps} />;
  }

  if (!content) return null;

  return (
    <figure className="my-10 overflow-hidden rounded-2xl border border-border bg-surface p-5 sm:p-8">
      {value.title ? (
        <span className="mb-5 flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest text-primary">
          <span className="size-1.5 rounded-full bg-signal" />
          {value.title}
        </span>
      ) : null}
      {content}
      {value.caption ? (
        <figcaption className="mt-6 border-t border-border pt-4 font-body text-sm leading-relaxed text-muted-foreground">
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
