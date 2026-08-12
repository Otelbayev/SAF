import type { NextConfig } from "next";
import { locales } from "./lib/locales";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Next 16 only serves qualities listed here; 70 is what the large
    // photographic backdrops use, 75 is the default for everything else.
    qualities: [70, 75],
  },
  compress: true,
  poweredByHeader: false,
  // The site collapsed from three pages into one landing; keep the old URLs alive.
  async redirects() {
    return [
      { from: "services", to: "tariffs" },
      { from: "contact", to: "contact" },
    ].flatMap(({ from, to }) =>
      locales.map((locale) => ({
        source: `/${locale}/${from}`,
        destination: `/${locale}#${to}`,
        permanent: true,
      })),
    );
  },
};

export default nextConfig;
