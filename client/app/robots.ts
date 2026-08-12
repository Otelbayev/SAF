import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nothing user-facing lives here and crawling it wastes budget.
        disallow: ["/api/"],
      },
      // Image and video crawlers need both the originals and the
      // next/image output to be reachable.
      {
        userAgent: ["Googlebot-Image", "Googlebot-Video"],
        allow: ["/images/", "/videos/", "/_next/image"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
