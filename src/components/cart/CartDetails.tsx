"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LuMinus, LuPlus, LuTrash2, LuX } from "react-icons/lu";
import CartCoupons from "@/components/cart/CartCoupons";
import RemoveCartItemConfirm from "@/components/cart/RemoveCartItemConfirm";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { useModal } from "@/components/layout/common/ModalProvider";
import { Link } from "@/i18n/navigation";
import { getProductRoutePath, getShopRoutePath } from "@/utils/routes";
import {
  useApplyCouponMutation,
  useGetCartQuery,
  useRemoveCouponMutation,
  useUpdateCartItemQuantityMutation,
} from "@/store/endpoints/cartApi";
import { formatAmount } from "@/utils/price";

const minQuantity = 1;
const maxQuantity = 99;



type CartDetailsProps = {
  checkoutHref: string;
};

export default function CartDetails({ checkoutHref }: CartDetailsProps) {
  const t = useTranslations("CartPage");
  const { data: cart, isLoading: isLoadingCart } = useGetCartQuery();
  const [updateQuantity, { isLoading: isUpdatingQuantity }] = useUpdateCartItemQuantityMutation();
  const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();
  const [removeCoupon, { isLoading: isRemovingCoupon }] = useRemoveCouponMutation();
  const cartItems = cart?.items ?? [];
  const cartSummary = cart?.summary ?? null;
  const cartShipping = cart?.shipping_rate ?? null;

  const { openModal } = useModal();

  const removeCartItem = (itemId: string, name: string) => {
    openModal({
      title: t("removeTitle"),
      size: "sm",
      content: <RemoveCartItemConfirm itemId={itemId} name={name} />,
    });
  };

  const updateCartItemQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateQuantity({ itemId, quantity }).unwrap();
    } catch (error) {
      console.error('Error updating quantity', error);
    }
  };

  const applyCartCoupon = async (couponCode: string) => {
    try {
      await applyCoupon(couponCode).unwrap();
    } catch (error) {
      console.error('Error applying coupon', error);
    }
  };

  const removeCartCoupon = async () => {
    try {
      await removeCoupon().unwrap();
    } catch (error) {
      console.error('Error removing coupon', error);
    }
  };


  const itemCount = cartSummary?.item_count ?? 0;
  const subtotal = cartSummary?.subtotal ?? 0;
  const couponCode = cartSummary?.coupon_code ?? null;
  const discountAmount = cartSummary?.discount_amount ?? 0;
  const couponType = cartSummary?.coupon_type ?? null;
  const couponValue = cartSummary?.coupon_value ?? 0;
  const shippingRateAvailable = cartSummary?.shipping_rate_available ?? false;
  const shippingCharge = cartSummary?.shipping_charge ?? 0;
  const shippingRateTitle = cartShipping?.title ?? null;
  const taxAmount = cartSummary?.tax_amount ?? 0;
  const totalAmount = cartSummary?.total_amount ?? 0;
  const currencySymbol = cartSummary?.currency_symbol ?? "";

  return (
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10">
      {cartItems?.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background px-6 py-12 text-center">
          <p className="text-muted">{t("empty")}</p>
          <Link
            href={getShopRoutePath()}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("shop")}
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background">
          {cartItems?.map((item, index) => {
            const quantity = item?.quantity;

            return (
              <li key={index} className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                <Link
                  href={getProductRoutePath(item?.product_id?.slug)}
                  aria-label={item?.product_id?.title}
                  className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:size-24"
                >
                  <ImageComponent src={item?.product_id?.thumbnail} alt="" width={192} height={192} sizes="96px" objectFit="cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={getProductRoutePath(item?.product_id?.slug)}
                        className="font-semibold text-heading hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {item?.product_id?.title}
                      </Link>
                      <p className="mt-1 text-sm text-muted">{formatAmount(item?.selected_variant?.price, item?.product_id?.pricing_context?.currency_symbol ?? "")}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={t("remove", { name: item?.product_id?.title })}
                      onClick={() => removeCartItem(item?._id, item?.product_id?.title)}
                      className="-me-1 -mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <LuTrash2 aria-hidden className="size-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="inline-flex h-9 items-center rounded-full border border-border bg-background">
                      <button
                        type="button"
                        aria-label={t("decrease", { name: item?.product_id?.title })}
                        disabled={isUpdatingQuantity || quantity <= minQuantity}
                        onClick={() => updateCartItemQuantity(item?._id, quantity - 1)}
                        className="inline-flex size-9 items-center justify-center rounded-full text-heading transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-border"
                      >
                        <LuMinus aria-hidden className="size-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold tabular-nums text-heading" aria-hidden>
                        {quantity}
                      </span>
                      <span className="sr-only">
                        {t("quantity")} {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={t("increase", { name: item?.product_id?.title })}
                        disabled={isUpdatingQuantity || quantity >= maxQuantity}
                        onClick={() => updateCartItemQuantity(item?._id, quantity + 1)}
                        className="inline-flex size-9 items-center justify-center rounded-full text-heading transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-border"
                      >
                        <LuPlus aria-hidden className="size-3.5" />
                      </button>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-price sm:text-base">{formatAmount(item?.selected_variant?.price, currencySymbol)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <aside className="overflow-hidden rounded-2xl border border-border bg-background lg:sticky lg:top-24">
        {cartItems?.length > 0 ? <CartCoupons appliedCode={couponCode} applying={isApplyingCoupon} onApply={applyCartCoupon} /> : null}

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
          {cartItems?.length > 0 ? (
            <Link
              href={checkoutHref}
              className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t("checkout")}
            </Link>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
