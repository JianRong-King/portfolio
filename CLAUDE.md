# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                 # Next.js dev server on :3000
npm run build               # production build (also type-checks every .ts/.tsx, including frontend-test/)
npm run start               # serve the production build

npm run test:e2e            # Playwright suite; builds + starts the site unless :3000 is already serving
npm run test:e2e:report     # open last HTML report
npx playwright test r05     # run one requirement's spec by filename prefix
npx playwright test r09 --repeat-each=5   # flakiness check
npx tsc --noEmit            # type-check without building

npm run test:healer         # healer unit tests (node:test via tsx), no API key needed
npm run heal                # self-healing loop locally; needs a clean working tree and Anthropic auth
HEALER_DEBUG=1 npm run heal # also log per-call token counts
```

No linter is configured. First-time Playwright setup: `npx playwright install chromium`.

On Windows, stopping a backgrounded `npm run start` can leave the `node` child listening on :3000; Playwright will then silently reuse that stale server.

## Architecture

Single-page Next.js 16 (App Router) portfolio, React 19, TypeScript, CSS Modules, framer-motion. No backend, no API routes; the page is fully static.

- **Content lives in `app/data/*.ts`, not in components.** Components in `app/components/` map over typed arrays/objects (`career`, `selectedWork`, `primaryTech`, `contact`, `profile`, ...). To add or change a project, job or link, edit the data file.
- `app/page.tsx` composes sections in order; `app/layout.tsx` wraps everything in `Nav` + `MotionProvider` and sets the `js` class on `<html>` before hydration.
- Section anchors used by Nav: `#career`, `#work` (Projects), `#contact`; `#top` is on `<main>`. Intro and TechStack have no id.
- `FeaturedWork` picks the preview per item: `gallery` (2+ slides) -> carousel, `mockup: "phones"` -> `PhoneMockup`, `.mp4` -> `<video>`, else `<img>`.
- `TechStack` maps icon name strings from data to `react-icons` components via a local registry; a new icon must be imported and registered there, or it renders nothing.

### Styling and motion
- Design tokens (colours, type scale, gutter, easing) are CSS variables in `styles/tokens.css`, imported by `app/globals.css`. Use them rather than raw values.
- Two animation systems: framer-motion `whileInView` (Career, TechStack, FeaturedWork; initial `opacity: 0`) and pure CSS for the Intro, gated on `:global(.js)` + `prefers-reduced-motion: no-preference`.
- `MotionProvider` sets `reducedMotion="user"`, so framer animations are skipped when the OS requests reduced motion.

## Frontend tests (`frontend-test/`)

Playwright e2e, desktop Chromium 1280x720 only. Config is `playwright.config.ts` at repo root.

- `tests/rNN-<requirement>.spec.ts` — exactly one file per requirement R1-R12 in `spec.md`. New requirement = new numbered file.
- Import `test`/`expect` from `fixtures/test.ts`, not `@playwright/test`. It provides the `homePage` fixture (already navigated) and an auto fixture that aborts every non-localhost request, exposed as `blockedRequests`.
- All locators go through `pages/HomePage.ts`. Prefer role/text locators, then section ids; `data-testid` only as a last resort and the only allowed change to site code for testing.
- Expected values are hard-coded in `data/expected.ts` and must be updated when `app/data/*` changes.
- Never assert on real external sites; check link attributes or `blockedRequests` instead.

## Self-healing loop (`frontend-test/agent-healer/`)

CI runs `.github/workflows/test.yml` on every push/PR; when it fails, `heal.yml` (`workflow_run`, skips `main`, `heal/*` and forks) runs `npm run heal -- --ci`.

- `orchestrator.ts` is plain code: run suite -> `agents/classify.ts` labels each failure `test_outdated` / `possible_regression` (read-only tools, JSON schema output) -> `agents/fix.ts` edits only outdated tests -> `postCheck.ts` rejects bad diffs -> rerun, max 3 attempts. Dependencies are injected so the loop is unit-tested with stubs.
- Guardrails live in code, not prompts: `tools` list per agent (no Bash), `agents/hooks.ts` limits reads to `frontend-test/`, `app/`, `styles/` and edits to `frontend-test/{pages,data,tests}/`, `budget.ts` caps spend at $0.90 per run. All limits are in `config.ts`.
- Model `claude-opus-4-6` by default, override with `HEALER_MODEL`. Each tool-using agent turn has a fixed ~113k cached-token overhead, so a heal costs roughly $0.15-0.55.
- In `--ci` mode `github.ts` opens a PR from `heal/<branch>-<sha7>` into the failing branch and comments on regressions; locally it only edits the working tree.

## SDLC docs

Work is driven by `intent.md -> spec.md -> plan.md`, one folder per feature at `frontend-test/feat/<feature-slug>/` (this overrides the ai-sdlc default `docs/sdlc/`). Start a new feature by copying `frontend-test/feat/_template/`; `feat/initial-testcase/` is the completed reference. Requirement numbers (R<N>) continue across features so each maps to one `tests/r<NN>-*.spec.ts`. Feature work needs approved docs before code; record deviations in `plan.md`.
