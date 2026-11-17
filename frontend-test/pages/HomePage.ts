import type { Locator, Page } from "@playwright/test";
import { expected, type MediaKind } from "../data/expected";

export class HomePage {
  readonly nav: Locator;
  readonly intro: Locator;
  readonly ticker: Locator;
  readonly techStack: Locator;
  readonly career: Locator;
  readonly projects: Locator;
  readonly contact: Locator;
  readonly footer: Locator;

  constructor(readonly page: Page) {
    this.nav = page.getByRole("navigation");
    this.intro = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { level: 1 }) });
    this.ticker = this.intro
      .locator("div")
      .filter({ has: page.getByRole("heading", { name: expected.ticker.caption }) });
    this.techStack = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: expected.techStack.heading }) });
    this.career = page.locator("#career");
    this.projects = page.locator("#work");
    this.contact = page.locator("#contact");
    this.footer = page.locator("footer");
  }

  async goto() {
    await this.page.goto("/");
  }

  heading(section: Locator, name: string) {
    return section.getByRole("heading", { name, exact: true });
  }

  careerRows() {
    return this.career.getByRole("listitem");
  }

  projectCards() {
    return this.projects.getByRole("article");
  }

  projectCard(title: string) {
    return this.projectCards().filter({
      has: this.page.getByRole("heading", { level: 3, name: title }),
    });
  }

  projectMedia(card: Locator, media: { kind: MediaKind; name: string }) {
    switch (media.kind) {
      case "gallery":
        return card.getByRole("region", { name: media.name });
      case "video":
        return card.getByLabel(media.name);
      default:
        return card.getByRole("img", { name: media.name }).first();
    }
  }

  contactLink(name: string) {
    return this.contact.getByRole("link", { name });
  }
}
