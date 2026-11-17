# Spec: Self-healing frontend test loop

- Status: approved
- Intent: [intent.md](./intent.md)
- Date: 2026-11-17

## Summary
Add a CI workflow that runs the Playwright suite on every push and PR, and a healer in `frontend-test/agent-healer/` that runs when that workflow fails. The healer is a deterministic TypeScript orchestrator with two Claude Agent SDK steps. First, a read-only **classify** step labels each failing test as `test_outdated` or `possible_regression`. Second, a **fix** step edits tests only for the outdated failures. The orchestrator reruns the suite after each fix, enforces the attempt cap, the spending cap and the file-path rule in code, then opens a heal PR, posts a regression comment, or both.

## Functional requirements
CI
- R13: A test workflow runs `npm run test:e2e` on every push, every pull request and manual dispatch, and uploads the Playwright report and JSON results as artifacts.
- R14: A heal workflow runs when the test workflow completes with failure. It is skipped for `main`, for branches `heal/*` and for runs from forks, and allows one heal run per branch at a time.

Classify
- R15: The healer collects context: failing tests and their error messages from Playwright JSON results, and the site-code diff (`app/`, `styles/`, `public/`) between the failing commit and its base. The classify step returns, for every failing test, a verdict (`test_outdated` | `possible_regression`) and a reason, as structured output.
- R16: The classify step cannot change files: it has read-only tools (Read, Glob, Grep) and no Edit, Write or Bash.

Fix
- R17: The fix step runs only for `test_outdated` failures, with tools Read, Glob, Grep, Edit and Write and no Bash. A `PreToolUse` hook denies any Edit or Write outside `frontend-test/pages/`, `frontend-test/data/` and `frontend-test/tests/`.
- R18: After each fix attempt the orchestrator reruns the suite, at most 3 attempts. Healing succeeds when every `test_outdated` test passes and no previously passing test fails.
- R19: After each attempt a post-check, independent of the agent, rejects the attempt and resets the working tree if the diff:
  - touches a disallowed path;
  - adds `.skip`, `.fixme` or `.only`;
  - lowers the listed test count.
- R20: Total model spend per run stays at or under $1. Each agent call gets the remaining budget as `maxBudgetUsd`, cost is summed from `total_cost_usd`, and the loop stops when the budget is used up.

Deliver
- R21: On successful healing, the healer pushes a branch `heal/<branch>-<short-sha>`. It then opens a PR into the failing branch whose body lists verdicts, reasons, changed files, attempts, cost and the final test result, and dispatches the test workflow on the heal branch.
- R22: When any verdict is `possible_regression`, the healer comments on the failing branch's PR, or on the commit if no PR exists. The comment lists each failing test with its reason. Those tests are not edited. A mixed result produces both the heal PR (R21) and this comment.
- R23: When healing gives up (3 attempts or budget exhausted), the healer posts one comment with the report and opens no PR.

Local
- R24: `npm run heal` runs the same classify and fix loop locally against the working tree and prints the report. It does no git or GitHub actions unless `--ci` is passed.

## Non-functional requirements
- Model `claude-opus-4-6` (King's choice), overridable with `HEALER_MODEL`.
- Agent runs ignore user and local settings (`settingSources: ["project"]` only, which loads `CLAUDE.md`).
- Every limit (attempts, budget, allowed paths, branch prefixes) lives in one config file.
- Healer source code follows the same standard as the test suite: clean modules, no unnecessary comments.
- Deterministic parts have unit tests that run with no API key and no network.

## Design

### Flow
```
test.yml fails
  -> heal.yml (skip main, heal/*, forks; concurrency per branch)
     -> healer
        1. run suite, read JSON results          (failures)
        2. git diff base...head -- app styles public
        3. classify  (read-only agent, json_schema output)
        4. outdated? loop <= 3:
             fix (agent, hook-guarded edits) -> post-check -> rerun suite
        5. deliver: heal PR (R21) and/or regression comment (R22) or give-up comment (R23)
```

### Folder layout
```
.github/workflows/
  test.yml                       R13
  heal.yml                       R14
frontend-test/agent-healer/
  config.ts                      limits, model, allowed paths, branch prefixes
  index.ts                       CLI entry: local by default, --ci for GitHub actions
  orchestrator.ts                the loop: classify -> fix -> post-check -> rerun
  playwright.ts                  run suite with JSON reporter, parse failures, count tests
  context.ts                     git diff of site code, base resolution
  agents/classify.ts             Agent SDK query: read-only tools, json_schema verdicts
  agents/fix.ts                  Agent SDK query: edit tools + PreToolUse path guard
  guard.ts                       pure path rule used by the hook and the post-check
  postCheck.ts                   diff inspection: paths, skip/fixme/only, test count
  budget.ts                      cumulative cost tracking
  report.ts                      markdown report for PR body and comments
  github.ts                      branch, commit, push, gh pr create, gh comment, workflow dispatch
  tests/rNN-*.test.ts            unit tests for deterministic modules (node:test)
```

### Agent SDK usage
- Package `@anthropic-ai/claude-agent-sdk`, entry `query({ prompt, options })`.
- Classify: `allowedTools: ["Read", "Glob", "Grep"]`, `disallowedTools: ["Edit", "Write", "Bash"]`, `outputFormat: { type: "json_schema", schema }`, and the verdicts read from the result's structured output.
- Fix: `allowedTools: ["Read", "Glob", "Grep", "Edit", "Write"]`, `disallowedTools: ["Bash"]`, `hooks.PreToolUse` matcher `Edit|Write` calling `guard.ts`. Paths are normalized for Windows backslashes.
- Both calls set `cwd` to the repo root, `maxBudgetUsd` to the remaining budget and `maxTurns` from config. Result subtypes `error_max_budget_usd` and `error_max_turns` end the loop as a give-up (R23).
- Auth: `ANTHROPIC_API_KEY` from the GitHub secret in CI, and from the environment locally.

### CI details
- `test.yml`: triggers `push`, `pull_request`, `workflow_dispatch`. It installs Chromium, runs the suite with JSON and HTML reporters, and uploads artifacts.
- `heal.yml`: trigger `workflow_run` on `test.yml` with `types: [completed]`, gated by an `if` on conclusion `failure`, `head_repository == repository`, branch not `main` and not `heal/*`. Permissions are `contents: write`, `pull-requests: write` and `actions: write`. It checks out `head_sha` with full history.
- Heal PRs opened with `GITHUB_TOKEN` do not trigger `pull_request` workflows. The healer therefore runs `gh workflow run test.yml --ref heal/...` so the heal commit still gets a test check.

### Scripts / dependencies
- Add `@anthropic-ai/claude-agent-sdk` and `tsx` (dev).
- Scripts: `heal` (`tsx frontend-test/agent-healer/index.ts`), `test:healer` (`tsx --test frontend-test/agent-healer/tests/*.test.ts`).

## Out of scope
- Bash or any shell access for the agent
- Editing `fixtures/`, `agent-healer/`, config, workflows or site code
- Auto-merge, direct pushes to any existing branch
- Generating tests for new features
- Healing on fork PRs
- Failures on `main`: no healing and no revert PR for now (deferred; see intent)

## Concerns
| # | Concern | Area | Owner to resolve | Resolution |
|---|---|---|---|---|
| C1 | Public repo: `workflow_run` has secrets even for fork PRs, and fork code could prompt-inject the agent | security | Claude (spec) | resolved in R14: skip forks |
| C2 | Misclassification: a real regression labelled `test_outdated` gets "healed" | reliability | King | mitigated: separate classify step, post-check, human PR review; measured by planted-bug eval |
| C3 | `maxBudgetUsd` is a client-side estimate and can overshoot | cost | Claude (plan) | open: internal cap at $0.90, so the $1 limit has headroom |
| C4 | Opus 4.6 ($5/$25 per MTok) at ~$1 may run out on large diffs | cost | King | open: switch with `HEALER_MODEL` if evals show it |
| C5 | Failures on `main` are not handled automatically | scope | King | accepted: deferred to a later feature |
| C6 | Agent SDK needs its native CLI binary on the Ubuntu runner | build | Claude (plan) | open: verify in first CI run; fallback `pathToClaudeCodeExecutable` |
| C7 | Evals call the real API and cost money | cost | King | accepted: about $2 per eval round |

## Acceptance criteria
- [ ] AC1 (R13): push to a branch shows a test check with report artifacts
- [ ] AC2 (R14): heal workflow does not start for `main`, a `heal/*` branch or a passing run
- [x] AC3 (R16, R17, R19): unit tests prove the guard denies out-of-scope paths and the post-check rejects skip/fixme/only, fewer tests and disallowed paths
- [x] AC4 (R20): unit test proves the loop stops when cumulative cost reaches the cap
- [ ] AC5 (R15, R18, R21) eval "deliberate change": rename a section heading on a scratch branch; result is a heal PR into that branch with green tests, at most 3 attempts and $1
- [ ] AC6 (R15, R22) eval "planted bug": break the LinkedIn URL in `app/data/contact.ts`; result is a regression comment and no test files changed
- [x] AC7 (R24): `npm run heal` reproduces AC5 and AC6 locally without touching git (verdicts and edits as expected; one heal run at $0.33-0.56, see plan Deviations)
- [x] AC8: `npm run test:healer` passes without an API key; `npm run build` and `npm run test:e2e` still pass

## Decision
Go / no-go: Go - King, 2026-11-17
