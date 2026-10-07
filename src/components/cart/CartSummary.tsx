"use client";

import { useTranslations } from "next-intl";
import { LuX } from "react-icons/lu";
import CartCoupons from "@/components/cart/CartCoupons";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { Link } from "@/i18n/navigation";
import { useApplyCouponMutation, useGetCartQuery, useRemoveCouponMutation } from "@/store/endpoints/cartApi";
import { getProductRoutePath } from "@/utils/routes";
import { formatAmount } from "@/utils/price";

type CartSummaryProps = {
  // cart page: shows the "Proceed to checkout" button
  checkoutHref?: string;
  // checkout page: shows the "Your order" product list
  showItems?: boolean;
};

export default function CartSummary({ checkoutHref, showItems = false }: CartSummaryProps) {
  const t = useTranslations("CartPage");
  const { data: cart } = useGetCartQuery();
  const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();
  const [removeCoupon, { isLoading: isRemovingCoupon }] = useRemoveCouponMutation();
  const cartItems = cart?.items ?? [];
  const cartSummary = cart?.summary ?? null;
  const cartShipping = cart?.shipping_rate ?? null;

  const applyCartCoupon = async (couponCode: string) => {
    try {
      await applyCoupon(couponCode).unwrap();
    } catch (error) {
      console.error("Error applying coupon", error);
    }
  };

  const removeCartCoupon = async () => {
    try {
      await removeCoupon().unwrap();
    } catch (error) {
      console.error("Error removing coupon", error);
    }
  };

  const itemCount = cartSummary?.item_count ?? 0;
  const subtotal = cartSummary?.subtotal ?? 0;
  const couponCode = cartSummary?.coupon_code ?? null;
  const discountAmount = cartSummary?.discount_amount ?? 0;
  const couponType = cartSummary?.coupon_type ?? null;
  const couponValue = cartSummary?.coupon_value ?? 0;
  const shippingCharge = cartSummary?.shipping_charge ?? 0;
  const shippingRateTitle = cartShipping?.title ?? null;
  const taxAmount = cartSummary?.tax_amount ?? 0;
  const totalAmount = cartSummary?.total_amount ?? 0;
  const currencySymbol = cartSummary?.currency_symbol ?? "";
  return (
    <aside className="overflow-hidden rounded-2xl border border-border bg-background lg:sticky lg:top-24">
      {showItems && cartItems.length > 0 ? (
        <div className="border-b border-border">
          <h2 className="px-5 pt-4 text-lg font-bold tracking-tight">{t("yourOrder")}</h2>
          <ul className="divide-y divide-border px-5">
            {cartItems.map((item, index) => (
              <li key={item?._id ?? index} className="flex items-center gap-3 py-4">
                <Link
                  href={getProductRoutePath(item?.product_id?.slug)}
                  aria-label={item?.product_id?.title}
                  className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <ImageComponent src={item?.product_id?.thumbnail} alt="" width={128} height={128} sizes="64px" objectFit="cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={getProductRoutePath(item?.product_id?.slug)}
                    className="line-clamp-2 text-sm font-semibold text-heading hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {item?.product_id?.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted">
                    {item?.selected_size ? `${item.selected_size} · ` : ""}
                    {t("itemQty", { count: item?.quantity ?? 0 })}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-price">
                  {formatAmount((item?.selected_variant?.price ?? 0) * (item?.quantity ?? 0), currencySymbol)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {cartItems.length > 0 ? <CartCoupons appliedCode={couponCode} applying={isApplyingCoupon} onApply={applyCartCoupon} /> : null}

      <div className="p-5">
        <h2 className="text-lg font-bold tracking-tight">{t("summary")}</h2>
        <dl className="mt-4 space-y-3.5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">
              {t("subtotal")}
              {itemCount > 0 ? <span className="ms-1 text-xs">({t("itemCount", { count: itemCount })})</span> : null}
            </dt>
            <dd className="font-semibold tabular-nums text-heading">{formatAmount(subtotal, currencySymbol)}</dd>
          </div>
          {couponCode ? (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">
                {t("couponLabel")}
                <span className="mt-0.5 block text-xs font-semibold tracking-wide text-primary">{couponCode} {couponValue > 0 ? `${couponType?.toLowerCase() === "percentage" ? `(${couponValue}%)` : ``}` : ""}</span>
              </dt>
              <dd className="flex items-center gap-1 font-semibold tabular-nums text-price">
                {discountAmount > 0 ? `−${formatAmount(discountAmount, currencySymbol)}` : t("couponShipping")}
                <button
                  type="button"
                  aria-label={t("removeCoupon")}
                  disabled={isRemovingCoupon}
                  onClick={removeCartCoupon}
                  className="inline-flex size-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LuX aria-hidden className="size-3.5" />
                </button>
              </dd>
            </div>
          ) : null}
          <div className="flex items-start justify-between gap-3">
            <dt className="text-muted">
              {t("shipping")}
              <span className="mt-0.5 block text-xs text-muted/80">{shippingRateTitle}</span>
            </dt>
            <dd className="pt-0.5 font-semibold tabular-nums text-heading">{formatAmount(shippingCharge, currencySymbol)}</dd>
          </div>
          {taxAmount > 0 ? (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">{t("tax")}</dt>
              <dd className="font-semibold tabular-nums text-heading">{formatAmount(taxAmount, currencySymbol)}</dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3.5 py-3">
            <dt className="text-sm font-semibold text-heading">{t("total")}</dt>
            <dd className="text-base font-bold tabular-nums text-price">{formatAmount(totalAmount, currencySymbol)}</dd>
          </div>
        </dl>
        {checkoutHref && cartItems.length > 0 ? (
          <Link
            href={checkoutHref}
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("checkout")}
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
