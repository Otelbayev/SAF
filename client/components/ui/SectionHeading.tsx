"use client";

import clsx from "clsx";
import { motion } from "framer-motion";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: Props) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? (
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-1 text-xs font-medium uppercase tracking-widest text-brand-700 dark:text-brand-200"
        >
          {eyebrow}
        </motion.span>
      ) : null}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0, margin: "0px 0px -40px 0px" }}
        transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
      >
        {title}
      </motion.h2>
      {subtitle ? (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className={clsx(
            "max-w-2xl text-base text-muted sm:text-lg",
            align === "center" ? "text-center" : "text-left",
          )}
        >
          {subtitle}
        </motion.p>
      ) : null}
    </div>
  );
}
