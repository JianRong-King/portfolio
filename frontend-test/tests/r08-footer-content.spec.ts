import { test, expect } from "../fixtures/test";
import { expected } from "../data/expected";

const { footer } = expected;

test.describe("R8 Footer content", () => {
  test("shows the name link", async ({ homePage }) => {
    await expect(homePage.footer.getByRole("link", { name: footer.name, exact: true })).toBeVisible();
  });

  test("shows the copyright with the current year", async ({ homePage }) => {
    const year = new Date().getFullYear();
    await expect(homePage.footer.getByText(`© ${year} ${footer.name}`)).toBeVisible();
  });

  test("shows the location", async ({ homePage }) => {
    await expect(homePage.footer.getByText(footer.location, { exact: true })).toBeVisible();
  });

  test("shows the back to top link", async ({ homePage }) => {
    await expect(homePage.footer.getByRole("link", { name: footer.backToTop })).toBeVisible();
  });
});
