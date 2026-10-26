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

function LabeledLine({ label, value }: { label: string; value?: string | null }) {
  const text = value?.trim();
  if (!text) return null;

  return (
    <p className="mt-1 text-sm text-muted">
      <span className="font-medium text-heading">{label}: </span>
      {text}
    </p>
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
  const t = useTranslations("AccountPage");
  const locale = useLocale();
  const date = (value: string) => moment(value).locale(locale).format("D MMM YYYY, h:mm A");
  if (requests.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-background px-5 py-4">
      <h2 className="text-sm font-semibold text-heading">{title}</h2>
      <ul className="mt-3 grid gap-3">
        {requests.map((request, index) => {
          const when = request.createdAt || request.created_at;
          // const reason = request.reason?.trim();
          // const details = request.description?.trim();
          // const message = request.message?.trim();
          const products = requestProducts(request);
          const steps = request.timeline ?? [];
          const refund = [
            request.refund_status?.trim() ? label(request.refund_status) : "",
            request.refund_amount != null ? formatAmount(request.refund_amount, currency) : "",
            request.refund_transaction_id?.trim() || "",
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <li key={request._id || index} className="rounded-xl bg-surface px-3 py-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {request.status ? <p className="text-sm font-semibold text-heading">{label(request.status)}</p> : null}
                {when ? <p className="text-xs text-muted">{date(when)}</p> : null}
              </div>
              {request.type ? <p className="mt-1 text-sm text-muted">{label(request.type)}</p> : null}
              {products.length > 0 ? (
                <ul className="mt-2 grid gap-1">
                  {products.map((product) => (
                    <li key={product._id || product.product_name} className="text-sm text-heading">
                      {product.product_name}
                      {product.quantity != null ? <span className="text-muted"> · {t("lineQuantity", { count: product.quantity })}</span> : null}
                      {product.total != null ? <span className="text-muted"> · {formatAmount(product.total, currency)}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : null}
              {/* {message && message !== reason && message !== details ? <p className="mt-1 text-sm leading-5 text-muted">{message}</p> : null}
              {/* <LabeledLine label={t("cancelReason")} value={reason} />
              <LabeledLine label={t("cancelDetails")} value={details} /> */}
              {steps.length > 0 ? (
                <ol className="mt-2 grid gap-2 border-t border-border pt-2">
                  {steps.map((step, stepIndex) => {
                    const message = step.message?.trim();
                    // const alreadyShown = message === reason || message === details;
                    return (
                      <li key={`${step.at}-${stepIndex}`}>
                        {step.status ? <p className="text-sm font-medium text-heading">{label(step.status)}</p> : null}
                        {step.at ? <p className="text-xs text-muted">{date(step.at)}</p> : null}
                        {message ? <p className="mt-0.5 text-sm leading-5 text-muted">{message}</p> : null}
                      </li>
                    );
                  })}
                </ol>
              ) : null}
              <LabeledLine label={t("refund")} value={refund} />
              {/* {request.admin_note?.trim() ? <p className="mt-1 text-sm text-muted">{request.admin_note}</p> : null} */}
              {request.processed_at ? <p className="mt-1 text-xs text-muted">{t("requestProcessed")} · {date(request.processed_at)}</p> : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
