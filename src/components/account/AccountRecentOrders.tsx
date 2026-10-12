"use client";

import moment from "moment";
import { useLocale, useTranslations } from "next-intl";
import { LuChevronRight } from "react-icons/lu";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useGetUserOrdersQuery } from "@/store/endpoints/orderApi";
import type { UserOrder } from "@/server/types/order";
import { getAccountOrderRoutePath } from "@/utils/routes";
import { formatAmount } from "@/utils/price";
import { AccountRecentOrdersSkeleton, AccountStatValueSkeleton } from "@/components/skeletons/AccountSkeletons";

const recentOrdersArgs = { status: "all", page: 1, limit: 2 };

const statusClassName = {
  completed: "bg-surface-soft text-accent-deep",
  pending: "bg-primary-soft text-primary",
  cancelled: "bg-surface text-muted",
  failed: "bg-primary-soft text-primary",
  on_hold: "bg-surface text-muted",
  processing: "bg-primary-soft text-primary",
} as const;

const statusLabel = {
  completed: "statusCompleted",
  pending: "statusPending",
  cancelled: "statusCancelled",
  failed: "statusFailed",
  on_hold: "statusOnHold",
  processing: "statusProcessing",
} as const;

function useRecentOrders() {
  const { token } = useAuth();
  return useGetUserOrdersQuery(recentOrdersArgs, { skip: !token });
}

export function AccountOrdersCount() {
  const { data, isLoading, isUninitialized } = useRecentOrders();
  if (!data && (isLoading || isUninitialized)) return <AccountStatValueSkeleton />;
  return data?.pagination.totalItems ?? 0;
}

export function AccountRecentOrders() {
  const t = useTranslations("AccountPage");
  const cards = useTranslations("ProductCard");
  const locale = useLocale();
  const { data, isLoading, isUninitialized } = useRecentOrders();
  const orders = data?.orders ?? [];

  if ((isLoading || isUninitialized) && !data) return <AccountRecentOrdersSkeleton />;

  if (orders.length === 0) {
    return <p className="text-sm text-muted">{t("noOrders")}</p>;
  }

  return (
    <ul className="grid gap-4">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} locale={locale} t={t} cards={cards} />
      ))}
    </ul>
  );
}

function OrderCard({
  order,
  locale,
  t,
  cards,
}: {
  order: UserOrder;
  locale: string;
  t: ReturnType<typeof useTranslations<"AccountPage">>;
  cards: ReturnType<typeof useTranslations<"ProductCard">>;
}) {
  const images = (order.preview_images ?? []).filter(Boolean);
  const status = order.status;

  return (
    <li className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <div>
          <Link
            href={getAccountOrderRoutePath(order._id)}
            className="font-semibold text-heading hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("order", { id: order.order_code || order.order_number })}
          </Link>
          <p className="mt-0.5 text-sm text-muted">{t("placedOn", { date: order.order_date })}</p>
        </div>
        <span className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${statusClassName[status]}`}>
          {t(statusLabel[status])}
        </span>
      </div>
      {images.length > 0 ? (
        <ul className="flex gap-3 px-4 py-3 sm:px-5">
          {images.map((src) => (
            <li key={src} className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/70">
              <ImageComponent src={src} alt="" width={112} height={112} sizes="56px" objectFit="cover" />
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex items-center justify-between gap-4 border-t border-border bg-surface/60 px-4 py-3.5 sm:px-5">
        <div>
          <p className="text-xs font-medium text-muted">{t("orderTotal")}</p>
          <p className="mt-0.5 text-lg font-bold tabular-nums text-price">{formatAmount(order.total_amount, order.currency)}</p>
          <p className="mt-0.5 text-xs text-muted">{t("items", { count: order.item_count })}</p>
        </div>
        <Link
          href={getAccountOrderRoutePath(order._id)}
          className="inline-flex h-10 shrink-0 items-center gap-1 rounded-full border border-border bg-background px-4 text-sm font-semibold text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("viewDetails")}
          <LuChevronRight aria-hidden className="size-4 rtl:-scale-x-100" />
        </Link>
      </div>
    </li>
  );
}
