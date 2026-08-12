import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { type Topic, topicPath } from "@/lib/pages";
import { siteConfig } from "@/lib/site";

type Props = { locale: Locale; dict: Dictionary; topic: Topic };

/**
 * Structured data for a topic page. The organisation, website and founder
 * nodes are already emitted once per page by `BusinessJsonLd` in the layout,
 * so this only adds the page-level nodes and references the shared ones by
 * `@id` instead of repeating them.
 */
export function TopicJsonLd({ locale, dict, topic }: Props) {
  const page = dict.pages.items[topic.key];
  const url = `${siteConfig.url}${topicPath(topic, locale)}`;
  const home = `${siteConfig.url}/${locale}`;
  const imageUrl = `${siteConfig.url}${topic.image}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.pages.common.breadcrumbHome,
        item: home,
      },
      { "@type": "ListItem", position: 2, name: page.h1, item: url },
    ],
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: locale,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl,
      caption: page.h1,
    },
    thumbnailUrl: imageUrl,
    dateModified: new Date().toISOString().slice(0, 10),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    inLanguage: locale,
    isPartOf: { "@id": `${url}#webpage` },
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  /** The reference pages (FAQ, company) describe the business rather than a
   *  purchasable service, so they get no Service node. */
  const isService = !["faq", "company"].includes(topic.key);

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: page.h1,
    description: page.description,
    serviceType: "Road freight",
    provider: { "@id": `${siteConfig.url}/#organization` },
    areaServed: [
      { "@type": "Country", name: "China" },
      { "@type": "Country", name: "Uzbekistan" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: url,
      servicePhone: siteConfig.phones[0],
    },
  };

  const graphs = [breadcrumb, webPage, faqPage, ...(isService ? [service] : [])];

  return (
    <>
      {graphs.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}
