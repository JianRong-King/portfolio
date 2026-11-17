# Intent: Self-healing frontend test loop

- Status: approved
- Owner: King
- Source: idea
- Date: 2026-11-17

## Problem
When the site is changed on purpose (new heading, new project, reworded content), the frontend tests fall out of date and fail. Updating them is manual, so tests either block the change or get left broken. At the same time, a failing test can mean the site is actually broken, and that case must not be papered over by updating the test.

## Proposed outcome
- Every push runs the frontend tests automatically.
- When tests fail, an agent investigates and decides whether the tests are outdated or the site has a possible regression.
- Outdated tests: the agent updates the tests and opens a separate PR, targeting the failing branch, for King to review.
- Possible regression: the agent changes nothing and posts a comment explaining why it believes the site broke.
- Mixed result: one heal PR for the outdated tests plus a regression comment for the rest.
- Failure on `main` after a merge: not handled for now (deferred).
- The same loop can run locally for learning and debugging.

## Scope
In:
- CI workflow that runs the existing suite on every push / PR
- Healing loop triggered by any failed CI test run
- Agent that classifies each failure (test outdated vs possible regression)
- Test updates delivered as a separate PR targeting the failing branch; regressions reported as a comment
- Local run of the loop with one command
- Guardrails: edit scope, attempt cap, spending cap

Out:
- Agent editing site code (`app/**`, `styles/**`, `public/**`) or any file outside `frontend-test/**`
- Deleting, skipping or `fixme`-ing tests to make them pass
- Auto-merging any PR
- Writing tests for new features (healing existing tests only)
- Handling failures on `main` (revert PR deferred, changed during spec review)
- Mobile, accessibility, visual and other areas still out of scope from `initial-testcase`

## Affected users & systems
- Users: King (reviews heal PRs and regression reports); recruiters (read the repo)
- Systems / modules: new `frontend-test/agent-healer/`; new CI workflow under `.github/workflows/`; `frontend-test/pages`, `data`, `tests` (edited by the agent); `package.json` scripts and dependencies; GitHub repo secrets

## Constraints
- Engine: Claude Agent SDK (TypeScript)
- Code lives in `frontend-test/agent-healer/`
- Agent may edit only `frontend-test/**`; enforced in code, not just by prompt
- Max 3 fix attempts per CI run, then stop with a report
- Max ~$1 spend per run
- Anthropic API key stored as a GitHub secret
- Never pushes to `main`; every change goes through a PR King approves
- Clean code, clear separation, no unnecessary comments (same standard as `initial-testcase`)

## Success criteria
- After a deliberate site change (e.g. a renamed section heading), the loop opens a PR with updated tests that pass
- After a planted bug (e.g. a broken contact link), the loop does not change any test and reports a possible regression
- The loop runs locally with one command as well as in CI
- No run ever edits a file outside `frontend-test/**`
- No run exceeds 3 attempts or ~$1

## Open questions
- [x] Heal PR base: the failing branch. Failure on `main` after a merge: revert PR first chosen, then deferred during spec review - King
- [ ] Which Claude model, given the $1 cap? - decide in spec
- [ ] How to stop the healer's own PR from re-triggering the healer (loop guard)? - decide in spec
- [ ] How does the agent learn what changed (git diff vs base, CI logs, Playwright report)? - decide in spec
- [x] Mixed result: one heal PR plus a regression comment - King
- [x] Target deadline: none - King
