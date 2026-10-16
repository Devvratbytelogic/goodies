"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import ImageComponent from "@/components/layout/common/ImageComponent";
import OrderCancellation from "@/components/account/OrderCancellation";
import OrderTracking from "@/components/account/OrderTracking";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { AccountOrderDetailSkeleton } from "@/components/skeletons/AccountSkeletons";
import { useDownloadOrderInvoiceMutation, useGetOrderDetailsQuery } from "@/store/endpoints/orderApi";
import type { OrderChangeRequest, OrderDetailsAddress } from "@/server/types/order";
import { formatAmount } from "@/utils/price";
import { getProductRoutePath } from "@/utils/routes";

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
  item_cancelled: "statusCancelled",
  failed: "statusFailed",
  on_hold: "statusOnHold",
  processing: "statusProcessing",
  paid: "statusPaid",
  tamara_p_canceled: "statusTamaraCanceled",
  tamara_p_failed: "statusTamaraFailed",
} as const;

function readableStatus(value: string | null | undefined, t: ReturnType<typeof useTranslations<"AccountPage">>) {
  if (!value) return "";
  if (value in statusLabel) return t(statusLabel[value as keyof typeof statusLabel]);
  return value.replaceAll("_", " ").replace(/^\w/, (letter) => letter.toUpperCase());
}

function statusTone(value: string | null | undefined) {
  if (value && value in statusClassName) return statusClassName[value as keyof typeof statusClassName];
  return "bg-surface text-muted";
}

function AddressCard({ title, address }: { title: string; address: OrderDetailsAddress }) {
  const name = address.full_name?.trim() || [address.first_name, address.last_name].filter(Boolean).join(" ");
  const line = [address.city, address.state, address.postal_code, address.country].filter(Boolean).join(", ");
  const phone = address.phone_number?.trim();
  const phoneLabel = phone ? (phone.startsWith("+") ? phone : `+${phone}`) : "";

  return (
    <section className="rounded-2xl border border-border bg-background px-5 py-4">
      <h2 className="text-sm font-semibold text-heading">{title}</h2>
      {name ? <p className="mt-2 text-sm font-medium text-heading">{name}</p> : null}
      {address.street_address ? <p className="mt-1 text-sm leading-relaxed text-muted">{address.street_address}</p> : null}
      {line ? <p className="text-sm leading-relaxed text-muted">{line}</p> : null}
      {phoneLabel ? (
        <p className="mt-2 text-sm text-heading" dir="ltr">
          {phoneLabel}
        </p>
      ) : null}
      {address.email ? (
        <p className="mt-1 text-sm text-muted" dir="ltr">
          {address.email}
        </p>
      ) : null}
    </section>
  );
}

function RequestList({ title, requests, locale, label }: { title: string; requests: OrderChangeRequest[]; locale: string; label: (value: string) => string }) {
  if (requests.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-background px-5 py-4">
      <h2 className="text-sm font-semibold text-heading">{title}</h2>
      <ul className="mt-3 grid gap-3">
        {requests.map((request, index) => {
          const when = request.created_at || request.createdAt;
          const note = request.message || request.reason;

          return (
            <li key={request._id || `${request.status}-${index}`} className="rounded-xl bg-surface px-3 py-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {request.status ? <p className="text-sm font-semibold text-heading">{label(request.status)}</p> : null}
                {when ? <p className="text-xs text-muted">{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(when))}</p> : null}
              </div>
              {request.type ? <p className="mt-1 text-sm text-muted">{label(request.type)}</p> : null}
              {note ? <p className="mt-1 text-sm text-muted">{note}</p> : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function AccountOrderDetail({ id }: { id: string }) {
  const t = useTranslations("AccountPage");
  const locale = useLocale();
  const { token } = useAuth();
  const { data: order, isLoading, isUninitialized, isError } = useGetOrderDetailsQuery(id, { skip: !token });
  const [downloadInvoice, { isLoading: downloading }] = useDownloadOrderInvoiceMutation();
  const [pdfError, setPdfError] = useState(false);

  if ((isLoading || isUninitialized) && !order) return <AccountOrderDetailSkeleton embedded />;

  if (isError || !order) {
    return <p className="text-sm text-muted">{t("orderError")}</p>;
  }

  const status = order.status;
  const paymentStatus = order.payment_status;
  const paymentMethod = order.payment_method?.replaceAll("_", " ").replace(/^\w/, (letter) => letter.toUpperCase());
  const summary = order.summary;
  const currency = summary?.currency_symbol || "";
  const items = order.items ?? [];
  const timeline = order.timeline ?? [];
  const banner = order.status_banner;
  const discount = (summary?.discount_amount ?? 0) > 0 ? summary?.discount_amount ?? 0 : summary?.coupon_discount ?? 0;
  const label = (value: string) => readableStatus(value, t);

  async function onDownload() {
    if (!order?.order_id || downloading) return;
    setPdfError(false);
    try {
      const blob = await downloadInvoice(order.order_id).unwrap();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `goodies-order-${order.order_number || order.order_id}.pdf`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setPdfError(true);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="shrink-0 text-2xl font-bold tracking-tight text-heading">{t("order", { id: order.order_code || order.order_number })}</h1>
        <div className="flex shrink-0 items-center gap-2">
          {status ? (
            <span className={`inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs ${statusTone(status)}`}>
              <span className="font-medium opacity-70">{t("orderStatus")}</span>
              <span className="font-semibold">{label(status)}</span>
            </span>
          ) : null}
          {paymentStatus ? (
            <span className={`inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs ${statusTone(paymentStatus)}`}>
              <span className="font-medium opacity-70">{t("paymentStatus")}</span>
              <span className="font-semibold">{label(paymentStatus)}</span>
            </span>
          ) : null}
        </div>
      </div>
      {order.order_date ? <p className="text-sm text-muted">{t("placedOn", { date: order.order_date })}</p> : null}

      <OrderTracking banner={banner} timeline={timeline} label={label} />
      <OrderCancellation order={order} />
      {order.can_return_replacement ? <p className="text-sm text-heading">{t("returnAvailable")}</p> : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <section className="overflow-hidden rounded-2xl border border-border bg-background">
          <h2 className="border-b border-border px-4 py-3 text-sm font-semibold text-heading sm:px-5">{t("orderItems")}</h2>
          <ul className="divide-y divide-border">
            {items.map((item) => {
              const image = item.image || item.thumbnail || "";
              const note = [item.reason, item.description].filter(Boolean).join(". ");
              const title = (
                <span className={`line-clamp-2 font-medium group-hover:text-primary ${item.cancelled ? "text-muted" : "text-heading"}`}>{item.title}</span>
              );

              return (
                <li key={item.item_id} className={`flex items-center gap-3 px-4 py-3 sm:px-5 ${item.cancelled ? "bg-surface/60" : ""}`}>
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/70">
                    {item.slug ? (
                      <Link
                        href={getProductRoutePath(item.slug)}
                        aria-label={item.title}
                        className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <ImageComponent src={image} alt="" width={128} height={128} sizes="64px" objectFit="cover" />
                      </Link>
                    ) : (
                      <ImageComponent src={image} alt="" width={128} height={128} sizes="64px" objectFit="cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    {item.slug ? (
                      <Link href={getProductRoutePath(item.slug)} className="group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                        {title}
                      </Link>
                    ) : (
                      title
                    )}
                    <p className="mt-0.5 text-sm text-muted">
                      {item.size ? `${item.size} · ` : ""}
                      {t("lineQuantity", { count: item.quantity })}
                      {item.quantity > 1 ? ` · ${formatAmount(item.unit_price, item.currency_symbol || currency)}` : ""}
                    </p>
                    {item.cancelled ? <p className="mt-1 text-xs font-semibold text-muted">{t("statusCancelled")}</p> : null}
                    {note ? <p className="mt-0.5 text-sm text-muted">{note}</p> : null}
                  </div>
                  <p className={`shrink-0 text-sm font-semibold tabular-nums ${item.cancelled ? "text-muted line-through" : "text-price"}`}>
                    {formatAmount(item.line_total, item.currency_symbol || currency)}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="grid content-start gap-4">
          <section className="rounded-2xl border border-border bg-background px-5 py-4">
            <h2 className="text-sm font-semibold text-heading">{t("paymentStatus")}</h2>
            {order.payment_method_title ? <p className="mt-2 text-sm font-medium text-heading">{order.payment_method_title}</p> : null}
            {paymentMethod ? <p className="mt-0.5 text-sm text-muted">{paymentMethod}</p> : null}
            {order.customer_email ? (
              <p className="mt-3 text-sm text-muted">
                {t("email")}
                <span className="mt-0.5 block text-heading" dir="ltr">
                  {order.customer_email}
                </span>
              </p>
            ) : null}
            {order.customer_note ? (
              <p className="mt-3 text-sm text-muted">
                {t("customerNote")}
                <span className="mt-0.5 block text-heading">{order.customer_note}</span>
              </p>
            ) : null}
          </section>

          {summary ? (
            <section className="rounded-2xl border border-border bg-background px-5 py-4">
              <h2 className="text-sm font-semibold text-heading">{t("orderSummary")}</h2>
              <dl className="mt-3 space-y-2.5 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">{t("subtotal")}</dt>
                  <dd className="font-semibold tabular-nums text-heading">{formatAmount(summary.order_total, currency)}</dd>
                </div>
                {discount > 0 ? (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted">
                      {t("orderCoupon")}
                      {summary.coupon_code ? <span className="mt-0.5 block text-xs font-semibold tracking-wide text-primary">{summary.coupon_code}</span> : null}
                    </dt>
                    <dd className="font-semibold tabular-nums text-price">−{formatAmount(discount, currency)}</dd>
                  </div>
                ) : null}
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">{t("shipping")}</dt>
                  <dd className="font-semibold tabular-nums text-heading">{formatAmount(summary.shipping_amount, currency)}</dd>
                </div>
                {summary.fee_amount > 0 ? (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted">{t("fee")}</dt>
                    <dd className="font-semibold tabular-nums text-heading">{formatAmount(summary.fee_amount, currency)}</dd>
                  </div>
                ) : null}
                {summary.tax_amount > 0 ? (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted">{t("tax")}</dt>
                    <dd className="font-semibold tabular-nums text-heading">{formatAmount(summary.tax_amount, currency)}</dd>
                  </div>
                ) : null}
                <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2.5">
                  <dt className="font-semibold text-heading">{t("orderTotal")}</dt>
                  <dd className="font-bold tabular-nums text-price">{formatAmount(summary.grand_total, currency)}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={onDownload}
                disabled={downloading}
                className="mt-4 inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-full border border-border bg-background px-4 text-sm font-semibold text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70"
              >
                {downloading ? t("downloadingInvoice") : t("downloadInvoice")}
              </button>
              {pdfError ? (
                <p role="alert" className="mt-2 text-sm text-primary">
                  {t("downloadInvoiceError")}
                </p>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>

      {order.shipping_address || order.billing_address ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {order.shipping_address ? <AddressCard title={t("shipTo")} address={order.shipping_address} /> : null}
          {order.billing_address ? <AddressCard title={t("billingAddress")} address={order.billing_address} /> : null}
        </div>
      ) : null}

      <RequestList title={t("cancellationRequests")} requests={order.cancellation_requests ?? []} locale={locale} label={label} />
      <RequestList title={t("returnRequests")} requests={order.return_replacement_requests ?? []} locale={locale} label={label} />
    </div>
  );
}
