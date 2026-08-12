"use client";

import type { ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { tariffKeys, tariffs, type TariffKey } from "@/lib/site";

type Props = { dict: Dictionary };

type RowKey = keyof Dictionary["services"]["compareTable"]["rows"];
type Marks = Record<TariffKey, "yes" | "no"> | null;

/** "delivery" and "transport" render text; the rest render a yes/no mark. */
const rows: { key: RowKey; values: Marks }[] = [
  { key: "delivery", values: null },
  { key: "transport", values: null },
  {
    key: "tracking",
    values: { express: "yes", standard: "yes", econom: "yes" },
  },
  {
    key: "customs",
    values: { express: "yes", standard: "yes", econom: "yes" },
  },
  {
    key: "insurance",
    values: { express: "yes", standard: "yes", econom: "yes" },
  },
  { key: "manager", values: { express: "yes", standard: "yes", econom: "no" } },
  { key: "priority", values: { express: "yes", standard: "no", econom: "no" } },
];

function Mark({ value }: { value: "yes" | "no" }) {
  return value === "yes" ? (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-800 text-white">
      <Icon.Check size={14} />
    </span>
  ) : (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted/70">
      <Icon.X size={14} />
    </span>
  );
}

export function CompareTable({ dict }: Props) {
  const t = dict.services.compareTable;

  /**
   * One cell's content, shared by the mobile matrix and the desktop table.
   * `compact` stacks the day count over its unit — "14–18 дней" on one line
   * does not fit a third of a phone screen.
   */
  const cell = (
    rowKey: RowKey,
    key: TariffKey,
    marks: Marks,
    compact = false,
  ): ReactNode => {
    if (rowKey === "delivery") {
      return compact ? (
        <span className="flex flex-col items-center leading-tight">
          <span className="font-semibold text-foreground">
            {tariffs[key].min}–{tariffs[key].max}
          </span>
          <span className="text-[10px] font-normal text-muted">
            {dict.services.daysLabel}
          </span>
        </span>
      ) : (
        <span className="whitespace-nowrap font-semibold text-foreground">
          {tariffs[key].min}–{tariffs[key].max}{" "}
          <span className="text-xs font-normal text-muted">
            {dict.services.daysLabel}
          </span>
        </span>
      );
    }
    if (rowKey === "transport") {
      return (
        <span className="whitespace-nowrap font-medium text-foreground">
          {t.truckOnly}
        </span>
      );
    }
    return <Mark value={marks![key]} />;
  };

  return (
    <section className="pb-16 sm:pb-24">
      <Container>
        <SectionHeading title={dict.services.compare} />

        <Reveal
          from="zoom"
          className="mt-10 overflow-hidden rounded-3xl border border-border bg-surface shadow-(--shadow-soft)"
        >
          {/* Mobile: stacked matrix. All three tariffs stay on screen, so
              nothing is cut off and there is no horizontal scrolling. */}
          <div className="sm:hidden">
            <div className="grid grid-cols-[1fr_13rem] items-center gap-2 bg-surface-2 px-3 py-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                {t.feature}
              </span>
              <div className="grid grid-cols-3 gap-1">
                {tariffKeys.map((key) => (
                  <span
                    key={key}
                    className={`rounded-lg px-1 py-1 text-center text-[10px] font-semibold uppercase leading-tight ${
                      tariffs[key].featured
                        ? "bg-brand-800 text-white"
                        : "text-muted"
                    }`}
                  >
                    {dict.services[key].name}
                  </span>
                ))}
              </div>
            </div>

            {rows.map((r) => (
              <div
                key={r.key}
                className="grid grid-cols-[1fr_13rem] items-center gap-2 border-t border-border px-3 py-2"
              >
                <span className="text-[13px] font-medium leading-snug text-foreground">
                  {t.rows[r.key]}
                </span>
                <div className="grid grid-cols-3 items-center gap-1">
                  {tariffKeys.map((key) => (
                    <span
                      key={key}
                      className={`flex min-h-9 items-center justify-center rounded-lg px-0.5 text-center text-[13px] ${
                        tariffs[key].featured ? "bg-brand-500/10" : ""
                      }`}
                    >
                      {cell(r.key, key, r.values, true)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: real table. table-fixed with equal tariff columns keeps
              the marks centred under their heading instead of stranding them
              at the left edge of an over-wide column. */}
          <table className="hidden w-full table-fixed text-left sm:table">
            <colgroup>
              <col className="w-[34%]" />
              {tariffKeys.map((key) => (
                <col key={key} className="w-[22%]" />
              ))}
            </colgroup>
            <thead className="bg-surface-2 text-foreground">
              <tr>
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-widest">
                  {t.feature}
                </th>
                {tariffKeys.map((key) => (
                  <th
                    key={key}
                    className={`px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-widest ${
                      tariffs[key].featured ? "bg-brand-500/10" : ""
                    }`}
                  >
                    <span className="flex flex-col items-center gap-1">
                      {dict.services[key].name}
                      {tariffs[key].featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-800 px-2 py-0.5 text-[9px] font-semibold normal-case tracking-wide text-white">
                          <Icon.Lightning size={9} />
                          {dict.services.popular}
                        </span>
                      ) : null}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.key}
                  className="border-t border-border transition-colors hover:bg-surface-2/60"
                >
                  <td className="px-6 py-3 text-sm font-medium text-foreground">
                    {t.rows[r.key]}
                  </td>
                  {tariffKeys.map((key) => (
                    <td
                      key={key}
                      className={`px-4 py-3 text-center text-sm ${
                        tariffs[key].featured ? "bg-brand-500/5" : ""
                      }`}
                    >
                      {cell(r.key, key, r.values)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Container>
    </section>
  );
}
