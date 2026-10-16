import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AccountOrderDetail from "@/components/account/AccountOrderDetail";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { getAccountOrdersRoutePath, getAccountRoutePath, getHomeRoutePath } from "@/utils/routes";

type OrderPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AccountPage");
  return {
    title: t("viewDetails"),
    description: t("ordersIntro"),
  };
}

export default async function AccountOrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const t = await getTranslations("AccountPage");
  const nav = await getTranslations("Nav");

  return (
    <>
      <Breadcrumbs
        className="mb-4"
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: t("title"), href: getAccountRoutePath() },
          { label: t("orders"), href: getAccountOrdersRoutePath() },
          { label: t("viewDetails") },
        ]}
      />
      <AccountOrderDetail id={id} />
    </>
  );
}
