import { Budget } from "./budget";
import {
  config,
  type AttemptRecord,
  type Classification,
  type FailingTest,
  type Outcome,
  type RunReport,
  type TestRunResult,
} from "./config";

export type HealerDeps = {
  runSuite: () => TestRunResult;
  countTests: () => number;
  siteDiff: () => string;
  classify: (
    failures: FailingTest[],
    diff: string,
    budgetUsd: number
  ) => Promise<{ classifications: Classification[] | null; costUsd: number; stopReason: string | null }>;
  fix: (
    failures: FailingTest[],
    classifications: Classification[],
    diff: string,
    feedback: string[],
    budgetUsd: number
  ) => Promise<{ costUsd: number; stopReason: string | null }>;
  collectDiff: () => { changedFiles: string[]; addedLines: string[] };
  checkDiff: (input: {
    changedFiles: string[];
    addedLines: string[];
    testCountBefore: number;
    testCountAfter: number;
  }) => { ok: boolean; reasons: string[] };
  reset: () => void;
};

type Target = { branch: string; sha: string };

export async function heal(deps: HealerDeps, target: Target): Promise<RunReport> {
  const budget = new Budget(config.budgetUsd);
  const attempts: AttemptRecord[] = [];
  const report = (outcome: Outcome, extra: Partial<RunReport> = {}): RunReport => ({
    ...target,
    outcome,
    classifications: [],
    attempts,
    changedFiles: [],
    costUsd: budget.spent,
    finalResult: null,
    ...extra,
  });

  const initial = deps.runSuite();
  if (initial.failed.length === 0) return report("green", { finalResult: initial });

  const diff = deps.siteDiff();
  const triage = await deps.classify(initial.failed, diff, budget.remaining);
  budget.record(triage.costUsd);
  if (!triage.classifications) {
    return report("gave_up", { giveUpReason: `Classification stopped: ${triage.stopReason}`, costUsd: budget.spent });
  }

  const classifications = triage.classifications;
  const regressionTitles = new Set(
    classifications.filter((c) => c.verdict === "possible_regression").map((c) => c.test)
  );
  const outdated = initial.failed.filter((f) => !regressionTitles.has(f.title));
  if (outdated.length === 0) {
    return report("regression_only", { classifications, finalResult: initial, costUsd: budget.spent });
  }

  const testCountBefore = deps.countTests();
  let pending = outdated;
  let feedback: string[] = [];
  let giveUpReason = `Outdated tests still failing after ${config.maxAttempts} attempts`;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    if (budget.exhausted) {
      giveUpReason = `Budget of $${config.budgetUsd.toFixed(2)} used up`;
      break;
    }

    const run = await deps.fix(pending, classifications, diff, feedback, budget.remaining);
    budget.record(run.costUsd);

    const changes = deps.collectDiff();
    const check = deps.checkDiff({ ...changes, testCountBefore, testCountAfter: deps.countTests() });
    if (!check.ok) {
      deps.reset();
      attempts.push({ attempt, costUsd: run.costUsd, accepted: false, rejectionReasons: check.reasons, remainingFailures: pending.length });
      feedback = check.reasons;
      continue;
    }

    const rerun = deps.runSuite();
    const unexpected = rerun.failed.filter((f) => !regressionTitles.has(f.title));
    attempts.push({ attempt, costUsd: run.costUsd, accepted: true, rejectionReasons: [], remainingFailures: unexpected.length });

    if (unexpected.length === 0) {
      const outcome = regressionTitles.size > 0 ? "mixed" : "healed";
      return report(outcome, { classifications, changedFiles: changes.changedFiles, finalResult: rerun, costUsd: budget.spent });
    }

    pending = unexpected;
    feedback = unexpected.map((f) => `${f.title} still fails: ${f.error.split("\n")[0]}`);
    if (run.stopReason) {
      giveUpReason = `Fix agent stopped: ${run.stopReason}`;
      break;
    }
  }

  deps.reset();
  return report("gave_up", { classifications, giveUpReason, costUsd: budget.spent });
}
