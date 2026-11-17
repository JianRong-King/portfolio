import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isEditAllowed, toRepoPath } from "../guard";

const winRoot = "C:\\Grad\\repo";
const posixRoot = "/home/runner/work/repo";

describe("R17 edit guard", () => {
  it("allows files in editable dirs", () => {
    for (const file of [
      "frontend-test/pages/HomePage.ts",
      "frontend-test/data/expected.ts",
      "frontend-test/tests/r05-career-content.spec.ts",
    ]) {
      assert.equal(isEditAllowed(file, posixRoot), true, file);
    }
  });

  it("denies fixtures, healer, site code and config", () => {
    for (const file of [
      "frontend-test/fixtures/test.ts",
      "frontend-test/agent-healer/config.ts",
      "app/data/contact.ts",
      "playwright.config.ts",
      ".github/workflows/heal.yml",
    ]) {
      assert.equal(isEditAllowed(file, posixRoot), false, file);
    }
  });

  it("denies the editable dir itself", () => {
    assert.equal(isEditAllowed("frontend-test/tests", posixRoot), false);
    assert.equal(isEditAllowed("frontend-test/tests/", posixRoot), false);
  });

  it("denies .. escapes", () => {
    assert.equal(isEditAllowed("frontend-test/tests/../../app/page.tsx", posixRoot), false);
    assert.equal(isEditAllowed("../outside/frontend-test/tests/a.ts", posixRoot), false);
  });

  it("resolves .. that stays inside an editable dir", () => {
    assert.equal(isEditAllowed("frontend-test/pages/../tests/a.spec.ts", posixRoot), true);
  });

  it("handles absolute posix paths in and out of the repo", () => {
    assert.equal(isEditAllowed(`${posixRoot}/frontend-test/data/expected.ts`, posixRoot), true);
    assert.equal(isEditAllowed(`${posixRoot}/app/page.tsx`, posixRoot), false);
    assert.equal(isEditAllowed("/etc/passwd", posixRoot), false);
    assert.equal(isEditAllowed(`${posixRoot}-other/frontend-test/data/x.ts`, posixRoot), false);
  });

  it("handles Windows backslashes and drive letter case", () => {
    assert.equal(isEditAllowed("C:\\Grad\\repo\\frontend-test\\tests\\r01.spec.ts", winRoot), true);
    assert.equal(isEditAllowed("c:\\Grad\\repo\\frontend-test\\tests\\r01.spec.ts", winRoot), true);
    assert.equal(isEditAllowed("c:/Grad/repo/frontend-test/data/expected.ts", winRoot), true);
    assert.equal(isEditAllowed("frontend-test\\pages\\HomePage.ts", winRoot), true);
    assert.equal(isEditAllowed("C:\\Grad\\repo\\app\\page.tsx", winRoot), false);
    assert.equal(isEditAllowed("D:\\Grad\\repo\\frontend-test\\tests\\r01.spec.ts", winRoot), false);
  });

  it("maps paths to repo-relative posix form", () => {
    assert.equal(toRepoPath("C:\\Grad\\repo\\frontend-test\\data\\expected.ts", winRoot), "frontend-test/data/expected.ts");
    assert.equal(toRepoPath(`${posixRoot}/`, posixRoot), "");
    assert.equal(toRepoPath("/tmp/x.ts", posixRoot), null);
  });
});
