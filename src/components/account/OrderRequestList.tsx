"use client";

import moment from "moment";
import { useLocale, useTranslations } from "next-intl";
import type { OrderChangeRequest, OrderRequestLine } from "@/server/types/order";
import { formatAmount } from "@/utils/price";

function requestProducts(request: OrderChangeRequest) {
  return (request.order_item_ids ?? []).filter((item): item is OrderRequestLine => {
    return typeof item === "object" && item !== null && Boolean(item.product_name);
  });
}

function statusClass(status?: string | null) {
  const value = status?.toLowerCase() ?? "";
  if (value.includes("approv") || value.includes("complete")) return "bg-accent/15 text-accent-deep";
  if (value.includes("reject") || value.includes("fail")) return "bg-primary-soft text-primary";
  if (value.includes("pending") || value.includes("request")) return "bg-orange-50 text-orange-700";
  return "bg-background text-muted";
}

const refundClassName = {
  pending: "bg-orange-50 text-orange-700",
  initiating_refund: "bg-orange-50 text-orange-700",
  refund_initiated: "bg-accent/15 text-accent-deep",
  refunded: "bg-accent/15 text-accent-deep",
  failed: "bg-red-50 text-red-700",
  not_required: "bg-background text-muted ring-1 ring-border",
} as const;

function refundKey(status: string) {
  return status.trim().toLowerCase().replaceAll(" ", "_");
}

function Amount({ value, currency }: { value: number; currency: string }) {
  return (
    <span dir="ltr" className="inline-block">
      {formatAmount(value, currency)}
    </span>
  );
}

function OrderRequestCard({
  request,
  label,
  currency,
  date,
}: {
  request: OrderChangeRequest;
  label: (value: string) => string;
  currency: string;
  date: (value: string) => string;
}) {
  const t = useTranslations("AccountPage");
  const when = request.createdAt || request.created_at;
  const reason = request.reason?.trim();
  const details = request.description?.trim();
  const products = requestProducts(request);
  const steps = request.timeline ?? [];
  const refundStatus = request.refund_status?.trim() ?? "";
  const refundTone = refundClassName[refundKey(refundStatus) as keyof typeof refundClassName] ?? "bg-background text-muted";
  const showRefund = Boolean(refundStatus || request.refund_amount != null || request.refund_transaction_id?.trim());

  return (
    <li className="rounded-xl bg-surface px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {request.status ? <p className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold ${statusClass(request.status)}`}>{label(request.status)}</p> : null}
        {when ? <p className="text-xs text-muted">{date(when)}</p> : null}
      </div>

      {products.length > 0 ? (
        <ul className="mt-3 grid gap-1">
          {products.map((product) => (
            <li key={product._id || product.product_name} className="text-sm font-medium text-heading">
              {product.product_name}
              {product.quantity != null || product.total != null ? (
                <span className="mt-0.5 block font-normal text-muted">
                  {product.quantity != null ? t("lineQuantity", { count: product.quantity }) : null}
                  {product.quantity != null && product.total != null ? " · " : null}
                  {product.total != null ? <Amount value={product.total} currency={currency} /> : null}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {reason ? (
        <p className="mt-3 text-sm text-muted">
          <span className="font-medium text-heading">{t("cancelReason")}: </span>
          {reason}
        </p>
      ) : null}
      {details ? (
        <p className="mt-1 text-sm text-muted">
          <span className="font-medium text-heading">{t("cancelDetails")}: </span>
          {details}
        </p>
      ) : null}

      {steps.length > 0 ? (
        <div className="mt-3 border-t border-border pt-3">
          <p className="text-xs font-semibold text-heading">{t("requestUpdates")}</p>
          <ol className="mt-2">
            {steps.map((step, index) => {
              const message = step.message?.trim();
              const note = message && message !== reason && message !== details ? message : "";
              const last = index === steps.length - 1;
              return (
                <li key={`${step.at}-${index}`} className="flex gap-3">
                  <div className="flex w-3 shrink-0 flex-col items-center">
                    <span className={`mt-1.5 size-2.5 rounded-full ${last ? "bg-primary" : "bg-border"}`} />
                    {last ? null : <span aria-hidden className="my-1 w-px flex-1 bg-border" />}
                  </div>
                  <div className={`min-w-0 flex-1 ${last ? "" : "pb-3"}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                      {step.status ? <p className="text-sm font-medium text-heading">{label(step.status)}</p> : null}
                      {step.at ? <p className="text-xs text-muted">{date(step.at)}</p> : null}
                    </div>
                    {note ? <p className="mt-0.5 text-sm leading-5 text-muted">{note}</p> : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}

      {showRefund ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <span className="text-sm font-medium text-heading">{t("refund")}</span>
          {refundStatus ? <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold ${refundTone}`}>{label(refundKey(refundStatus))}</span> : null}
          {request.refund_amount != null ? (
            <span className="text-sm font-semibold text-heading">
              <Amount value={request.refund_amount} currency={currency} />
            </span>
          ) : null}
          {request.refund_transaction_id?.trim() ? (
            <span className="text-xs text-muted" dir="ltr">
              {request.refund_transaction_id.trim()}
            </span>
          ) : null}
        </div>
      ) : null}
      {request.processed_at && steps.length === 0 ? (
        <p className="mt-1 text-xs text-muted">
          {t("requestProcessed")} · {date(request.processed_at)}
        </p>
      ) : null}
    </li>
  );
}

export default function OrderRequestList({
  title,
  requests,
  label,
  currency,
}: {
  title: string;
  requests: OrderChangeRequest[];
  label: (value: string) => string;
  currency: string;
}) {
  const locale = useLocale();
  const date = (value: string) => moment(value).locale(locale).format("D MMM YYYY, h:mm A");
  if (requests.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-background px-5 py-4">
      <h2 className="text-sm font-semibold text-heading">{title}</h2>
      <ul className="mt-3 grid gap-3">
        {requests.map((request, index) => (
          <OrderRequestCard key={request._id || index} request={request} label={label} currency={currency} date={date} />
        ))}
      </ul>
    </section>
  );
}
