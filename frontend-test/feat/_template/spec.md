# Spec: <title>

- Status: draft | approved | rejected
- Intent: [intent.md](./intent.md)
- Date: <YYYY-MM-DD>

## Summary
<One paragraph: what will be built and how it solves the intent's problem.>

## Functional requirements
- R<N>: <testable statement; numbering continues from the previous feature>

## Non-functional requirements
<Run time, determinism, CI-readiness, code style.>

## Design
### Folder layout
<New files; one spec file per requirement, `r<NN>-<requirement>.spec.ts`.>

### Config
<Changes to `playwright.config.ts`, projects, fixtures.>

### Locators
<New `HomePage` locators; any `data-testid` needed and why.>

### Test data
<Additions to `data/expected.ts`.>

## Out of scope
-

## Concerns
| # | Concern | Area | Owner to resolve | Resolution |
|---|---|---|---|---|
| C1 | | reliability / data / scope / performance | | open |

## Acceptance criteria
- [ ] AC1 (covers R<N>):

## Decision
Go / no-go: <pending - decided by King>
