import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LuInfo } from "react-icons/lu";
import CheckoutView from "@/components/checkout/CheckoutView";
import PaymentReturn from "@/components/checkout/PaymentReturn";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { getPageNoticeSettings } from "@/server";
import { toCurrency } from "@/utils/currency";
import { getCartRoutePath, getCheckoutClassicRoutePath, getHomeRoutePath, getShopRoutePath } from "@/utils/routes";

type CheckoutSearchParams = {
  ziina?: string;
  tabby?: string;
  order_id?: string;
  order_number?: string;
  message?: string;
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<CheckoutSearchParams> }): Promise<Metadata> {
  const t = await getTranslations("CheckoutClassicPage");
  const query = await searchParams;
  const paymentStatus = query.tabby || query.ziina;
  if (paymentStatus) {
    const resultTitle = query.tabby ? t("tabbyResultTitle") : t("ziinaResultTitle");
    return {
      title: paymentStatus === "success" ? t("received") : resultTitle,
      robots: { index: false, follow: false },
    };
  }
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CheckoutClassicPage({
  params,
  searchParams,
}: {
  params: Promise<{ currency: string }>;
  searchParams: Promise<CheckoutSearchParams>;
}) {
  const { currency } = await params;
  const t = await getTranslations("CheckoutClassicPage");
  const nav = await getTranslations("Nav");
  const cart = await getTranslations("CartPage");
  const query = await searchParams;
  const paymentStatus = query.tabby || query.ziina;
  const notices = await getPageNoticeSettings(toCurrency(currency));
  const checkoutNotice = notices?.checkout_notice_enabled ? notices.checkout_notice?.trim() : "";

  return (
    <div className="container section_y_space">
      <Breadcrumbs
        className="mb-4"
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: cart("title"), href: getCartRoutePath() },
          { label: paymentStatus === "success" ? t("received") : t("title") },
        ]}
      />
      {checkoutNotice ? (
        <p className="mb-4 flex items-center gap-2.5 rounded-lg bg-primary-soft px-4 py-3 text-sm leading-5 text-heading" role="note">
          <LuInfo className="size-5 shrink-0 text-primary" aria-hidden="true" />
          <span>{checkoutNotice}</span>
        </p>
      ) : null}
      {paymentStatus ? (
        <div className="mx-auto mt-6 max-w-3xl">
          <PaymentReturn
            status={paymentStatus}
            method={query.tabby ? "tabby" : "ziina"}
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
