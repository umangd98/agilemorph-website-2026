#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import {
  assertUnchanged,
  assertNoDrafts,
  buildPlan,
  fingerprint,
  mutationsFor,
  rollbackMutations,
} from "./lib/reviewed-migration.mjs";

const args = process.argv.slice(2);
const value = (key) => {
  const i = args.indexOf(key);
  if (i < 0) return null;
  if (!args[i + 1] || args[i + 1].startsWith("--"))
    throw new Error(`Missing value for ${key}`);
  return args[i + 1];
};
const apply = args.includes("--apply");
const rollback = value("--rollback");
const planPath = value("--plan");
const output = value("--output") ?? ".context/reviewed-migration-plan.json";
const desired = JSON.parse(
  fs.readFileSync(
    new URL("../src/data/reviewed-content.json", import.meta.url),
    "utf8",
  ),
);
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
if (!projectId || !dataset)
  throw new Error("Configure the Sanity project and dataset.");
if (apply && !process.env.SANITY_API_WRITE_TOKEN)
  throw new Error(
    "Applying a migration requires SANITY_API_WRITE_TOKEN. Dry runs are read-only.",
  );
const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-02-19",
  useCdn: false,
  perspective: "raw",
  token: apply
    ? process.env.SANITY_API_WRITE_TOKEN
    : process.env.SANITY_API_READ_TOKEN,
});
const read = (ids) =>
  client.fetch("*[_id in $ids]", {
    ids: ids.flatMap((id) => [id, `drafts.${id}`]),
  });
const save = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", { mode: 0o600 });
};
if (rollback) {
  const receipt = JSON.parse(fs.readFileSync(rollback, "utf8"));
  if (receipt.projectId !== projectId || receipt.dataset !== dataset)
    throw new Error("Receipt belongs to another project or dataset.");
  const current = await read(receipt.changes.map((c) => c.id));
  assertNoDrafts(
    receipt.changes.map((c) => c.id),
    current,
  );
  const mutations = rollbackMutations(receipt, current);
  console.log(
    JSON.stringify(
      {
        mode: apply ? "rollback" : "rollback-dry-run",
        documents: receipt.changes.map((c) => c.id),
      },
      null,
      2,
    ),
  );
  if (apply && mutations.length) {
    save(output + ".rollback-backup.json", current);
    await client.mutate(mutations, { visibility: "sync" });
    console.log("Rollback applied.");
  }
} else if (apply) {
  if (!planPath)
    throw new Error("Apply requires --plan from a reviewed dry run.");
  const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
  if (plan.projectId !== projectId || plan.dataset !== dataset)
    throw new Error("Plan belongs to another project or dataset.");
  if (plan.sourceHash !== fingerprint(desired))
    throw new Error("Reviewed content changed. Generate a new dry-run plan.");
  const current = await read(desired.map((d) => d._id));
  assertNoDrafts(
    desired.map((d) => d._id),
    current,
  );
  assertUnchanged(plan, current);
  const fresh = buildPlan(desired, current);
  if (fingerprint(fresh.changes) !== fingerprint(plan.changes))
    throw new Error(
      "Plan no longer matches the reviewed source and current documents. Regenerate it.",
    );
  if (!plan.changes.length) {
    console.log("No changes needed.");
    process.exit(0);
  }
  const stamp = new Date().toISOString().replaceAll(":", "-");
  const receiptPath = `.context/content-backups/${stamp}.json`;
  const receipt = {
    ...plan,
    createdAt: new Date().toISOString(),
    applied: false,
  };
  save(receiptPath, receipt); // Complete before-state saved before the first write.
  const after = await client.mutate(mutationsFor(plan), {
    returnDocuments: true,
    returnFirst: false,
    visibility: "sync",
  });
  const revisions = new Map(after.filter(Boolean).map((d) => [d._id, d._rev]));
  receipt.changes = receipt.changes.map((c) => ({
    ...c,
    afterRevision: revisions.get(c.id),
  }));
  receipt.applied = true;
  save(receiptPath, receipt);
  console.log(
    `Applied ${plan.changes.length} changes. Rollback receipt: ${receiptPath}`,
  );
} else {
  const current = await read(desired.map((d) => d._id));
  const plan = {
    ...buildPlan(desired, current),
    projectId,
    dataset,
    drafts: current
      .filter((d) => d._id.startsWith("drafts."))
      .map((d) => ({ id: d._id, revision: d._rev })),
  };
  save(output, plan);
  console.log(
    JSON.stringify(
      {
        mode: "dry-run",
        output,
        drafts: plan.drafts,
        changes: plan.changes.map((c) => ({
          id: c.id,
          action: c.action,
          set: Object.keys(c.set),
          unset: c.unset,
        })),
      },
      null,
      2,
    ),
  );
}
