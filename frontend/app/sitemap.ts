import type { MetadataRoute } from "next";
import { getDictionary } from "@/lib/i18n";
import { locales } from "@/lib/locales";
import { topicLanguages, topicPath, topics } from "@/lib/pages";
import { indexableImages, indexableVideos, siteConfig } from "@/lib/site";

const abs = (path: string) => `${siteConfig.url}${path}`;

/**
 * Three landing-page URLs plus one URL per topic page per locale.
 *
 * The landing pages carry the full image and video sitemap extensions — that
 * is what gets the photography into Google Images and the clips into Video
 * search. The topic pages carry a single representative image each; padding
 * them with the whole media library would only dilute the signal.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const dicts = Object.fromEntries(
    await Promise.all(
      locales.map(async (l) => [l, await getDictionary(l)] as const),
    ),
  ) as Record<(typeof locales)[number], Awaited<ReturnType<typeof getDictionary>>>;

  const languages = Object.fromEntries(
    locales.map((l) => [l, `${siteConfig.url}/${l}`]),
  );

  const landing: MetadataRoute.Sitemap = locales.map((locale) => {
    const dict = dicts[locale];

    return {
      url: `${siteConfig.url}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: locale === "uz" ? 1 : 0.9,
      alternates: {
        languages: {
          ...languages,
          "x-default": `${siteConfig.url}/uz`,
        },
      },
      images: indexableImages.map((img) => abs(img.path)),
      videos: indexableVideos.map((v) => ({
        title: dict.seo.video[v.titleKey].title,
        description: dict.seo.video[v.titleKey].description,
        thumbnail_loc: abs(v.thumbnail),
        content_loc: abs(v.path),
        family_friendly: "yes" as const,
        live: "no" as const,
        publication_date: "2026-08-05",
        uploader: { info: siteConfig.url, content: siteConfig.name },
      })),
    };
  });

  const topicPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    topics.map((topic) => ({
      url: `${siteConfig.url}${topicPath(topic, locale)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: topic.priority,
      alternates: { languages: topicLanguages(topic, siteConfig.url) },
      images: [abs(topic.image)],
    })),
  );

  return [...landing, ...topicPages];
}
