import { test } from "node:test";
import assert from "node:assert/strict";
import { isReadAllowed } from "../guard";

const root = "C:\\Grad\\repo";

test("allows reading test code, site source and CLAUDE.md", () => {
  for (const file of [
    "C:\\Grad\\repo\\frontend-test\\data\\expected.ts",
    "C:\\Grad\\repo\\app\\components\\Career.tsx",
    "C:\\Grad\\repo\\styles\\tokens.css",
    "C:\\Grad\\repo\\CLAUDE.md",
    "C:\\Grad\\repo\\frontend-test",
    "app",
  ]) {
    assert.equal(isReadAllowed(file, root), true, file);
  }
});

test("blocks large or unrelated paths", () => {
  for (const file of [
    "C:\\Grad\\repo",
    "C:\\Grad\\repo\\node_modules\\next\\package.json",
    "C:\\Grad\\repo\\.next\\server\\app\\page.js",
    "C:\\Grad\\repo\\playwright-report\\index.html",
    "C:\\Grad\\repo\\package-lock.json",
    "C:\\Grad\\repo\\public\\work\\guitar-hero.mp4",
    "C:\\Grad\\other\\secret.txt",
    "app/../node_modules/x.js",
  ]) {
    assert.equal(isReadAllowed(file, root), false, file);
  }
});
