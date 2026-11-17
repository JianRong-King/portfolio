import { test, expect } from "../fixtures/test";
import { expected } from "../data/expected";

const externalLinks = [
  { platform: "LinkedIn", ...expected.contact.linkedin },
  { platform: "GitHub", ...expected.contact.github },
];

test.describe("R12 external links open in a new tab", () => {
  for (const { platform, label, url } of externalLinks) {
    test(`clicking ${platform} opens a new tab and keeps the home page`, async ({ homePage, page, blockedRequests }) => {
      const homeUrl = page.url();

      const popup = page.waitForEvent("popup");
      await homePage.contactLink(label).click();
      await popup;

      await expect(page).toHaveURL(homeUrl);
      await expect.poll(() => blockedRequests.some((request) => request.startsWith(url))).toBe(true);
    });
  }
});
