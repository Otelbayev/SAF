import type { Locale } from "./locales";
import type { Dictionary } from "./i18n";

export type RoutePoint = {
  code: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  /** City photo shown behind the endpoint card; origins only. */
  image?: { path: string; altKey: keyof Dictionary["seo"]["alt"] };
};

/**
 * The company runs China → Uzbekistan, trucks only, out of two own warehouses
 * in China. Both corridors land on the same destination and share one set of
 * transit windows, so the geography-facing blocks (route diagram, JSON-LD
 * areaServed, flags) only need this list plus `destination`.
 *
 * The keys line up with `dict.route.origins.*` — add a key here and the same
 * key must exist in every messages/*.json.
 */
export const originKeys = ["guangzhou", "yiwu"] as const;
export type OriginKey = (typeof originKeys)[number];

export const origins: Record<OriginKey, RoutePoint> = {
  guangzhou: {
    code: "CN",
    country: "China",
    city: "Guangzhou",
    lat: 23.1291,
    lng: 113.2644,
    image: { path: "/images/guangzhou-city-skyline.jpg", altKey: "guangzhou" },
  },
  yiwu: {
    code: "CN",
    country: "China",
    city: "Yiwu",
    lat: 29.3069,
    lng: 120.0765,
    image: { path: "/images/yiwu-trade-city.jpg", altKey: "yiwu" },
  },
};

export const destination: RoutePoint = {
  code: "UZ",
  country: "Uzbekistan",
  city: "Tashkent",
  lat: 41.3111,
  lng: 69.2797,
};

/** Every point the corridor touches, origins first. */
export const routePoints: RoutePoint[] = [
  ...originKeys.map((k) => origins[k]),
  destination,
];

export const tariffKeys = ["express", "standard", "econom"] as const;
export type TariffKey = (typeof tariffKeys)[number];

/**
 * Delivery windows in days. These numbers live only here — cards, the
 * comparison table and the profit calculator all derive from them.
 */
export const tariffs: Record<
  TariffKey,
  { min: number; max: number; featured?: boolean }
> = {
  express: { min: 8, max: 12, featured: true },
  standard: { min: 14, max: 18 },
  econom: { min: 20, max: 30 },
};

export const siteConfig = {
  name: "SAF Logistics",
  shortName: "SAF",
  legalName: "SAF EXPRESS LOGISTICS MChJ",
  url: "https://saflogistics.uz",
  founder: "Farrukh Mashanpin",
  founderAlt: ["Farrux Mashanpin", "Фаррух Машанпин", "Фаррух Машанпин SAF"],
  founderImage: "/images/boss.jpg",
  logo: "/images/logo1.jpg",
  ogImage: "/images/logo1.jpg",
  phones: ["+998935118484", "+998771730303"],
  email: "info@saflogistics.uz",
  legalAddress: "Toshkent sh., Abu Sulaymon Banokatiy ko‘chasi, 209",
  /** Office pin, taken from the Yandex Maps house card for the address above. */
  office: { lat: 41.274893, lng: 69.285337 },
  mapUrl: "https://yandex.uz/maps/-/CTGvf8lc",
  mapEmbed:
    "https://yandex.uz/map-widget/v1/?ll=69.285337%2C41.274893&z=17&pt=69.285337,41.274893,pm2rdm",
  instagram: "https://www.instagram.com/farrukh_mashanpin",
  instagramHandle: "farrukh_mashanpin",
  hubs: originKeys.map((k) => origins[k]),
};

/**
 * Media that should be discoverable in Google Images / Video.
 *
 * These point at the original files in /public, not the `/_next/image`
 * transform URLs — the originals are stable, cacheable and are what Google
 * indexes. `altKey` maps into `dict.seo.alt.*` so captions stay translated.
 */
export type IndexableImage = {
  path: string;
  altKey: keyof Dictionary["seo"]["alt"];
  width: number;
  height: number;
};

export const indexableImages: IndexableImage[] = [
  { path: "/images/logo1.jpg", altKey: "logo", width: 1080, height: 1080 },
  { path: "/images/boss.jpg", altKey: "founder", width: 1000, height: 1000 },
  {
    path: "/images/semi-truck-port-sunset.jpg",
    altKey: "truckPort",
    width: 1920,
    height: 1280,
  },
  {
    path: "/images/industrial-port-container-yard.jpg",
    altKey: "containerYard",
    width: 1920,
    height: 1280,
  },
  {
    path: "/images/truck-logistics-operations-dusk.jpg",
    altKey: "operationsDusk",
    width: 1920,
    height: 1280,
  },
  {
    path: "/images/large-cargo-truck-driving-rural-highway-with-trailer-logistics-freight-transport.jpg",
    altKey: "truckHighway",
    width: 1920,
    height: 1280,
  },
  {
    path: "/images/emerald-green-truck-forest-highway-modern-power-transport.jpg",
    altKey: "truckForest",
    width: 1920,
    height: 1280,
  },
  {
    path: "/images/a-large-white-semi-truck-is-driving-down-a-highway-free-video-poster.png",
    altKey: "heroPoster",
    width: 1920,
    height: 1080,
  },
  {
    path: "/images/5secondtuck-poster.png",
    altKey: "routePoster",
    width: 1920,
    height: 1080,
  },
  {
    path: "/images/vecteezy_cargo-truck-with-cargo-trailer-is-driving-on-the-highway_47880046-poster.png",
    altKey: "ctaPoster",
    width: 1920,
    height: 1080,
  },
  { path: "/images/poster.png", altKey: "fleetPoster", width: 1920, height: 1080 },
  {
    path: "/images/guangzhou-city-skyline.jpg",
    altKey: "guangzhou",
    width: 2000,
    height: 1027,
  },
  {
    path: "/images/yiwu-trade-city.jpg",
    altKey: "yiwu",
    width: 1280,
    height: 570,
  },
];

/** The landscape image used for social cards and as the page's primary image. */
export const primaryImage = indexableImages.find(
  (i) => i.altKey === "truckPort",
)!;

export type IndexableVideo = {
  path: string;
  thumbnail: string;
  titleKey: keyof Dictionary["seo"]["video"];
};

export const indexableVideos: IndexableVideo[] = [
  {
    path: "/videos/a-large-white-semi-truck-is-driving-down-a-highway-free-video.mp4",
    thumbnail:
      "/images/a-large-white-semi-truck-is-driving-down-a-highway-free-video-poster.png",
    titleKey: "hero",
  },
  {
    path: "/videos/15373444_3840_2160_25fps.mp4",
    thumbnail: "/images/poster.png",
    titleKey: "fleet",
  },
  {
    path: "/videos/5secondtuck.mp4",
    thumbnail: "/images/5secondtuck-poster.png",
    titleKey: "route",
  },
  {
    path: "/videos/vecteezy_cargo-truck-with-cargo-trailer-is-driving-on-the-highway_47880046.mp4",
    thumbnail:
      "/images/vecteezy_cargo-truck-with-cargo-trailer-is-driving-on-the-highway_47880046-poster.png",
    titleKey: "highway",
  },
];

export const localeHtmlLang: Record<Locale, string> = {
  uz: "uz-UZ",
  ru: "ru-RU",
  en: "en-US",
};
