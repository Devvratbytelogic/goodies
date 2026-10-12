import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AccountAddresses } from "@/components/account/AccountAddresses";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { getAccountRoutePath, getHomeRoutePath } from "@/utils/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AccountPage");
  return {
    title: t("addresses"),
    description: t("addressesIntro"),
  };
}

export default async function AccountAddressPage() {
  const t = await getTranslations("AccountPage");
  const nav = await getTranslations("Nav");

  return (
    <>
      <Breadcrumbs
        className="mb-4"
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: t("title"), href: getAccountRoutePath() },
          { label: t("addresses") },
        ]}
      />
      <h1 className="text-2xl font-bold tracking-tight text-heading">{t("addresses")}</h1>
      <p className="mt-1 text-sm text-muted">{t("addressesIntro")}</p>
      <AccountAddresses />
    </>
  );
}
