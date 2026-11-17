import { test, expect } from "../fixtures/test";
import { expected } from "../data/expected";

const { contact } = expected;

test.describe("R7 Contact content", () => {
  test("shows the heading", async ({ homePage }) => {
    await expect(homePage.heading(homePage.contact, contact.heading)).toBeVisible();
  });

  for (const label of ["LinkedIn", "GitHub", "Email", "Active in"]) {
    test(`shows the ${label} entry`, async ({ homePage }) => {
      await expect(homePage.contact.getByText(label, { exact: true })).toBeVisible();
    });
  }

  test("shows the contact link labels", async ({ homePage }) => {
    await expect(homePage.contactLink(contact.linkedin.label)).toBeVisible();
    await expect(homePage.contactLink(contact.github.label)).toBeVisible();
    await expect(homePage.contactLink(contact.email)).toBeVisible();
  });

  test("shows the active-in places", async ({ homePage }) => {
    for (const place of contact.activeIn) {
      await expect(homePage.contact.getByText(place, { exact: true })).toBeVisible();
    }
  });

  test("shows the map", async ({ homePage }) => {
    await expect(homePage.contact.locator(`iframe[title="${contact.mapTitle}"]`)).toBeVisible();
  });
});
