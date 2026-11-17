import type { AttemptRecord, Classification, Outcome, RunReport, TestRunResult } from "./config";

const outcomeLabels: Record<Outcome, string> = {
  green: "all tests passing",
  healed: "outdated tests healed",
  regression_only: "possible regression",
  mixed: "tests healed, possible regression",
  gave_up: "gave up",
};

function cell(text: string): string {
  return text.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function shortSha(sha: string): string {
  return sha.slice(0, 7);
}

function header(report: RunReport, title: string): string {
  return `## ${title}: \`${report.branch}\` @ \`${shortSha(report.sha)}\``;
}

export function formatCost(costUsd: number): string {
  return `$${costUsd.toFixed(2)}`;
}

function verdictTable(rows: Classification[]): string {
  if (rows.length === 0) return "_No failing tests classified._";
  const body = rows.map((row) => `| ${cell(row.test)} | ${row.verdict} | ${cell(row.reason)} |`);
  return ["| Test | Verdict | Reason |", "|---|---|---|", ...body].join("\n");
}

function attemptsTable(attempts: AttemptRecord[]): string {
  if (attempts.length === 0) return "_No fix attempts._";
  const body = attempts.map(
    (a) =>
      `| ${a.attempt} | ${a.accepted ? "accepted" : "rejected"} | ${a.remainingFailures} | ${formatCost(a.costUsd)} | ${cell(a.rejectionReasons.join("; ")) || "-"} |`
  );
  return ["| Attempt | Result | Failures left | Cost | Rejection reasons |", "|---|---|---|---|---|", ...body].join("\n");
}

function changedFilesList(files: string[]): string {
  return files.length === 0 ? "_No files changed._" : files.map((file) => `- \`${file}\``).join("\n");
}

function finalResultLine(result: TestRunResult | null): string {
  return result ? `Final run: ${result.passed} passed, ${result.failed.length} failed` : "Final run: not run";
}

function costLine(report: RunReport): string {
  return `Cost: ${formatCost(report.costUsd)}`;
}

function section(title: string, body: string): string {
  return `### ${title}\n${body}`;
}

function join(parts: string[]): string {
  return `${parts.join("\n\n")}\n`;
}

export function buildHealPrBody(report: RunReport): string {
  return join([
    header(report, "Test healer"),
    "Updates tests the healer judged outdated. Review before merging.",
    section("Verdicts", verdictTable(report.classifications)),
    section("Attempts", attemptsTable(report.attempts)),
    section("Changed files", changedFilesList(report.changedFiles)),
    `${finalResultLine(report.finalResult)}\n${costLine(report)}`,
  ]);
}

export function buildRegressionComment(report: RunReport): string {
  const regressions = report.classifications.filter((row) => row.verdict === "possible_regression");
  return join([
    header(report, "Possible regression"),
    `${regressions.length} failing test(s) look like a site bug. No tests were changed for them.`,
    verdictTable(regressions),
    costLine(report),
  ]);
}

export function buildGiveUpComment(report: RunReport): string {
  return join([
    header(report, "Test healer gave up"),
    `Reason: ${report.giveUpReason ?? "unknown"}. No PR was opened.`,
    section("Verdicts", verdictTable(report.classifications)),
    section("Attempts", attemptsTable(report.attempts)),
    `${finalResultLine(report.finalResult)}\n${costLine(report)}`,
  ]);
}

export function buildLocalSummary(report: RunReport): string {
  const parts = [
    header(report, `Test healer: ${outcomeLabels[report.outcome]}`),
    section("Verdicts", verdictTable(report.classifications)),
    section("Attempts", attemptsTable(report.attempts)),
    section("Changed files", changedFilesList(report.changedFiles)),
    `${finalResultLine(report.finalResult)}\n${costLine(report)}`,
  ];
  if (report.giveUpReason) parts.splice(1, 0, `Reason: ${report.giveUpReason}`);
  return join(parts);
}
