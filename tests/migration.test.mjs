import test from "node:test";
import assert from "node:assert/strict";
import {
  buildPlan,
  normalize,
  mutationsFor,
  assertUnchanged,
  assertNoDrafts,
  rollbackMutations,
} from "../scripts/lib/reviewed-migration.mjs";
const desired = [
  {
    _id: "homepage",
    _type: "homepage",
    contentVersion: 2,
    hero: { heading: "Reviewed" },
    faq: [{ question: "Who?", answer: "SMBs" }],
  },
  {
    _id: "caseStudy-example",
    _type: "caseStudy",
    contentVersion: 2,
    title: "Example",
  },
];
const before = [
  {
    _id: "homepage",
    _type: "homepage",
    _rev: "r1",
    hero: { heading: "Old" },
    stats: ["unsupported"],
    editorNote: "keep",
  },
  {
    _id: "singleton-aboutPage",
    _type: "aboutPage",
    _rev: "r2",
    title: "Other site",
  },
];
function applied(plan) {
  return plan.changes.map((c) =>
    c.action === "create"
      ? { ...c.document, _rev: "new" }
      : {
          ...c.before,
          ...c.set,
          ...Object.fromEntries(c.unset.map((k) => [k, undefined])),
          _rev: "new",
        },
  );
}
test("plan updates only owned fields and deterministic IDs", () => {
  const plan = buildPlan(desired, before);
  assert.equal(plan.changes.length, 2);
  assert.deepEqual(plan.changes[0].unset, ["stats"]);
  assert.ok(!("editorNote" in plan.changes[0].set));
  assert.equal(mutationsFor(plan)[0].patch.ifRevisionID, "r1");
  assert.ok(!plan.changes.some((c) => c.id === "singleton-aboutPage"));
  assert.deepEqual(normalize(desired), normalize(desired));
  assert.equal(normalize(desired[0]).faq[0]._type, "faqItem");
});
test("reapplying migrated content yields no changes", () => {
  const plan = buildPlan(desired, before);
  const current = applied(plan).map((d) =>
    Object.fromEntries(Object.entries(d).filter(([, v]) => v !== undefined)),
  );
  assert.equal(buildPlan(desired, current).changes.length, 0);
});
test("concurrent edits and creations invalidate a plan", () => {
  const plan = buildPlan(desired, before);
  assert.throws(
    () => assertUnchanged(plan, [{ ...before[0], _rev: "edited" }]),
    /Concurrent/,
  );
  assert.throws(
    () =>
      assertUnchanged(plan, [
        ...before,
        { _id: "caseStudy-example", _rev: "created" },
      ]),
    /Concurrent/,
  );
});
test("rollback restores previous fields and is revision guarded", () => {
  const plan = buildPlan(desired, before);
  const current = applied(plan);
  const receipt = {
    changes: plan.changes.map((c) => ({ ...c, afterRevision: "new" })),
  };
  const reverse = rollbackMutations(receipt, current);
  assert.equal(reverse[0].patch.set.hero.heading, "Old");
  assert.deepEqual(reverse[0].patch.set.stats, ["unsupported"]);
  assert.ok(reverse[0].patch.unset.includes("contentVersion"));
  assert.equal(reverse[1].patch.ifRevisionID, "new");
  assert.equal(reverse[2].delete.id, "caseStudy-example");
  assert.throws(
    () =>
      rollbackMutations(receipt, [
        { ...current[0], _rev: "later" },
        current[1],
      ]),
    /Rollback stopped/,
  );
});
test("wrong document types and duplicate fixture IDs are rejected", () => {
  assert.throws(
    () => buildPlan(desired, [{ ...before[0], _type: "other" }]),
    /mismatch/,
  );
  assert.throws(() => buildPlan([...desired, desired[0]], []), /Duplicate/);
});
test("migration refuses unpublished edits to its target documents", () => {
  assert.throws(
    () => assertNoDrafts(["homepage"], [{ _id: "drafts.homepage" }]),
    /Unpublished drafts/,
  );
  assert.doesNotThrow(() =>
    assertNoDrafts(["homepage"], [{ _id: "drafts.unrelated" }]),
  );
});
test("blog corrections preserve article metadata and cannot create incomplete articles", () => {
  const correction = {
    _id: "blogPost-example",
    _type: "blogPost",
    contentVersion: 2,
    body: [],
  };
  const article = {
    ...correction,
    _rev: "b1",
    title: "Existing title",
    seo: { title: "Existing SEO" },
    body: [{ _type: "block", _key: "b1", children: [] }],
  };
  const plan = buildPlan([correction], [article]);
  assert.deepEqual(Object.keys(plan.changes[0].set), ["body"]);
  assert.deepEqual(plan.changes[0].unset, []);
  assert.throws(() => buildPlan([correction], []), /target is missing/);
});
