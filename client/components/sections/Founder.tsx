"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/lib/site";

type Props = { dict: Dictionary };

export function Founder({ dict }: Props) {
  return (
    <section id="founder" className="relative py-16 sm:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-brand p-8 text-white sm:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(40% 60% at 80% 20%, color-mix(in oklab, var(--color-brand-500) 50%, transparent) 0%, transparent 60%), radial-gradient(40% 40% at 10% 90%, color-mix(in oklab, var(--color-brand-300) 35%, transparent) 0%, transparent 60%)",
            }}
          />
          <div aria-hidden className="absolute inset-0 bg-grid opacity-20" />

          <div className="relative grid gap-10 lg:grid-cols-5 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative lg:col-span-2"
            >
              <div className="relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-2xl border border-white/20 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
                <Image
                  src="/images/boss.jpg"
                  alt={dict.seo.alt.founder}
                  fill
                  sizes="(min-width: 1024px) 420px, 80vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 60%, rgba(3,15,49,0.85) 100%)",
                  }}
                />
                <div className="absolute inset-x-5 bottom-5">
                  <div className="text-xs uppercase tracking-widest text-white/80">
                    {dict.founder.title}
                  </div>
                  <div className="text-xl font-semibold text-white">
                    {dict.founder.name}
                  </div>
                </div>
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute -left-8 -top-8 -z-10 h-40 w-40 rounded-full bg-brand-300/20 blur-3xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-widest text-white/80 backdrop-blur">
                {dict.founder.title}
              </span>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
                {dict.founder.name}
              </h2>
              <p className="mt-3 text-lg text-white/85">{dict.founder.role}</p>
              <p className="mt-1 text-sm text-white/70">
                {dict.founder.specialty}
              </p>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85">
                {dict.founder.bio}
              </p>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white hover:text-brand-950"
              >
                <Icon.Instagram size={18} />
                {dict.founder.instagram}
                <Icon.ArrowRight size={16} />
              </a>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
