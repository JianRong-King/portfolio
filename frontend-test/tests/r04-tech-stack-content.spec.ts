import { test, expect } from "../fixtures/test";
import { expected } from "../data/expected";

test.describe("R4 Tech stack content", () => {
  test("shows the heading", async ({ homePage }) => {
    await expect(homePage.heading(homePage.techStack, expected.techStack.heading)).toBeVisible();
  });

  for (const item of expected.techStack.primary) {
    test(`shows ${item.name} with its use`, async ({ homePage }) => {
      const row = homePage.techStack
        .getByRole("listitem")
        .filter({ has: homePage.page.getByText(item.name, { exact: true }) });
      await expect(row).toBeVisible();
      await expect(row).toContainText(item.use);
    });
  }

  test("shows every tool in the tool strip", async ({ homePage }) => {
    for (const tool of expected.techStack.tools) {
      await expect(homePage.techStack.getByText(tool, { exact: true }).first()).toBeVisible();
    }
  });
});
