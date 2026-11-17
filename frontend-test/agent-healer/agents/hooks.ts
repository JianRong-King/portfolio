import type { HookCallback, HookCallbackMatcher, PreToolUseHookInput } from "@anthropic-ai/claude-agent-sdk";
import { config } from "../config";
import { isEditAllowed, isReadAllowed } from "../guard";

type ToolInput = { file_path?: string; path?: string };

function deny(reason: string) {
  return {
    hookSpecificOutput: {
      hookEventName: "PreToolUse" as const,
      permissionDecision: "deny" as const,
      permissionDecisionReason: reason,
    },
  };
}

function toolInput(input: unknown): ToolInput {
  return (input as PreToolUseHookInput).tool_input as ToolInput;
}

function editGuard(repoRoot: string): HookCallback {
  return async (input) => {
    const filePath = toolInput(input).file_path ?? "";
    return isEditAllowed(filePath, repoRoot) ? {} : deny(`Edits are only allowed in ${config.editableDirs.join(", ")}`);
  };
}

function readScopeGuard(repoRoot: string): HookCallback {
  const scope = [...config.readableDirs, ...config.readableFiles].join(", ");
  return async (input) => {
    const { file_path, path } = toolInput(input);
    const target = file_path ?? path;
    if (!target) return deny(`Set "path" to one of: ${scope}`);
    return isReadAllowed(target, repoRoot) ? {} : deny(`Reading is only allowed in ${scope}`);
  };
}

export function readHooks(repoRoot: string): HookCallbackMatcher[] {
  return [{ matcher: "Read|Grep|Glob", hooks: [readScopeGuard(repoRoot)] }];
}

export function editHooks(repoRoot: string): HookCallbackMatcher[] {
  return [...readHooks(repoRoot), { matcher: "Edit|Write", hooks: [editGuard(repoRoot)] }];
}
