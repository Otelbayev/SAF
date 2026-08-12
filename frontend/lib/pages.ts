import type { Dictionary } from "./i18n";
import type { Locale } from "./locales";
import { locales } from "./locales";

/**
 * Standalone topic pages that live beside the landing page.
 *
 * The landing page is deliberately untouched and does not link here — these
 * exist to give the domain more than three indexable URLs, each aimed at a
 * search intent the one-pager cannot rank for on its own. To keep them from
 * being orphans (which Google treats as doorway pages), every topic links to
 * its `related` siblings, so the set forms a connected cluster reachable from
 * the sitemap downward.
 */
export type TopicKey = keyof Dictionary["pages"]["items"];

export type Topic = {
  key: TopicKey;
  /** Slugs are localized: a Russian query matches a Russian URL. */
  slug: Record<Locale, string>;
  /** Path into `indexableImages` — drives the OG card and JSON-LD image. */
  image: string;
  priority: number;
  related: TopicKey[];
};

export const topics: Topic[] = [
  {
    key: "chinaFreight",
    slug: {
      uz: "xitoydan-yuk-tashish",
      ru: "gruzoperevozki-iz-kitaya",
      en: "freight-from-china",
    },
    image: "/images/semi-truck-port-sunset.jpg",
    priority: 0.9,
    related: ["express", "route", "pricing", "customs"],
  },
  {
    key: "express",
    slug: {
      uz: "ekspress-yetkazib-berish",
      ru: "ekspress-dostavka-iz-kitaya",
      en: "express-delivery-from-china",
    },
    image: "/images/large-cargo-truck-driving-rural-highway-with-trailer-logistics-freight-transport.jpg",
    priority: 0.8,
    related: ["standard", "econom", "pricing", "chinaFreight"],
  },
  {
    key: "standard",
    slug: {
      uz: "standart-yetkazib-berish",
      ru: "standartnaya-dostavka-iz-kitaya",
      en: "standard-delivery-from-china",
    },
    image: "/images/truck-logistics-operations-dusk.jpg",
    priority: 0.8,
    related: ["express", "econom", "pricing", "chinaFreight"],
  },
  {
    key: "econom",
    slug: {
      uz: "ekonom-yetkazib-berish",
      ru: "ekonom-dostavka-iz-kitaya",
      en: "economy-delivery-from-china",
    },
    image: "/images/emerald-green-truck-forest-highway-modern-power-transport.jpg",
    priority: 0.8,
    related: ["standard", "express", "pricing", "chinaFreight"],
  },
  {
    key: "route",
    slug: {
      uz: "guanchjou-toshkent-yonalishi",
      ru: "marshrut-guanchzhou-tashkent",
      en: "guangzhou-tashkent-route",
    },
    image: "/images/industrial-port-container-yard.jpg",
    priority: 0.8,
    related: ["chinaFreight", "customs", "express", "company"],
  },
  {
    key: "customs",
    slug: {
      uz: "bojxona-rasmiylashtiruvi",
      ru: "tamozhennoe-oformlenie",
      en: "customs-clearance",
    },
    image: "/images/industrial-port-container-yard.jpg",
    priority: 0.7,
    related: ["insurance", "chinaFreight", "route", "faq"],
  },
  {
    key: "insurance",
    slug: {
      uz: "yuk-sugurtasi",
      ru: "strahovanie-gruza",
      en: "cargo-insurance",
    },
    image: "/images/truck-logistics-operations-dusk.jpg",
    priority: 0.7,
    related: ["customs", "chinaFreight", "faq", "company"],
  },
  {
    key: "pricing",
    slug: {
      uz: "yuk-tashish-narxlari",
      ru: "stoimost-dostavki-iz-kitaya",
      en: "china-uzbekistan-shipping-cost",
    },
    image: "/images/semi-truck-port-sunset.jpg",
    priority: 0.8,
    related: ["express", "standard", "econom", "faq"],
  },
  {
    key: "faq",
    slug: {
      uz: "savol-javob",
      ru: "voprosy-i-otvety",
      en: "faq",
    },
    image: "/images/truck-logistics-operations-dusk.jpg",
    priority: 0.7,
    related: ["pricing", "customs", "insurance", "chinaFreight"],
  },
  {
    key: "company",
    slug: {
      uz: "saf-logistics-kompaniyasi",
      ru: "o-kompanii-saf-logistics",
      en: "about-saf-logistics",
    },
    image: "/images/boss.jpg",
    priority: 0.8,
    related: ["chinaFreight", "route", "faq", "insurance"],
  },
];

export const topicByKey = new Map(topics.map((t) => [t.key, t]));

/**
 * Reverse index over every locale's slugs. A slug is only ever valid for the
 * locale it belongs to, so `/en/xitoydan-yuk-tashish` correctly 404s instead of
 * serving English copy under an Uzbek URL and creating a duplicate.
 */
const byLocaleSlug = new Map<string, Topic>(
  topics.flatMap((t) =>
    locales.map((l) => [`${l}/${t.slug[l]}`, t] as const),
  ),
);

export const findTopic = (locale: Locale, slug: string): Topic | undefined =>
  byLocaleSlug.get(`${locale}/${slug}`);

export const topicPath = (topic: Topic, locale: Locale): string =>
  `/${locale}/${topic.slug[locale]}`;

/** hreflang map for one topic: every locale's URL plus x-default (uz). */
export const topicLanguages = (
  topic: Topic,
  origin: string,
): Record<string, string> => ({
  ...Object.fromEntries(
    locales.map((l) => [l, `${origin}${topicPath(topic, l)}`]),
  ),
  "x-default": `${origin}${topicPath(topic, "uz")}`,
});
