import { test, expect } from "../fixtures/test";
import { expected } from "../data/expected";

test.describe("R1 Nav content", () => {
  test("shows the home link", async ({ homePage }) => {
    const home = homePage.nav.getByRole("link", { name: expected.nav.homeLabel });
    await expect(home).toBeVisible();
    await expect(home).toHaveText("kjr");
  });

  for (const link of expected.nav.links) {
    test(`shows the ${link.label} link`, async ({ homePage }) => {
      const navLink = homePage.nav.getByRole("link", { name: link.label, exact: true });
      await expect(navLink).toBeVisible();
      await expect(navLink).toHaveAttribute("href", link.href);
    });
  }
});
