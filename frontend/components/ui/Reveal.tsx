"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

/** AOS-style entrance directions. */
export type RevealFrom = "up" | "down" | "left" | "right" | "fade" | "zoom";

type Props = {
  children: ReactNode;
  delay?: number;
  /** Travel distance in px for directional variants. */
  distance?: number;
  from?: RevealFrom;
  /** @deprecated use `distance`; kept so existing call sites keep working. */
  y?: number;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children" | "className">;

function initialFor(from: RevealFrom, d: number) {
  switch (from) {
    case "down":
      return { opacity: 0, y: -d };
    case "left":
      return { opacity: 0, x: -d };
    case "right":
      return { opacity: 0, x: d };
    case "zoom":
      return { opacity: 0, scale: 0.94 };
    case "fade":
      return { opacity: 0 };
    default:
      return { opacity: 0, y: d };
  }
}

export function Reveal({
  children,
  delay = 0,
  distance,
  from = "up",
  y,
  className,
  ...rest
}: Props) {
  const d = distance ?? y ?? 24;

  return (
    <motion.div
      initial={initialFor(from, d)}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
