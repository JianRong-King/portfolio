import { test as base, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

type Fixtures = {
  blockedRequests: string[];
  homePage: HomePage;
};

export const test = base.extend<Fixtures>({
  blockedRequests: [
    async ({ context }, use) => {
      const blocked: string[] = [];
      await context.route(
        (url) => !LOCAL_HOSTS.has(url.hostname),
        (route) => {
          blocked.push(route.request().url());
          return route.abort();
        }
      );
      await use(blocked);
    },
    { auto: true },
  ],

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },
});

export { expect };
