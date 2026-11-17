import { test, expect } from "../fixtures/test";
import { expected } from "../data/expected";

test.describe("R6 Projects content", () => {
  test("shows the heading", async ({ homePage }) => {
    await expect(homePage.heading(homePage.projects, expected.projects.heading)).toBeVisible();
  });

  test("shows one card per project", async ({ homePage }) => {
    await expect(homePage.projectCards()).toHaveCount(expected.projects.items.length);
  });

  for (const item of expected.projects.items) {
    test(`shows the ${item.title} card with description and media`, async ({ homePage }) => {
      const card = homePage.projectCard(item.title);
      await expect(card).toBeVisible();
      await expect(card).toContainText(item.description);
      await expect(homePage.projectMedia(card, item.media)).toBeVisible();
    });
  }
});
