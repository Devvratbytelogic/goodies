import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CartSummary from "@/components/cart/CartSummary";
import CheckoutForm from "@/components/checkout/CheckoutForm";
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
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
        <CheckoutForm shopHref={getShopRoutePath()} />
        <CartSummary showItems />
      </div>
    </div>
  );
}
