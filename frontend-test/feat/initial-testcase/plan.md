# Plan: Initial frontend test suite for portfolio website

- Status: done
- Spec: [spec.md](./spec.md)
- Approver: King
- Date: 2026-11-17

## Approach
Install Playwright and add a root `playwright.config.ts` that builds and serves the site, then runs specs from `frontend-test/tests` on desktop Chromium. A custom fixture gives every test a ready `HomePage` page object and blocks third-party requests. Each requirement R1-R12 gets its own spec file and reads expected values from `data/expected.ts`.

## Files changed
| Path | Change |
|---|---|
| `package.json` / `package-lock.json` | modify - add `@playwright/test` dev dependency, `test:e2e` and `test:e2e:report` scripts |
| `.gitignore` | modify - add `test-results/`, `playwright-report/`, `playwright/.cache/` |
| `playwright.config.ts` | new - Chromium desktop project, webServer, baseURL, retries, reporter |
| `frontend-test/data/expected.ts` | new - expected labels, URLs, email, item counts |
| `frontend-test/pages/HomePage.ts` | new - `goto()` and one locator group per section |
| `frontend-test/fixtures/test.ts` | new - `test` extended with `homePage` fixture and third-party route blocking; re-exports `expect` |
| `frontend-test/tests/r01-*.spec.ts` ... `r12-*.spec.ts` | new - 12 spec files, one per requirement |
| `app/components/*.tsx` | none expected - `data-testid` only if a role/text locator is ambiguous (logged under Deviations) |

## Order of work
1. Install `@playwright/test`, `npx playwright install chromium`, add scripts and `.gitignore` entries - check: `npx playwright --version`
2. Write `playwright.config.ts` - check: `npx playwright test --list` runs without config errors
3. Write `data/expected.ts` from current `app/data/*` - check: `npx tsc --noEmit`
4. Write `pages/HomePage.ts` and `fixtures/test.ts` - check: `npx tsc --noEmit`
5. Write `r01`-`r08` content specs one at a time - check: `npx playwright test r0<N>` after each
6. Write `r09-scroll-animations.spec.ts` - check: `npx playwright test r09 --repeat-each=5` (flakiness guard for C1)
7. Write `r10`-`r12` link specs - check: `npx playwright test r1`
8. Full run with timing, then CI mode - check: `npm run test:e2e` (< ~2 min) and `CI=true npm run test:e2e`
9. Confirm site still builds and only allowed files changed - check: `npm run build`, `git status`

## Proving tests
| Test | Proves | Requirement |
|---|---|---|
| `r01-nav-content.spec.ts` | `kjr` home link + Career/Projects/Contact links visible | R1 |
| `r02-intro-content.spec.ts` | greeting, h1 name, facts visible | R2 |
| `r03-project-ticker-content.spec.ts` | caption + one logo per project with alt | R3 |
| `r04-tech-stack-content.spec.ts` | heading, each primary item name/use, tool strip | R4 |
| `r05-career-content.spec.ts` | heading, row count, org/role/period per row | R5 |
| `r06-projects-content.spec.ts` | heading, card count, title/description, named preview media | R6 |
| `r07-contact-content.spec.ts` | heading, 4 entries, map iframe by title | R7 |
| `r08-footer-content.spec.ts` | name link, current-year copyright, location, Back to top | R8 |
| `r09-scroll-animations.spec.ts` | below-fold element opacity 0 -> 1 after scroll, per section | R9 |
| `r10-external-links.spec.ts` | LinkedIn/GitHub href, target, rel | R10 |
| `r11-email-links.spec.ts` | Contact email + Footer name `mailto:` href | R11 |
| `r12-external-link-new-tab.spec.ts` | click opens popup, home URL unchanged, external request blocked | R12 |

## Risks
- What could break: `next build` type-checks every `.ts` in the repo (tsconfig `include: **/*.ts`), so a type error in test code would fail the site build. Mitigation: `npx tsc --noEmit` at steps 3-4 and `npm run build` at step 9; if it becomes a problem, add `frontend-test` and `playwright.config.ts` to tsconfig `exclude`.
- Riskiest step: R9 animations (C1). framer-motion `whileInView` depends on IntersectionObserver and transition timing. Mitigation: assert initial opacity before scrolling, then `toHaveCSS('opacity', '1')` with auto-wait; verify with `--repeat-each=5`.
- Run time (C3): production build may exceed 2 min. Mitigation: `reuseExistingServer` locally; if still slow, switch local webServer to `next dev` and keep the build for CI.
- Hard-coded expectations (C2) drift from `app/data`; accepted until next phase.

## Rejected options
- Single spec file per concern (render / animations / links) - rejected by King; one file per requirement gives direct traceability.
- Importing `app/data/*` into tests now - deferred to next phase per intent.
- Cypress / Vitest + Testing Library - intent constraint is Playwright; component tests would not cover scroll and real rendering.
- `data-testid` everywhere - role/text locators are more readable and test what users see; testids only as fallback.
- Running against `next dev` by default - production build is closer to what ships and what CI will test.

## Deviations
- r01-r08 written by a parallel subagent while r09-r12 were written in the main session, sharing one running production server; foundation files (config, fixture, page object, data) were written first since both depend on them.
- R12 asserts the new tab via the `popup` event plus a blocked-request check; a trivial `popup !== page` assertion was dropped.
- `blockedRequests` exposed as an auto fixture so R12 can prove the external request was blocked (AC3).
- No `data-testid` needed; site code unchanged.
- Results: 53 tests, cold run incl. build 15 s; `CI=true` run passes; r09 stable over `--repeat-each=5`, r01-r08 over `--repeat-each=3`; `npm run build` passes.
