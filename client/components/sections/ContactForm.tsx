"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isValidPhoneNumber } from "libphonenumber-js";
import type { Dictionary } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { PhoneField } from "@/components/ui/PhoneField";

type Props = { dict: Dictionary };

const SERVICE_KEYS = [
  "express",
  "standard",
  "econom",
  "customs",
  "b2b",
] as const;

export function ContactForm({ dict }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base text-foreground placeholder:text-muted/80 outline-none transition focus:border-brand-500 focus:bg-surface focus:ring-2 focus:ring-brand-500/30 sm:text-sm";

  const labelClass =
    "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted";

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
      const serviceKey = String(fd.get("service") ?? "");
      const serviceLabel =
        (dict.contact.form.services as Record<string, string>)[serviceKey] ??
        serviceKey;
      const userMsg = String(fd.get("message") ?? "").trim();
      const composed = [serviceLabel, userMsg].filter(Boolean).join("\n");

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "contact",
          name: String(fd.get("name") ?? ""),
          phone,
          message: composed,
          locale: document.documentElement.lang,
          page: window.location.pathname,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !data.ok) throw new Error("failed");
      setDone(true);
      form.reset();
      setPhone("");
      setTimeout(() => setDone(false), 4000);
    } catch {
      setError(true);
      setTimeout(() => setError(false), 4000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative isolate overflow-hidden rounded-3xl border border-border bg-surface p-7 shadow-(--shadow-soft) sm:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[20%] top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--color-brand-500) 70%, transparent), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 -z-10 h-64 w-64 rounded-full bg-brand-500/15 blur-3xl"
      />

      <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
        {dict.contact.form.title}
      </h3>
      <p className="mt-1.5 text-sm text-muted">{dict.contact.form.subtitle}</p>

      <form onSubmit={onSubmit} className="mt-7 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>{dict.contact.form.name}</span>
            <input
              required
              name="name"
              type="text"
              autoComplete="name"
              autoCapitalize="words"
              enterKeyHint="next"
              placeholder={dict.contact.form.namePlaceholder}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>{dict.contact.form.phone}</span>
            <PhoneField
              value={phone}
              onChange={setPhone}
              placeholder={dict.contact.form.phonePlaceholder}
              required
            />
            {phoneError ? (
              <span
                role="alert"
                className="mt-1.5 block text-xs text-red-600 dark:text-red-300"
              >
                {dict.contact.form.phoneInvalid}
              </span>
            ) : null}
          </label>
        </div>

        <label className="block">
          <span className={labelClass}>{dict.contact.form.service}</span>
          <div className="relative">
            <select
              name="service"
              defaultValue={SERVICE_KEYS[0]}
              className={`${inputClass} appearance-none pr-12`}
            >
              {SERVICE_KEYS.map((k) => (
                <option key={k} value={k}>
                  {dict.contact.form.services[k]}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted">
              <Icon.ChevronDown size={16} />
            </span>
          </div>
        </label>

        <label className="block">
          <span className={labelClass}>{dict.contact.form.message}</span>
          <textarea
            name="message"
            rows={4}
            enterKeyHint="done"
            maxLength={2000}
            placeholder={dict.contact.form.messagePlaceholder}
            className={`${inputClass} min-h-28 resize-y`}
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-700 via-brand-500 to-brand-800 px-6 text-base font-semibold text-white shadow-(--shadow-glow) transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:pointer-events-none disabled:opacity-60 dark:from-brand-500 dark:via-brand-400 dark:to-brand-200 dark:text-brand-950"
        >
          {submitting ? dict.contact.form.sending : dict.contact.form.submit}
          <Icon.ArrowRight size={18} />
        </button>

        <p className="text-center text-xs text-muted">
          {dict.contact.form.disclaimer}
        </p>

        <AnimatePresence>
          {done ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-3 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-sm text-brand-700 dark:text-brand-200"
              role="status"
            >
              <Icon.Check size={16} />
              {dict.contact.form.success}
            </motion.div>
          ) : null}
          {error ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200"
              role="alert"
            >
              {dict.contact.form.error}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </form>
    </div>
  );
}
