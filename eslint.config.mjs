import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored from the Kokonut UI and Bklit shadcn registries. Re-pulled with
    // `npx shadcn add`, not hand-edited, so they are not linted here.
    "src/components/kokonutui/**",
    "src/components/charts/**",
    "src/components/shimmering-text.tsx",
  ]),
]);

export default eslintConfig;
