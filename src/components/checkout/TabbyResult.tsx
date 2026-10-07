"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useVerifyTabbyPaymentQuery } from "@/store/endpoints/paymentApi";

const buttonClassName =
  "mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function TabbyResult({ shopHref, checkoutHref }: { shopHref: string; checkoutHref: string }) {
  const t = useTranslations("CheckoutClassicPage");
  const searchParams = useSearchParams();
  const result = searchParams.get("result");
  const paymentId = searchParams.get("payment_id") ?? "";
  const shouldVerify = result === "success" && paymentId !== "";

  const { data: payment, isLoading, isError } = useVerifyTabbyPaymentQuery(paymentId, { skip: !shouldVerify });

  if (shouldVerify && isLoading) {
    return (
      <section role="status" className="rounded-2xl border border-border bg-background px-5 py-8 sm:px-8">
        <h1 className="text-2xl font-bold">{t("tabbyVerifying")}</h1>
      </section>
    );
  }

  const paid = shouldVerify && !isError && (payment?.status === "AUTHORIZED" || payment?.status === "CLOSED");

  if (paid) {
    return (
      <section className="rounded-2xl border border-border bg-background px-5 py-8 sm:px-8">
        <h1 className="text-2xl font-bold">{t("received")}</h1>
        <p className="mt-2 max-w-md text-sm text-muted">{t("receivedNote")}</p>
        {payment?.order_id ? (
          <p className="mt-5 text-sm">
            <span className="text-muted">{t("orderNumber")}</span>{" "}
            <span className="font-bold text-primary">{payment.order_id}</span>
          </p>
        ) : null}
        <Link href={shopHref} className={buttonClassName}>
          {t("shop")}
        </Link>
      </section>
    );
  }

  const cancelled = result === "cancel";

  return (
    <section role="alert" className="rounded-2xl border border-border bg-background px-5 py-8 sm:px-8">
      <h1 className="text-2xl font-bold">{cancelled ? t("tabbyCancelledTitle") : t("tabbyFailedTitle")}</h1>
      <p className="mt-2 max-w-md text-sm text-muted">{cancelled ? t("tabbyCancelledNote") : t("tabbyFailedNote")}</p>
      <Link href={checkoutHref} className={buttonClassName}>
        {t("backToCheckout")}
      </Link>
    </section>
  );
}
