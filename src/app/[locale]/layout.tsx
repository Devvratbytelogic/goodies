import type { Metadata, Viewport } from "next";
import { Geist, Noto_Sans_Arabic } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ModalProvider } from "@/components/layout/common/ModalProvider";
import { OriginCookie } from "@/components/layout/OriginCookie";
import { TrackingScripts } from "@/components/layout/TrackingScripts";
import { StoreProvider } from "@/store/StoreProvider";
import { routing } from "@/i18n/routing";
import { getGlobalSettings } from "@/server";
import { defaultCurrency } from "@/utils/currency";
import "../../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export const revalidate = 600; // in seconds

export const viewport: Viewport = {
  themeColor: "#d60751",
  viewportFit: "cover",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "Metadata" });
  const settings = await getGlobalSettings(defaultCurrency);
  const title = settings?.meta_title?.trim() || settings?.platformName?.trim() || t("title");
  const description = settings?.meta_description?.trim() || t("description");
  const keywords = settings?.meta_keywords?.trim();
  const ogTitle = settings?.og_title?.trim() || settings?.og_tag?.trim() || title;
  const ogDescription = settings?.og_description?.trim() || description;
  const ogImage = settings?.og_image?.trim();
  const twitterTitle = settings?.twitter_title?.trim() || title;
  const twitterDescription = settings?.twitter_description?.trim() || description;
  const twitterImage = settings?.twitter_image?.trim() || ogImage;
  const googleVerification = settings?.search_console?.trim();
  const metaVerification = settings?.meta_domain_verification?.trim();

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
    applicationName: title,
    title: {
      default: title,
      template: `%s · ${title}`,
    },
    description,
    keywords: keywords || undefined,
    category: "shopping",
    verification: {
      ...(googleVerification ? { google: googleVerification } : {}),
      ...(metaVerification ? { other: { "facebook-domain-verification": metaVerification } } : {}),
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title,
    },
    other: {
      "apple-mobile-web-app-capable": "yes",
    },
    openGraph: {
      type: "website",
      siteName: settings?.platformName?.trim() || title,
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
    twitter: {
      card: twitterImage ? "summary_large_image" : "summary",
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },
    alternates: {
      languages: {
        en: "/",
        ar: "/ar",
        "x-default": "/",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const settings = await getGlobalSettings(defaultCurrency);
  const schemaMarkup = settings?.schema_markup?.trim();
  const jsonLd = schemaMarkup && /^[\[{]/.test(schemaMarkup) ? schemaMarkup : "";

  // if (!hasLocale(routing.locales, locale)) {
  //   notFound();
  // }

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${locale === "ar" ? notoArabic.variable : ""} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} /> : null}
        <OriginCookie />
        <TrackingScripts
          googleAnalyticsId={settings?.google_analytics_id}
          googleTagManagerId={settings?.google_tag_manager}
          clarityId={settings?.microsoft_clarity}
          metaPixelId={settings?.meta_pixel}
        />
        <NextIntlClientProvider>
          <StoreProvider>
            <AuthProvider>
              <ModalProvider>{children}</ModalProvider>
            </AuthProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
