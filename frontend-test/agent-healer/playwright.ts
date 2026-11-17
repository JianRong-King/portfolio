import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import type { FailingTest, TestRunResult } from "./config";

type JsonResult = { status: string; error?: { message?: string } };
type JsonTest = { status: string; results: JsonResult[] };
type JsonSpec = { id: string; title: string; file: string; tests: JsonTest[] };
type JsonSuite = { title: string; specs?: JsonSpec[]; suites?: JsonSuite[] };
type JsonReport = { suites: JsonSuite[]; errors?: { message?: string }[] };

const ANSI = /\u001b\[[0-9;]*m/g;

function playwright(repoRoot: string, args: string[], env: Record<string, string> = {}) {
  const cli = path.join(repoRoot, "node_modules", "@playwright", "test", "cli.js");
  return spawnSync(process.execPath, [cli, "test", ...args], {
    cwd: repoRoot,
    env: { ...process.env, ...env },
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
}

function collectSpecs(suite: JsonSuite, parents: string[], out: { spec: JsonSpec; titlePath: string[] }[]) {
  const titlePath = suite.title && !suite.title.endsWith(".ts") ? [...parents, suite.title] : parents;
  for (const spec of suite.specs ?? []) out.push({ spec, titlePath: [...titlePath, spec.title] });
  for (const child of suite.suites ?? []) collectSpecs(child, titlePath, out);
}

export function parseReport(report: JsonReport): TestRunResult {
  const specs: { spec: JsonSpec; titlePath: string[] }[] = [];
  for (const suite of report.suites) collectSpecs(suite, [], specs);

  if (specs.length === 0 && report.errors?.length) {
    throw new Error(`Test suite could not run: ${report.errors.map((e) => e.message).join("\n")}`);
  }

  let passed = 0;
  const failed: FailingTest[] = [];
  for (const { spec, titlePath } of specs) {
    for (const test of spec.tests) {
      if (test.status !== "unexpected") {
        if (test.status !== "skipped") passed++;
        continue;
      }
      const last = test.results[test.results.length - 1];
      failed.push({
        id: spec.id,
        file: spec.file,
        title: titlePath.join(" › "),
        error: (last?.error?.message ?? "unknown error").replace(ANSI, "").trim(),
      });
    }
  }
  return { passed, failed };
}

export function runSuite(repoRoot: string): TestRunResult {
  const dir = mkdtempSync(path.join(tmpdir(), "healer-"));
  const outputFile = path.join(dir, "results.json");
  try {
    playwright(repoRoot, ["--reporter=json"], { PLAYWRIGHT_JSON_OUTPUT_NAME: outputFile });
    return parseReport(JSON.parse(readFileSync(outputFile, "utf8")) as JsonReport);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function parseListCount(output: string): number {
  const match = output.match(/Total: (\d+) tests?/);
  if (!match) throw new Error(`Could not read test count from: ${output.slice(-500)}`);
  return Number(match[1]);
}

export function countTests(repoRoot: string): number {
  const result = playwright(repoRoot, ["--list"]);
  return parseListCount(`${result.stdout}\n${result.stderr}`);
}
