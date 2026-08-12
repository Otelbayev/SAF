"use client";

import { useTheme } from "./ThemeProvider";
import { Icon } from "@/components/ui/Icon";

type Props = {
  label?: string;
  className?: string;
};

export function ThemeToggle({ label, className }: Props) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label ?? "Toggle theme"}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:bg-surface-2 ${className ?? ""}`}
    >
      <span className="sr-only">{label ?? "Toggle theme"}</span>
      <span
        className={`transition-transform duration-300 ${isDark ? "rotate-0" : "-rotate-90 opacity-0"}`}
        style={{ position: "absolute" }}
      >
        <Icon.Moon size={18} />
      </span>
      <span
        className={`transition-transform duration-300 ${isDark ? "rotate-90 opacity-0" : "rotate-0"}`}
        style={{ position: "absolute" }}
      >
        <Icon.Sun size={18} />
      </span>
    </button>
  );
}
