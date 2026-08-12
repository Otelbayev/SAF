import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import {
  indexableImages,
  indexableVideos,
  destination,
  primaryImage,
  routePoints,
  siteConfig,
  tariffs,
} from "@/lib/site";

type Props = { locale: Locale; dict: Dictionary };

/**
 * Site-wide nodes: the organisation, the website, the founder and the videos.
 * These describe the business rather than the current URL, so the layout can
 * safely render them on every page. Anything that describes *one page* — the
 * `WebPage` and `BreadcrumbList` nodes — belongs to that page instead, or two
 * pages end up claiming the same `@id` with different content.
 */
export function BusinessJsonLd({ locale, dict }: Props) {
  const url = `${siteConfig.url}/${locale}`;
  const abs = (path: string) => `${siteConfig.url}${path}`;
  const logoUrl = abs(siteConfig.logo);
  const founderImage = abs(siteConfig.founderImage);

  /** Every indexable photo as a full ImageObject, so Google can attribute
   *  captions and dimensions instead of guessing from the markup. */
  const imageObjects = indexableImages.map((img) => ({
    "@type": "ImageObject",
    "@id": `${abs(img.path)}#image`,
    contentUrl: abs(img.path),
    url: abs(img.path),
    width: img.width,
    height: img.height,
    caption: dict.seo.alt[img.altKey],
    representativeOfPage: img.altKey === primaryImage.altKey,
    creditText: siteConfig.name,
    license: `${siteConfig.url}/${locale}`,
    acquireLicensePage: `${siteConfig.url}/${locale}#contact`,
  }));

  const videoObjects = indexableVideos.map((v) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${abs(v.path)}#video`,
    name: dict.seo.video[v.titleKey].title,
    description: dict.seo.video[v.titleKey].description,
    thumbnailUrl: [abs(v.thumbnail)],
    contentUrl: abs(v.path),
    uploadDate: "2026-08-05T00:00:00+05:00",
    isFamilyFriendly: true,
    inLanguage: locale,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  }));

  const founderPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#founder`,
    name: siteConfig.founder,
    alternateName: siteConfig.founderAlt,
    givenName: "Farrukh",
    familyName: "Mashanpin",
    description:
      "Farrukh Mashanpin — SAF Logistics asoschisi, Guanchjou (Xitoy) ofisi rahbari · Фаррух Машанпин, основатель SAF Logistics, руководитель офиса в Гуанчжоу · Founder of SAF Logistics, head of Guangzhou (China) office.",
    jobTitle: dict.founder.role,
    image: {
      "@type": "ImageObject",
      url: founderImage,
      caption: siteConfig.founder,
    },
    url: `${siteConfig.url}/${locale}#founder`,
    nationality: { "@type": "Country", name: "Uzbekistan" },
    worksFor: { "@id": `${siteConfig.url}/#organization` },
    knowsLanguage: ["uz", "ru", "zh", "en"],
    sameAs: [
      siteConfig.instagram,
      `https://www.instagram.com/${siteConfig.instagramHandle}`,
    ],
  };

  const business = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "MovingCompany"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: [
      "SAF Logistics Uzbekistan",
      "САФ Логистикс",
      "SAF Логистика",
      "SAFcargo",
      "Saflogistics",
    ],
    description: dict.seo.homeDescription,
    url,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
      width: 1080,
      height: 1080,
    },
    image: imageObjects,
    photo: imageObjects,
    telephone: siteConfig.phones,
    email: siteConfig.email,
    contactPoint: siteConfig.phones.map((phone) => ({
      "@type": "ContactPoint",
      telephone: phone,
      contactType: "customer service",
      areaServed: [...new Set(routePoints.map((p) => p.code))],
      availableLanguage: ["uz", "ru", "en"],
    })),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Abu Sulaymon Banokatiy street, 209",
      addressLocality: "Tashkent",
      addressCountry: "UZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.office.lat,
      longitude: siteConfig.office.lng,
    },
    hasMap: siteConfig.mapUrl,
    // Open around the clock — schema.org expresses that as every day 00:00–23:59.
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    founder: { "@id": `${siteConfig.url}/#founder` },
    employee: { "@id": `${siteConfig.url}/#founder` },
    sameAs: [siteConfig.instagram],
    areaServed: [...new Set(routePoints.map((p) => p.country))].map(
      (name) => ({ "@type": "Country", name }),
    ),
    serviceType: [
      "Road freight",
      "Express road freight China to Uzbekistan",
      "Customs clearance",
      "B2B logistics",
      "Cargo insurance",
      "Avtotransport (fura) yetkazib berish",
      "Xitoydan O'zbekistonga ekspress yetkazib berish",
      "Bojxona rasmiylashtirish",
      "Автомобильные грузоперевозки",
      "Экспресс-доставка из Китая в Узбекистан",
      "Таможенное оформление",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "120",
    },
    knowsAbout: [
      "Road freight forwarding",
      "Guangzhou Tashkent route",
      "Yiwu Tashkent route",
      "Customs clearance Uzbekistan",
      "Fura bilan yuk tashish",
      "Xitoydan O'zbekistonga yuk",
      "Автоперевозки Китай Узбекистан",
      "Доставка из Китая фурой",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: dict.services.title,
      itemListElement: (["express", "standard", "econom"] as const).map(
        (key) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `${dict.services[key].name} — China → ${destination.city}`,
            description: dict.services[key].description,
            serviceType: "Road freight",
          },
          deliveryLeadTime: {
            "@type": "QuantitativeValue",
            minValue: tariffs[key].min,
            maxValue: tariffs[key].max,
            unitCode: "DAY",
          },
        }),
      ),
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: locale,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };

  const graphs = [founderPerson, business, website, ...videoObjects];

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

/**
 * The landing page's own `WebPage` and `BreadcrumbList`. Split out of
 * `BusinessJsonLd` so it stays on the landing page only: the topic pages under
 * `[locale]/[slug]` emit their own equivalents via `TopicJsonLd`, and two
 * `WebPage` nodes describing different URLs on one document is exactly the
 * inconsistency that makes Google discard the markup.
 */
export function HomePageJsonLd({ locale, dict }: Props) {
  const url = `${siteConfig.url}/${locale}`;
  const abs = (path: string) => `${siteConfig.url}${path}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.nav.home, item: url },
    ],
  };

  /** Binds the page to one representative photo — this is the association
   *  Google uses when deciding which image to show beside the result. */
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: dict.seo.homeTitle,
    description: dict.seo.homeDescription,
    inLanguage: locale,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    primaryImageOfPage: { "@id": `${abs(primaryImage.path)}#image` },
    thumbnailUrl: abs(primaryImage.path),
    breadcrumb: { "@id": `${url}#breadcrumb` },
    datePublished: "2019-01-01",
    dateModified: new Date().toISOString().slice(0, 10),
  };

  return (
    <>
      {[breadcrumb, webPage].map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}
