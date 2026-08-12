/**
 * TZ §5.1 conformance test for the profit calculator.
 *
 * Run with:  node --test lib/profit.test.ts
 * (Node 24 strips the types natively — no test runner or transpiler needed.)
 *
 * The point of this file is to check the implementation against the TZ formula
 * chain *independently*: `tzReference` below is transcribed straight from the
 * spec text and knows nothing about `lib/profit.ts`.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LIMITS, calculateProfit } from "./profit.ts";

const EXPRESS = 12; // tariffs.express.max
const STANDARD = 18;
const ECONOM = 30;

/** Transcribed from the TZ, verbatim, with `savedDays` supplied by the caller. */
function tzReference(
  investment: number,
  marginPercent: number,
  cycle: number,
  savedDays: number,
) {
  const profitPerBatch = investment * (marginPercent / 100);
  const turnsWithout = 365 / cycle;
  const turnsWith = 365 / (cycle - savedDays);
  const extraTurns = turnsWith - turnsWithout;
  return {
    profitPerBatch,
    turnsWithout,
    turnsWith,
    extraTurns,
    extraProfit: extraTurns * profitPerBatch,
  };
}

const close = (actual: number, expected: number, label: string) =>
  assert.ok(
    Math.abs(actual - expected) < 1e-9,
    `${label}: got ${actual}, expected ${expected}`,
  );

function ok(c: ReturnType<typeof calculateProfit>) {
  assert.equal(c.state, "ok");
  return c as Extract<typeof c, { state: "ok" }>;
}

describe("TZ formula chain", () => {
  it("matches the spec formulas exactly for the default inputs", () => {
    const r = ok(calculateProfit(50_000, 20, 60, 30, EXPRESS));
    const ref = tzReference(50_000, 20, 60, r.savedDays);

    close(r.profitPerBatch, ref.profitPerBatch, "profitPerBatch");
    close(r.turnsWithout, ref.turnsWithout, "turnsWithout");
    close(r.turnsWith, ref.turnsWith, "turnsWith");
    close(r.extraTurns, ref.extraTurns, "extraTurns");
    close(r.extraProfit, ref.extraProfit, "extraProfit");
  });

  it("matches the spec formulas across a sweep of realistic inputs", () => {
    let checked = 0;
    for (const investment of [1_000, 25_000, 50_000, 250_000, 1_000_000]) {
      for (const margin of [5, 12, 20, 35, 60]) {
        for (const cycle of [30, 45, 60, 90, 120, 180]) {
          for (const delivery of [15, 20, 25, 30, 40, 55]) {
            for (const saf of [EXPRESS, STANDARD, ECONOM]) {
              const c = calculateProfit(
                investment,
                margin,
                cycle,
                delivery,
                saf,
              );
              if (c.state !== "ok") continue;
              const ref = tzReference(investment, margin, cycle, c.savedDays);
              close(c.profitPerBatch, ref.profitPerBatch, "profitPerBatch");
              close(c.turnsWithout, ref.turnsWithout, "turnsWithout");
              close(c.turnsWith, ref.turnsWith, "turnsWith");
              close(c.extraTurns, ref.extraTurns, "extraTurns");
              close(c.extraProfit, ref.extraProfit, "extraProfit");
              checked++;
            }
          }
        }
      }
    }
    assert.ok(checked > 500, `expected a broad sweep, only ran ${checked}`);
  });

  it("derives savedDays from the delivery leg, not the whole cycle", () => {
    // TZ target: shortening by 15–20 days. 30-day delivery on express is 18.
    const r = ok(calculateProfit(50_000, 20, 60, 30, EXPRESS));
    assert.equal(r.savedDays, 18);
    assert.ok(
      r.savedDays >= 15 && r.savedDays <= 20,
      `savedDays ${r.savedDays} outside the TZ's 15–20 day target`,
    );
    assert.equal(r.newCycle, 42);
  });
});

describe("plausibility — no inflated figures", () => {
  it("never returns more turns than the cycle allows", () => {
    for (const cycle of [20, 45, 90, 200]) {
      for (const delivery of [15, 30, 60, 120]) {
        const c = calculateProfit(50_000, 20, cycle, delivery, EXPRESS);
        if (c.state !== "ok") continue;
        assert.ok(
          c.turnsWith <= 365 / EXPRESS,
          `turnsWith ${c.turnsWith} exceeds the physical ceiling`,
        );
        assert.ok(c.turnsWith > c.turnsWithout, "speeding up must add turns");
        assert.ok(c.newCycle > 0 && c.newCycle < cycle, "newCycle must shrink");
      }
    }
  });

  it("keeps extra annual profit within a believable multiple of capital", () => {
    // The old bug returned +$223,000 on $50,000 at 20% — a 446% annual return.
    const r = ok(calculateProfit(50_000, 20, 60, 30, EXPRESS));
    assert.ok(
      r.extraProfit < 50_000,
      `extraProfit ${r.extraProfit} exceeds the invested capital`,
    );
    assert.equal(Math.round(r.extraProfit), 26_071);
  });

  it("scales linearly with investment and with margin", () => {
    const a = ok(calculateProfit(50_000, 20, 60, 30, EXPRESS));
    const b = ok(calculateProfit(100_000, 20, 60, 30, EXPRESS));
    const c = ok(calculateProfit(50_000, 40, 60, 30, EXPRESS));
    close(b.extraProfit, a.extraProfit * 2, "double investment");
    close(c.extraProfit, a.extraProfit * 2, "double margin");
  });

  it("a slower tariff saves fewer days and earns less", () => {
    const fast = ok(calculateProfit(50_000, 20, 90, 40, EXPRESS));
    const mid = ok(calculateProfit(50_000, 20, 90, 40, STANDARD));
    const slow = ok(calculateProfit(50_000, 20, 90, 40, ECONOM));
    assert.ok(fast.savedDays > mid.savedDays && mid.savedDays > slow.savedDays);
    assert.ok(
      fast.extraProfit > mid.extraProfit && mid.extraProfit > slow.extraProfit,
    );
  });
});

describe("guard states", () => {
  it("rejects empty, zero, negative and NaN inputs", () => {
    const bad = [
      [Number.NaN, 20, 60, 30],
      [50_000, Number.NaN, 60, 30],
      [50_000, 20, Number.NaN, 30],
      [50_000, 20, 60, Number.NaN],
      [0, 20, 60, 30],
      [50_000, 0, 60, 30],
      [50_000, 20, 0, 30],
      [50_000, 20, 60, 0],
      [-50_000, 20, 60, 30],
      [50_000, -20, 60, 30],
      [Number.POSITIVE_INFINITY, 20, 60, 30],
    ] as const;
    for (const [i, m, c, d] of bad) {
      assert.equal(
        calculateProfit(i, m, c, d, EXPRESS).state,
        "invalid",
        `expected invalid for ${i}/${m}/${c}/${d}`,
      );
    }
  });

  it("flags a delivery time that is not shorter than the cycle", () => {
    assert.equal(
      calculateProfit(50_000, 20, 30, 40, EXPRESS).state,
      "deliveryTooLong",
    );
    assert.equal(
      calculateProfit(50_000, 20, 30, 30, EXPRESS).state,
      "deliveryTooLong",
    );
  });

  it("flags a client already faster than the chosen tariff", () => {
    assert.equal(calculateProfit(50_000, 20, 60, 30, ECONOM).state, "tooFast");
    assert.equal(calculateProfit(50_000, 20, 60, 12, EXPRESS).state, "tooFast");
    assert.equal(calculateProfit(50_000, 20, 60, 8, EXPRESS).state, "tooFast");
  });
});

describe("input clamping", () => {
  it("caps a margin typed above 100%", () => {
    const wild = ok(calculateProfit(50_000, 999, 60, 30, EXPRESS));
    const capped = ok(calculateProfit(50_000, 100, 60, 30, EXPRESS));
    assert.deepEqual(wild, capped);
    assert.equal(wild.profitPerBatch, 50_000);
  });

  it("caps a cycle and a delivery typed beyond their bounds", () => {
    const wild = ok(calculateProfit(50_000, 20, 5_000, 900, EXPRESS));
    const capped = ok(
      calculateProfit(50_000, 20, LIMITS.cycle.max, LIMITS.delivery.max, EXPRESS),
    );
    assert.deepEqual(wild, capped);
  });

  it("caps investment at both ends", () => {
    const low = ok(calculateProfit(1, 20, 60, 30, EXPRESS));
    assert.equal(low.profitPerBatch, LIMITS.investment.min * 0.2);
    const high = ok(calculateProfit(9e12, 20, 60, 30, EXPRESS));
    assert.equal(high.profitPerBatch, LIMITS.investment.max * 0.2);
  });

  it("never produces a non-finite number in the ok state", () => {
    for (const cycle of [1, 2, 13, 365, 5_000]) {
      for (const delivery of [1, 13, 180, 900]) {
        const c = calculateProfit(50_000, 20, cycle, delivery, EXPRESS);
        if (c.state !== "ok") continue;
        for (const [k, v] of Object.entries(c)) {
          if (typeof v === "number") {
            assert.ok(Number.isFinite(v), `${k} was ${v}`);
          }
        }
      }
    }
  });
});
