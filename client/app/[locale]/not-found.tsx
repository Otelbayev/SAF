import Link from "next/link";
import { defaultLocale } from "@/lib/locales";
import { siteConfig } from "@/lib/site";

/**
 * 404 for anything thrown by `notFound()` inside the [locale] segment — an
 * unknown topic slug, or a slug requested under the wrong locale.
 *
 * It renders inside `app/[locale]/layout.tsx`, so it inherits <html>/<body>,
 * the theme provider and the localized navbar and footer. `not-found` files
 * receive no params, so the message itself is kept trilingual rather than
 * guessing the locale.
 */
export default function LocaleNotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <p className="text-6xl font-semibold tracking-tight text-brand-800 sm:text-8xl dark:text-brand-200">
        404
      </p>
      <p className="max-w-md text-base text-muted">
        Sahifa topilmadi · Страница не найдена · Page not found
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href={`/${defaultLocale}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Bosh sahifa
        </Link>
        <a
          href={`tel:${siteConfig.phones[0]}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:bg-surface-2"
        >
          {siteConfig.phones[0]}
        </a>
      </div>
    </section>
  );
}
