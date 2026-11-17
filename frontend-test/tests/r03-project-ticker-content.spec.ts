import { test, expect } from "../fixtures/test";
import { expected } from "../data/expected";

test.describe("R3 Contributed projects ticker content", () => {
  test("shows the caption", async ({ homePage }) => {
    await expect(homePage.heading(homePage.ticker, expected.ticker.caption)).toBeVisible();
  });

  test("shows one logo per contributed project", async ({ homePage }) => {
    await expect(homePage.ticker.getByRole("img")).toHaveCount(expected.ticker.logos.length);
  });

  for (const logo of expected.ticker.logos) {
    test(`shows the ${logo} logo with alt text`, async ({ homePage }) => {
      await expect(homePage.ticker.getByRole("img", { name: logo, exact: true })).toBeVisible();
    });
  }
});
