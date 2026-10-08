export function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export function externalLinkProps(href: string, openInNewTab?: boolean) {
  const external = isExternalHref(href) || openInNewTab;

  return external
    ? ({ target: "_blank" as const, rel: "noopener noreferrer" as const })
    : {};
}

/** CAT, the AI content management tool, in its live app. */
export const CAT_TRY_URL = "https://cat.agilemorph.in/home";
