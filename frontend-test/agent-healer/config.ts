export const config = {
  model: process.env.HEALER_MODEL ?? "claude-opus-4-6",
  maxAttempts: 3,
  budgetUsd: 0.9,
  maxTurns: {
    classify: 8,
    fix: 15,
  },
  effort: {
    classify: "medium",
    fix: "low",
  },
  editableDirs: ["frontend-test/pages/", "frontend-test/data/", "frontend-test/tests/"],
  siteDirs: ["app/", "styles/", "public/"],
  testsDir: "frontend-test/tests/",
  defaultBranch: "main",
  healBranchPrefix: "heal/",
  forbiddenTestMarkers: [".skip(", ".fixme(", ".only("],
} as const;

export type Verdict = "test_outdated" | "possible_regression";

export type FailingTest = {
  id: string;
  file: string;
  title: string;
  error: string;
};

export type Classification = {
  test: string;
  verdict: Verdict;
  reason: string;
};

export type TestRunResult = {
  passed: number;
  failed: FailingTest[];
};

export type AttemptRecord = {
  attempt: number;
  costUsd: number;
  accepted: boolean;
  rejectionReasons: string[];
  remainingFailures: number;
};

export type Outcome = "green" | "healed" | "regression_only" | "mixed" | "gave_up";

export type RunReport = {
  branch: string;
  sha: string;
  outcome: Outcome;
  classifications: Classification[];
  attempts: AttemptRecord[];
  changedFiles: string[];
  costUsd: number;
  finalResult: TestRunResult | null;
  giveUpReason?: string;
};

export const ciEnv = {
  branch: "HEAL_BRANCH",
  sha: "HEAL_SHA",
} as const;
