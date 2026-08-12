import Link from "next/link";
import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/lib/site";
import { Newsletter } from "@/components/sections/Newsletter";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function Footer({ locale, dict }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-border bg-surface sm:mt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 40% at 20% 0%, color-mix(in oklab, var(--color-brand-800) 25%, transparent), transparent), radial-gradient(40% 40% at 100% 100%, color-mix(in oklab, var(--color-brand-500) 18%, transparent), transparent)",
        }}
      />
      <Container className="relative py-12 sm:py-16">
        <div className="mb-10 sm:mb-12">
          <Newsletter dict={dict} />
        </div>

        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <span className="relative inline-flex h-11 w-11 overflow-hidden rounded-xl bg-brand-950">
                <Image
                  src="/images/logo1.jpg"
                  alt={dict.site.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
              <div>
                <div className="text-lg font-semibold">{dict.site.name}</div>
                <div className="text-xs uppercase tracking-widest text-muted">
                  {dict.site.tagline}
                </div>
              </div>
            </Link>
            <p className="mt-5 max-w-md text-sm text-muted">
              {dict.footer.about}
            </p>
            <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              {dict.footer.follow}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-brand-800 hover:text-white"
              >
                <Icon.Instagram size={18} />
              </a>
              {siteConfig.phones.map((p) => (
                <a
                  key={p}
                  href={`tel:${p}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-3 text-sm text-foreground transition hover:bg-surface-2"
                >
                  <Icon.Phone size={16} />
                  <span>{p}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              {dict.footer.quickLinks}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {(
                [
                  ["tariffs", "tariffs"],
                  ["calculator", "calculator"],
                  ["route", "route"],
                  ["guarantees", "guarantees"],
                  ["contact", "contact"],
                ] as const
              ).map(([key, anchor]) => (
                <li key={key}>
                  <Link
                    href={`/${locale}#${anchor}`}
                    className="hover:text-foreground"
                  >
                    {dict.footer.links[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              {dict.footer.contacts}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">
                  <Icon.MapPin size={16} />
                </span>
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted/80">
                    {dict.footer.legalLabel}
                  </span>
                  <span className="mt-0.5 block font-medium text-foreground">
                    {siteConfig.legalName}
                  </span>
                  {dict.contact.address}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Icon.Clock size={16} />
                <span>
                  {dict.contact.hoursWeek} · {dict.contact.hoursSun}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Icon.Mail size={16} />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-foreground"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="relative border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
          <span>
            © {year} {siteConfig.legalName}. {dict.footer.rights}
          </span>
          <span>{dict.footer.madeWith} · SAF Logistics</span>
        </Container>
      </div>
    </footer>
  );
}
