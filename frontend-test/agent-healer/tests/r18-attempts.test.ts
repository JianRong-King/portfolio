import { test } from "node:test";
import assert from "node:assert/strict";
import type { Classification, FailingTest, TestRunResult } from "../config";
import { heal, type HealerDeps } from "../orchestrator";

const target = { branch: "feat/x", sha: "abcdef1234567" };
const failing = (title: string): FailingTest => ({ id: title, file: "r05.spec.ts", title, error: "expected X" });
const run = (...titles: string[]): TestRunResult => ({ passed: 10, failed: titles.map(failing) });

function deps(overrides: Partial<HealerDeps> & { verdicts?: Classification[] }): HealerDeps & { calls: Record<string, number> } {
  const calls = { fix: 0, reset: 0, runSuite: 0 };
  const base: HealerDeps = {
    runSuite: () => (calls.runSuite++, run("A")),
    countTests: () => 53,
    siteDiff: () => "diff",
    classify: async (failures) => ({
      classifications:
        overrides.verdicts ?? failures.map((f) => ({ test: f.title, verdict: "test_outdated" as const, reason: "r" })),
      costUsd: 0.05,
      stopReason: null,
    }),
    fix: async () => (calls.fix++, { costUsd: 0.1, stopReason: null }),
    collectDiff: () => ({ changedFiles: ["frontend-test/data/expected.ts"], addedLines: [] }),
    checkDiff: () => ({ ok: true, reasons: [] }),
    reset: () => void calls.reset++,
  };
  return Object.assign(base, overrides, { calls });
}

test("green suite never calls the agent", async () => {
  const d = deps({ runSuite: () => run() });
  const report = await heal(d, target);
  assert.equal(report.outcome, "green");
  assert.equal(d.calls.fix, 0);
});

test("stops after 3 attempts and resets the working tree", async () => {
  const d = deps({});
  const report = await heal(d, target);
  assert.equal(report.outcome, "gave_up");
  assert.equal(d.calls.fix, 3);
  assert.equal(report.attempts.length, 3);
  assert.equal(d.calls.reset, 1);
});

test("heals when the rerun passes", async () => {
  let runs = 0;
  const d = deps({ runSuite: () => (runs++ === 0 ? run("A") : run()) });
  const report = await heal(d, target);
  assert.equal(report.outcome, "healed");
  assert.equal(d.calls.fix, 1);
  assert.deepEqual(report.changedFiles, ["frontend-test/data/expected.ts"]);
});

test("regressions are never sent to the fix step", async () => {
  const d = deps({ verdicts: [{ test: "A", verdict: "possible_regression", reason: "broken link" }] });
  const report = await heal(d, target);
  assert.equal(report.outcome, "regression_only");
  assert.equal(d.calls.fix, 0);
});

test("mixed result heals outdated tests and keeps regressions failing", async () => {
  let runs = 0;
  const d = deps({
    runSuite: () => (runs++ === 0 ? run("A", "B") : run("B")),
    verdicts: [
      { test: "A", verdict: "test_outdated", reason: "renamed" },
      { test: "B", verdict: "possible_regression", reason: "broken" },
    ],
    fix: async (failures) => {
      assert.deepEqual(failures.map((f) => f.title), ["A"]);
      return { costUsd: 0.1, stopReason: null };
    },
  });
  const report = await heal(d, target);
  assert.equal(report.outcome, "mixed");
});

test("rejected attempts are reset and fed back", async () => {
  const feedbacks: string[][] = [];
  const d = deps({
    checkDiff: () => ({ ok: false, reasons: ["Disallowed path changed: app/page.tsx"] }),
    fix: async (_f, _c, _d, feedback) => (feedbacks.push(feedback), { costUsd: 0.1, stopReason: null }),
  });
  const report = await heal(d, target);
  assert.equal(report.outcome, "gave_up");
  assert.equal(report.attempts.every((a) => !a.accepted), true);
  assert.deepEqual(feedbacks[1], ["Disallowed path changed: app/page.tsx"]);
});

test("stops when the budget is used up", async () => {
  const d = deps({ fix: async () => ({ costUsd: 0.6, stopReason: null }) });
  const report = await heal(d, target);
  assert.equal(report.outcome, "gave_up");
  assert.match(report.giveUpReason ?? "", /Budget/);
  assert.ok(report.attempts.length < 3);
});
