import { test, expect } from "../fixtures/test";
import { expected } from "../data/expected";

const externalLinks = [
  { platform: "LinkedIn", ...expected.contact.linkedin },
  { platform: "GitHub", ...expected.contact.github },
];

test.describe("R10 external contact links", () => {
  for (const { platform, label, url } of externalLinks) {
    test(`${platform} link points to the profile and opens safely in a new tab`, async ({ homePage }) => {
      const link = homePage.contactLink(label);

      await expect(link).toHaveAttribute("href", url);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  }
});
