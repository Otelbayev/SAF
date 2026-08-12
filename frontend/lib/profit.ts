/**
 * Profit calculator model from the TZ (§5.1).
 *
 * Kept free of React and of `lib/site` (which pulls in `server-only`) so the
 * arithmetic can be run and asserted on its own — see `lib/profit.test.ts`.
 *
 * The TZ chain is:
 *   profitPerBatch = investment × margin
 *   turnsWithout   = 365 / cycle
 *   turnsWith      = 365 / (cycle − savedDays)
 *   extraTurns     = turnsWith − turnsWithout
 *   extraProfit    = extraTurns × profitPerBatch
 *
 * `savedDays` is the one term the TZ leaves open ("aniq formula/muddat
 * buyurtmachi bilan aniqlashtirilishi ... kerak"). It is the days SAF removes
 * from the cycle, so it is measured against the leg SAF actually replaces —
 * the client's current delivery time — not against the whole purchase→sale
 * cycle, which also contains buying, production and selling. Reading it as the
 * whole cycle would collapse `cycle − savedDays` to the transit window and
 * inflate the answer roughly tenfold, landing far outside the 15–20 saved days
 * the TZ itself sets as the target.
 */

/** Input bounds, mirrored on the `<input>` elements. */
export const LIMITS = {
  investment: { min: 100, max: 100_000_000 },
  margin: { min: 1, max: 100 },
  cycle: { min: 1, max: 365 },
  delivery: { min: 1, max: 180 },
} as const;

const DAYS_PER_YEAR = 365;

export const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

export type Calculation =
  | { state: "invalid" }
  | { state: "deliveryTooLong" }
  | { state: "tooFast" }
  | {
      state: "ok";
      savedDays: number;
      newCycle: number;
      profitPerBatch: number;
      turnsWithout: number;
      turnsWith: number;
      extraTurns: number;
      extraProfit: number;
    };

/**
 * @param safDays  Transit days for the chosen tariff. Pass the upper bound of
 *                 the window so the figure under-promises rather than over.
 */
export function calculateProfit(
  rawInvestment: number,
  rawMargin: number,
  rawCycle: number,
  rawDelivery: number,
  safDays: number,
): Calculation {
  if (
    !Number.isFinite(rawInvestment) ||
    !Number.isFinite(rawMargin) ||
    !Number.isFinite(rawCycle) ||
    !Number.isFinite(rawDelivery) ||
    rawInvestment <= 0 ||
    rawMargin <= 0 ||
    rawCycle <= 0 ||
    rawDelivery <= 0
  ) {
    return { state: "invalid" };
  }

  // The `min`/`max` attributes are only a hint — a typed 900% margin or a
  // 5000-day cycle still reaches this function, so clamp before doing maths.
  const investment = clamp(
    rawInvestment,
    LIMITS.investment.min,
    LIMITS.investment.max,
  );
  const marginPercent = clamp(rawMargin, LIMITS.margin.min, LIMITS.margin.max);
  const currentCycle = clamp(rawCycle, LIMITS.cycle.min, LIMITS.cycle.max);
  const currentDelivery = clamp(
    rawDelivery,
    LIMITS.delivery.min,
    LIMITS.delivery.max,
  );

  // Delivery is one leg *inside* the cycle; it cannot be the cycle or longer.
  if (currentDelivery >= currentCycle) return { state: "deliveryTooLong" };
  // Nothing to gain when the client already ships faster than the tariff.
  if (currentDelivery <= safDays) return { state: "tooFast" };

  const savedDays = currentDelivery - safDays;
  const newCycle = currentCycle - savedDays;
  const profitPerBatch = (investment * marginPercent) / 100;
  const turnsWithout = DAYS_PER_YEAR / currentCycle;
  const turnsWith = DAYS_PER_YEAR / newCycle;
  const extraTurns = turnsWith - turnsWithout;

  return {
    state: "ok",
    savedDays,
    newCycle,
    profitPerBatch,
    turnsWithout,
    turnsWith,
    extraTurns,
    extraProfit: extraTurns * profitPerBatch,
  };
}
