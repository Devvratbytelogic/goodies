import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AccountOrderSection } from "@/components/account/AccountOrders";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { getAccountRoutePath, getHomeRoutePath } from "@/utils/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AccountPage");
  return {
    title: t("orders"),
    description: t("ordersIntro"),
  };
}

export default async function AccountOrdersPage() {
  const t = await getTranslations("AccountPage");
  const nav = await getTranslations("Nav");

  return (
    <>
      <Breadcrumbs
        className="mb-4"
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: t("title"), href: getAccountRoutePath() },
          { label: t("orders") },
        ]}
      />
      <h1 className="text-2xl font-bold tracking-tight text-heading">{t("orders")}</h1>
      <p className="mt-1 text-sm text-muted">{t("ordersIntro")}</p>
      <div className="mt-6">
        <AccountOrderSection />
      </div>
    </>
  );
}
