import { test } from "node:test";
import assert from "node:assert/strict";
import { parseListCount, parseReport } from "../playwright";

const report = {
  suites: [
    {
      title: "r05-career-content.spec.ts",
      specs: [],
      suites: [
        {
          title: "R5 Career content",
          specs: [
            { id: "a", title: "shows the heading", file: "r05-career-content.spec.ts", tests: [{ status: "expected", results: [] }] },
            {
              id: "b",
              title: "shows one row per career item",
              file: "r05-career-content.spec.ts",
              tests: [{ status: "unexpected", results: [{ status: "failed", error: { message: "\u001b[31mExpected: 3\u001b[39m" } }] }],
            },
          ],
        },
      ],
    },
  ],
};

test("collects failing tests with title path and clean error", () => {
  const result = parseReport(report);
  assert.equal(result.passed, 1);
  assert.equal(result.failed.length, 1);
  assert.equal(result.failed[0].title, "R5 Career content › shows one row per career item");
  assert.equal(result.failed[0].error, "Expected: 3");
});

test("throws when the suite could not run", () => {
  assert.throws(() => parseReport({ suites: [], errors: [{ message: "webServer failed" }] }), /could not run/);
});

test("reads the listed test count", () => {
  assert.equal(parseListCount("Listing tests:\n...\nTotal: 53 tests in 12 files"), 53);
});
