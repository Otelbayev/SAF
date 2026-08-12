"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { useQuoteModal } from "@/components/ui/QuoteModal";
import { siteConfig } from "@/lib/site";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function Navbar({ locale, dict }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: openQuote } = useQuoteModal();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // iOS-safe scroll lock: position:fixed on <body> with preserved scroll Y
  useEffect(() => {
    if (!mobileOpen) return;
    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
    };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.left = prev.bodyLeft;
      body.style.right = prev.bodyRight;
      body.style.width = prev.bodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen]);

  const links = [
    { href: `/${locale}#about`, label: dict.nav.about, icon: Icon.Sparkle },
    { href: `/${locale}#tariffs`, label: dict.nav.tariffs, icon: Icon.Truck },
    {
      href: `/${locale}#calculator`,
      label: dict.nav.calculator,
      icon: Icon.Cpu,
    },
    { href: `/${locale}#route`, label: dict.nav.route, icon: Icon.MapPin },
    { href: `/${locale}#contact`, label: dict.nav.contact, icon: Icon.Phone },
  ];

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-90 w-full transition-all duration-300",
          scrolled
            ? "backdrop-blur-xl bg-[color-mix(in_oklab,var(--background)_88%,transparent)] border-b border-border"
            : "backdrop-blur-md bg-[color-mix(in_oklab,var(--background)_60%,transparent)] md:bg-transparent md:backdrop-blur-none",
        )}
        style={{ pointerEvents: "auto" }}
      >
        <Container className="flex h-16 items-center justify-between sm:h-20">
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-3"
            aria-label={dict.site.name}
          >
            <span className="relative inline-flex h-10 w-10 overflow-hidden rounded-xl bg-brand-950 ring-1 ring-brand-700/40">
              <Image
                src="/images/logo1.jpg"
                alt={dict.site.name}
                fill
                sizes="40px"
                priority
                className="object-cover"
              />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-wide text-foreground sm:text-base">
                {dict.site.name}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted sm:text-[11px]">
                {dict.site.tagline}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-surface-2 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <LocaleSwitcher current={locale} />
            <ThemeToggle label={dict.theme.toggle} />
            <Button onClick={openQuote} size="sm">
              {dict.nav.getQuote}
              <Icon.ArrowRight size={16} />
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="relative inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-(--shadow-soft) transition-transform active:scale-95 md:hidden"
            style={{
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none relative block h-3 w-5"
            >
              <motion.span
                className="absolute left-0 right-0 block h-0.5 rounded-full bg-current"
                style={{ top: "0%" }}
                animate={
                  mobileOpen ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }
                }
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="absolute left-0 right-0 block h-0.5 rounded-full bg-current"
                style={{ top: "calc(50% - 1px)" }}
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 right-0 block h-0.5 rounded-full bg-current"
                style={{ top: "calc(100% - 2px)" }}
                animate={
                  mobileOpen ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }
                }
                transition={{ duration: 0.3 }}
              />
            </span>
          </button>
        </Container>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            id="mobile-menu"
            className="fixed inset-0 top-0 z-95 overflow-x-hidden overflow-y-auto overscroll-contain md:hidden"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div
              aria-hidden
              className="pointer-events-none fixed inset-0 bg-linear-to-br from-brand-950 via-brand-900 to-brand-800"
            />
            <div
              aria-hidden
              className="pointer-events-none fixed inset-0 bg-grid opacity-15"
            />
            <div
              aria-hidden
              className="pointer-events-none fixed -right-20 -top-16 h-64 w-64 rounded-full bg-brand-500/25 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none fixed -bottom-16 -left-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl"
            />

            <div className="relative flex min-h-dvh w-full flex-col text-white">
              <Container className="flex h-16 items-center justify-between">
                <Link
                  href={`/${locale}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5"
                  aria-label={dict.site.name}
                >
                  <span className="relative inline-flex h-9 w-9 overflow-hidden rounded-lg bg-white/10 ring-1 ring-white/20">
                    <Image
                      src="/images/logo1.jpg"
                      alt={dict.site.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[13px] font-semibold tracking-wide">
                      {dict.site.name}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/60">
                      {dict.site.tagline}
                    </span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition active:scale-95"
                >
                  <Icon.X size={16} />
                </button>
              </Container>

              <Container className="flex flex-1 flex-col gap-5 pt-2 pb-6">
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.04,
                        delayChildren: 0.05,
                      },
                    },
                  }}
                  className="flex flex-col gap-1.5"
                >
                  {links.map((l, i) => {
                    const Ico = l.icon;
                    return (
                      <motion.li
                        key={l.href}
                        variants={{
                          hidden: { opacity: 0, x: -16 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        <Link
                          href={l.href}
                          onClick={() => setMobileOpen(false)}
                          className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 backdrop-blur transition active:scale-[0.98]"
                        >
                          <span className="flex items-center gap-3 min-w-0">
                            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                              <Ico size={16} />
                            </span>
                            <span className="flex flex-col min-w-0">
                              <span className="text-[9px] uppercase tracking-[0.22em] text-white/50">
                                0{i + 1}
                              </span>
                              <span className="truncate text-base font-semibold">
                                {l.label}
                              </span>
                            </span>
                          </span>
                          <Icon.ArrowRight
                            size={14}
                            className="shrink-0 text-white/70 transition group-hover:translate-x-0.5"
                          />
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="flex flex-col gap-2.5"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      openQuote();
                    }}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-brand-950 shadow-(--shadow-glow) transition active:scale-[0.98]"
                  >
                    {dict.nav.getQuote}
                    <Icon.ArrowRight size={16} />
                  </button>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <LocaleSwitcher current={locale} />
                    </div>
                    <ThemeToggle label={dict.theme.toggle} />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.4 }}
                  className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/60">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>
                      {dict.contact.hoursLabel}
                    </div>
                    <div className="text-[11px] text-white/80 truncate">
                      {dict.contact.hoursWeek}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col gap-1.5">
                    {siteConfig.phones.map((p) => (
                      <a
                        key={p}
                        href={`tel:${p}`}
                        className="inline-flex items-center gap-2.5 text-sm font-semibold text-white"
                      >
                        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                          <Icon.Phone size={12} />
                        </span>
                        <span className="truncate">{p}</span>
                      </a>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
                    <a
                      href={siteConfig.instagram}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Instagram"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition active:scale-95"
                    >
                      <Icon.Instagram size={15} />
                    </a>
                    <a
                      href={siteConfig.mapUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Map"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition active:scale-95"
                    >
                      <Icon.MapPin size={15} />
                    </a>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      aria-label="Email"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition active:scale-95"
                    >
                      <Icon.Mail size={15} />
                    </a>
                  </div>
                </motion.div>
              </Container>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
