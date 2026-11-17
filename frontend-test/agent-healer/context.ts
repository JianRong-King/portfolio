import { execFileSync } from "node:child_process";
import { config } from "./config";

const MAX_DIFF_CHARS = 60_000;

export function git(repoRoot: string, args: string[]): string {
  return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).trim();
}

export function currentBranch(repoRoot: string): string {
  return git(repoRoot, ["rev-parse", "--abbrev-ref", "HEAD"]);
}

export function currentSha(repoRoot: string): string {
  return git(repoRoot, ["rev-parse", "HEAD"]);
}

export function isWorkingTreeClean(repoRoot: string): boolean {
  return git(repoRoot, ["status", "--porcelain"]) === "";
}

export function resolveBase(repoRoot: string): string {
  for (const ref of [`origin/${config.defaultBranch}`, config.defaultBranch]) {
    try {
      return git(repoRoot, ["merge-base", ref, "HEAD"]);
    } catch {
      continue;
    }
  }
  throw new Error(`Cannot find a merge base with ${config.defaultBranch}`);
}

export function siteDiff(repoRoot: string, base: string): string {
  const diff = git(repoRoot, ["diff", base, "HEAD", "--", ...config.siteDirs]);
  if (diff.length <= MAX_DIFF_CHARS) return diff;
  return `${diff.slice(0, MAX_DIFF_CHARS)}\n\n[diff truncated at ${MAX_DIFF_CHARS} characters; read changed files directly if needed]`;
}

export function resetWorkingTree(repoRoot: string): void {
  git(repoRoot, ["checkout", "HEAD", "--", "."]);
  git(repoRoot, ["clean", "-fd"]);
}
