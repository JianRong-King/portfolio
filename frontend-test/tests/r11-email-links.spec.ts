import { test, expect } from "../fixtures/test";
import { expected } from "../data/expected";

const mailto = `mailto:${expected.contact.email}`;

test.describe("R11 email links", () => {
  test("contact email link opens a mail draft to the expected address", async ({ homePage }) => {
    await expect(homePage.contactLink(expected.contact.email)).toHaveAttribute("href", mailto);
  });

  test("footer name link opens a mail draft to the expected address", async ({ homePage }) => {
    const nameLink = homePage.footer.getByRole("link", { name: expected.footer.name, exact: true });

    await expect(nameLink).toHaveAttribute("href", mailto);
  });
});
