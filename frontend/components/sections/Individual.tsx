"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

type Props = { dict: Dictionary };

const itemKeys = ["route", "terms", "pricing", "manager"] as const;
type ItemKey = (typeof itemKeys)[number];

const itemIcons = {
  route: Icon.MapPin,
  terms: Icon.Check,
  pricing: Icon.Tag,
  manager: Icon.Headset,
} as const;

const AUTOPLAY_MS = 4500;

export function Individual({ dict }: Props) {
  const [active, setActive] = useState<ItemKey>("route");
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const ActiveIcon = itemIcons[active];

  // Advance on its own, but only while the section is on screen and the
  // visitor is neither interacting with it nor asking for reduced motion.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = sectionRef.current;
    if (!el) return;

    let timer: number | undefined;
    const start = () => {
      timer = window.setInterval(() => {
        setActive((cur) => {
          const i = itemKeys.indexOf(cur);
          return itemKeys[(i + 1) % itemKeys.length];
        });
      }, AUTOPLAY_MS);
    };
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = undefined;
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.25 },
    );
    io.observe(el);

    const onVisibility = () => (document.hidden ? stop() : undefined);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [paused]);

  return (
    <section
      id="individual"
      ref={sectionRef}
      className="relative py-16 sm:py-32"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 50% at 15% 30%, color-mix(in oklab, var(--color-brand-500) 10%, transparent), transparent 70%)",
        }}
      />
      <Container>
        <SectionHeading
          eyebrow={dict.individual.eyebrow}
          title={dict.individual.title}
          subtitle={dict.individual.description}
          align="left"
          className="max-w-3xl"
        />

        <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Selector list */}
          <Reveal from="left" className="flex flex-col gap-2">
            {itemKeys.map((key, i) => {
              const Ico = itemIcons[key];
              const isActive = key === active;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActive(key)}
                  aria-pressed={isActive}
                  className={`group relative flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition duration-300 ${
                    isActive
                      ? "border-brand-500/50 bg-surface shadow-(--shadow-soft)"
                      : "border-border bg-surface/50 hover:border-brand-500/30 hover:bg-surface"
                  }`}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="individual-active"
                      className="absolute inset-y-2 left-0 w-1 rounded-full bg-brand-500"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  ) : null}
                  <span
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                      isActive
                        ? "bg-linear-to-br from-brand-600 to-brand-900 text-white shadow-(--shadow-soft)"
                        : "bg-surface-2 text-muted group-hover:text-foreground"
                    }`}
                  >
                    <Ico size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-foreground">
                      {dict.individual.items[key].title}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 text-muted transition ${
                      isActive
                        ? "translate-x-0 text-brand-600 dark:text-brand-200"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }`}
                  >
                    <Icon.ArrowRight size={18} />
                  </span>
                  <span className="sr-only">{String(i + 1)}</span>
                </button>
              );
            })}
          </Reveal>

          {/* Detail panel */}
          <Reveal
            delay={0.1}
            className="relative min-h-72 overflow-hidden rounded-3xl border border-border bg-linear-to-br from-brand-900 via-brand-800 to-brand-950 p-8 text-white shadow-(--shadow-elevated) sm:p-10"
          >
            <div aria-hidden className="absolute inset-0 bg-dots opacity-20" />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-400/25 blur-3xl"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="relative flex h-full flex-col"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
                  <ActiveIcon size={26} />
                </div>
                <h3 className="mt-6 text-2xl font-semibold leading-tight sm:text-3xl">
                  {dict.individual.items[active].title}
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-white/80">
                  {dict.individual.items[active].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Slide indicators, also usable as controls */}
            <div className="relative mt-8 flex items-center gap-2">
              {itemKeys.map((key) => {
                const isActive = key === active;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActive(key)}
                    aria-label={dict.individual.items[key].title}
                    aria-current={isActive}
                    className="group py-2"
                  >
                    <span
                      className={`block h-1.5 overflow-hidden rounded-full transition-all duration-300 ${
                        isActive
                          ? "w-10 bg-white/30"
                          : "w-3 bg-white/30 group-hover:bg-white/50"
                      }`}
                    >
                      {isActive ? (
                        <motion.span
                          key={`${key}-${paused}`}
                          className="block h-full rounded-full bg-white"
                          initial={{ width: paused ? "100%" : "0%" }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration: paused ? 0 : AUTOPLAY_MS / 1000,
                            ease: "linear",
                          }}
                        />
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
