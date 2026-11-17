import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { config } from "./config";
import { isEditableRepoPath } from "./guard";

export type DiffInput = {
  changedFiles: string[];
  addedLines: string[];
  testCountBefore: number;
  testCountAfter: number;
};

export type DiffCheck = {
  ok: boolean;
  reasons: string[];
};

function pathReasons(changedFiles: string[]): string[] {
  return changedFiles
    .filter((file) => !isEditableRepoPath(file))
    .map((file) => `Disallowed path changed: ${file}`);
}

function markerReasons(addedLines: string[]): string[] {
  return addedLines.flatMap((line) =>
    config.forbiddenTestMarkers
      .filter((marker) => line.includes(marker))
      .map((marker) => `Forbidden marker "${marker}" added: ${line.trim()}`)
  );
}

function countReasons(before: number, after: number): string[] {
  return after < before ? [`Test count dropped from ${before} to ${after}`] : [];
}

export function checkDiff(input: DiffInput): DiffCheck {
  const reasons = [
    ...pathReasons(input.changedFiles),
    ...markerReasons(input.addedLines),
    ...countReasons(input.testCountBefore, input.testCountAfter),
  ];
  return { ok: reasons.length === 0, reasons };
}

function git(repoRoot: string, args: string[]): string {
  return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" });
}

function lines(text: string): string[] {
  return text.split(/\r?\n/).filter((line) => line.length > 0);
}

function trackedAddedLines(repoRoot: string): string[] {
  return lines(git(repoRoot, ["diff", "-U0", "HEAD"]))
    .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
    .map((line) => line.slice(1));
}

function untrackedAddedLines(repoRoot: string, files: string[]): string[] {
  return files.flatMap((file) => lines(readFileSync(path.join(repoRoot, file), "utf8")));
}

export function collectWorkingDiff(repoRoot: string): { changedFiles: string[]; addedLines: string[] } {
  const tracked = lines(git(repoRoot, ["diff", "--name-only", "HEAD"]));
  const untracked = lines(git(repoRoot, ["ls-files", "--others", "--exclude-standard"]));
  return {
    changedFiles: [...tracked, ...untracked],
    addedLines: [...trackedAddedLines(repoRoot), ...untrackedAddedLines(repoRoot, untracked)],
  };
}
