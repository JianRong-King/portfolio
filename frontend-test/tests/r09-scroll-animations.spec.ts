import { test, expect } from "../fixtures/test";
import { expected } from "../data/expected";
import type { Locator } from "@playwright/test";
import type { HomePage } from "../pages/HomePage";

const animatedHeadings: { section: string; target: (home: HomePage) => Locator }[] = [
  { section: "Tech stack", target: (home) => home.heading(home.techStack, expected.techStack.heading) },
  { section: "Career", target: (home) => home.heading(home.career, expected.career.heading) },
  { section: "Projects", target: (home) => home.heading(home.projects, expected.projects.heading) },
];

test.describe("R9 scroll animations reveal content", () => {
  for (const { section, target } of animatedHeadings) {
    test(`${section} heading fades in when scrolled into view`, async ({ homePage }) => {
      const heading = target(homePage);

      await expect(heading).toHaveCSS("opacity", "0");
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toHaveCSS("opacity", "1");
    });
  }
});
