import { test } from "node:test";
import assert from "node:assert/strict";
import { commitCommentArgs, healBranchName, prCreateArgs } from "../github";

test("heal branch is prefixed and uses the short sha", () => {
  assert.equal(healBranchName("feat/rename", "abcdef1234567"), "heal/feat/rename-abcdef1");
});

test("heal PR targets the failing branch", () => {
  const args = prCreateArgs("feat/rename", "heal/feat/rename-abcdef1", "Heal", "body.md");
  assert.equal(args[args.indexOf("--base") + 1], "feat/rename");
  assert.equal(args[args.indexOf("--head") + 1], "heal/feat/rename-abcdef1");
  assert.equal(args[args.indexOf("--body-file") + 1], "body.md");
});

test("commit comment posts to the failing sha", () => {
  const args = commitCommentArgs("abcdef1234567", "body.md");
  assert.ok(args.includes("repos/{owner}/{repo}/commits/abcdef1234567/comments"));
  assert.ok(args.includes("body=@body.md"));
});
