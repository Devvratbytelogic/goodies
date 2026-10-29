"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LuChevronRight, LuX } from "react-icons/lu";
import CartCoupons from "@/components/cart/CartCoupons";
import CartDetails from "@/components/cart/CartDetails";
import { useApplyCouponMutation, useGetCartQuery } from "@/store/endpoints/cartApi";
import { formatAmount } from "@/utils/price";

export default function OrderSummary() {
  const t = useTranslations("OrderSummary");
  const cartText = useTranslations("CartPage");
  const titleId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { data: cart, isLoading } = useGetCartQuery();
  const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();

  const items = cart?.items ?? [];
  const summary = cart?.summary ?? null;
  const symbol = summary?.currency_symbol ?? "";
  const itemCount = summary?.item_count ?? 0;
  const subtotal = summary?.subtotal ?? 0;
  const discountAmount = summary?.discount_amount ?? 0;
  const couponCode = summary?.coupon_code ?? null;
  const totalAmount = summary?.total_amount ?? 0;
  const hasDiscount = Boolean(couponCode) && discountAmount > 0;

  async function applyCartCoupon(code: string) {
    try {
      await applyCoupon(code).unwrap();
    } catch (error) {
      console.error("Error applying coupon", error);
    }
  }

  useEffect(() => {
    if (!open) return;
    sheetRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open]);

  return (
    <>
      <div className="grid gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={isLoading || items.length === 0}
          aria-expanded={open}
          aria-haspopup="dialog"
          className="w-full rounded-xl bg-white px-3.5 py-3 text-start transition-colors hover:bg-surface-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-heading">
              {isLoading ? cartText("loading") : t("title", { count: itemCount })}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm tabular-nums text-heading">
              {hasDiscount ? <span className="text-muted line-through">{formatAmount(subtotal, symbol)}</span> : null}
              <span className="font-bold">{formatAmount(totalAmount, symbol)}</span>
              <LuChevronRight aria-hidden className="size-4 text-muted rtl:rotate-180" />
            </span>
          </span>
          {hasDiscount && couponCode ? (
            <span className="mt-1.5 block text-xs font-medium leading-5 text-price">
              {t("offerApplied", { offer: couponCode, amount: formatAmount(discountAmount, symbol) })}
            </span>
          ) : null}
        </button>

        {!isLoading && items.length > 0 ? (
          <div className="overflow-hidden bg-white rounded-xl">
            <CartCoupons variant="sheet" appliedCode={couponCode} applying={isApplyingCoupon} onApply={applyCartCoupon} />
          </div>
        ) : null}
      </div>

      {open ? (
        <div className="fixed inset-0 z-110 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/55" onClick={() => setOpen(false)} />
          <div className="relative z-120 flex w-full max-w-lg flex-col items-center px-0 sm:px-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("close")}
              className="mb-3 flex size-10 shrink-0 items-center justify-center rounded-full bg-heading text-background shadow-md transition-colors hover:bg-heading/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <LuX aria-hidden className="size-5" />
            </button>
            <div
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              className="order-summary-sheet flex max-h-[min(78vh,40rem)] w-full flex-col overflow-hidden rounded-t-3xl bg-background px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-lg outline-none sm:px-5"
            >
              <h2 id={titleId} className="order-summary-sheet-header shrink-0 pb-4 text-base font-bold tracking-tight text-heading">
                {t("title", { count: itemCount })}
              </h2>
              <CartDetails variant="sheet" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
