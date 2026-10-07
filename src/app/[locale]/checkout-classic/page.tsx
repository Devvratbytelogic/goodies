import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CheckoutView from "@/components/checkout/CheckoutView";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { getCartRoutePath, getHomeRoutePath, getShopRoutePath } from "@/utils/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CheckoutClassicPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CheckoutClassicPage() {
  const t = await getTranslations("CheckoutClassicPage");
  const nav = await getTranslations("Nav");
  const cart = await getTranslations("CartPage");

  return (
    <div className="container section_y_space">
      <Breadcrumbs
        className="mb-4"
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: cart("title"), href: getCartRoutePath() },
          { label: t("title") },
        ]}
      />
      {/* <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1> */}
      <CheckoutView shopHref={getShopRoutePath()} />
    </div>
  );
}
