"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { AccountStatValueSkeleton } from "@/components/skeletons/AccountSkeletons";
import type { CouponApiResponseDataEntity } from "@/server/types/coupon";
import { useGetCouponsQuery } from "@/store/endpoints/cartApi";
import { getCartRoutePath } from "@/utils/routes";

function useCoupons() {
  const { token } = useAuth();
  return useGetCouponsQuery(undefined, { skip: !token });
}

export function AccountCouponsCount() {
  const { data, isLoading, isUninitialized } = useCoupons();
  if (!data && (isLoading || isUninitialized)) return <AccountStatValueSkeleton />;
  return data?.length ?? 0;
}

export function AccountCouponList() {
  const t = useTranslations("AccountPage");
  const cart = useTranslations("CartPage");
  const { data, isLoading, isUninitialized } = useCoupons();

  if ((isLoading || isUninitialized) && !data) {
    return (
      <ul className="mt-6 grid gap-4 sm:grid-cols-2" aria-hidden>
        {Array.from({ length: 2 }, (_, index) => (
          <li key={index} className="rounded-2xl border border-dashed border-border bg-background px-5 py-4">
            <div className="h-4 w-24 animate-pulse rounded bg-surface-muted" />
            <div className="mt-3 h-4 w-40 animate-pulse rounded bg-surface-muted" />
          </li>
        ))}
      </ul>
    );
  }

  const coupons = data ?? [];

  if (coupons.length === 0) {
    return <p className="mt-6 text-sm text-muted">{t("noCoupons")}</p>;
  }

  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-heading">{t("couponsAvailable")}</h2>
      <ul className="mt-3 grid gap-4 sm:grid-cols-2">
        {coupons.map((coupon) => (
          <CouponCard key={coupon._id} coupon={coupon} label={couponLabel(coupon, cart)} minimum={cart("couponMinCart", { value: coupon.minimum_cart_value_display, currency: coupon.currency_symbol })} />
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted">
        <Link
          href={getCartRoutePath()}
          className="font-medium text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("useAtCheckout")}
        </Link>
      </p>
    </section>
  );
}

function couponLabel(item: CouponApiResponseDataEntity, t: ReturnType<typeof useTranslations<"CartPage">>) {
  return item.coupon_type?.toLowerCase() === "percentage"
    ? t("couponOffPercent", { value: item.value_display })
    : t("couponOffFixed", { value: item.value_display, currency: item.currency_symbol });
}

function CouponCard({ coupon, label, minimum }: { coupon: CouponApiResponseDataEntity; label: string; minimum: string }) {
  return (
    <li className="rounded-2xl border border-dashed border-primary/40 bg-primary-soft/40 px-5 py-4">
      <p className="font-mono text-sm font-bold tracking-wide text-primary">{coupon.coupon_code}</p>
      <p className="mt-2 text-sm text-heading">{label}</p>
      {coupon.minimum_cart_value > 0 ? <p className="mt-1 text-sm text-muted">{minimum}</p> : null}
    </li>
  );
}
