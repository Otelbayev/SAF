"use client";

import type { Dictionary } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { CargoScene } from "@/components/ui/CargoScene";
import { tariffs } from "@/lib/site";

type Props = { dict: Dictionary };

/**
 * Bento layout: one hero cell carrying the headline advantage plus a 3D
 * container, and five supporting cells of varying width. Deliberately not a
 * uniform card grid — the surrounding sections already use those.
 */
const items = [
  {
    key: "fast" as const,
    icon: Icon.Truck,
    span: "lg:col-span-2 lg:row-span-2",
  },
  { key: "expert" as const, icon: Icon.MapPin, span: "lg:col-span-2" },
  { key: "secure" as const, icon: Icon.Shield, span: "" },
  { key: "price" as const, icon: Icon.Tag, span: "" },
  { key: "support" as const, icon: Icon.Headset, span: "" },
  { key: "tech" as const, icon: Icon.Cpu, span: "" },
];

export function WhyUs({ dict }: Props) {
  return (
    <section id="why" className="relative py-16 sm:py-32">
      <Container>
        <SectionHeading eyebrow={dict.why.subtitle} title={dict.why.title} />

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:auto-rows-fr lg:grid-cols-4">
          {items.map((item, i) => {
            const Ico = item.icon;
            const hero = i === 0;

            return (
              <Reveal
                key={item.key}
                delay={i * 0.06}
                className={`group relative overflow-hidden rounded-3xl border transition duration-500 hover:-translate-y-1 ${item.span} ${
                  hero
                    ? "border-brand-500/30 bg-linear-to-br from-brand-900 via-brand-800 to-brand-950 p-6 text-white shadow-(--shadow-elevated) sm:p-8"
                    : "border-border bg-surface p-5 hover:border-brand-500/30 hover:shadow-(--shadow-glow)"
                }`}
              >
                {hero ? (
                  <>
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-grid opacity-15"
                    />
                    <CargoScene
                      className="pointer-events-none absolute -right-6 top-1/2 hidden h-56 w-56 -translate-y-1/2 opacity-70 sm:block"
                      size={104}
                      duration={20}
                    />
                    <div className="relative max-w-xs">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                        <Ico size={24} />
                      </div>
                      <h3 className="mt-5 text-2xl font-semibold leading-tight">
                        {dict.why.items[item.key].title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/75">
                        {dict.why.items[item.key].desc}
                      </p>
                      <div className="mt-6 inline-flex items-baseline gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur">
                        <span className="text-2xl font-semibold">
                          {tariffs.express.min}–{tariffs.express.max}
                        </span>
                        <span className="text-xs uppercase tracking-widest text-white/70">
                          {dict.services.daysLabel}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-brand-500/10 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100"
                    />
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-brand-700 to-brand-900 text-white shadow-(--shadow-soft)">
                      <Ico size={20} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-foreground sm:text-lg">
                      {dict.why.items[item.key].title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {dict.why.items[item.key].desc}
                    </p>
                  </>
                )}
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
