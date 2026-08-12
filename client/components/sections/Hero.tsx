"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useQuoteModal } from "@/components/ui/QuoteModal";
import { canStream } from "@/components/ui/VideoBackdrop";
import { CountUp } from "@/components/ui/CountUp";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

/** `value` is the number that counts up; prefix/suffix frame it. */
const stats = [
  { key: "years", value: 5, suffix: "+" },
  { key: "projects", value: 500, suffix: "+" },
  { key: "saved", value: 20, prefix: "15–" },
  { key: "clients", value: 120, suffix: "+" },
] as const;

const whole = (n: number) => String(Math.round(n));

/**
 * The hero is sized to exactly one viewport (h-svh) and never scrolls
 * internally: every block below shrinks rather than pushing content out.
 */
export function Hero({ locale, dict }: Props) {
  const { open: openQuote } = useQuoteModal();
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Start playback from JS rather than `autoplay`, which would make the
  // browser fetch the file during initial load no matter the preload hint.
  useEffect(() => {
    if (!showVideo) return;
    videoRef.current?.play().catch(() => {});
  }, [showVideo]);

  useEffect(() => {
    // Phones get the same clip as desktop. The only things that still hold it
    // back are the visitor's own signals: reduced motion, data-saver, or a
    // connection too slow to stream it without hurting the page.
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setShowVideo(!calm.matches && canStream("heavy"));

    // Defer past first paint so the poster renders immediately.
    const idle =
      window.requestIdleCallback?.(decide) ?? window.setTimeout(decide, 900);

    calm.addEventListener("change", decide);
    return () => {
      calm.removeEventListener("change", decide);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number);
      else clearTimeout(idle as number);
    };
  }, []);

  return (
    <section
      id="showcase"
      className="relative isolate flex h-svh min-h-136 w-full flex-col overflow-hidden pb-6 pt-16 sm:pb-10 sm:pt-24"
    >
      {/* Poster paints first (optimised by next/image); the clip fades in
          later, desktop only. The <video> gets no `poster` attribute — that
          would refetch the raw PNG straight from /public. */}
      <Image
        src="/images/poster.png"
        alt={dict.seo.alt.fleetPoster}
        fill
        priority
        fetchPriority="high"
        quality={70}
        sizes="100vw"
        className="absolute inset-0 -z-30 h-full w-full object-cover"
      />
      {showVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 -z-30 h-full w-full object-cover opacity-0 transition-opacity duration-700"
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          src="/videos/15373444_3840_2160_25fps.mp4"
        />
      ) : null}

      {/* Theme-aware overlay — stronger on mobile for readability */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 sm:hidden dark:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(247, 249, 255, 0.78) 0%, rgba(237, 241, 251, 0.58) 35%, rgba(3, 42, 125, 0.45) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 hidden sm:block dark:hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(247, 249, 255, 0.5) 0%, rgba(237, 241, 251, 0.34) 45%, rgba(3, 42, 125, 0.32) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 hidden dark:block"
        style={{
          background:
            "linear-gradient(135deg, rgba(5,13,26,0.88) 0%, rgba(5,13,26,0.78) 45%, rgba(13,59,122,0.6) 70%, rgba(5,13,26,0.88) 100%)",
        }}
      />

      {/* Brand glow accents */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 60% at 18% 30%, color-mix(in oklab, var(--color-brand-800) 22%, transparent) 0%, transparent 65%), radial-gradient(40% 40% at 90% 80%, color-mix(in oklab, var(--color-brand-500) 18%, transparent) 0%, transparent 65%)",
        }}
      />

      <div
        aria-hidden
        className="showcase-grid pointer-events-none absolute inset-0 -z-10 hidden sm:block"
      />

      {/* Floating info badges */}
      <div className="hidden 2xl:block">
        <FloatBox
          className="right-[5vw] top-[28%]"
          style={{ ["--dur" as string]: "3.4s" }}
        >
          <Icon.Sparkle size={12} /> {dict.hero.float1}
        </FloatBox>
        <FloatBox
          className="right-[10vw] top-[46%]"
          style={{ ["--dur" as string]: "4.2s" }}
        >
          <Icon.Truck size={12} /> {dict.hero.float2}
        </FloatBox>
      </div>

      <Container className="relative flex min-h-0 flex-1 flex-col justify-center">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-700/30 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-800 backdrop-blur sm:px-4 sm:py-1.5 sm:text-[11px] sm:tracking-[0.22em] dark:border-white/15 dark:bg-white/10 dark:text-brand-200"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500/80" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500 dark:bg-brand-300" />
            </span>
            <span>{dict.hero.badge}</span>
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            /* From lg up the headline is pinned to exactly two lines: each half
               is its own nowrap line and the block is allowed to grow past the
               copy column. Type size is unchanged — only the wrapping differs.
               Below lg it wraps naturally as before. */
            className="mt-3 text-balance text-[clamp(1.75rem,6vw,4.5rem)] font-semibold leading-[1.06] tracking-tight text-brand-950 sm:mt-5 lg:w-max lg:max-w-none dark:text-white"
          >
            <span className="block lg:whitespace-nowrap">
              {dict.hero.titleLine1}
            </span>
            <span className="block lg:whitespace-nowrap">
              {dict.hero.titleLine2}{" "}
              <span className="bg-linear-to-r from-brand-700 via-brand-500 to-brand-800 bg-clip-text text-transparent dark:from-brand-200 dark:via-white dark:to-brand-300">
                {dict.hero.titleAccent}
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-3 line-clamp-4 max-w-xl text-sm leading-relaxed text-brand-950/85 sm:mt-6 sm:text-lg dark:text-white/85"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-5 flex flex-col items-stretch gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <Button onClick={openQuote} size="lg" className="w-full sm:w-auto">
              {dict.hero.ctaContact}
              <Icon.ArrowRight size={18} />
            </Button>
            <Link
              href={`/${locale}#tariffs`}
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full border border-brand-700/30 bg-white/70 px-6 py-3.5 text-base font-medium text-brand-900 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-700/60 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto sm:px-8 dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:border-white/45 dark:hover:bg-white/20"
            >
              {dict.hero.ctaServices}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.42 }}
            className="mt-5 flex flex-wrap items-center gap-2 text-brand-950/85 sm:mt-7 sm:gap-2.5 dark:text-white/85"
          >
            <Pill>
              <Icon.Shield size={12} /> {dict.hero.badgeInsuredValue}
            </Pill>
            <Pill>
              <Icon.Lightning size={12} /> {dict.hero.badgeExpressValue}
            </Pill>
            <Pill className="hidden sm:inline-flex">
              <Icon.Truck size={12} /> {dict.hero.routeValue}
            </Pill>
            <Pill className="gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="truncate">{dict.hero.routeLabel}</span>
              <span className="sr-only">{dict.hero.tickerLabel}</span>
            </Pill>
          </motion.div>
        </div>
      </Container>

      <Container className="relative mt-4 shrink-0 sm:mt-8">
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.55 },
            },
          }}
          className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4"
        >
          {stats.map((s, idx) => (
            <motion.li
              key={s.key}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
              className={`rounded-2xl border border-brand-700/20 bg-white/60 px-3 py-2 backdrop-blur-md sm:p-4 dark:border-white/15 dark:bg-white/10 ${
                idx >= 2 ? "hidden sm:block" : ""
              }`}
            >
              <div className="text-xl font-semibold text-brand-950 sm:text-4xl dark:text-white">
                <CountUp
                  value={s.value}
                  format={whole}
                  prefix={"prefix" in s ? s.prefix : ""}
                  suffix={"suffix" in s ? s.suffix : ""}
                />
              </div>
              <div className="mt-0.5 text-[9px] font-medium uppercase tracking-widest text-brand-900/75 sm:mt-1 sm:text-[11px] dark:text-white/75">
                {dict.hero.stats[s.key]}
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </Container>

      {/* Sits above the backdrop but below the copy, so it never veils text. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 -z-10 h-16 sm:h-20"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, var(--background) 100%)",
        }}
      />
    </section>
  );
}

function Pill({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border border-brand-700/25 bg-white/65 px-2.5 py-1 text-[11px] backdrop-blur sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs dark:border-white/20 dark:bg-white/10 ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

function FloatBox({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`showcase-floatbox pointer-events-none absolute z-10 inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-brand-700/25 bg-white/70 px-3.5 py-2.5 text-xs font-medium text-brand-900 backdrop-blur dark:border-white/15 dark:bg-brand-900/40 dark:text-brand-100 ${className ?? ""}`}
      style={style}
    >
      {children}
    </div>
  );
}
