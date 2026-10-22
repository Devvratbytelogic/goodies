import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getGlobalSettings, getHomePage } from "@/server";
import { defaultCurrency, toCurrency } from "@/utils/currency";
import BestSellerSection from "@/components/page-components/home/BestSellerSection";
import CategorySection from "@/components/page-components/home/CategorySection";
import InstallAppBanner from "@/components/page-components/home/InstallAppBanner";
// import MadeWithLoveSection from "@/components/page-components/home/MadeWithLoveSection";
import MainBanner from "@/components/page-components/home/MainBanner";
import NewArrivalsSection from "@/components/page-components/home/NewArrivalsSection";
import TastyChoicesSection from "@/components/page-components/home/TastyChoicesSection";
import WhyChooseSection from "@/components/page-components/home/WhyChooseSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

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

  return {
    title: { absolute: title },
    description,
    keywords: keywords || undefined,
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
  };
}

export default async function Home({ params }: { params: Promise<{ currency: string }> }) {
  const { currency } = await params;
  const homePage = await getHomePage(toCurrency(currency));

  return (
    <>
      <div className="">
        <MainBanner banner={homePage?.home_page_banner} bannerMobile={homePage?.home_page_banner_mobile} />
        <CategorySection categories={homePage?.categories ?? []} />
        <BestSellerSection bestSellers={homePage?.best_sellers ?? []} />
        <TastyChoicesSection />
        <NewArrivalsSection newArrivals={homePage?.new_arrivals ?? []} />
        <WhyChooseSection />
        {/* <MadeWithLoveSection /> */}
        <div className="container">
          <div className="mx-auto max-w-xl sm:max-w-2xl lg:max-w-3xl mb-6">
            <InstallAppBanner />
          </div>
        </div>
      </div>
    </>
  );
}
