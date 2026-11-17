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

## SDLC docs

Work is driven by `intent.md -> spec.md -> plan.md` (see `frontend-test/` for the existing chain). Feature work needs approved docs before code; record deviations in `plan.md`.
