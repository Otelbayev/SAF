"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type Props = {
  /** Path under /public/videos. */
  src: string;
  /** Poster rendered through next/image, so the heavy PNG is optimised. */
  poster: string;
  /**
   * Grade the footage into the brand palette instead of showing raw colour.
   * "duotone" is the strongest, "tint" is subtle, "none" leaves it alone.
   */
  grade?: "duotone" | "tint" | "none";
  /** Drift the layer as it scrolls through the viewport. */
  parallax?: boolean;
  /** Extra classes for the wrapper (positioning is the caller's job). */
  className?: string;
  /** Opacity of the media itself, before overlays. */
  opacity?: number;
  /**
   * Roughly how big the file is. "heavy" clips are skipped unless the
   * connection clearly has headroom, so a mediocre link still gets the poster.
   */
  weight?: "light" | "heavy";
};

/**
 * Decorative video is never worth degrading the page for: skip it on
 * data-saver, slow effective types, and — for large files — slow downlinks.
 */
export function canStream(weight: "light" | "heavy" = "light"): boolean {
  const conn = (
    navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
        downlink?: number;
      };
    }
  ).connection;

  if (!conn) return true; // no info (Safari/Firefox) — assume it's fine
  if (conn.saveData) return false;
  if (conn.effectiveType && /(^|-)2g|3g/.test(conn.effectiveType)) return false;
  if (weight === "heavy" && typeof conn.downlink === "number") {
    return conn.downlink >= 5; // Mbps
  }
  return true;
}

/**
 * A poster-first video backdrop.
 *
 * The poster paints immediately; the clip is only fetched once the section is
 * about to enter the viewport, and never on small screens, reduced-motion or
 * data-saver setups. Nothing here is decorative-critical — if the video never
 * loads the section still looks finished.
 */
export function VideoBackdrop({
  src,
  poster,
  grade = "duotone",
  parallax = false,
  className,
  opacity = 1,
  weight = "light",
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!wide.matches || calm.matches) return;
    if (!canStream(weight)) return;

    const el = hostRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "500px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [weight]);

  // Cheap parallax: one transform write per frame, driven by rAF.
  useEffect(() => {
    if (!parallax) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const host = hostRef.current;
        const media = mediaRef.current;
        if (!host || !media) return;
        const r = host.getBoundingClientRect();
        const progress = (r.top + r.height / 2) / window.innerHeight - 0.5;
        media.style.transform = `translate3d(0, ${(-progress * 48).toFixed(1)}px, 0) scale(1.12)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [parallax]);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={clsx(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div
        ref={mediaRef}
        className="absolute inset-0 will-change-transform"
        style={{ transform: parallax ? "scale(1.12)" : undefined, opacity }}
      >
        <Image
          src={poster}
          alt=""
          fill
          sizes="100vw"
          quality={70}
          className="object-cover"
        />
        {load ? (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onCanPlay={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            src={src}
          />
        ) : null}
      </div>

      {/* Brand grading */}
      {grade === "duotone" ? (
        <>
          <div className="absolute inset-0 bg-brand-950/70 mix-blend-color" />
          <div className="absolute inset-0 bg-linear-to-br from-brand-900/85 via-brand-950/70 to-brand-800/80" />
        </>
      ) : null}
      {grade === "tint" ? (
        <div className="absolute inset-0 bg-brand-950/55" />
      ) : null}

      {/* Fine grain keeps large flat gradients from banding */}
      <div className="video-grain absolute inset-0" />
    </div>
  );
}
