"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ImageComponent from "@/components/layout/common/ImageComponent";
import OrderCancellation from "@/components/account/OrderCancellation";
import OrderRequestList from "@/components/account/OrderRequestList";
import OrderTracking from "@/components/account/OrderTracking";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { AccountOrderDetailSkeleton } from "@/components/skeletons/AccountSkeletons";
import { useDownloadOrderInvoiceMutation, useGetOrderDetailsQuery } from "@/store/endpoints/orderApi";
import type { OrderDetailsAddress } from "@/server/types/order";
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
  initiating_refund: "statusInitiatingRefund",
  refund_initiated: "statusRefundInitiated",
  refunded: "statusRefunded",
  not_required: "statusRefundNotRequired",
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
  const cityLine = [address.city, address.state, address.postal_code].filter(Boolean).join(", ");
  const phone = address.phone_number?.trim();
  const phoneLabel = phone ? (phone.startsWith("+") ? phone : `+${phone}`) : "";

  return (
    <div className="px-4 py-4 sm:px-5">
      <h3 className="text-sm font-semibold text-heading">{title}</h3>
      <address className="mt-3 text-sm leading-6 not-italic">
        {name ? <span className="block font-medium text-heading">{name}</span> : null}
        {address.street_address ? <span className="mt-1 block wrap-break-word text-muted">{address.street_address}</span> : null}
        {cityLine ? <span className="block wrap-break-word text-muted">{cityLine}</span> : null}
        {address.country ? <span className="block text-muted">{address.country}</span> : null}
        {phoneLabel || address.email ? (
          <span className="mt-3 flex flex-col gap-1 border-t border-border pt-3">
            {phoneLabel ? (
              <span className="font-medium text-heading" dir="ltr">
                <bdi>{phoneLabel}</bdi>
              </span>
            ) : null}
            {address.email ? (
              <span className="min-w-0 break-all text-muted" dir="ltr">
                {address.email}
              </span>
            ) : null}
          </span>
        ) : null}
      </address>
    </div>
  );
}

export default function AccountOrderDetail({ id }: { id: string }) {
  const t = useTranslations("AccountPage");
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
  const isCod = order.payment_method === "cod";
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-heading">{t("order", { id: order.order_code || order.order_number })}</h1>
        <div className="flex flex-wrap items-center gap-2">
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
        <div className="grid content-start gap-4">
        <section className="overflow-hidden rounded-2xl border border-border bg-background">
          <h2 className="border-b border-border px-4 py-3 text-sm font-semibold text-heading sm:px-5">{t("orderItems")}</h2>
          <ul className="divide-y divide-border">
            {items.map((item) => {
              const image = item.image || item.thumbnail || "";
              const requested = !item.cancelled && Boolean(item.is_cancel_requested);
              const note = [item.reason, item.description].filter(Boolean).join(". ");
              const title = (
                <span className={`line-clamp-2 font-medium ${item.cancelled ? "text-muted line-through" : "text-heading group-hover:text-primary"}`}>{item.title}</span>
              );

              return (
                <li key={item.item_id} className={`flex items-center gap-3 px-4 py-3 sm:px-5 ${item.cancelled ? "bg-surface-muted" : ""}`}>
                  <div className={`relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/70 ${item.cancelled ? "opacity-70 grayscale" : ""}`}>
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
                    {item.cancelled ? (
                      <p className="mt-1">
                        <span className="inline-flex h-6 items-center rounded-full bg-red-50 px-2.5 text-xs font-semibold text-red-700">{t("statusCancelled")}</span>
                      </p>
                    ) : null}
                    {requested ? (
                      <p className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-heading">{t("statusCancellationRequested")}</span>
                        <span className="inline-flex h-6 items-center rounded-full bg-orange-50 px-2.5 text-xs font-semibold text-orange-700">{t("statusPending")}</span>
                      </p>
                    ) : null}
                    {note && !item.cancelled ? <p className="mt-0.5 text-sm text-muted">{note}</p> : null}
                  </div>
                  <p className={`shrink-0 text-sm font-semibold tabular-nums ${item.cancelled ? "text-red-700 line-through" : "text-price"}`}>
                    {formatAmount(item.line_total, item.currency_symbol || currency)}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
        </div>

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
                {isCod ? (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted">{t("cod")}</dt>
                    <dd className="font-semibold tabular-nums text-heading">
                      {(summary.cod_amount ?? 0) > 0 ? formatAmount(summary.cod_amount ?? 0, currency) : t("free")}
                    </dd>
                  </div>
                ) : null}
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
        <section
          className={`overflow-hidden rounded-2xl border border-border bg-background ${
            order.shipping_address && order.billing_address ? "grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0" : ""
          }`}
        >
          {order.shipping_address ? <AddressCard title={t("shipTo")} address={order.shipping_address} /> : null}
          {order.billing_address ? <AddressCard title={t("billingAddress")} address={order.billing_address} /> : null}
        </section>
      ) : null}

      <OrderRequestList title={t("cancellationRequests")} requests={order.cancellation_requests ?? []} label={label} currency={currency} />
      <OrderRequestList title={t("returnRequests")} requests={order.return_replacement_requests ?? []} label={label} currency={currency} />
    </div>
  );
}
