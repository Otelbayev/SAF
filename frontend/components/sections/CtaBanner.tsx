"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/lib/site";
import { useQuoteModal } from "@/components/ui/QuoteModal";
import { VideoBackdrop } from "@/components/ui/VideoBackdrop";

type Props = { dict: Dictionary };

export function CtaBanner({ dict }: Props) {
  const { open } = useQuoteModal();

  return (
    <section className="relative py-16 sm:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative isolate overflow-hidden rounded-4xl border border-border shadow-(--shadow-elevated)"
        >
          <VideoBackdrop
            src="/videos/vecteezy_cargo-truck-with-cargo-trailer-is-driving-on-the-highway_47880046.mp4"
            poster="/images/vecteezy_cargo-truck-with-cargo-trailer-is-driving-on-the-highway_47880046-poster.png"
            grade="duotone"
            weight="heavy"
            parallax
            className="-z-10"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-grid opacity-20"
          />
          <div aria-hidden className="sheen -z-10 left-0" />

          <div className="relative flex flex-col items-start justify-between gap-8 p-7 text-white sm:gap-10 sm:p-14 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/85 backdrop-blur">
                <Icon.Lightning size={12} />
                {dict.site.name}
              </span>
              <h3 className="mt-5 text-balance text-3xl font-semibold leading-tight sm:text-5xl">
                {dict.ctaBanner.title}
              </h3>
              <p className="mt-4 text-base text-white/85 sm:text-lg">
                {dict.ctaBanner.subtitle}
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={open}
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-brand-950 shadow-(--shadow-glow) transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/95 sm:w-auto"
              >
                {dict.ctaBanner.button}
                <Icon.ArrowRight size={18} />
              </button>
              <a
                href={`tel:${siteConfig.phones[0]}`}
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 text-base font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/15 sm:w-auto"
              >
                <Icon.Phone size={16} />
                {dict.ctaBanner.secondary}
              </a>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
