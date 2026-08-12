"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { tariffKeys, tariffs } from "@/lib/site";
import { useQuoteModal } from "@/components/ui/QuoteModal";
import { TiltCard } from "@/components/ui/TiltCard";

type Props = { dict: Dictionary };

const accents: Record<string, string> = {
  express: "from-brand-500 to-brand-800",
  standard: "from-brand-700 to-brand-900",
  econom: "from-brand-800 to-brand-950",
};

export function Services({ dict }: Props) {
  const { open: openQuote } = useQuoteModal();

  return (
    <section id="tariffs" className="relative py-16 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow={dict.services.subtitle}
          title={dict.services.title}
          subtitle={dict.services.description}
        />

        <div className="mt-10 grid gap-6 sm:mt-14 md:grid-cols-3">
          {tariffKeys.map((key, i) => {
            const tier = dict.services[key];
            const { min, max, featured } = tariffs[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  amount: 0,
                  margin: "0px 0px -40px 0px",
                }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full"
              >
                <TiltCard max={5} lift={8} className="h-full">
                  <article
                    className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-surface p-8 transition-colors duration-500 ${
                      featured
                        ? "border-brand-500/40 ring-1 ring-brand-500/30"
                        : "border-border"
                    }`}
                  >
                    <div
                      aria-hidden
                      className={`pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-linear-to-br ${accents[key]} opacity-20 blur-3xl transition duration-700 group-hover:opacity-40`}
                    />
                    {featured ? (
                      <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-brand-600 dark:text-brand-200">
                        <Icon.Lightning size={12} />
                        {dict.services.popular}
                      </span>
                    ) : null}
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-800 text-white">
                      <Icon.Truck size={22} />
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold text-foreground">
                      {tier.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      {tier.description}
                    </p>
                    <div className="mt-6">
                      <div className="text-3xl font-semibold text-foreground">
                        {min}–{max}{" "}
                        <span className="text-xl font-normal text-muted">
                          {dict.services.daysLabel}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-muted">
                        {tier.price}
                      </div>
                    </div>
                    <ul className="mt-8 space-y-4 text-base text-foreground">
                      {tier.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-4 rounded-2xl border border-border bg-background/60 px-4 py-3.5 transition hover:border-brand-500/40 hover:bg-background"
                        >
                          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-800 text-white shadow-(--shadow-soft)">
                            <Icon.Check size={16} />
                          </span>
                          <span className="font-medium">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-8">
                      <Button
                        onClick={openQuote}
                        variant={featured ? "primary" : "outline"}
                        className="w-full"
                      >
                        {dict.services.cta}
                        <Icon.ArrowRight size={16} />
                      </Button>
                    </div>
                  </article>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
