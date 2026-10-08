import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CheckoutView from "@/components/checkout/CheckoutView";
import ZiinaReturn from "@/components/checkout/ZiinaReturn";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { getCartRoutePath, getCheckoutClassicRoutePath, getHomeRoutePath, getShopRoutePath } from "@/utils/routes";

type CheckoutSearchParams = {
  ziina?: string;
  order_id?: string;
  order_number?: string;
  message?: string;
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<CheckoutSearchParams> }): Promise<Metadata> {
  const t = await getTranslations("CheckoutClassicPage");
  const query = await searchParams;
  if (query.ziina) {
    return {
      title: query.ziina === "success" ? t("received") : t("ziinaResultTitle"),
      robots: { index: false, follow: false },
    };
  }
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CheckoutClassicPage({ searchParams }: { searchParams: Promise<CheckoutSearchParams> }) {
  const t = await getTranslations("CheckoutClassicPage");
  const nav = await getTranslations("Nav");
  const cart = await getTranslations("CartPage");
  const query = await searchParams;

  return (
    <div className="container section_y_space">
      <Breadcrumbs
        className="mb-4"
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: cart("title"), href: getCartRoutePath() },
          { label: query.ziina === "success" ? t("received") : t("title") },
        ]}
      />
      {query.ziina ? (
        <div className="mx-auto mt-6 max-w-3xl">
          <ZiinaReturn
            status={query.ziina}
            orderId={query.order_id ?? ""}
            orderNumber={query.order_number ?? ""}
            message={query.message ?? ""}
            shopHref={getShopRoutePath()}
            checkoutHref={getCheckoutClassicRoutePath()}
          />
        </div>
      ) : (
        <CheckoutView shopHref={getShopRoutePath()} />
      )}
    </div>
  );
}
