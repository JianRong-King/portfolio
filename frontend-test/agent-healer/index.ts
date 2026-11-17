import { classify } from "./agents/classify";
import { fix } from "./agents/fix";
import { ciEnv, type RunReport } from "./config";
import { currentBranch, currentSha, isWorkingTreeClean, resetWorkingTree, resolveBase, siteDiff } from "./context";
import { openHealPr, postComment } from "./github";
import { heal } from "./orchestrator";
import { countTests, runSuite } from "./playwright";
import { checkDiff, collectWorkingDiff } from "./postCheck";
import { buildGiveUpComment, buildHealPrBody, buildLocalSummary, buildRegressionComment } from "./report";

function deliver(repoRoot: string, report: RunReport): void {
  const { branch, sha, outcome } = report;
  if (outcome === "healed" || outcome === "mixed") {
    console.log(`Heal PR: ${openHealPr(repoRoot, branch, sha, buildHealPrBody(report))}`);
  }
  if (outcome === "regression_only" || outcome === "mixed") {
    postComment(repoRoot, branch, sha, buildRegressionComment(report));
  }
  if (outcome === "gave_up") {
    postComment(repoRoot, branch, sha, buildGiveUpComment(report));
  }
}

async function main(): Promise<number> {
  const repoRoot = process.cwd();
  const ci = process.argv.includes("--ci");

  if (!isWorkingTreeClean(repoRoot)) {
    console.error("Working tree has uncommitted changes. Commit or stash them before healing.");
    return 2;
  }

  const target = {
    branch: process.env[ciEnv.branch] ?? currentBranch(repoRoot),
    sha: process.env[ciEnv.sha] ?? currentSha(repoRoot),
  };
  const base = resolveBase(repoRoot);

  const report = await heal(
    {
      runSuite: () => runSuite(repoRoot),
      countTests: () => countTests(repoRoot),
      siteDiff: () => siteDiff(repoRoot, base),
      classify: (failures, diff, budget) => classify(repoRoot, failures, diff, budget),
      fix: (failures, classifications, diff, feedback, budget) =>
        fix(repoRoot, failures, classifications, diff, feedback, budget),
      collectDiff: () => collectWorkingDiff(repoRoot),
      checkDiff,
      reset: () => resetWorkingTree(repoRoot),
    },
    target
  );

  console.log(buildLocalSummary(report));
  if (ci) deliver(repoRoot, report);
  return report.outcome === "green" || report.outcome === "healed" ? 0 : 1;
}

main().then(
  (code) => process.exit(code),
  (error) => {
    console.error(error);
    process.exit(1);
  }
);
