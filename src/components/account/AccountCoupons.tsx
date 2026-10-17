"use client";

import { useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LuChevronLeft, LuChevronRight, LuHistory, LuTicket } from "react-icons/lu";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { AccountStatValueSkeleton } from "@/components/skeletons/AccountSkeletons";
import type { CouponApiResponseDataEntity, UsedCoupon } from "@/server/types/coupon";
import { useGetCouponsQuery, useGetUsedCouponsQuery } from "@/store/endpoints/cartApi";
import { getAccountOrderRoutePath, getCartRoutePath } from "@/utils/routes";

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

  const loading = (isLoading || isUninitialized) && !data;
  const coupons = data ?? [];

  return (
    <>
      {loading ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2" aria-hidden>
          {Array.from({ length: 2 }, (_, index) => (
            <li key={index} className="rounded-2xl border border-dashed border-border bg-background px-5 py-4">
              <div className="h-4 w-24 animate-pulse rounded bg-surface-muted" />
              <div className="mt-3 h-4 w-40 animate-pulse rounded bg-surface-muted" />
            </li>
          ))}
        </ul>
      ) : (
        <section className="mt-6 rounded-2xl border border-primary/25 bg-primary-soft/40 p-4 sm:p-5">
          <SectionHeading icon={<LuTicket aria-hidden className="size-4" />} title={t("couponsAvailable")} note={t("couponsAvailableIntro")} tone="available" />
          {coupons.length === 0 ? (
            <p className="mt-4 text-sm text-muted">{t("noCoupons")}</p>
          ) : (
            <>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {coupons.map((coupon) => (
                  <CouponCard key={coupon._id} coupon={coupon} badge={t("couponsAvailable")} label={couponLabel(coupon, cart)} minimum={cart("couponMinCart", { value: coupon.minimum_cart_value_display, currency: coupon.currency_symbol })} />
                ))}
              </ul>
              <p className="mt-4 text-sm">
                <Link
                  href={getCartRoutePath()}
                  className="font-medium text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {t("useAtCheckout")}
                </Link>
              </p>
            </>
          )}
        </section>
      )}
      <UsedCouponList />
    </>
  );
}

const statusLabel = {
  completed: "statusCompleted",
  pending: "statusPending",
  cancelled: "statusCancelled",
  failed: "statusFailed",
  on_hold: "statusOnHold",
  processing: "statusProcessing",
  paid: "statusPaid",
  tamara_p_canceled: "statusTamaraCanceled",
  tamara_p_failed: "statusTamaraFailed",
} as const;

function UsedCouponList() {
  const t = useTranslations("AccountPage");
  const cart = useTranslations("CartPage");
  const locale = useLocale();
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading, isUninitialized, isFetching, isError } = useGetUsedCouponsQuery({ page, limit: 10 }, { skip: !token });

  if ((isLoading || isUninitialized) && !data) {
    return (
      <section className="mt-6 rounded-2xl border border-border bg-surface p-4 sm:p-5" aria-hidden>
        <div className="h-9 w-40 animate-pulse rounded bg-surface-muted" />
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 2 }, (_, index) => (
            <li key={index} className="rounded-2xl border border-border bg-background px-5 py-4">
              <div className="h-4 w-24 animate-pulse rounded bg-surface-muted" />
              <div className="mt-3 h-4 w-40 animate-pulse rounded bg-surface-muted" />
              <div className="mt-2 h-3 w-28 animate-pulse rounded bg-surface-muted" />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  const coupons = data?.coupons ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <section className="mt-6 rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <SectionHeading icon={<LuHistory aria-hidden className="size-4" />} title={t("couponsUsed")} note={t("couponsUsedIntro")} tone="used" />
      {isError ? <p className="mt-3 text-sm text-muted">{t("usedCouponsError")}</p> : null}
      {!isError && coupons.length === 0 ? <p className="mt-3 text-sm text-muted">{t("noUsedCoupons")}</p> : null}
      {coupons.length > 0 ? (
        <ul className={`mt-3 grid gap-4 sm:grid-cols-2 ${isFetching ? "opacity-70" : ""}`}>
          {coupons.map((entry) => (
            <UsedCouponCard key={entry._id} entry={entry} locale={locale} badge={t("couponsUsed")} label={usedCouponLabel(entry, cart)} t={t} />
          ))}
        </ul>
      ) : null}
      {totalPages > 1 ? (
        <nav aria-label={t("usedPagination")} className="mt-6 flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => setPage((current) => current - 1)}
            disabled={page <= 1 || isFetching}
            aria-label={t("usedPrevious")}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-35"
          >
            <LuChevronLeft aria-hidden className="size-4 rtl:-scale-x-100" />
          </button>
          <span className="px-2 text-sm font-semibold text-heading">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={page >= totalPages || isFetching}
            aria-label={t("usedNext")}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-35"
          >
            <LuChevronRight aria-hidden className="size-4 rtl:-scale-x-100" />
          </button>
        </nav>
      ) : null}
    </section>
  );
}

function usedCouponLabel(entry: UsedCoupon, t: ReturnType<typeof useTranslations<"CartPage">>) {
  const coupon = entry.coupon;
  if (!coupon) return "";
  return coupon.coupon_type?.toLowerCase() === "percentage"
    ? t("couponOffPercent", { value: coupon.value })
    : t("couponOffFixed", { value: coupon.value, currency: entry.currency });
}

function SectionHeading({ icon, title, note, tone }: { icon: ReactNode; title: string; note: string; tone: "available" | "used" }) {
  return (
    <div className="flex items-start gap-3">
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${tone === "available" ? "bg-primary text-white" : "bg-heading text-background"}`}>
        {icon}
      </span>
      <div>
        <h2 className="text-base font-bold text-heading">{title}</h2>
        <p className="mt-0.5 text-sm text-muted">{note}</p>
      </div>
    </div>
  );
}

function UsedCouponCard({
  entry,
  locale,
  badge,
  label,
  t,
}: {
  entry: UsedCoupon;
  locale: string;
  badge: string;
  label: string;
  t: ReturnType<typeof useTranslations<"AccountPage">>;
}) {
  const status = entry.order_status;
  const statusText = status in statusLabel ? t(statusLabel[status as keyof typeof statusLabel]) : status.replaceAll("_", " ");
  const usedOn = entry.used_at
    ? t("couponUsedOn", { date: new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(entry.used_at)) })
    : "";

  return (
    <li className="rounded-2xl border border-border bg-background px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-6 items-center rounded-full bg-surface px-2.5 text-xs font-semibold text-muted">{badge}</span>
        {statusText ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs">
            <span className="font-medium text-muted">{t("couponOrderStatus")}</span>
            <span className="font-semibold text-heading">{statusText}</span>
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-mono text-sm font-bold tracking-wide text-heading">{entry.coupon?.coupon_code}</p>
      {label ? <p className="mt-2 text-sm text-heading">{label}</p> : null}
      <p className="mt-1 text-sm text-muted">{t("couponSaved", { amount: `${entry.currency} ${entry.discount_amount}` })}</p>
      {usedOn ? <p className="mt-1 text-sm text-muted">{usedOn}</p> : null}
      {entry.order_id ? (
        <Link
          href={getAccountOrderRoutePath(entry.order_id)}
          className="mt-2 inline-flex text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("couponOrder", { id: entry.order_number })}
        </Link>
      ) : null}
    </li>
  );
}

function couponLabel(item: CouponApiResponseDataEntity, t: ReturnType<typeof useTranslations<"CartPage">>) {
  return item.coupon_type?.toLowerCase() === "percentage"
    ? t("couponOffPercent", { value: item.value_display })
    : t("couponOffFixed", { value: item.value_display, currency: item.currency_symbol });
}

function CouponCard({ coupon, badge, label, minimum }: { coupon: CouponApiResponseDataEntity; badge: string; label: string; minimum: string }) {
  return (
    <li className="rounded-2xl border border-dashed border-primary/40 bg-background px-5 py-4">
      <span className="inline-flex h-6 items-center rounded-full bg-primary px-2.5 text-xs font-semibold text-white">{badge}</span>
      <p className="mt-3 font-mono text-sm font-bold tracking-wide text-primary">{coupon.coupon_code}</p>
      <p className="mt-2 text-sm text-heading">{label}</p>
      {coupon.minimum_cart_value > 0 ? <p className="mt-1 text-sm text-muted">{minimum}</p> : null}
    </li>
  );
}
