import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { defaultLocale, locales, type Locale } from "@/lib/locales";
import { findTopic, topicLanguages, topicPath, topics } from "@/lib/pages";
import { localeHtmlLang, siteConfig } from "@/lib/site";
import { TopicArticle } from "@/components/sections/TopicArticle";
import { TopicJsonLd } from "@/components/seo/TopicJsonLd";

/**
 * Deliberately NOT `dynamicParams = false`. That rejects an unknown slug at the
 * routing layer, before any segment renders, so the request never reaches
 * `app/[locale]/not-found.tsx` and falls through to Next's unstyled built-in
 * 404 — which, with the root layout under `[locale]`, has no branded page to
 * render. Letting the segment render and calling `notFound()` below returns the
 * same 404 status but inside the locale layout, with the navbar and footer.
 */
export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    topics.map((topic) => ({ locale, slug: topic.slug[locale] })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const safeLocale: Locale = hasLocale(locale) ? locale : defaultLocale;
  const topic = findTopic(safeLocale, slug);
  if (!topic) return {};

  const dict = await getDictionary(safeLocale);
  const page = dict.pages.items[topic.key];
  const url = `${siteConfig.url}${topicPath(topic, safeLocale)}`;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: url,
      languages: topicLanguages(topic, siteConfig.url),
    },
    openGraph: {
      type: "article",
      url,
      siteName: dict.site.name,
      title: page.title,
      description: page.description,
      locale: localeHtmlLang[safeLocale],
      images: [{ url: topic.image, alt: page.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [{ url: topic.image, alt: page.h1 }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function TopicPage({
  params,
}: PageProps<"/[locale]/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();

  // A slug only resolves under the locale it belongs to, so /en/<uzbek-slug>
  // 404s instead of serving the same content under two URLs.
  const topic = findTopic(locale, slug);
  if (!topic) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      <TopicArticle locale={locale} dict={dict} topic={topic} />
      <TopicJsonLd locale={locale} dict={dict} topic={topic} />
    </>
  );
}
