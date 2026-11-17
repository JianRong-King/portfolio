import type { HookCallback, Options, PreToolUseHookInput } from "@anthropic-ai/claude-agent-sdk";
import { config, type Classification, type FailingTest } from "../config";
import { isEditAllowed } from "../guard";
import { blockedTools, editTools, runAgent } from "./run";

const systemPrompt = `You update outdated Playwright end-to-end tests after an intentional change to a portfolio website.
Rules:
- Edit only files in frontend-test/pages/, frontend-test/data/ and frontend-test/tests/. Edits elsewhere are blocked.
- Prefer updating expected values in frontend-test/data/expected.ts and locators in frontend-test/pages/HomePage.ts over changing spec logic.
- Make the tests match the new intended site behaviour shown in the diff. Never weaken a test: do not remove assertions, delete tests, or add .skip, .fixme or .only.
- Keep the existing code style: no comments, small focused changes.
You cannot run commands; the tests are rerun for you after you finish.`;

function pathGuard(repoRoot: string): HookCallback {
  return async (input) => {
    const { tool_input } = input as PreToolUseHookInput;
    const filePath = (tool_input as { file_path?: string }).file_path ?? "";
    if (isEditAllowed(filePath, repoRoot)) return {};
    return {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: `Edits are only allowed in ${config.editableDirs.join(", ")}`,
      },
    };
  };
}

export function fixOptions(repoRoot: string, budgetUsd: number): Options {
  return {
    model: config.model,
    cwd: repoRoot,
    systemPrompt,
    tools: editTools,
    allowedTools: editTools,
    disallowedTools: blockedTools,
    permissionMode: "dontAsk",
    settingSources: ["project"],
    maxTurns: config.maxTurns.fix,
    maxBudgetUsd: budgetUsd,
    hooks: { PreToolUse: [{ matcher: "Edit|Write", hooks: [pathGuard(repoRoot)] }] },
  };
}

export function fixPrompt(
  failures: FailingTest[],
  classifications: Classification[],
  diff: string,
  feedback: string[]
): string {
  const list = failures
    .map((f) => {
      const reason = classifications.find((c) => c.test === f.title)?.reason ?? "";
      return `### ${f.title}\nFile: ${f.file}\nWhy it is outdated: ${reason}\nError:\n${f.error}`;
    })
    .join("\n\n");
  const previous = feedback.length ? `\n\nYour previous attempt was not accepted:\n- ${feedback.join("\n- ")}` : "";
  return `Update the tests so these outdated tests pass against the changed site.\n\n${list}\n\nSite diff since the base branch:\n\n${diff}${previous}`;
}

export async function fix(
  repoRoot: string,
  failures: FailingTest[],
  classifications: Classification[],
  diff: string,
  feedback: string[],
  budgetUsd: number
) {
  const { result, costUsd } = await runAgent(
    "fix",
    fixPrompt(failures, classifications, diff, feedback),
    fixOptions(repoRoot, budgetUsd)
  );
  return { costUsd, stopReason: result.subtype === "success" ? null : result.subtype };
}
