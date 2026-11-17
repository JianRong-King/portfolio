import { test, expect } from "../fixtures/test";
import { expected } from "../data/expected";

test.describe("R5 Career content", () => {
  test("shows the heading", async ({ homePage }) => {
    await expect(homePage.heading(homePage.career, expected.career.heading)).toBeVisible();
  });

  test("shows one row per career item", async ({ homePage }) => {
    await expect(homePage.careerRows()).toHaveCount(expected.career.items.length);
  });

  expected.career.items.forEach((item, i) => {
    test(`shows ${item.org} with role and period`, async ({ homePage }) => {
      const row = homePage.careerRows().nth(i);
      await expect(row.getByRole("heading", { name: item.org })).toBeVisible();
      await expect(row).toContainText(item.role);
      await expect(row).toContainText(item.period);
    });
  });
});
