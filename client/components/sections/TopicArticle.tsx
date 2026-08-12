import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { type Topic, topicByKey, topicPath } from "@/lib/pages";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

type Props = { locale: Locale; dict: Dictionary; topic: Topic };

/**
 * Renders one standalone topic page. Deliberately plain server-rendered prose:
 * the body text must be in the initial HTML, because these pages exist to be
 * read by a crawler that arrives from the sitemap rather than from the nav.
 */
export function TopicArticle({ locale, dict, topic }: Props) {
  const page = dict.pages.items[topic.key];
  const t = dict.pages.common;
  const home = `/${locale}`;

  return (
    <article className="pb-16 sm:pb-24">
      <header className="relative overflow-hidden border-b border-border bg-surface">
        <Image
          src={topic.image}
          alt={page.h1}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-15 dark:opacity-10"
        />
        <Container className="relative py-16 sm:py-20 lg:py-24">
          <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted">
            <Link href={home} className="transition-colors hover:text-foreground">
              {t.breadcrumbHome}
            </Link>
            <span className="mx-2 select-none opacity-50">/</span>
            <span className="text-foreground">{page.eyebrow}</span>
          </nav>

          <span className="inline-flex items-center rounded-full border border-border bg-background px-4 py-1 text-xs font-medium uppercase tracking-widest text-brand-700 dark:text-brand-200">
            {page.eyebrow}
          </span>

          <h1 className="mt-5 max-w-4xl text-balance text-3xl font-semibold leading-tight tracking-tight text-brand-950 sm:text-4xl lg:text-5xl dark:text-white">
            {page.h1}
          </h1>

          <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            {page.intro}
          </p>
        </Container>
      </header>

      <Container className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16 lg:py-20">
        <div className="min-w-0">
          {page.sections.map((section) => (
            <Reveal key={section.h2} className="mb-12 last:mb-0">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {section.h2}
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-pretty text-base leading-relaxed text-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}

          <section className="mt-16 border-t border-border pt-12">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t.faqTitle}
            </h2>
            <dl className="mt-6 flex flex-col gap-6">
              {page.faq.map((item) => (
                <div
                  key={item.q}
                  className="rounded-2xl border border-border bg-surface p-6"
                >
                  <dt className="text-base font-semibold text-foreground">
                    {item.q}
                  </dt>
                  <dd className="mt-2 text-base leading-relaxed text-muted">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
              {t.factsTitle}
            </h2>
            <dl className="mt-4 flex flex-col gap-4">
              {page.facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1">
                  <dt className="text-xs uppercase tracking-wide text-muted">
                    {fact.label}
                  </dt>
                  <dd className="text-sm font-medium text-foreground">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* The cluster's internal linking. Without this the pages would be
              orphans reachable only from the sitemap, which is exactly the
              shape Google treats as doorway pages. */}
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
              {t.relatedTitle}
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {topic.related.map((key) => {
                const related = topicByKey.get(key);
                if (!related) return null;
                return (
                  <li key={key}>
                    <Link
                      href={topicPath(related, locale)}
                      className="text-sm font-medium text-brand-700 underline-offset-4 transition-colors hover:underline dark:text-brand-200"
                    >
                      {dict.pages.items[key].h1}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
              {t.contactTitle}
            </h2>
            <dl className="mt-4 flex flex-col gap-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  {t.phoneLabel}
                </dt>
                {siteConfig.phones.map((phone) => (
                  <dd key={phone}>
                    <a
                      href={`tel:${phone}`}
                      className="font-medium text-foreground transition-colors hover:text-brand-700 dark:hover:text-brand-200"
                    >
                      {phone}
                    </a>
                  </dd>
                ))}
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  {t.emailLabel}
                </dt>
                <dd>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="font-medium text-foreground transition-colors hover:text-brand-700 dark:hover:text-brand-200"
                  >
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  {t.hoursLabel}
                </dt>
                <dd className="font-medium text-foreground">{t.hoursValue}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </Container>

      <Container>
        <div className="rounded-3xl border border-border bg-surface p-8 text-center sm:p-12">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t.ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted">
            {t.ctaText}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href={`${home}#contact`} size="lg">
              {t.ctaPrimary}
            </Button>
            <Button href={home} variant="secondary" size="lg">
              {t.ctaSecondary}
            </Button>
          </div>
        </div>
      </Container>
    </article>
  );
}
