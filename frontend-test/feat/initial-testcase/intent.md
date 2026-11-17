# Intent: Initial frontend test suite for portfolio website

- Status: approved
- Owner: King
- Source: idea
- Date: 2026-11-17

## Problem
The portfolio website has no automated frontend checks. Every change to content, layout or animation is verified by eye, so a broken section, missing content or wrong contact link can ship unnoticed. The repo is also reviewed by recruiters, and it currently shows no evidence of a testing practice.

## Proposed outcome
- Running one command confirms the site's main flow on desktop works: every section renders its content, scroll-triggered content appears, and contact links point to the right destinations.
- The test code is clean and well separated, so a recruiter reading the repo sees a deliberate, professional structure.
- The intent -> spec -> plan -> code chain is kept in `frontend-test/feat/<feature>/` as a study reference for how the steps are done.

## Scope
In:
- Every section (Nav, Intro, FeaturedWork, ProjectTicker, TechStack, Career, Contact, Footer) renders with its content (text, images, video)
- Contact links resolve to the correct destinations
- Scroll animations reveal their content
- Desktop viewport only

Out:
- Nav button scroll-to-section behaviour
- Mobile / responsive layouts
- Broken link / image crawling and console error checks
- Visual pixel comparison
- Accessibility audit
- Performance / Lighthouse scores
- Cross-browser coverage
- Tests that adapt automatically to `app/data/*.ts` changes (next phase)

## Affected users & systems
- Users: King (runs tests locally, later in CI); recruiters (read the repo)
- Systems / modules: `app/page.tsx`, `app/components/*`, `app/data/*`; new `frontend-test/` folder; `package.json` scripts and dev dependencies

## Constraints
- Tool: Playwright
- Site code stays unchanged, except adding locators (e.g. `data-testid`)
- Clean code, clear separation of concerns, no unnecessary comments or code documentation
- Must be CI-ready without rework, though CI setup itself comes later

## Success criteria
- Every in-scope section has at least one passing test
- Full suite runs locally with one command in under ~2 min
- Suite can be added to a CI pipeline later without restructuring

## Open questions
- [ ] Target deadline (e.g. tied to job applications)? - King
- [ ] Which CI provider later (assumed GitHub Actions)? - King
- [ ] Should tests run against `next dev` or a production build (`next build && next start`)? - decide in spec
- [ ] Where should test code live: `frontend-test/` only, or the conventional `tests/` / `e2e/` at the repo root with docs in `frontend-test/`? - King
