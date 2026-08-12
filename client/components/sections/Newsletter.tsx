"use client";

import { useState, type FormEvent } from "react";
import { isValidPhoneNumber } from "libphonenumber-js";
import type { Dictionary } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { PhoneField } from "@/components/ui/PhoneField";

type Props = { dict: Dictionary; variant?: "inline" | "panel" };

export function Newsletter({ dict, variant = "panel" }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (!phone || !isValidPhoneNumber(phone)) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);
    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "newsletter",
          name: String(fd.get("name") ?? ""),
          phone,
          locale: document.documentElement.lang,
          page: window.location.pathname,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !data.ok) throw new Error("failed");
      setSent(true);
      form.reset();
      setPhone("");
      setTimeout(() => setSent(false), 4000);
    } catch {
      setError(true);
      setTimeout(() => setError(false), 4000);
    } finally {
      setSubmitting(false);
    }
  }

  const lightInput =
    "h-12 flex-1 rounded-full border border-border bg-background px-5 text-base sm:text-sm text-foreground placeholder:text-muted/80 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30";
  const darkInput =
    "h-12 flex-1 rounded-full border border-white/15 bg-white/10 px-5 text-base sm:text-sm text-white placeholder:text-white/60 backdrop-blur outline-none transition focus:border-white/50 focus:ring-2 focus:ring-white/20";

  const buttonLabel = submitting
    ? "…"
    : sent
      ? dict.newsletter.success
      : error
        ? dict.newsletter.error
        : dict.newsletter.submit;

  if (variant === "inline") {
    return (
      <form
        onSubmit={onSubmit}
        className="flex w-full flex-col gap-2 sm:flex-row"
      >
        <input
          name="name"
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          enterKeyHint="next"
          placeholder={dict.newsletter.namePlaceholder}
          required
          className={lightInput}
        />
        <PhoneField
          value={phone}
          onChange={setPhone}
          placeholder={dict.newsletter.phonePlaceholder}
          shape="pill"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-800 px-6 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
        >
          {buttonLabel}
          <Icon.ArrowRight size={16} />
        </button>
      </form>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-4xl border border-border bg-linear-to-br from-brand-900 via-brand-800 to-brand-950 p-8 text-white shadow-(--shadow-elevated) sm:p-12">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-20" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-16 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl"
      />
      <div className="relative flex flex-col gap-8">
        <div className="max-w-2xl">
          <h3 className="text-balance text-2xl font-semibold leading-tight sm:text-3xl">
            {dict.newsletter.title}
          </h3>
          <p className="mt-3 text-sm text-white/80 sm:text-base">
            {dict.newsletter.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <form
            onSubmit={onSubmit}
            className="grid w-full gap-3 sm:grid-cols-[1fr_1.4fr_auto]"
          >
            <input
              name="name"
              type="text"
              autoComplete="name"
              autoCapitalize="words"
              enterKeyHint="next"
              placeholder={dict.newsletter.namePlaceholder}
              required
              className={darkInput}
            />
            <PhoneField
              value={phone}
              onChange={setPhone}
              placeholder={dict.newsletter.phonePlaceholder}
              variant="dark"
              shape="pill"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-brand-950 transition hover:bg-white/90 disabled:opacity-70"
            >
              {buttonLabel}
              <Icon.ArrowRight size={16} />
            </button>
          </form>
          {phoneError ? (
            <span role="alert" className="text-xs text-red-200">
              {dict.contact.form.phoneInvalid}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
