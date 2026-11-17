import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkDiff } from "../postCheck";

const clean = {
  changedFiles: ["frontend-test/data/expected.ts"],
  addedLines: ['    heading: "Experience",'],
  testCountBefore: 53,
  testCountAfter: 53,
};

describe("R19 post-check", () => {
  it("accepts an in-scope edit", () => {
    assert.deepEqual(checkDiff(clean), { ok: true, reasons: [] });
  });

  it("accepts an empty diff and a higher test count", () => {
    assert.equal(checkDiff({ changedFiles: [], addedLines: [], testCountBefore: 53, testCountAfter: 54 }).ok, true);
  });

  it("rejects a disallowed path", () => {
    const result = checkDiff({ ...clean, changedFiles: [...clean.changedFiles, "app/data/contact.ts"] });
    assert.equal(result.ok, false);
    assert.match(result.reasons.join("\n"), /app\/data\/contact\.ts/);
  });

  it("rejects fixtures and healer files", () => {
    for (const file of ["frontend-test/fixtures/test.ts", "frontend-test/agent-healer/guard.ts"]) {
      assert.equal(checkDiff({ ...clean, changedFiles: [file] }).ok, false, file);
    }
  });

  it("rejects Windows-style disallowed paths", () => {
    assert.equal(checkDiff({ ...clean, changedFiles: ["app\\page.tsx"] }).ok, false);
  });

  for (const marker of ["test.skip(", "test.fixme(", "test.only(", "test.describe.only("]) {
    it(`rejects an added ${marker}`, () => {
      const result = checkDiff({ ...clean, addedLines: [`  ${marker}"x", async () => {});`] });
      assert.equal(result.ok, false);
      assert.match(result.reasons.join("\n"), /Forbidden marker/);
    });
  }

  it("rejects a lower test count", () => {
    const result = checkDiff({ ...clean, testCountAfter: 52 });
    assert.equal(result.ok, false);
    assert.match(result.reasons.join("\n"), /53 to 52/);
  });

  it("reports every reason at once", () => {
    const result = checkDiff({
      changedFiles: ["app/page.tsx"],
      addedLines: ["test.skip(\"a\", () => {});"],
      testCountBefore: 10,
      testCountAfter: 9,
    });
    assert.equal(result.reasons.length, 3);
  });
});
