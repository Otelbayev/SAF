import { notFound } from "next/navigation";
import type { Metadata, Viewport } from "next";
import "../globals.css";
import { themeInitScript } from "@/components/theme/ThemeProvider";
import { hasLocale, getDictionary } from "@/lib/i18n";
import { defaultLocale, locales, type Locale } from "@/lib/locales";
import { localeHtmlLang, primaryImage, siteConfig } from "@/lib/site";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BusinessJsonLd } from "@/components/seo/JsonLd";
import { QuoteModalProvider } from "@/components/ui/QuoteModal";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030f31" },
  ],
  width: "device-width",
  initialScale: 1,
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = hasLocale(locale) ? locale : defaultLocale;
  const dict = await getDictionary(safeLocale);
  const url = `${siteConfig.url}/${safeLocale}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: dict.seo.homeTitle,
      template: `%s · ${dict.site.name}`,
    },
    description: dict.seo.homeDescription,
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: siteConfig.logo, type: "image/jpeg" },
      ],
      apple: siteConfig.logo,
      shortcut: "/favicon.ico",
    },
    keywords: dict.seo.keywords,
    applicationName: dict.site.name,
    authors: [{ name: siteConfig.founder }],
    creator: siteConfig.founder,
    publisher: dict.site.name,
    category: "Logistics",
    alternates: {
      canonical: url,
      languages: {
        uz: `${siteConfig.url}/uz`,
        ru: `${siteConfig.url}/ru`,
        en: `${siteConfig.url}/en`,
        "x-default": `${siteConfig.url}/uz`,
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: dict.site.name,
      title: dict.seo.homeTitle,
      description: dict.seo.homeDescription,
      locale: localeHtmlLang[safeLocale],
      images: [
        {
          url: primaryImage.path,
          width: primaryImage.width,
          height: primaryImage.height,
          alt: dict.seo.alt[primaryImage.altKey],
          type: "image/jpeg",
        },
        {
          url: siteConfig.ogImage,
          width: 1080,
          height: 1080,
          alt: dict.seo.alt.logo,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.seo.homeTitle,
      description: dict.seo.homeDescription,
      images: [
        {
          url: primaryImage.path,
          alt: dict.seo.alt[primaryImage.altKey],
        },
      ],
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

/**
 * This is the app's root layout: it owns <html> and <body>. Living under the
 * [locale] segment is what lets `lang` carry the real language instead of a
 * hardcoded one — see the internationalization note in the Next layout docs.
 */
export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <html lang={localeHtmlLang[locale]} suppressHydrationWarning>
      <body className="antialiased">
        {/* Must run synchronously before anything paints, otherwise a returning
            dark-mode visitor gets a white flash. Rendered as the first node in
            <body> rather than inside <head>: React 19 warns about script tags
            it renders itself, and the head is where that fires. */}
        <script
          id="saf-theme-init"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <ThemeProvider>
          <QuoteModalProvider dict={dict}>
            <div className="relative">
              <Navbar locale={locale} dict={dict} />
              <main className="min-h-[70vh]">{children}</main>
              <Footer locale={locale} dict={dict} />
              <BusinessJsonLd locale={locale} dict={dict} />
            </div>
          </QuoteModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
