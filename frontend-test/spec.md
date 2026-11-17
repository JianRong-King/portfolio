# Spec: Initial frontend test suite for portfolio website

- Status: approved
- Intent: [intent.md](./intent.md)
- Date: 2026-11-17

## Summary
Add a Playwright end-to-end suite that loads the home page on a desktop Chromium viewport and verifies three things: every section renders its content, scroll-triggered content becomes visible, and contact links point to the correct destinations. Tests use a page object for locators, a shared fixture, a single test-data file for expected values, and one spec file per requirement named after it, so each requirement traces to exactly one file.

## Functional requirements
Content render
- R1: Nav shows the `kjr` home link and the Career, Projects and Contact links.
- R2: Intro shows the greeting, name lines (h1) and profile facts.
- R3: Contributed projects ticker shows its caption and one logo image per contributed project, each with alt text.
- R4: Tech stack shows its heading, every primary tech item (name + use) and the tool strip.
- R5: Career shows its heading and one row per career item with org, role and period.
- R6: Projects shows its heading and one card per selected work item with title and description; each card's preview media (image, video, phone mockup or gallery) is present with an accessible name.
- R7: Contact shows its heading, LinkedIn, GitHub, Email and "Active in" entries, and the map iframe (by title).
- R8: Footer shows the name link, copyright with the current year, location and "Back to top" link.

Scroll animations
- R9: For each animated section (Tech stack, Career, Projects), an element below the fold starts hidden (opacity 0) and reaches opacity 1 after being scrolled into view.

Links
- R10: LinkedIn and GitHub links have the expected `href`, `target="_blank"` and `rel="noopener noreferrer"`.
- R11: Contact email link and Footer name link have `href="mailto:<expected email>"`.
- R12: Clicking an external contact link opens a new tab and the home page keeps its URL; third-party requests are blocked in tests so no external site is loaded.

## Non-functional requirements
- Full suite completes in under ~2 min locally with one command (`npm run test:e2e`).
- Deterministic: no fixed sleeps; rely on Playwright auto-waiting assertions.
- Runs headless with no manual setup beyond `npm install` and `npx playwright install chromium`, so it can move into CI unchanged.
- Code style: TypeScript, no unnecessary comments, clear separation between config, page objects, test data and specs.

## Design

### Folder layout
One spec file per requirement, named `r<NN>-<requirement>.spec.ts`.
```
playwright.config.ts                  root config, testDir -> frontend-test/tests
frontend-test/
  intent.md  spec.md  plan.md         SDLC docs
  fixtures/test.ts                    extends Playwright test: homePage fixture + third-party request blocking
  pages/HomePage.ts                   page object: section + element locators
  data/expected.ts                    hard-coded expected values (links, counts, labels)
  tests/
    r01-nav-content.spec.ts
    r02-intro-content.spec.ts
    r03-project-ticker-content.spec.ts
    r04-tech-stack-content.spec.ts
    r05-career-content.spec.ts
    r06-projects-content.spec.ts
    r07-contact-content.spec.ts
    r08-footer-content.spec.ts
    r09-scroll-animations.spec.ts
    r10-external-links.spec.ts
    r11-email-links.spec.ts
    r12-external-link-new-tab.spec.ts
```

### Config
- Project: Chromium only, viewport 1280x720, `reducedMotion: 'no-preference'` (site uses framer-motion `reducedMotion="user"`).
- `webServer`: `npm run build && npm run start` on port 3000; `reuseExistingServer: !process.env.CI` so a running local server is reused.
- `baseURL: http://localhost:3000`, retries 0 locally / 2 in CI, HTML reporter.
- Third-party requests (Google Maps embed, external link targets) are blocked in the shared fixture with `context.route` to keep tests fast and offline-safe.

### Locators
- Priority: role/label/text (`getByRole`, `getByText`) > existing ids (`#career`, `#work`, `#contact`) > `data-testid`.
- Intro and Tech stack sections have no id; scope them via `section` filtered by their heading. `data-testid` is added to site code only if a role/text locator proves ambiguous (allowed by intent constraint).

### Test data
- `expected.ts` holds expected URLs, email, labels and item counts, copied from `app/data/*` today. Reading `app/data` directly is the next phase.

### package.json
- Add dev dependency `@playwright/test`.
- Add scripts: `test:e2e` (`playwright test`), `test:e2e:report` (`playwright show-report`).
- `.gitignore`: `test-results/`, `playwright-report/`.

## Out of scope
- Nav scroll-to-section behaviour, Gallery carousel buttons, Projects "GitHub" / "Chat Now" buttons
- Mobile / responsive viewports
- Image load success (naturalWidth), broken link crawling, console error checks
- Visual comparison, accessibility audit, performance, cross-browser
- Auto-adapting tests to `app/data` changes (next phase)
- CI pipeline file (later)

## Concerns
| # | Concern | Area | Owner to resolve | Resolution |
|---|---|---|---|---|
| C1 | `whileInView` timing may flake if assertions don't wait for the transition | UX / reliability | Claude (plan) | resolved: auto-wait `toHaveCSS`; stable over 5 repeats |
| C2 | Hard-coded expected values drift when `app/data` changes | data | King | accepted until next phase |
| C3 | Production build adds ~30-60 s; may push past the 2 min target | performance | King | resolved: cold run incl. build is 15 s |
| C4 | Adding `data-testid` touches site code | scope | King | resolved: none needed |
| C5 | Footer copyright year depends on clock | reliability | Claude (plan) | resolved: year computed in test |

## Acceptance criteria
- [x] AC1 (R1-R12): each requirement has exactly one spec file `r<NN>-*.spec.ts`, and all pass
- [x] AC2 (R9): scroll animation test proves hidden -> visible for Tech stack, Career and Projects
- [x] AC3 (R10-R12): link tests make no real external request
- [x] AC4: `npm run test:e2e` passes from a clean checkout in under ~2 min
- [x] AC5: No site code changes other than optional `data-testid` attributes
- [x] AC6: Suite runs with `CI=true` without config changes

## Decision
Go / no-go: Go - King, 2026-11-17
