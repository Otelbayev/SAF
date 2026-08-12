"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

type Props = { dict: Dictionary };

const itemKeys = ["deadline", "cargo", "transparency"] as const;
const itemIcons = {
  deadline: Icon.Clock,
  cargo: Icon.Shield,
  transparency: Icon.Tag,
} as const;

/** Rotating seal: concentric rings around a shield, drawn in SVG. */
function Seal({ label }: { label: string }) {
  return (
    <div className="relative mx-auto h-52 w-52 sm:h-64 sm:w-64">
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full text-brand-500"
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        <circle
          cx="100"
          cy="100"
          r="78"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeDasharray="30 14"
        />
      </motion.svg>
      <div
        aria-hidden
        className="beacon absolute inset-8 rounded-full bg-brand-500/20 blur-2xl"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-brand-600 to-brand-950 text-white shadow-(--shadow-elevated) sm:h-24 sm:w-24">
          <Icon.Shield size={38} />
        </span>
        <span className="mt-4 max-w-36 text-center text-[11px] font-semibold uppercase leading-tight tracking-[0.18em] text-muted">
          {label}
        </span>
      </div>
    </div>
  );
}

export function Guarantees({ dict }: Props) {
  return (
    <section
      id="guarantees"
      className="relative overflow-hidden border-y border-border bg-surface py-16 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-dots opacity-30"
      />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {/* Left: seal + heading */}
          <div>
            <Reveal>
              <Seal label={dict.guarantees.eyebrow} />
            </Reveal>
            <Reveal delay={0.1} className="mt-8 text-center lg:text-left">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {dict.guarantees.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {dict.guarantees.description}
              </p>
            </Reveal>
          </div>

          {/* Right: numbered rows, not cards */}
          <ol className="relative space-y-px">
            {itemKeys.map((key, i) => {
              const Ico = itemIcons[key];
              return (
                <li key={key}>
                  <Reveal
                    delay={0.12 + i * 0.1}
                    className="group relative flex gap-4 rounded-2xl border border-transparent px-3 py-4 transition duration-300 hover:border-border hover:bg-background sm:gap-6 sm:px-5 sm:py-5"
                  >
                    <div className="flex shrink-0 flex-col items-center">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-500/30 bg-background text-brand-700 transition duration-300 group-hover:bg-brand-800 group-hover:text-white dark:text-brand-200">
                        <Ico size={22} />
                      </span>
                      {i < itemKeys.length - 1 ? (
                        <span
                          aria-hidden
                          className="mt-2 w-px flex-1 bg-linear-to-b from-border to-transparent"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs font-semibold tabular-nums text-brand-600 dark:text-brand-300">
                          0{i + 1}
                        </span>
                        <h3 className="text-xl font-semibold text-foreground">
                          {dict.guarantees.items[key].title}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                        {dict.guarantees.items[key].desc}
                      </p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
