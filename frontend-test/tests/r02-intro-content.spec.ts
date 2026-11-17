import { test, expect } from "../fixtures/test";
import { expected } from "../data/expected";

test.describe("R2 Intro content", () => {
  test("shows the greeting and name heading", async ({ homePage }) => {
    const heading = homePage.intro.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(expected.intro.greeting);
    await expect(heading).toContainText(expected.intro.name);
  });

  for (const fact of expected.intro.facts) {
    test(`shows the fact "${fact}"`, async ({ homePage }) => {
      await expect(homePage.intro.getByText(fact, { exact: true })).toBeVisible();
    });
  }
});
