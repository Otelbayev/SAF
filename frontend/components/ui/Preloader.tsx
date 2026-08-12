"use client";

import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "saf-splash";
/**
 * Floor before dismissing. React hydrates after `load`, so on a fast connection
 * the page is already "ready" the moment this component wakes up — without a
 * floor the splash would flash for a frame, which reads worse than no splash.
 */
const MIN_MS = 600;
/** Never hold the visitor longer than this, however slow the page is. */
const MAX_MS = 1200;
/** Must match the opacity transition on #saf-splash in globals.css. */
const FADE_MS = 450;

/**
 * Runs synchronously, before anything paints, so a visitor who already saw the
 * splash this session never gets a flash of it on the next page. Same technique
 * as `themeInitScript` — the stylesheet is render-blocking in <head>, so the
 * `.saf-splash-seen #saf-splash { display: none }` rule is already in force by
 * the time this line executes.
 */
export const splashInitScript = `(function(){try{if(sessionStorage.getItem('${SESSION_KEY}'))document.documentElement.classList.add('saf-splash-seen');}catch(e){}})();`;

/**
 * Brand splash shown on the first landing-page view of a session.
 *
 * Deliberately not a video: a video has to be downloaded before it can show
 * anything, so on a slow connection a "loading" screen would itself be the
 * thing being waited for. This is inline SVG + CSS — no extra network request
 * at all, so it paints with the very first frame of HTML even on 2G.
 *
 * The real page renders underneath and is fully in the accessibility tree, so
 * the overlay is `aria-hidden` and nothing is gated on it.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    const timers: number[] = [];
    const after = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(fn, ms));

    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) !== null;
    } catch {
      // Private mode / storage disabled — treat as a first view.
    }

    if (seen) {
      // The pre-paint script already hid it via CSS, so there is nothing to
      // rush; drop the markup on the next tick rather than mid-effect.
      after(0, () => setVisible(false));
      return () => timers.forEach(window.clearTimeout);
    }

    const startedAt = performance.now();

    // `load` and the cap can both reach this; the ref makes it idempotent.
    const finish = () => {
      if (finished.current) return;
      const elapsed = performance.now() - startedAt;
      if (elapsed < MIN_MS) {
        after(MIN_MS - elapsed, finish);
        return;
      }
      finished.current = true;
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // Nothing to do — the splash just shows again next navigation.
      }
      setDone(true);
      // A timer rather than `transitionend`: the global reduced-motion rule
      // collapses every transition to 0.01ms, and a missed event would leave
      // the overlay stuck on screen.
      after(FADE_MS, () => setVisible(false));
    };

    after(MAX_MS, finish);
    // Deferred even when the page is already loaded: setState straight from an
    // effect body forces an extra render pass during hydration.
    if (document.readyState === "complete") after(0, finish);
    else window.addEventListener("load", finish, { once: true });

    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("load", finish);
    };
  }, []);

  return (
    <>
      <script
        id="saf-splash-init"
        dangerouslySetInnerHTML={{ __html: splashInitScript }}
      />
      {visible ? (
        <div id="saf-splash" aria-hidden className={done ? "is-done" : undefined}>
          <div className="saf-splash-mark">
            {/* Colours come from globals.css, not from `var()` in presentation
                attributes — the house pattern is `currentColor` (Route.tsx:163)
                and custom properties in SVG attributes are unevenly supported. */}
            <svg viewBox="0 0 112 112" className="saf-splash-disc" aria-hidden>
              <defs>
                <linearGradient id="safSplashDisc" x1="0" y1="0" x2="1" y2="1">
                  <stop className="saf-splash-stop-0" offset="0%" />
                  <stop className="saf-splash-stop-1" offset="55%" />
                  <stop className="saf-splash-stop-2" offset="100%" />
                </linearGradient>
              </defs>
              <circle cx="56" cy="56" r="56" fill="url(#safSplashDisc)" />
              <circle
                className="saf-splash-ring"
                cx="56"
                cy="56"
                r="53"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={100}
              />
            </svg>
            <span className="saf-splash-word">
              <span className="saf-splash-name">SAF</span>
              <span className="saf-splash-sub">logistics</span>
            </span>
          </div>

          {/* The corridor, in miniature: two hubs in China feeding Tashkent. */}
          <svg
            viewBox="0 0 160 12"
            className="saf-splash-route"
            aria-hidden
            role="presentation"
          >
            <line
              className="route-line"
              x1="8"
              y1="6"
              x2="152"
              y2="6"
              stroke="currentColor"
              strokeOpacity="0.55"
              strokeWidth="2"
            />
            <circle cx="8" cy="6" r="4" fill="currentColor" />
            <circle
              cx="152"
              cy="6"
              r="4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>

          <span className="saf-splash-bar">
            <i />
          </span>
        </div>
      ) : null}
    </>
  );
}
