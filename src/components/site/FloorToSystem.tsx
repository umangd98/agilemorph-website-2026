"use client";

import { useEffect, useRef, useState } from "react";
import { FileImage, Mic, MessageSquare } from "lucide-react";

import { FIELD_EXAMPLE } from "@/content/site";
import { cn } from "@/lib/utils";

/*
 * The site's one moving piece: three messages from the floor become one
 * record in the system. It plays once, when it first scrolls into view.
 * The text is always in the DOM; only opacity changes, so readers without
 * JavaScript or with reduced motion get the finished state.
 */

const MESSAGE_ICONS = [MessageSquare, Mic, FileImage] as const;

// Stage at which each element appears.
const STAGE = {
  message: [1, 2, 3],
  step: [4, 5, 7, 8],
  fields: 5,
  confirmPending: 6,
  confirmDone: 7,
  written: 8,
  final: 8,
} as const;

const STAGE_DELAY_MS = 520;

function useSequence(ref: React.RefObject<HTMLElement | null>) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const id = requestAnimationFrame(() => setStage(STAGE.final));
      return () => cancelAnimationFrame(id);
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        let next = 0;
        const tick = () => {
          next += 1;
          setStage(next);
          if (next < STAGE.final) timer = setTimeout(tick, STAGE_DELAY_MS);
        };
        timer = setTimeout(tick, 250);
      },
      { threshold: 0.35 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [ref]);

  return stage;
}

function Reveal({ show, children, className }: { show: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "fts-reveal transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
        show ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FloorToSystem({ caption = true }: { caption?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const stage = useSequence(ref);
  const { messages, record, steps } = FIELD_EXAMPLE;
  const confirmed = stage >= STAGE.confirmDone;

  return (
    <figure ref={ref} className="m-0">
      <noscript>
        <style>{".fts-reveal{opacity:1!important;transform:none!important}"}</style>
      </noscript>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_8.5rem_minmax(0,1.1fr)] lg:gap-0">
        {/* On the floor */}
        <div className="min-w-0 lg:pr-8">
          <p className="mb-4 text-sm font-medium text-ink-muted">On the floor</p>
          <ol className="flex flex-col gap-3">
            {messages.map((message, i) => {
              const Icon = MESSAGE_ICONS[i] ?? MessageSquare;
              return (
                <li key={message.body}>
                  <Reveal show={stage >= STAGE.message[i]!}>
                    <div className="max-w-md rounded-2xl rounded-tl-md bg-white px-4 py-3 ring-1 ring-rule">
                      <p className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
                        <Icon size={14} aria-hidden className="shrink-0" />
                        <span>
                          {message.from}, {message.kind.toLowerCase()}
                        </span>
                      </p>
                      <p className="mt-1.5 text-[0.9375rem] leading-snug text-ink">{message.body}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        {/* The seam: what happens between the floor and the system */}
        <ol
          aria-label="What happens in between"
          className="relative flex flex-row flex-wrap gap-x-5 gap-y-2 lg:flex-col lg:items-center lg:justify-center lg:gap-8 lg:border-x lg:border-dashed lg:border-rule lg:py-6"
        >
          {steps.map((step, i) => {
            const isConfirm = step === "Confirmed";
            const shown = stage >= STAGE.step[i]!;
            return (
              <li key={step} className="flex items-center gap-2 lg:flex-col lg:gap-1.5">
                <span
                  aria-hidden
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-colors duration-300",
                    !shown && "bg-rule",
                    shown && (isConfirm ? "bg-amber" : "bg-green"),
                  )}
                />
                <span
                  className={cn(
                    "text-[0.8125rem] font-medium transition-colors duration-300",
                    shown ? (isConfirm ? "text-amber" : "text-green-deep") : "text-ink-faint",
                  )}
                >
                  {isConfirm ? "Person confirms" : step}
                </span>
              </li>
            );
          })}
        </ol>

        {/* In your system */}
        <div className="min-w-0 lg:pl-8">
          <p className="mb-4 text-sm font-medium text-ink-muted">In your system</p>
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-rule">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule-soft px-5 py-3.5">
              <p className="font-display text-base font-semibold tracking-[-0.01em]">{record.title}</p>
              <span
                className={cn(
                  "rounded-pill px-2.5 py-1 text-xs font-medium transition-colors duration-300",
                  stage >= STAGE.written ? "bg-green-soft text-green-deep" : "bg-panel text-ink-faint",
                )}
              >
                {stage >= STAGE.written ? record.system : "Not yet written"}
              </span>
            </div>
            <dl className="divide-y divide-rule-soft px-5 font-code text-[0.8125rem]">
              {record.fields.map((field, i) => (
                <div key={field.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 py-2.5">
                  <dt className="text-ink-faint">{field.label}</dt>
                  <dd className="min-w-0">
                    <span
                      className={cn(
                        "fts-reveal inline-block transition-opacity duration-500 motion-reduce:transition-none",
                        stage >= STAGE.fields ? "opacity-100" : "opacity-0",
                      )}
                      style={{ transitionDelay: stage >= STAGE.fields ? `${i * 70}ms` : undefined }}
                    >
                      {field.value}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <div
              className={cn(
                "fts-reveal flex items-center gap-2 px-5 py-3 text-[0.8125rem] font-medium transition-[opacity,background-color,color] duration-300 motion-reduce:transition-none",
                stage >= STAGE.confirmPending ? "opacity-100" : "opacity-0",
                confirmed ? "bg-green-soft text-green-deep" : "bg-amber-soft text-amber",
              )}
              aria-live="polite"
            >
              <span aria-hidden className={cn("h-2 w-2 rounded-full", confirmed ? "bg-green" : "bg-amber")} />
              {confirmed ? record.confirm.done : record.confirm.pending}
            </div>
          </div>
        </div>
      </div>

      {caption ? (
        <figcaption className="mt-8 max-w-2xl text-[0.9375rem] text-ink-muted">
          {FIELD_EXAMPLE.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
