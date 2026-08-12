"use client";

import { useRef, type ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees at the card's corners. */
  max?: number;
  /** Lift in px while hovered. */
  lift?: number;
};

/**
 * Pointer-tracked 3D tilt. Writes CSS custom properties directly on the node
 * instead of going through React state, so moving the pointer never re-renders.
 * Honours prefers-reduced-motion via the `.tilt` rule in globals.css.
 */
export function TiltCard({ children, className, max = 7, lift = 6 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${px * max * 2}deg`);
    el.style.setProperty("--rx", `${-py * max * 2}deg`);
    el.style.setProperty("--ty", `${-lift}px`);
    el.style.transitionDuration = "80ms";
  }

  function reset() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ty", "0px");
    el.style.transitionDuration = "";
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={clsx("tilt", className)}
    >
      {children}
    </div>
  );
}
