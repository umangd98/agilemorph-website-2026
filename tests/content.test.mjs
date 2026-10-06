import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const docs = JSON.parse(
  fs.readFileSync(
    new URL("../src/data/reviewed-content.json", import.meta.url),
    "utf8",
  ),
);
const projects = docs.filter((d) => d._type === "caseStudy");
const services = docs.filter((d) => d._type === "servicePage");
const ids = new Set(docs.map((d) => d._id));
test("reviewed content has stable unique identities and eight substantive case studies", () => {
  assert.equal(ids.size, docs.length);
  assert.equal(projects.filter((p) => p.detailed).length, 8);
  for (const p of projects.filter((p) => p.detailed)) {
    for (const key of ["problem", "contribution", "outcome"])
      assert.ok(p[key]?.length > 80, `${p.slug.current}: ${key}`);
    assert.ok(p.solution.length >= 3);
    assert.ok(p.workflow.length >= 3);
  }
});
test("all project references resolve and every service has relevant proof", () => {
  function check(v) {
    if (Array.isArray(v)) v.forEach(check);
    else if (v && typeof v === "object") {
      if (v._type === "reference" && !v._ref.startsWith("image-"))
        assert.ok(ids.has(v._ref), v._ref);
      Object.values(v).forEach(check);
    }
  }
  docs.forEach(check);
  for (const s of services) {
    assert.ok(s.featuredProjects.length);
    for (const r of s.featuredProjects) {
      const p = projects.find((p) => p._id === r._ref);
      assert.ok(
        s.parentService === "engagement" || p.services.includes(s.slug.current),
        `${s.slug.current}: unrelated proof`,
      );
    }
  }
});
test("status and attribution prevent undelivered results and employer/client conflation", () => {
  for (const p of projects) {
    assert.ok(p.attribution);
    if (p.status !== "delivered") assert.ok(!p.results?.length);
    assert.ok(!["Amazon", "Sixt", "Quido"].includes(p.client));
    if (p.category === "previous")
      assert.match(p.attribution, /previous|prior/i);
  }
  assert.equal(
    projects.find((p) => p.slug.current === "restaurant-operations").status,
    "scoped",
  );
  assert.equal(
    projects.find((p) => p.slug.current === "consultancy-gtm").status,
    "in-progress",
  );
  assert.match(
    projects.find((p) => p.slug.current === "chronoseconds").attribution,
    /Quido/,
  );
});
test("marketing claims and commercial terms are reconciled", () => {
  const marketing = docs.filter((d) => d._type !== "caseStudy");
  const text = JSON.stringify(marketing);
  for (const phrase of [
    "500K",
    "500,000",
    "180+",
    "98%",
    "4.9",
    "PLATINUM",
    "SOC-ready",
    "SOC 2 certified",
    "100% webhook",
    "Limited time",
  ])
    assert.ok(!text.includes(phrase), phrase);
  const pricing = docs.find((d) => d._id === "pricingPage");
  assert.equal(pricing.engagements[0].label, "Free · 15 minutes");
  for (const e of pricing.engagements.slice(1))
    assert.equal(e.label, "Quoted to scope");
  assert.ok(!JSON.stringify(pricing).includes("$"));
  const home = docs.find((d) => d._id === "homepage");
  assert.ok(
    home.featuredProjects.every(
      (r) => projects.find((p) => p._id === r._ref)?.category === "company",
    ),
  );
  assert.ok(home.testimonials.items.every((t) => t.relationship === "client"));
});
test("named outcome claims preserve scope and qualifiers", () => {
  const deep = projects.find((p) => p.slug.current === "deeply-ai-coaching");
  assert.match(deep.outcome, /relative/);
  const punch = projects.find(
    (p) => p.slug.current === "punchbowl-support-agent",
  );
  assert.match(punch.outcome, /held-out set of 786/);
  assert.match(punch.outcome, /cancellation\/refund tickets/);
  const cert = projects.find(
    (p) => p.slug.current === "certifyos-document-review",
  );
  assert.match(cert.outcome, /approximately/);
  assert.match(cert.solution.join(" "), /not AgileMorph certifications/);
});

test("capability filtering handles empty datasets and preserves separate project statuses", async () => {
  const ts = await import("typescript");
  const source = fs.readFileSync(
    new URL("../src/lib/portfolio.ts", import.meta.url),
    "utf8",
  );
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext },
  }).outputText;
  const { filterProjects, groupProjects } = await import(
    "data:text/javascript;base64," + Buffer.from(compiled).toString("base64")
  );
  assert.deepEqual(filterProjects([], "all"), []);
  assert.deepEqual(filterProjects(projects, "unmatched-capability"), []);
  const filtered = filterProjects(projects, "ai-automation");
  const groups = groupProjects(filtered);
  assert.ok(
    groups.company.every(
      (p) => p.category === "company" && p.status === "delivered",
    ),
  );
  assert.ok(
    groups.previous.every(
      (p) => p.category === "previous" && p.status === "delivered",
    ),
  );
  assert.ok(groups.ongoing.every((p) => p.status !== "delivered"));
  assert.equal(
    groups.company.length + groups.previous.length + groups.ongoing.length,
    filtered.length,
  );
});
