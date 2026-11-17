# Plan: Self-healing frontend test loop

- Status: draft
- Spec: [spec.md](./spec.md)
- Approver: King
- Date: 2026-11-17

## Approach
Build the healer as plain TypeScript modules run with `tsx`. The deterministic parts (guard, post-check, budget, report, Playwright and git helpers) are pure or thin wrappers with unit tests. The two Agent SDK calls are isolated in `agents/`, and `orchestrator.ts` wires everything together. CI gets a `test.yml` that runs the suite and a `heal.yml` that runs the healer with `--ci` after a failed test run. Work is verified locally first, including both evals. CI evals follow after the workflows reach `main`, because `workflow_run` only fires for workflow files on the default branch.

## Files changed
| Path | Change |
|---|---|
| `package.json` / `package-lock.json` | modify - add `@anthropic-ai/claude-agent-sdk`, `tsx` (dev); scripts `heal`, `test:healer` |
| `playwright.config.ts` | modify - in CI also write a JSON report to `test-results-json/results.json` |
| `.gitignore` | modify - add `test-results-json/` |
| `.github/workflows/test.yml` | new - R13 |
| `.github/workflows/heal.yml` | new - R14 |
| `frontend-test/agent-healer/config.ts` | new - limits, model, allowed paths, prefixes |
| `frontend-test/agent-healer/guard.ts` | new - `isEditAllowed(path)`, Windows path normalization |
| `frontend-test/agent-healer/postCheck.ts` | new - inspect `git diff` (paths, skip/fixme/only) + test count |
| `frontend-test/agent-healer/budget.ts` | new - cumulative cost, remaining, exhausted |
| `frontend-test/agent-healer/report.ts` | new - markdown for PR body / comments |
| `frontend-test/agent-healer/playwright.ts` | new - run suite with JSON reporter, parse failures, `--list` count |
| `frontend-test/agent-healer/context.ts` | new - base resolution (`merge-base origin/main`), site diff |
| `frontend-test/agent-healer/agents/classify.ts` | new - read-only query, json_schema verdicts |
| `frontend-test/agent-healer/agents/fix.ts` | new - edit query with `PreToolUse` guard |
| `frontend-test/agent-healer/orchestrator.ts` | new - classify -> fix loop -> post-check -> rerun |
| `frontend-test/agent-healer/github.ts` | new - heal branch, commit, push, PR, comment, workflow dispatch |
| `frontend-test/agent-healer/index.ts` | new - CLI (local default, `--ci`) |
| `frontend-test/agent-healer/tests/r16-r17-guard.test.ts` etc. | new - unit tests (see Proving tests) |
| `CLAUDE.md` | modify - add `heal` / `test:healer` commands and healer architecture lines |

## Order of work
Steps marked (P) run in parallel via forked subagents once step 1 is done; each owns separate files.

1. Install deps, add scripts, `config.ts` - check: `npx tsc --noEmit`, `npx tsx --version`
2. (P) Fork A: `guard.ts`, `postCheck.ts`, `budget.ts`, `report.ts` + unit tests - check: `npm run test:healer`
3. (P) Fork B: `test.yml`, `heal.yml`, Playwright JSON reporter in CI - check: YAML lint via `npx yaml-lint` or `actionlint` if available; `CI=true npm run test:e2e` writes the JSON file
4. (P) Main session: `playwright.ts`, `context.ts` - check: script prints failures for a deliberately broken local test, then reverted
5. `agents/classify.ts`, `agents/fix.ts` - check: `npx tsc --noEmit`; one real classify call on a broken-test scenario (cost logged)
6. `orchestrator.ts`, `index.ts` (local mode) - check: `npm run heal` with green suite exits 0 without calling the agent
7. Local eval 1, deliberate change: on scratch branch `eval/rename-heading`, change the Career heading text; `npm run heal` - check: verdict `test_outdated`, edits only in `frontend-test/data|pages|tests`, suite green, <= 3 attempts, <= $1 (AC7, part of AC5)
8. Local eval 2, planted bug: on scratch branch `eval/broken-link`, change the LinkedIn URL in `app/data/contact.ts`; `npm run heal` - check: verdict `possible_regression`, `git diff -- frontend-test` empty (AC7, part of AC6)
9. `github.ts` + `--ci` mode - check: unit test of command construction; dry `--ci` run against a fake remote is skipped, real check happens in step 12
10. Full check: `npm run test:healer`, `npx tsc --noEmit`, `npm run build`, `npm run test:e2e`; update `CLAUDE.md` - check: all green
11. PR into `main`; King merges; King adds secret with `gh secret set ANTHROPIC_API_KEY`
12. CI evals: push `eval/rename-heading` and `eval/broken-link` - check: AC1, AC2, AC5, AC6 in GitHub; then delete eval branches and close their PRs

## Proving tests
| Test | Proves | Requirement |
|---|---|---|
| GitHub run on any push (step 12) | test check + artifacts | R13 |
| `heal.yml` `if` + CI eval on `heal/*` branch (step 12) | no heal for `main`, `heal/*`, forks, passing runs | R14 |
| Local + CI eval "deliberate change" | context collected, verdict `test_outdated`, heal PR | R15, R18, R21 |
| Local + CI eval "planted bug" | verdict `possible_regression`, comment, no test edits | R15, R22 |
| `tests/r16-classify-tools.test.ts` | classify options contain no Edit/Write/Bash | R16 |
| `tests/r17-guard.test.ts` | allowed vs denied paths incl. `..`, absolute, backslash, `fixtures/`, `agent-healer/` | R17 |
| `tests/r18-attempts.test.ts` | orchestrator stops after 3 attempts (agent and runner stubbed) | R18 |
| `tests/r19-post-check.test.ts` | rejects disallowed path, `.skip`/`.fixme`/`.only`, lower test count | R19 |
| `tests/r20-budget.test.ts` | stops at cap; passes remaining budget to each call | R20 |
| `tests/r21-r23-report.test.ts` | PR body, regression comment, give-up comment contents | R21, R22, R23 |
| `tests/r21-github.test.ts` | branch name, `gh` arguments, base = failing branch | R21, R22 |
| `npm run heal` evals with git status check | local mode runs loop and does no git/GitHub actions | R24 |

## Risks
- What could break: `next build` type-checks the healer (tsconfig includes `**/*.ts`); an SDK type error would break the site build. Mitigation: `tsc --noEmit` at every step and `npm run build` in step 10.
- Riskiest step: eval 2 (C2). If classify calls the planted bug `test_outdated`, the guardrails still allow a test edit. Mitigation: classify prompt states that the site diff is the evidence, and a changed expected value without a matching site change means a regression. Re-run eval 2 after any prompt change.
- CI-only behaviour: `workflow_run` needs the workflow on `main`, so step 12 cannot run before merge. Mitigation: all logic verified locally first; first CI run treated as a test with King watching.
- Agent SDK native binary on the Ubuntu runner (C6). Mitigation: check in step 12; fallback `pathToClaudeCodeExecutable`.
- Cost overshoot (C3): internal cap $0.90 per run; eval spend reported after each eval.
- Parallel forks editing shared files: avoided by file ownership per fork; `package.json` and `config.ts` finished in step 1 before forking.

## Rejected options
- Giving the agent Bash to run tests itself - would let it write files outside the guard and run arbitrary commands; the orchestrator reruns instead.
- One agent call that classifies and fixes - cannot enforce "no edits for regressions" in code.
- `claude-code-action` - chosen engine is the Agent SDK (intent).
- Vitest/Jest for healer unit tests - `node:test` via `tsx` needs no new framework.
- Running the healer against the CI artifact instead of rerunning - reruns are needed after each fix anyway, and keep local and CI paths identical.

## Deviations
<Filled during implementation.>
