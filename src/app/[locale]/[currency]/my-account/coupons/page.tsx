import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AccountCouponList } from "@/components/account/AccountCoupons";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { getAccountCouponsRoutePath, getAccountRoutePath, getHomeRoutePath } from "@/utils/routes";
import { pageAlternates } from "@/utils/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("AccountPage");
  return {
    title: t("coupons"),
    description: t("couponsIntro"),
    alternates: pageAlternates(locale, getAccountCouponsRoutePath()),
  };
}

export default async function AccountCouponsPage() {
  const t = await getTranslations("AccountPage");
  const nav = await getTranslations("Nav");

  return (
    <>
      <Breadcrumbs
        className="mb-4"
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: t("title"), href: getAccountRoutePath() },
          { label: t("coupons") },
        ]}
      />
      <h1 className="text-2xl font-bold tracking-tight text-heading">{t("coupons")}</h1>
      <p className="mt-1 text-sm text-muted">{t("couponsIntro")}</p>
      <AccountCouponList />
    </>
  );
}
