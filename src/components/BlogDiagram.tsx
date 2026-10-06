type DiagramColumn = { heading?: string; items?: string[] };
type Diagram = {
  title?: string;
  caption?: string;
  variant?: string;
  steps?: { label: string; detail?: string; flagged?: boolean }[];
  left?: DiagramColumn;
  right?: DiagramColumn;
};
/** Semantic HTML keeps existing CMS diagrams readable without a charting runtime. */
export function BlogDiagram({ value }: { value: Diagram }) {
  return (
    <figure className="border-line bg-bg-elevated my-8 rounded-2xl border p-5 sm:p-7">
      {value.title && <p className="mb-5 text-lg font-medium">{value.title}</p>}
      {value.variant === "compare" ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {[value.left, value.right].filter(Boolean).map((c, i) => (
            <div key={i}>
              <h3 className="text-signal mb-3 text-sm font-medium">
                {c?.heading}
              </h3>
              <ul className="text-fg-muted list-disc space-y-3 pl-4 text-sm leading-relaxed">
                {c?.items?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <ol className="space-y-3">
          {value.steps?.map((step, i) => (
            <li
              key={i}
              className={`rounded-xl border p-4 ${step.flagged ? "border-primary/40" : "border-line"}`}
            >
              <p className="text-sm font-medium">
                <span className="text-signal mr-3 font-mono text-xs">
                  {i + 1}
                </span>
                {step.label}
              </p>
              {step.detail && (
                <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                  {step.detail}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
      {value.caption && (
        <figcaption className="text-fg-muted mt-5 text-xs leading-relaxed">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}
