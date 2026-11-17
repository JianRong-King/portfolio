import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Budget } from "../budget";

describe("R20 budget", () => {
  it("starts with the full cap remaining", () => {
    const budget = new Budget(0.9);
    assert.equal(budget.spent, 0);
    assert.equal(budget.remaining, 0.9);
    assert.equal(budget.exhausted, false);
  });

  it("accumulates spend across calls", () => {
    const budget = new Budget(0.9);
    budget.record(0.3);
    budget.record(0.2);
    assert.ok(Math.abs(budget.spent - 0.5) < 1e-9);
    assert.ok(Math.abs(budget.remaining - 0.4) < 1e-9);
    assert.equal(budget.exhausted, false);
  });

  it("is exhausted at the cap", () => {
    const budget = new Budget(0.9);
    budget.record(0.9);
    assert.equal(budget.exhausted, true);
    assert.equal(budget.remaining, 0);
  });

  it("never reports negative remaining after overshoot", () => {
    const budget = new Budget(0.9);
    budget.record(1.4);
    assert.equal(budget.exhausted, true);
    assert.equal(budget.remaining, 0);
  });

  it("ignores negative costs", () => {
    const budget = new Budget(0.9);
    budget.record(-1);
    assert.equal(budget.spent, 0);
  });
});
