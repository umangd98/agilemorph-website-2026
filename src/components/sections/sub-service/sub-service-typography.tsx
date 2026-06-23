import type { ReactNode } from "react";

import type { ServiceHeadline } from "@/sanity/types";

export function SubServiceHeadline({
  headline,
  fallbackTitle,
}: {
  headline?: ServiceHeadline;
  fallbackTitle: string;
}) {
  if (!headline?.highlight) {
    return <>{fallbackTitle}</>;
  }

  return (
    <>
      {headline.before}
      <span className="text-gradient">{headline.highlight}</span>
      {headline.after}
    </>
  );
}

export function SubServiceSectionTitle({
  children,
  highlight,
}: {
  children: ReactNode;
  highlight?: ReactNode;
}) {
  return (
    <h2 className="sub-service-section-title">
      {children}
      {highlight ? <> {highlight}</> : null}
    </h2>
  );
}

/** Split flow step text into display chips (e.g. "Web / ads / inbox" → three items). */
export function parseFlowStepItems(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  if (trimmed.includes("/")) {
    return trimmed.split(/\s*\/\s*/).map((part) => part.trim()).filter(Boolean);
  }

  if (trimmed.includes("+")) {
    return trimmed.split(/\s*\+\s*/).map((part) => part.trim()).filter(Boolean);
  }

  return [trimmed];
}

function HighlightedTitle({
  title,
  highlight,
}: {
  title: string;
  highlight?: string;
}) {
  if (!highlight || !title.includes(highlight)) {
    return <>{title}</>;
  }

  const [before, after] = title.split(highlight);
  return (
    <>
      {before}
      <span className="text-gradient">{highlight}</span>
      {after}
    </>
  );
}

export function SubServiceHighlightedHeading({
  title,
  highlight,
  id,
}: {
  title: string;
  highlight?: string;
  id?: string;
}) {
  return (
    <h2 id={id} className="sub-service-section-title">
      <HighlightedTitle title={title} highlight={highlight} />
    </h2>
  );
}

/** Word-heavy stat values (e.g. "Full", "SOC-ready") use a smaller scale than numbers. */
export function isCompactStatValue(value: string) {
  return /^[A-Za-z][\w-]*$/.test(value.trim()) && value.length <= 12;
}
