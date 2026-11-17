import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyOptions, completeClassifications } from "../agents/classify";
import { fixOptions } from "../agents/fix";

const editTools = ["Edit", "Write", "Bash", "NotebookEdit"];

test("classify step only gets read-only tools", () => {
  const options = classifyOptions("/repo", 0.5);
  assert.deepEqual(options.tools, ["Read", "Glob", "Grep"]);
  assert.deepEqual(options.allowedTools, ["Read", "Glob", "Grep"]);
  for (const tool of editTools) assert.ok(options.disallowedTools?.includes(tool), `${tool} must be blocked`);
  assert.equal(options.permissionMode, "dontAsk");
  assert.equal(options.maxBudgetUsd, 0.5);
  assert.equal(options.outputFormat?.type, "json_schema");
});

test("fix step has no shell and a PreToolUse guard on edits", () => {
  const options = fixOptions("/repo", 0.4);
  assert.deepEqual(options.tools, ["Read", "Glob", "Grep", "Edit", "Write"]);
  assert.ok(!options.allowedTools?.includes("Bash"));
  assert.ok(options.disallowedTools?.includes("Bash"));
  assert.equal(options.hooks?.PreToolUse?.[0]?.matcher, "Edit|Write");
  assert.equal(options.maxBudgetUsd, 0.4);
});

test("failures without a verdict default to possible_regression", () => {
  const failures = [
    { id: "1", file: "a.spec.ts", title: "A", error: "x" },
    { id: "2", file: "b.spec.ts", title: "B", error: "y" },
  ];
  const result = completeClassifications(failures, [{ test: "A", verdict: "test_outdated", reason: "renamed" }]);
  assert.equal(result[0].verdict, "test_outdated");
  assert.equal(result[1].verdict, "possible_regression");
});
