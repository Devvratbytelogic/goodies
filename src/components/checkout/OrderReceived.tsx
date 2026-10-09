"use client";

import { useTranslations } from "next-intl";
import { LuCircleCheck } from "react-icons/lu";
import ImageComponent from "@/components/layout/common/ImageComponent";
import OrderAddresses from "@/components/checkout/OrderAddresses";
import { Link } from "@/i18n/navigation";
import { PlacedOrder } from "@/server/types/order";
import { useGetOrderDetailsQuery } from "@/store/endpoints/orderApi";
import { getProductRoutePath } from "@/utils/routes";
import { formatAmount } from "@/utils/price";

export default function OrderReceived({ order, shopHref }: { order: PlacedOrder; shopHref: string }) {
  const t = useTranslations("CheckoutClassicPage");
  const cart = useTranslations("CartPage");
  const items = order.order_items ?? [];
  const currency = order.currency;
  const hasBothAddresses = Boolean(order.shipping_address && order.billing_address);
  const { data: details } = useGetOrderDetailsQuery(order.order_id, {
    skip: !order.order_id || hasBothAddresses,
  });
  const shippingAddress = order.shipping_address ?? details?.shipping_address ?? order.delivery_address;
  const billingAddress = order.billing_address ?? details?.billing_address;

  return (
    <section className="rounded-2xl border border-border bg-background px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex items-start gap-3">
        <LuCircleCheck aria-hidden className="mt-0.5 size-7 shrink-0 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">{t("received")}</h2>
          <p className="mt-1 max-w-md text-sm text-muted">{t("receivedNote")}</p>
        </div>
      </div>

      <dl className="mt-6 grid gap-3 rounded-xl bg-surface p-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted">{t("orderNumber")}</dt>
          <dd className="mt-0.5 font-bold text-primary">#{order.order_number}</dd>
        </div>
        <div>
          <dt className="text-muted">{t("paymentLabel")}</dt>
          <dd className="mt-0.5 font-semibold text-heading">{order.payment_method_title}</dd>
        </div>
        <div>
          <dt className="text-muted">{cart("total")}</dt>
          <dd className="mt-0.5 font-bold tabular-nums text-price">{formatAmount(order.total_amount, currency)}</dd>
        </div>
      </dl>

      {order.payment_method === "cod" ? (
        <p className="mt-4 text-sm text-muted">{t("codNote", { amount: formatAmount(order.total_amount, currency) })}</p>
      ) : null}

      <h3 className="mt-6 text-base font-bold">{cart("yourOrder")}</h3>
      <ul className="mt-2 divide-y divide-border">
        {items.map((item, index) => (
          <li key={item?._id ?? index} className="flex items-center gap-3 py-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/70">
              <ImageComponent src={item?.product_id?.thumbnail ?? ""} alt="" width={112} height={112} sizes="56px" objectFit="cover" />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={getProductRoutePath(item?.product_id?.slug ?? "")}
                className="line-clamp-2 text-sm font-semibold text-heading hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {item?.product_name}
              </Link>
              <p className="mt-1 text-xs text-muted">
                {item?.selected_size ? `${item.selected_size} · ` : ""}
                {cart("itemQty", { count: item?.quantity ?? 0 })}
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold tabular-nums text-price">{formatAmount(item?.total ?? 0, currency)}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-2 space-y-3 border-t border-border pt-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted">
            {cart("subtotal")} <span className="text-xs">({cart("itemCount", { count: order.item_count })})</span>
          </dt>
          <dd className="font-semibold tabular-nums text-heading">{formatAmount(order.subtotal_amount, currency)}</dd>
        </div>
        {order.coupon_code && order.discount_amount > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">
              {cart("couponLabel")}{" "}
              <span className="text-xs font-semibold tracking-wide text-primary">
                {order.coupon_code}
                {order.coupon_type?.toLowerCase() === "percentage" && order.coupon_discount ? ` (${order.coupon_discount}%)` : ""}
              </span>
            </dt>
            <dd className="font-semibold tabular-nums text-price">−{formatAmount(order.discount_amount, currency)}</dd>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted">
            {cart("shipping")}
            {order.shipping_method_title ? <span className="ms-1 text-xs">({order.shipping_method_title})</span> : null}
          </dt>
          <dd className="font-semibold tabular-nums text-heading">{formatAmount(order.shipping_amount, currency)}</dd>
        </div>
        {order.tax_amount > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">{cart("tax")}</dt>
            <dd className="font-semibold tabular-nums text-heading">{formatAmount(order.tax_amount, currency)}</dd>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3.5 py-3">
          <dt className="font-semibold text-heading">{cart("total")}</dt>
          <dd className="text-base font-bold tabular-nums text-price">{formatAmount(order.total_amount, currency)}</dd>
        </div>
      </dl>

      <OrderAddresses
        shipping={shippingAddress}
        billing={billingAddress}
        shippingLabel={t("shippingAddress")}
        billingLabel={t("billingAddress")}
        heading="h3"
      />

      <Link
        href={shopHref}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t("shop")}
      </Link>
    </section>
  );
}
