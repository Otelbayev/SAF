"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  /** Formats the animated number for display. */
  format: (n: number) => string;
  /** Animation length in ms. */
  duration?: number;
  prefix?: string;
  suffix?: string;
  /** Re-run every time the number scrolls back into view. */
  replay?: boolean;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts up when the number scrolls into view, and rolls between values
 * whenever `value` changes while it is already on screen.
 *
 * `animated` holds a value only while a run is in flight; otherwise the
 * component renders `value` straight through, so the server output and the
 * settled client output are identical.
 */
export function CountUp({
  value,
  format,
  duration = 1100,
  prefix = "",
  suffix = "",
  replay = true,
}: Props) {
  const [animated, setAnimated] = useState<number | null>(null);
  const hostRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const shownRef = useRef(value); // last number actually painted
  const inViewRef = useRef(false);

  const run = useCallback(
    (from: number, to: number) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      const calm = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (calm || from === to) {
        shownRef.current = to;
        setAnimated(null);
        return;
      }

      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        if (p < 1) {
          const v = from + (to - from) * easeOut(p);
          shownRef.current = v;
          setAnimated(v);
          rafRef.current = requestAnimationFrame(tick);
        } else {
          shownRef.current = to;
          setAnimated(null); // hand back to `value`
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [duration],
  );

  // Count up from zero when the figure enters the viewport.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Already on screen means a value change is mid-roll; don't restart.
          if (!inViewRef.current) {
            inViewRef.current = true;
            run(0, value);
            if (!replay) io.disconnect();
          }
        } else {
          inViewRef.current = false;
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [run, replay, value]);

  // Roll to the new figure when inputs change while it is already on screen.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (inViewRef.current) run(shownRef.current, value);
    else shownRef.current = value;
  }, [value, run]);

  return (
    <span ref={hostRef} className="tabular-nums">
      {prefix}
      {format(animated ?? value)}
      {suffix}
    </span>
  );
}
