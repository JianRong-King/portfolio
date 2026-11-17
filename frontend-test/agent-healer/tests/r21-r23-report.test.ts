import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { RunReport } from "../config";
import { buildGiveUpComment, buildHealPrBody, buildLocalSummary, buildRegressionComment, formatCost } from "../report";

const base: RunReport = {
  branch: "eval/rename-heading",
  sha: "0123456789abcdef",
  outcome: "mixed",
  classifications: [
    { test: "R5 Career content > shows the heading", verdict: "test_outdated", reason: "Heading renamed in app/components/Career.tsx" },
    { test: "R10 LinkedIn link", verdict: "possible_regression", reason: "URL changed without | matching intent" },
  ],
  attempts: [
    { attempt: 1, costUsd: 0.12, accepted: false, rejectionReasons: ["Disallowed path changed: app/page.tsx"], remainingFailures: 2 },
    { attempt: 2, costUsd: 0.2, accepted: true, rejectionReasons: [], remainingFailures: 0 },
  ],
  changedFiles: ["frontend-test/data/expected.ts"],
  costUsd: 0.4234,
  finalResult: { passed: 52, failed: [] },
};

describe("R21-R23 reports", () => {
  it("formats cost to two decimals", () => {
    assert.equal(formatCost(0.4234), "$0.42");
    assert.equal(formatCost(0), "$0.00");
  });

  it("R21 heal PR body has header, verdicts, attempts, files, result and cost", () => {
    const body = buildHealPrBody(base);
    assert.match(body, /`eval\/rename-heading` @ `0123456`/);
    assert.doesNotMatch(body, /0123456789/);
    assert.match(body, /\| R5 Career content > shows the heading \| test_outdated \|/);
    assert.match(body, /\| 1 \| rejected \| 2 \| \$0\.12 \| Disallowed path changed: app\/page\.tsx \|/);
    assert.match(body, /\| 2 \| accepted \| 0 \| \$0\.20 \| - \|/);
    assert.match(body, /- `frontend-test\/data\/expected\.ts`/);
    assert.match(body, /Final run: 52 passed, 0 failed/);
    assert.match(body, /Cost: \$0\.42/);
  });

  it("escapes pipes in table cells", () => {
    assert.match(buildHealPrBody(base), /without \\\| matching/);
  });

  it("R22 regression comment lists only regressions and says tests were not changed", () => {
    const comment = buildRegressionComment(base);
    assert.match(comment, /R10 LinkedIn link/);
    assert.doesNotMatch(comment, /R5 Career content/);
    assert.match(comment, /No tests were changed for them/);
    assert.match(comment, /1 failing test\(s\)/);
  });

  it("R23 give-up comment includes the reason", () => {
    const comment = buildGiveUpComment({
      ...base,
      outcome: "gave_up",
      giveUpReason: "budget exhausted",
      finalResult: { passed: 50, failed: [{ id: "a", file: "f", title: "t", error: "e" }] },
    });
    assert.match(comment, /Reason: budget exhausted\. No PR was opened\./);
    assert.match(comment, /Final run: 50 passed, 1 failed/);
  });

  it("local summary names the outcome and handles empty sections", () => {
    const summary = buildLocalSummary({
      ...base,
      outcome: "green",
      classifications: [],
      attempts: [],
      changedFiles: [],
      costUsd: 0,
      finalResult: null,
    });
    assert.match(summary, /all tests passing/);
    assert.match(summary, /_No failing tests classified\._/);
    assert.match(summary, /_No fix attempts\._/);
    assert.match(summary, /_No files changed\._/);
    assert.match(summary, /Final run: not run/);
  });
});
