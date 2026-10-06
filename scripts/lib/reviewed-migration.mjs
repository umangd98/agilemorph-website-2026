import { createHash } from "node:crypto";

const retired = {
  homepage: [
    "stats",
    "partners",
    "integrations",
    "whyUs",
    "services",
    "featuredLogos",
  ],
  aboutPage: [
    "hero",
    "about",
    "values",
    "process",
    "stats",
    "cta",
    "founder",
    "integrations",
    "partners",
    "featuredLogos",
    "testimonials",
  ],
  pricingPage: [
    "hero",
    "projectSection",
    "retainerSection",
    "engagementSection",
    "cta",
  ],
  servicePage: [
    "layout",
    "tagline",
    "headline",
    "flow",
    "stats",
    "whyTitle",
    "whyHighlight",
    "whyText",
    "checks",
    "useCases",
    "pricing",
    "processSteps",
    "heroImage",
    "heroCta",
    "capabilitiesHeading",
    "capabilities",
    "whyUsHeading",
    "whyUs",
    "technologiesHeading",
    "technologies",
    "cta",
  ],
  siteSettings: ["newsletterHeading", "newsletterDescription"],
};
export function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stable(value[key])]),
    );
  return value;
}
export function fingerprint(value) {
  return createHash("sha256")
    .update(JSON.stringify(stable(value)))
    .digest("hex");
}
export function normalize(value, path = "root") {
  if (Array.isArray(value))
    return value.map((item, i) => {
      const result = normalize(item, `${path}.${i}`);
      return result && typeof result === "object" && !Array.isArray(result)
        ? {
            ...result,
            _type:
              result._type ??
              {
                faq: "faqItem",
                faqs: "faqItem",
                members: "teamLeadItem",
                endorsements: "testimonial",
                navLinks: "navLink",
                footerQuickLinks: "navLink",
                socialLinks: "socialLink",
                credentials: "partnerItem",
              }[path.split(".").at(-1)] ??
              "object",
            _key: result._key ?? fingerprint(`${path}.${i}`).slice(0, 16),
          }
        : result;
    });
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .filter(
          ([key]) =>
            !["_rev", "_createdAt", "_updatedAt", "_system"].includes(key),
        )
        .map(([key, item]) => [key, normalize(item, `${path}.${key}`)]),
    );
  return value;
}
export function buildPlan(desired, current) {
  const ids = new Set();
  const changes = [];
  for (const raw of desired) {
    const doc = normalize(raw, raw._id);
    if (ids.has(doc._id)) throw new Error(`Duplicate desired ID: ${doc._id}`);
    ids.add(doc._id);
    const before = current.find((d) => d._id === doc._id);
    if (!before && doc._type === "blogPost")
      throw new Error(`Blog correction target is missing: ${doc._id}`);
    if (before && before._type !== doc._type)
      throw new Error(`Document type mismatch: ${doc._id}`);
    const fields = Object.fromEntries(
      Object.entries(doc).filter(([key]) => !key.startsWith("_")),
    );
    const unset = (retired[doc._type] ?? []).filter(
      (key) => !(key in fields) && before && key in before,
    );
    const set = Object.fromEntries(
      Object.entries(fields).filter(
        ([key, value]) =>
          !before || fingerprint(value) !== fingerprint(before[key] ?? null),
      ),
    );
    // Legacy SEO is a managed marketing field; reset it when no reviewed SEO is supplied.
    if (doc._type !== "blogPost" && before?.seo && !("seo" in fields))
      unset.push("seo");
    if (!before || Object.keys(set).length || unset.length)
      changes.push({
        id: doc._id,
        type: doc._type,
        action: before ? "patch" : "create",
        expectedRevision: before?._rev ?? null,
        before: before ?? null,
        document: doc,
        set,
        unset: [...new Set(unset)],
      });
  }
  return { version: 1, sourceHash: fingerprint(desired), changes };
}
export function assertUnchanged(plan, current) {
  for (const change of plan.changes) {
    const now = current.find((d) => d._id === change.id);
    if ((now?._rev ?? null) !== change.expectedRevision)
      throw new Error(
        `Concurrent edit or creation detected: ${change.id}. Generate a new plan.`,
      );
  }
}
export function assertNoDrafts(ids, current) {
  const targets = new Set(ids.map((id) => `drafts.${id}`));
  const drafts = current.filter((doc) => targets.has(doc._id));
  if (drafts.length)
    throw new Error(
      `Unpublished drafts detected: ${drafts.map((doc) => doc._id).join(", ")}. Resolve those edits and generate a new plan before applying.`,
    );
}
export function mutationsFor(plan) {
  return plan.changes.map((c) =>
    c.action === "create"
      ? { create: c.document }
      : {
          patch: {
            id: c.id,
            ifRevisionID: c.expectedRevision,
            set: c.set,
            ...(c.unset.length ? { unset: c.unset } : {}),
          },
        },
  );
}
export function rollbackMutations(receipt, current) {
  const result = [];
  for (const c of receipt.changes) {
    const now = current.find((d) => d._id === c.id);
    if (!c.afterRevision || now?._rev !== c.afterRevision)
      throw new Error(`Rollback stopped: ${c.id} has changed since migration.`);
    if (c.before) {
      const touched = [...Object.keys(c.set), ...c.unset];
      const set = Object.fromEntries(
        touched.filter((k) => k in c.before).map((k) => [k, c.before[k]]),
      );
      const unset = touched.filter((k) => !(k in c.before));
      result.push({
        patch: {
          id: c.id,
          ifRevisionID: c.afterRevision,
          set,
          ...(unset.length ? { unset } : {}),
        },
      });
    } else {
      // Revision guard and delete are atomic, including concurrent edits between read and commit.
      result.push(
        {
          patch: {
            id: c.id,
            ifRevisionID: c.afterRevision,
            set: { contentVersion: 2 },
          },
        },
        { delete: { id: c.id } },
      );
    }
  }
  return result;
}
