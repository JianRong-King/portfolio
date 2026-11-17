import type { Options } from "@anthropic-ai/claude-agent-sdk";
import { config, type Classification, type FailingTest } from "../config";
import { readHooks } from "./hooks";
import { blockedTools, readTools, runAgent } from "./run";

const schema = {
  type: "object",
  properties: {
    classifications: {
      type: "array",
      items: {
        type: "object",
        properties: {
          test: { type: "string" },
          verdict: { type: "string", enum: ["test_outdated", "possible_regression"] },
          reason: { type: "string" },
        },
        required: ["test", "verdict", "reason"],
        additionalProperties: false,
      },
    },
  },
  required: ["classifications"],
  additionalProperties: false,
};

const systemPrompt = `You triage failing Playwright end-to-end tests for a portfolio website.
For each failing test decide one verdict:
- test_outdated: the site was changed on purpose and the test still expects the old behaviour. The site diff must show a deliberate change that explains the failure.
- possible_regression: the site looks broken, or the diff does not clearly explain the failure as an intended change.
Evidence rules:
- The site diff is the primary evidence. Read the failing spec, frontend-test/data/expected.ts and frontend-test/pages/HomePage.ts as needed.
- A changed URL, email, link target or removed content with no sign of intent (e.g. a typo, a broken value) is a possible_regression.
- When unsure, choose possible_regression. Wrongly healing a real bug is worse than reporting a false alarm.
You cannot edit files. Use the exact failing test title as "test". Keep each reason to one or two sentences.`;

export function classifyOptions(repoRoot: string, budgetUsd: number): Options {
  return {
    model: config.model,
    cwd: repoRoot,
    systemPrompt,
    tools: readTools,
    allowedTools: readTools,
    disallowedTools: ["Edit", "Write", ...blockedTools],
    permissionMode: "dontAsk",
    settingSources: ["project"],
    maxTurns: config.maxTurns.classify,
    effort: config.effort.classify,
    maxBudgetUsd: budgetUsd,
    outputFormat: { type: "json_schema", schema },
    hooks: { PreToolUse: readHooks(repoRoot) },
  };
}

export function classifyPrompt(failures: FailingTest[], diff: string): string {
  const list = failures.map((f) => `### ${f.title}\nFile: ${f.file}\nError:\n${f.error}`).join("\n\n");
  return `Failing tests:\n\n${list}\n\nSite diff since the base branch (app/, styles/, public/):\n\n${diff || "(no site changes)"}`;
}

export function completeClassifications(failures: FailingTest[], returned: Classification[]): Classification[] {
  return failures.map(
    (f) =>
      returned.find((c) => c.test === f.title) ?? {
        test: f.title,
        verdict: "possible_regression",
        reason: "No verdict returned by the classifier; treated as a possible regression.",
      }
  );
}

export async function classify(repoRoot: string, failures: FailingTest[], diff: string, budgetUsd: number) {
  const { result, costUsd } = await runAgent("classify", classifyPrompt(failures, diff), classifyOptions(repoRoot, budgetUsd));
  if (result.subtype !== "success") return { classifications: null, costUsd, stopReason: result.subtype };
  const output = result.structured_output as { classifications: Classification[] } | undefined;
  return {
    classifications: completeClassifications(failures, output?.classifications ?? []),
    costUsd,
    stopReason: null,
  };
}
