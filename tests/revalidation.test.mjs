import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function route() {
  const invalidated = [];
  const source = fs.readFileSync(
    new URL("../src/app/api/revalidate/route.ts", import.meta.url),
    "utf8",
  );
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    process: { env: { SANITY_REVALIDATE_SECRET: "local-test-secret" } },
    require(name) {
      if (name === "next/cache")
        return { revalidateTag: (...args) => invalidated.push(args) };
      if (name === "next/server")
        return {
          NextResponse: {
            json: (body, options = {}) => ({
              body,
              status: options.status ?? 200,
            }),
          },
        };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return { POST: exports.POST, invalidated };
}

test("a case-study webhook invalidates project and shared page content", async () => {
  const { POST, invalidated } = route();
  const response = await POST({
    headers: new Headers({ "x-sanity-webhook-secret": "local-test-secret" }),
    json: async () => ({ _type: "caseStudy" }),
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.revalidated, true);
  assert.deepEqual(invalidated, [
    ["caseStudy", "max"],
    ["reviewedContent", "max"],
  ]);
});

test("an unauthenticated webhook cannot invalidate content", async () => {
  const { POST, invalidated } = route();
  const response = await POST({
    headers: new Headers(),
    json: async () => ({ _type: "caseStudy" }),
  });
  assert.equal(response.status, 401);
  assert.equal(invalidated.length, 0);
});
