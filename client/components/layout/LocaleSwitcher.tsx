"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/locales";
import { Icon } from "@/components/ui/Icon";
import { Flag } from "@/components/ui/Flag";

type Props = {
  current: Locale;
};

const localeFlagCodes: Record<Locale, string> = {
  uz: "uz",
  ru: "ru",
  en: "gb",
};

function swapLocale(pathname: string, next: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${next}`;
  if ((locales as readonly string[]).includes(parts[0])) {
    parts[0] = next;
  } else {
    parts.unshift(next);
  }
  return "/" + parts.join("/");
}

export function LocaleSwitcher({ current }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm font-medium text-foreground transition hover:bg-surface-2"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Flag code={localeFlagCodes[current]} width={20} />
        <span className="uppercase">{current}</span>
        <Icon.ChevronDown size={14} />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-border bg-surface p-1 shadow-(--shadow-soft)"
        >
          {locales.map((l) => {
            const active = l === current;
            return (
              <li key={l}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setOpen(false);
                    router.push(swapLocale(pathname, l));
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                    active
                      ? "bg-brand-800 text-white"
                      : "hover:bg-surface-2 text-foreground"
                  }`}
                >
                  <Flag code={localeFlagCodes[l]} width={20} />
                  <span>{localeNames[l]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
