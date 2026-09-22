import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header/Header";
import { InstallPrompt } from "@/components/install-prompt";
import { routing } from "@/i18n/routing";
import "../../styles/globals.css";
import Footer from "@/components/layout/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export const revalidate = 120; // in seconds

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
  const title = t("title");
  const description = t("description");

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
    category: "shopping",
    icons: {
      icon: [{ url: "/logo/logo.webp", type: "image/webp" }],
      apple: [{ url: "/logo/logo.webp", type: "image/webp" }],
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
      siteName: title,
      title,
      description,
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
    twitter: {
      card: "summary",
      title,
      description,
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

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} ${notoArabic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <Header />
          <InstallPrompt />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
