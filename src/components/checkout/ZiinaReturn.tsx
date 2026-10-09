"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LuCircleCheck, LuCircleX, LuClock } from "react-icons/lu";
import ImageComponent from "@/components/layout/common/ImageComponent";
import OrderAddresses from "@/components/checkout/OrderAddresses";
import { Link } from "@/i18n/navigation";
import { api } from "@/store/api";
import { useDownloadOrderInvoiceMutation, useGetOrderDetailsQuery } from "@/store/endpoints/orderApi";
import { useAppDispatch } from "@/store/hooks";
import { formatAmount } from "@/utils/price";
import { getProductRoutePath } from "@/utils/routes";

const buttonClassName =
  "mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const actionClassName =
  "inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70";

type ZiinaReturnProps = {
  status: string;
  orderId: string;
  orderNumber: string;
  message: string;
  shopHref: string;
  checkoutHref: string;
};

function OrderDetailsSkeleton() {
  return (
    <div aria-hidden>
      <div className="mt-6 grid gap-3 rounded-xl bg-surface p-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-surface-muted" />
            <div className="h-4 w-28 animate-pulse rounded bg-surface-muted" />
          </div>
        ))}
      </div>
      <div className="mt-6 h-5 w-28 animate-pulse rounded bg-surface-muted" />
      <div className="mt-3 flex items-center gap-3 border-b border-border py-3">
        <div className="size-14 shrink-0 animate-pulse rounded-xl bg-surface-muted" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-4/5 animate-pulse rounded bg-surface-muted" />
          <div className="h-3 w-16 animate-pulse rounded bg-surface-muted" />
        </div>
        <div className="h-4 w-14 shrink-0 animate-pulse rounded bg-surface-muted" />
      </div>
      <div className="mt-4 space-y-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="h-4 w-24 animate-pulse rounded bg-surface-muted" />
            <div className="h-4 w-16 animate-pulse rounded bg-surface-muted" />
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-5 w-36 animate-pulse rounded bg-surface-muted" />
        <div className="h-3 w-40 animate-pulse rounded bg-surface-muted" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-surface-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-surface-muted" />
      </div>
    </div>
  );
}

export default function ZiinaReturn({ status, orderId, orderNumber, message, shopHref, checkoutHref }: ZiinaReturnProps) {
  const t = useTranslations("CheckoutClassicPage");
  const cart = useTranslations("CartPage");
  const dispatch = useAppDispatch();
  const [downloadInvoice, { isLoading: downloading }] = useDownloadOrderInvoiceMutation();
  const [pdfError, setPdfError] = useState(false);
  const isSuccess = status === "success";
  const orderKey = orderId || orderNumber;
  const { data: order, isError } = useGetOrderDetailsQuery(orderKey, {
    skip: !isSuccess || orderKey.length === 0,
  });
  const loadingOrder = isSuccess && orderKey.length > 0 && !order && !isError;

  useEffect(() => {
    if (!isSuccess) return;
    dispatch(api.util.invalidateTags(["Cart"]));
  }, [dispatch, isSuccess]);

  if (status === "pending") {
    return (
      <section role="status" className="rounded-2xl border border-border bg-background px-5 py-8 sm:px-8">
        <div className="flex items-start gap-3">
          <LuClock aria-hidden className="mt-0.5 size-7 shrink-0 text-muted" />
          <h1 className="text-2xl font-bold">{t("ziinaPendingTitle")}</h1>
        </div>
        {orderNumber ? (
          <p className="mt-5 text-sm">
            <span className="text-muted">{t("orderNumber")}</span> <span className="font-bold text-primary">#{orderNumber}</span>
          </p>
        ) : null}
        <Link href={shopHref} className={buttonClassName}>
          {t("shop")}
        </Link>
      </section>
    );
  }

  if (status === "cancel") {
    return (
      <section role="alert" className="rounded-2xl border border-border bg-background px-5 py-8 sm:px-8">
        <div className="flex items-start gap-3">
          <LuCircleX aria-hidden className="mt-0.5 size-7 shrink-0 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">{t("ziinaCancelledTitle")}</h1>
            <p className="mt-2 max-w-md text-sm text-muted">{t("ziinaCancelledNote")}</p>
          </div>
        </div>
        <Link href={checkoutHref} className={buttonClassName}>
          {t("backToCheckout")}
        </Link>
      </section>
    );
  }

  if (!isSuccess) {
    return (
      <section role="alert" className="rounded-2xl border border-border bg-background px-5 py-8 sm:px-8">
        <div className="flex items-start gap-3">
          <LuCircleX aria-hidden className="mt-0.5 size-7 shrink-0 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">{t("ziinaFailedTitle")}</h1>
            <p className="mt-2 max-w-md text-sm text-muted">{message || t("ziinaFailedNote")}</p>
          </div>
        </div>
        <Link href={checkoutHref} className={buttonClassName}>
          {t("backToCheckout")}
        </Link>
      </section>
    );
  }

  const summary = order?.summary;
  const items = order?.items ?? [];
  const shippingAddress = order?.shipping_address;
  const billingAddress = order?.billing_address;
  const currency = summary?.currency || items[0]?.currency || "";
  const paid = order?.payment_status?.toLowerCase() === "paid";
  const isCod = order?.payment_method === "cod";
  const shownOrderNumber = order?.order_number ?? orderNumber;
  const discount = (summary?.discount_amount ?? 0) > 0 ? summary?.discount_amount ?? 0 : summary?.coupon_discount ?? 0;
  const itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

  async function onDownload() {
    const invoiceId = order?.order_id || orderId;
    if (!invoiceId || downloading) return;
    setPdfError(false);
    try {
      const blob = await downloadInvoice(invoiceId).unwrap();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `goodies-order-${shownOrderNumber || invoiceId}.pdf`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setPdfError(true);
    }
  }

  return (
    <section
      aria-busy={loadingOrder}
      className="rounded-2xl border border-border bg-background px-5 py-6 sm:px-8 sm:py-8"
    >
      <div className="flex items-start gap-3">
        <LuCircleCheck aria-hidden className="mt-0.5 size-7 shrink-0 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{t("received")}</h1>
          <p className="mt-1 max-w-md text-sm text-muted">{t("receivedNote")}</p>
          {isCod && summary ? (
            <p className="mt-2 max-w-md text-sm text-muted">{t("codNote", { amount: formatAmount(summary.grand_total, currency) })}</p>
          ) : null}
          {order && !paid && !isCod ? <p className="mt-2 max-w-md text-sm text-muted">{t("ziinaPendingTitle")}</p> : null}
        </div>
      </div>

      {loadingOrder ? (
        <div role="status">
          <span className="sr-only">{t("ziinaLoadingOrder")}</span>
          <OrderDetailsSkeleton />
        </div>
      ) : null}

      {isError ? <p className="mt-6 text-sm text-muted">{t("ziinaOrderError")}</p> : null}

      {order ? (
        <>
          <dl className="mt-6 grid gap-3 rounded-xl bg-surface p-4 text-sm sm:grid-cols-3">
            {shownOrderNumber ? (
              <div>
                <dt className="text-muted">{t("orderNumber")}</dt>
                <dd className="mt-0.5 font-bold text-primary">#{shownOrderNumber}</dd>
              </div>
            ) : null}
            {order.order_date ? (
              <div>
                <dt className="text-muted">{t("orderDate")}</dt>
                <dd className="mt-0.5 font-semibold text-heading">{order.order_date}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-muted">{t("paymentLabel")}</dt>
              <dd className="mt-0.5 flex flex-wrap items-center gap-2 font-semibold text-heading">
                <span>{order.payment_method_title || t("payZiina")}</span>
                {paid ? <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">{t("paid")}</span> : null}
              </dd>
            </div>
            {summary ? (
              <div>
                <dt className="text-muted">{cart("total")}</dt>
                <dd className="mt-0.5 font-bold tabular-nums text-price">{formatAmount(summary.grand_total, currency)}</dd>
              </div>
            ) : null}
          </dl>

          {items.length > 0 ? (
            <>
              <h2 className="mt-6 text-base font-bold">{cart("yourOrder")}</h2>
              <ul className="mt-2 divide-y divide-border">
                {items.map((item) => {
                  const title = (
                    <span className="line-clamp-2 text-sm font-semibold text-heading group-hover:text-primary">{item.title}</span>
                  );

                  return (
                    <li key={item.item_id} className="flex items-center gap-3 py-3">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/70">
                        {item.slug ? (
                          <Link
                            href={getProductRoutePath(item.slug)}
                            aria-label={item.title}
                            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            <ImageComponent src={item.image ?? ""} alt="" width={112} height={112} sizes="56px" objectFit="cover" />
                          </Link>
                        ) : (
                          <ImageComponent src={item.image ?? ""} alt="" width={112} height={112} sizes="56px" objectFit="cover" />
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
                        <p className="mt-1 text-xs text-muted">
                          {item.size ? `${item.size} · ` : ""}
                          {cart("itemQty", { count: item.quantity ?? 0 })}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tabular-nums text-price">
                        {formatAmount(item.line_total ?? 0, item.currency || currency)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}

          {summary ? (
            <dl className="mt-2 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">
                  {cart("subtotal")} {itemCount > 0 ? <span className="text-xs">({cart("itemCount", { count: itemCount })})</span> : null}
                </dt>
                <dd className="font-semibold tabular-nums text-heading">{formatAmount(summary.order_total, currency)}</dd>
              </div>
              {discount > 0 ? (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">
                    {cart("couponLabel")}
                    {summary.coupon_code ? (
                      <span className="ms-1 text-xs font-semibold tracking-wide text-primary">{summary.coupon_code}</span>
                    ) : null}
                  </dt>
                  <dd className="font-semibold tabular-nums text-price">−{formatAmount(discount, currency)}</dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">{cart("shipping")}</dt>
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
                  <dt className="text-muted">{cart("tax")}</dt>
                  <dd className="font-semibold tabular-nums text-heading">{formatAmount(summary.tax_amount, currency)}</dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3.5 py-3">
                <dt className="font-semibold text-heading">{cart("total")}</dt>
                <dd className="text-base font-bold tabular-nums text-price">{formatAmount(summary.grand_total, currency)}</dd>
              </div>
            </dl>
          ) : null}

          <OrderAddresses
            shipping={shippingAddress}
            billing={billingAddress}
            shippingLabel={t("shippingAddress")}
            billingLabel={t("billingAddress")}
          />
        </>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {order ? (
          <button
            type="button"
            onClick={onDownload}
            disabled={downloading}
            className={`${actionClassName} border border-border text-heading hover:border-primary hover:text-primary`}
          >
            {downloading ? t("downloadingPdf") : t("downloadPdf")}
          </button>
        ) : null}
        <Link href={shopHref} className={`${actionClassName} bg-primary text-white hover:bg-primary/90`}>
          {t("shop")}
        </Link>
      </div>
      {pdfError ? (
        <p role="alert" className="mt-3 text-sm text-primary">
          {t("downloadPdfError")}
        </p>
      ) : null}
    </section>
  );
}
