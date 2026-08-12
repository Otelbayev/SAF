"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

type Props = { dict: Dictionary };

const featureKeys = ["experience", "b2b", "hub"] as const;
const featureIcons = {
  experience: Icon.Sparkle,
  b2b: Icon.Truck,
  hub: Icon.MapPin,
} as const;

export function About({ dict }: Props) {
  return (
    <section id="about" className="relative py-16 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 50% at 80% 20%, color-mix(in oklab, var(--color-brand-500) 10%, transparent), transparent 70%)",
        }}
      />
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal from="left" className="relative lg:col-span-6">
            <div className="relative aspect-4/5 overflow-hidden rounded-[2.25rem] border border-border shadow-(--shadow-elevated) sm:aspect-5/6">
              <Image
                src="/images/industrial-port-container-yard.jpg"
                alt={dict.seo.alt.containerYard}
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(3,15,49,0.05) 30%, rgba(3,15,49,0.78) 100%)",
                }}
              />

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur"
              >
                <Icon.MapPin size={12} /> {dict.about.highlight.hub}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-white sm:inset-x-7 sm:bottom-7"
              >
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-white/80">
                    {dict.about.highlight.since}
                  </div>
                  <div className="mt-1 text-2xl font-semibold sm:text-3xl">
                    {dict.about.highlight.city}
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-8 -right-4 w-56 rounded-3xl border border-border bg-surface p-5 shadow-(--shadow-elevated) sm:-right-8 sm:w-64 sm:p-6"
            >
              <div className="text-xs font-medium uppercase tracking-widest text-muted">
                {dict.about.highlight.since}
              </div>
              <div className="mt-2 text-5xl font-semibold leading-none text-foreground sm:text-6xl">
                {dict.about.highlight.projectsNumber}
              </div>
              <div className="mt-2 text-sm text-muted">
                {dict.about.highlight.projectsLabel}
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "92%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-linear-to-r from-brand-500 to-brand-800"
                />
              </div>
            </motion.div>

            <div
              aria-hidden
              className="pointer-events-none absolute -left-10 top-1/3 -z-10 h-48 w-48 rounded-full bg-brand-500/25 blur-3xl"
            />
          </Reveal>

          <div className="lg:col-span-6">
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-700 dark:text-brand-200"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              {dict.about.subtitle}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl"
            >
              {dict.about.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-5 text-base leading-relaxed text-muted sm:text-lg"
            >
              {dict.about.description}
            </motion.p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {featureKeys.map((k, i) => {
                const IconEl = featureIcons[k];
                return (
                  <Reveal
                    key={k}
                    delay={0.1 + i * 0.08}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-(--shadow-glow)"
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-brand-700 to-brand-900 text-white shadow-(--shadow-soft)">
                      <IconEl size={20} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-foreground sm:text-lg">
                      {dict.about.features[k].title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {dict.about.features[k].desc}
                    </p>
                    <div
                      aria-hidden
                      className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-brand-500/10 opacity-0 transition group-hover:opacity-100"
                    />
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
