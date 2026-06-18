import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { AI_AUTOMATION_SUB_SERVICES } from "./ai-automation-sub-services.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
writeFileSync(
  join(root, "src/data/ai-automation-services.json"),
  `${JSON.stringify(AI_AUTOMATION_SUB_SERVICES, null, 2)}\n`,
);
