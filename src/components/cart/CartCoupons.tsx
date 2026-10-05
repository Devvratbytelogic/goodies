"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { LuChevronDown, LuSearch, LuTicket } from "react-icons/lu";
import type { CouponApiResponseDataEntity } from "@/server/types/coupon";
import { useGetCouponsQuery } from "@/store/endpoints/cartApi";

type CartCouponsProps = {
  appliedCode: string | null;
  applying: boolean;
  onApply: (code: string) => void;
};

export default function CartCoupons({ appliedCode, applying, onApply }: CartCouponsProps) {
  const t = useTranslations("CartPage");
  const { data: coupons = [] } = useGetCouponsQuery();
  const [query, setQuery] = useState("");
  const couponSearch = query.trim().toLowerCase();

  const couponLabel = (item: CouponApiResponseDataEntity) =>
    item.coupon_type?.toLowerCase() === "percentage"
      ? t("couponOffPercent", { value: item.value_display })
      : t("couponOffFixed", { value: item.value_display, currency: item.currency_symbol });

  const visibleCoupons = coupons.filter((item) => {
    if (!couponSearch) return true;
    return item.coupon_code.toLowerCase().includes(couponSearch) || couponLabel(item).toLowerCase().includes(couponSearch);
  });

  function submitCouponSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (couponSearch) onApply(query.trim());
  }

  return (
    <details className="group/coupons border-b border-border">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <LuTicket aria-hidden className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-heading">{t("coupons")}</span>
          <span className={`mt-0.5 block truncate text-xs ${appliedCode ? "font-semibold text-primary" : "font-normal text-muted"}`}>
            {appliedCode ? `${appliedCode} · ${t("applied")}` : t("couponOffers")}
          </span>
        </span>
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-surface px-1.5 text-[11px] font-semibold text-heading">
          {coupons.length}
        </span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface text-muted transition-colors group-open/coupons:bg-primary-soft group-open/coupons:text-primary">
          <LuChevronDown aria-hidden className="size-4 transition-transform group-open/coupons:rotate-180" />
        </span>
      </summary>
      <div className="border-t border-border px-4 pt-4">
        <form role="search" onSubmit={submitCouponSearch} className="relative">
          <label htmlFor="cart-coupon-search" className="sr-only">
            {t("couponSearch")}
          </label>
          <LuSearch aria-hidden className="pointer-events-none absolute inset-s-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            id="cart-coupon-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("couponSearch")}
            autoComplete="off"
            className="h-10 w-full rounded-full border border-border bg-surface ps-10 pe-4 text-sm text-heading outline-none transition-colors placeholder:text-muted focus:border-primary focus:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-search-cancel-button]:appearance-none"
          />
        </form>
      </div>
      {visibleCoupons.length === 0 ? (
        <p className="px-4 py-4 text-sm text-muted">{t("couponNone")}</p>
      ) : (
        <ul className="space-y-2 px-4 py-4">
          {visibleCoupons.map((item) => {
            const applied = appliedCode === item.coupon_code;

            return (
              <li
                key={item._id}
                className={`flex items-center justify-between gap-3 rounded-xl px-3 py-3 ${applied ? "bg-primary-soft ring-1 ring-primary/15" : "bg-surface"}`}
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-wide text-primary">{item.coupon_code}</p>
                  <p className="mt-0.5 text-sm text-heading">{couponLabel(item)}</p>
                  {item.minimum_cart_value_display > 0 ? (
                    <p className="mt-0.5 text-xs text-muted">
                      {t("couponMinCart", { value: item.minimum_cart_value_display, currency: item.currency_symbol })}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  disabled={applied || applying}
                  onClick={() => onApply(item.coupon_code)}
                  className={`inline-flex h-8 shrink-0 items-center justify-center rounded-full px-3.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed ${applied ? "cursor-default bg-primary text-primary-foreground" : "border border-primary text-primary hover:bg-background disabled:opacity-60"}`}
                >
                  {applied ? t("applied") : t("apply")}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </details>
  );
}
