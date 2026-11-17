import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { config } from "./config";
import { git } from "./context";

export function healBranchName(branch: string, sha: string): string {
  return `${config.healBranchPrefix}${branch}-${sha.slice(0, 7)}`;
}

export function prCreateArgs(base: string, head: string, title: string, bodyFile: string): string[] {
  return ["pr", "create", "--base", base, "--head", head, "--title", title, "--body-file", bodyFile];
}

export function commitCommentArgs(sha: string, bodyFile: string): string[] {
  return ["api", "--method", "POST", `repos/{owner}/{repo}/commits/${sha}/comments`, "-F", `body=@${bodyFile}`];
}

function gh(repoRoot: string, args: string[]): string {
  return execFileSync("gh", args, { cwd: repoRoot, encoding: "utf8" }).trim();
}

function withBodyFile<T>(body: string, use: (file: string) => T): T {
  const dir = mkdtempSync(path.join(tmpdir(), "healer-gh-"));
  const file = path.join(dir, "body.md");
  writeFileSync(file, body, "utf8");
  try {
    return use(file);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function openHealPr(repoRoot: string, branch: string, sha: string, body: string): string {
  const head = healBranchName(branch, sha);
  git(repoRoot, ["switch", "-c", head]);
  git(repoRoot, ["add", "--", ...config.editableDirs]);
  git(repoRoot, ["commit", "-m", `Heal outdated tests for ${branch}@${sha.slice(0, 7)}`]);
  git(repoRoot, ["push", "-u", "origin", head]);
  const url = withBodyFile(body, (file) => gh(repoRoot, prCreateArgs(branch, head, `Heal outdated tests for ${branch}`, file)));
  gh(repoRoot, ["workflow", "run", "test.yml", "--ref", head]);
  return url;
}

export function openPrNumber(repoRoot: string, branch: string): string | null {
  const number = gh(repoRoot, ["pr", "list", "--head", branch, "--state", "open", "--json", "number", "-q", ".[0].number"]);
  return number || null;
}

export function postComment(repoRoot: string, branch: string, sha: string, body: string): void {
  const pr = openPrNumber(repoRoot, branch);
  withBodyFile(body, (file) =>
    gh(repoRoot, pr ? ["pr", "comment", pr, "--body-file", file] : commitCommentArgs(sha, file))
  );
}
