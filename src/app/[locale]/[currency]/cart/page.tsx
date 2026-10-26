import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LuInfo } from "react-icons/lu";
import CartDetails from "@/components/cart/CartDetails";
import CartProducts from "@/components/cart/CartProducts";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { getPageNoticeSettings } from "@/server";
import { toCurrency } from "@/utils/currency";
import { getCheckoutClassicRoutePath, getHomeRoutePath } from "@/utils/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CartPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CartPage({ params }: { params: Promise<{ currency: string }> }) {
  const { currency } = await params;
  const t = await getTranslations("CartPage");
  const nav = await getTranslations("Nav");
  const notices = await getPageNoticeSettings(toCurrency(currency));
  const cartNotice = notices?.cart_notice_enabled ? notices.cart_notice?.trim() : "";

  return (
    <>
      <div className="section_y_space">
        <div className="container">
          <Breadcrumbs
            className="mb-4"
            items={[
              { label: nav("home"), href: getHomeRoutePath() },
              { label: t("title") },
            ]}
          />
          {cartNotice ? (
            <p className="mb-4 flex items-center gap-2.5 rounded-lg bg-primary-soft px-4 py-3 text-sm leading-5 text-heading" role="note">
              <LuInfo className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>{cartNotice}</span>
            </p>
          ) : null}
          {/* <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1> */}

          <CartDetails checkoutHref={getCheckoutClassicRoutePath()} />
        </div>
        <CartProducts />
      </div>
    </>
  );
}
