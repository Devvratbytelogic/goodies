"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useGetUserOrdersQuery, useDownloadOrderInvoiceMutation } from "@/store/endpoints/orderApi";
import type { UserOrder } from "@/server/types/order";
import { getAccountOrderRoutePath, getProductRoutePath } from "@/utils/routes";
import { formatAmount } from "@/utils/price";
import { AccountRecentOrdersSkeleton, AccountStatValueSkeleton } from "@/components/skeletons/AccountSkeletons";

const countArgs = { status: "all", page: 1, limit: 2 };

const statusClassName = {
  completed: "bg-surface-soft text-accent-deep",
  pending: "bg-primary-soft text-primary",
  cancelled: "bg-surface text-muted",
  failed: "bg-primary-soft text-primary",
  on_hold: "bg-surface text-muted",
  processing: "bg-primary-soft text-primary",
  paid: "bg-surface-soft text-accent-deep",
  tamara_p_canceled: "bg-surface text-muted",
  tamara_p_failed: "bg-primary-soft text-primary",
} as const;

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

function useOrderCount() {
  const { token } = useAuth();
  return useGetUserOrdersQuery(countArgs, { skip: !token });
}

export function AccountOrdersCount() {
  const { data, isLoading, isUninitialized } = useOrderCount();
  if (!data && (isLoading || isUninitialized)) return <AccountStatValueSkeleton />;
  return data?.pagination.totalItems ?? 0;
}

export function AccountOrderList({ limit = 10, paginated = false }: { limit?: number; paginated?: boolean }) {
  const t = useTranslations("AccountPage");
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading, isUninitialized, isFetching } = useGetUserOrdersQuery(
    { status: "all", page: paginated ? page : 1, limit },
    { skip: !token },
  );
  const orders = data?.orders ?? [];
  const totalPages = data?.pagination.totalPages ?? 1;

  function showPage(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if ((isLoading || isUninitialized) && !data) return <AccountRecentOrdersSkeleton count={paginated ? 3 : limit} />;

  if (orders.length === 0) {
    return <p className="text-sm text-muted">{t("noOrders")}</p>;
  }

  return (
    <div>
      <ul className="grid gap-4">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} t={t} />
        ))}
      </ul>
      {paginated && totalPages > 1 ? (
        <nav aria-label={t("pagination")} className="mt-6 flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => showPage(page - 1)}
            disabled={page <= 1 || isFetching}
            aria-label={t("previous")}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-35"
          >
            <LuChevronLeft aria-hidden className="size-4 rtl:-scale-x-100" />
          </button>
          <span className="px-2 text-sm font-semibold text-heading">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => showPage(page + 1)}
            disabled={page >= totalPages || isFetching}
            aria-label={t("next")}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-35"
          >
            <LuChevronRight aria-hidden className="size-4 rtl:-scale-x-100" />
          </button>
        </nav>
      ) : null}
    </div>
  );
}

function OrderCard({
  order,
  t,
}: {
  order: UserOrder;
  t: ReturnType<typeof useTranslations<"AccountPage">>;
}) {
  const status = order.status;
  const paymentStatus = order.payment_status;
  const paymentMethod = order.payment_method?.replaceAll("_", " ").replace(/^\w/, (letter) => letter.toUpperCase());
  const [downloadInvoice, { isLoading: downloading }] = useDownloadOrderInvoiceMutation();
  const [pdfError, setPdfError] = useState(false);

  async function onDownload() {
    const invoiceId = order.order_id || order._id;
    if (!invoiceId || downloading) return;
    setPdfError(false);
    try {
      const blob = await downloadInvoice(invoiceId).unwrap();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `goodies-order-${order.order_number || invoiceId}.pdf`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setPdfError(true);
    }
  }

  return (
    <li className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="border-b border-border px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={getAccountOrderRoutePath(order.order_id || order._id)}
            className="shrink-0 font-semibold text-heading hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("order", { id: order.order_code || order.order_number })}
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <span className={`inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs ${statusClassName[status]}`}>
              <span className="font-medium opacity-70">{t("orderStatus")}</span>
              <span className="font-semibold">{t(statusLabel[status])}</span>
            </span>
            {paymentStatus ? (
              <span className={`inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs ${statusClassName[paymentStatus]}`}>
                <span className="font-medium opacity-70">{t("paymentStatus")}</span>
                <span className="font-semibold">{t(statusLabel[paymentStatus])}</span>
              </span>
            ) : null}
          </div>
        </div>
        <p className="mt-0.5 text-sm text-muted">{t("placedOn", { date: order.order_date })}</p>
        {paymentMethod ? <p className="mt-0.5 text-sm font-medium text-heading">{paymentMethod}</p> : null}
        {order.payment_method_title ? <p className="mt-0.5 text-sm text-muted">{order.payment_method_title}</p> : null}
      </div>
      {order.items && order.items.length > 0 ? (
        <ul className="divide-y divide-border">
          {order.items.map((item) => {
            const image = item.image || item.thumbnail || "";
            const title = <span className="line-clamp-2 font-medium text-heading group-hover:text-primary">{item.title}</span>;

            return (
              <li key={item.item_id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/70">
                  {item.slug ? (
                    <Link
                      href={getProductRoutePath(item.slug)}
                      aria-label={item.title}
                      className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <ImageComponent src={image} alt="" width={112} height={112} sizes="56px" objectFit="cover" />
                    </Link>
                  ) : (
                    <ImageComponent src={image} alt="" width={112} height={112} sizes="56px" objectFit="cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  {item.slug ? (
                    <Link
                      href={getProductRoutePath(item.slug)}
                      className="group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {title}
                    </Link>
                  ) : (
                    title
                  )}
                  <p className="mt-0.5 text-sm text-muted">{t("lineQuantity", { count: item.quantity })}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-price">
                  {formatAmount(item.line_total, item.currency_symbol || order.currency)}
                </p>
              </li>
            );
          })}
        </ul>
      ) : null}
      <div className="border-t border-border bg-surface/60 px-4 py-3.5 sm:px-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted">{t("orderTotal")}</p>
            <p className="mt-0.5 text-lg font-bold tabular-nums text-price">{formatAmount(order.total_amount, order.summary?.currency_symbol || order.currency)}</p>
            <p className="mt-0.5 text-xs text-muted">{t("items", { count: order.item_count })}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onDownload}
              disabled={downloading}
              className="inline-flex h-10 items-center whitespace-nowrap rounded-full border border-border bg-background px-4 text-sm font-semibold text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70"
            >
              {downloading ? t("downloadingInvoice") : t("downloadInvoice")}
            </button>
            <Link
              href={getAccountOrderRoutePath(order.order_id || order._id)}
              className="inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-full border border-border bg-background px-4 text-sm font-semibold text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t("viewDetails")}
              <LuChevronRight aria-hidden className="size-4 rtl:-scale-x-100" />
            </Link>
          </div>
        </div>
        {pdfError ? (
          <p role="alert" className="mt-2 text-sm text-primary">
            {t("downloadInvoiceError")}
          </p>
        ) : null}
      </div>
    </li>
  );
}
