"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useQuoteModal } from "@/components/ui/QuoteModal";
import { CountUp } from "@/components/ui/CountUp";
import { siteConfig, tariffKeys, tariffs, type TariffKey } from "@/lib/site";
import { LIMITS, calculateProfit } from "@/lib/profit";

type Props = { dict: Dictionary };

const NUMBER = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const DECIMAL = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

function Field({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  min: number;
  max: number;
  suffix: string;
}) {
  const hintId = useId();
  return (
    // Column flex with a growing label: in the 2×2 mobile grid the labels wrap
    // to different line counts, and this keeps every input on the same baseline.
    <label className="flex h-full flex-col">
      <span className="mb-1 flex-1 text-[10px] font-semibold uppercase leading-tight tracking-[0.16em] text-muted sm:mb-1.5 sm:flex-none sm:text-[11px] sm:tracking-[0.2em]">
        {label}
      </span>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={hintId}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 pr-12 text-base font-medium text-foreground outline-none transition focus:border-brand-500 focus:bg-surface focus:ring-2 focus:ring-brand-500/30 sm:px-4 sm:py-3.5 sm:pr-16"
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-muted sm:right-4 sm:text-sm">
          {suffix}
        </span>
      </div>
      {/* The TZ requires the calculator to stay understandable on mobile, so
          the hints carry the unit and the meaning of each field at every size. */}
      <span
        id={hintId}
        className="mt-1 block text-[10px] leading-tight text-muted sm:mt-1.5 sm:text-xs"
      >
        {hint}
      </span>
    </label>
  );
}

function Result({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-2.5 sm:p-4 ${
        emphasis
          ? "col-span-2 border-brand-500/40 bg-brand-500/10"
          : "border-border bg-background/60 dark:border-white/10 dark:bg-white/5"
      }`}
    >
      <div className="text-[10px] font-medium uppercase leading-tight tracking-wider text-muted sm:text-xs sm:tracking-widest">
        {label}
      </div>
      <div
        className={`mt-1 font-semibold text-foreground sm:mt-1.5 ${
          emphasis ? "text-2xl sm:text-4xl" : "text-lg sm:text-2xl"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export function ProfitCalculator({ dict }: Props) {
  const { open: openQuote } = useQuoteModal();
  const [investment, setInvestment] = useState("50000");
  const [margin, setMargin] = useState("20");
  const [cycle, setCycle] = useState("60");
  const [delivery, setDelivery] = useState("30");
  const [tariff, setTariff] = useState<TariffKey>("express");

  const t = dict.calculator;

  const result = useMemo(
    () =>
      calculateProfit(
        Number.parseFloat(investment),
        Number.parseFloat(margin),
        Number.parseFloat(cycle),
        Number.parseFloat(delivery),
        // Upper bound of the window, so the figure under-promises.
        tariffs[tariff].max,
      ),
    [investment, margin, cycle, delivery, tariff],
  );

  // Format with a fixed locale, never the user's: Node and browser ICU disagree
  // on uz-UZ/ru-RU currency output ("$ 10,000" vs "10 000 US$"), which makes the
  // server and client markup differ and trips a hydration error.
  const money = (n: number) => `$${NUMBER.format(Math.round(n))}`;
  const decimal = (n: number) => DECIMAL.format(n);

  const warning =
    result.state === "invalid"
      ? t.warning.invalid
      : result.state === "deliveryTooLong"
        ? t.warning.deliveryTooLong
        : t.warning.tooFast;

  return (
    <section id="calculator" className="relative py-12 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 50% at 80% 30%, color-mix(in oklab, var(--color-brand-500) 12%, transparent), transparent 70%)",
        }}
      />
      <Container>
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.description}
        />

        <Reveal
          from="zoom"
          className="mx-auto mt-6 max-w-6xl overflow-hidden rounded-4xl border border-border bg-surface p-4 shadow-(--shadow-elevated) sm:mt-14 sm:p-10 xl:max-w-7xl"
        >
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10">
            {/* Inputs */}
            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-5">
                <Field
                  label={t.inputs.investment}
                  hint={t.inputs.investmentHint}
                  value={investment}
                  onChange={setInvestment}
                  min={LIMITS.investment.min}
                  max={LIMITS.investment.max}
                  suffix="$"
                />
                <Field
                  label={t.inputs.margin}
                  hint={t.inputs.marginHint}
                  value={margin}
                  onChange={setMargin}
                  min={LIMITS.margin.min}
                  max={LIMITS.margin.max}
                  suffix="%"
                />
                <Field
                  label={t.inputs.cycle}
                  hint={t.inputs.cycleHint}
                  value={cycle}
                  onChange={setCycle}
                  min={LIMITS.cycle.min}
                  max={LIMITS.cycle.max}
                  suffix={t.results.days}
                />
                <Field
                  label={t.inputs.delivery}
                  hint={t.inputs.deliveryHint}
                  value={delivery}
                  onChange={setDelivery}
                  min={LIMITS.delivery.min}
                  max={LIMITS.delivery.max}
                  suffix={t.results.days}
                />
              </div>

              <div>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:mb-1.5 sm:text-[11px] sm:tracking-[0.2em]">
                  {t.inputs.tariff}
                </span>
                <div
                  role="radiogroup"
                  aria-label={t.inputs.tariff}
                  className="grid grid-cols-3 gap-2"
                >
                  {tariffKeys.map((key) => (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={tariff === key}
                      onClick={() => setTariff(key)}
                      className={`rounded-xl border px-2 py-2 text-center transition sm:px-3 sm:py-3 ${
                        tariff === key
                          ? "border-brand-500 bg-brand-500/10 text-foreground ring-1 ring-brand-500/30"
                          : "border-border bg-background text-muted hover:border-brand-500/40 hover:text-foreground"
                      }`}
                    >
                      <span className="block text-xs font-semibold sm:text-sm">
                        {dict.services[key].name}
                      </span>
                      <span className="mt-0.5 block text-[10px] sm:text-xs">
                        {tariffs[key].min}–{tariffs[key].max}{" "}
                        {dict.services.daysLabel}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted sm:text-sm sm:tracking-[0.22em]">
                {t.results.title}
              </h3>

              {result.state !== "ok" ? (
                <div
                  role="status"
                  className="mt-3 flex flex-1 items-center rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-900 sm:mt-4 sm:p-6 dark:text-amber-100"
                >
                  {warning}
                </div>
              ) : (
                <>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">
                    <Result
                      label={t.results.saved}
                      value={
                        <CountUp
                          value={result.savedDays}
                          format={decimal}
                          suffix={` ${t.results.days}`}
                        />
                      }
                    />
                    <Result
                      label={t.results.newCycle}
                      value={
                        <CountUp
                          value={result.newCycle}
                          format={decimal}
                          suffix={` ${t.results.days}`}
                        />
                      }
                    />
                    <Result
                      label={t.results.turnsWithout}
                      value={
                        <CountUp
                          value={result.turnsWithout}
                          format={decimal}
                          suffix={` ${t.results.turns}`}
                        />
                      }
                    />
                    <Result
                      label={t.results.turnsWith}
                      value={
                        <CountUp
                          value={result.turnsWith}
                          format={decimal}
                          suffix={` ${t.results.turns}`}
                        />
                      }
                    />
                    <Result
                      label={t.results.extraTurns}
                      value={
                        <CountUp
                          value={result.extraTurns}
                          format={decimal}
                          prefix="+"
                          suffix={` ${t.results.turns}`}
                        />
                      }
                    />
                    <Result
                      label={t.results.perBatch}
                      value={
                        <CountUp value={result.profitPerBatch} format={money} />
                      }
                    />
                    <Result
                      label={t.results.extraProfit}
                      value={
                        <CountUp
                          value={result.extraProfit}
                          format={money}
                          prefix="+"
                          duration={1200}
                        />
                      }
                      emphasis
                    />
                  </div>

                  {/* Required by the TZ as the closing emphasis — shown at
                      every size, never dropped for vertical space. */}
                  <p className="mt-3 text-xs font-medium leading-snug text-brand-700 sm:mt-5 sm:text-sm sm:leading-relaxed dark:text-brand-200">
                    {t.results.emphasis}
                  </p>
                </>
              )}

              <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-3">
                <Button onClick={openQuote} className="w-full sm:w-auto">
                  {t.cta}
                  <Icon.ArrowRight size={16} />
                </Button>
                <Button
                  href={`tel:${siteConfig.phones[0]}`}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Icon.Phone size={16} />
                  {t.ctaSecondary}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
