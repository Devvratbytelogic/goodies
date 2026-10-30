"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { type PaymentMethod } from "@/components/checkout/PaymentMethods";
import { useCheckoutTotalsUpdating } from "@/components/checkout/useCheckoutTotalsUpdating";
import { usePlaceWhenSignedIn } from "@/components/checkout/usePlaceWhenSignedIn";
import { usePathname } from "@/i18n/navigation";
import { useCreateTamaraCheckoutMutation } from "@/store/endpoints/paymentApi";
import { rememberCheckoutReturn } from "@/utils/checkoutReturn";
import { readOrigin } from "@/utils/origin";

type TamaraCheckoutProps = {
  billingAddressId: string | null;
  shippingAddressId: string | null;
  shippingAvailable: boolean;
  buttonClassName?: string;
  autoStart?: boolean;
  /** null reuses the page cart. Omitted watches this gateway's own method. */
  totalsMethod?: PaymentMethod | null;
};

export default function TamaraCheckout({ billingAddressId, shippingAddressId, shippingAvailable, buttonClassName, autoStart = false, totalsMethod }: TamaraCheckoutProps) {
  const t = useTranslations("CheckoutClassicPage");
  const pathname = usePathname();
  const totalsUpdating = useCheckoutTotalsUpdating(totalsMethod === null ? undefined : totalsMethod ?? "tamara");
  const startedRef = useRef(false);
  const [error, setError] = useState("");
  const [createTamaraCheckout, { isLoading }] = useCreateTamaraCheckoutMutation();

  async function payWithTamara() {
    if (!billingAddressId || !shippingAddressId) return;
    setError("");

    try {
      const session = await createTamaraCheckout({
        shipping_address_id: shippingAddressId,
        billing_address_id: billingAddressId,
        customer_note: "",
        origin: readOrigin(),
      }).unwrap();

      const paymentUrl = session?.payment_url || session?.checkout_url || session?.redirect_url;
      if (paymentUrl) {
        rememberCheckoutReturn(`${pathname}${window.location.search}`);
        window.location.assign(paymentUrl);
        return;
      }
      setError(t("tamaraError"));
    } catch (error) {
      console.error("Error creating Tamara checkout", error);
      setError(t("tamaraError"));
    }
  }

  const ready = Boolean(shippingAvailable && billingAddressId && shippingAddressId && !totalsUpdating);
  const requestPlace = usePlaceWhenSignedIn(payWithTamara, "tamara", ready);

  useEffect(() => {
    if (!autoStart || !ready || startedRef.current) return;
    startedRef.current = true;
    requestPlace();
  }, [autoStart, ready, requestPlace]);

  if (autoStart) {
    return (
      <>
        {error ? (
          <p role="alert" className="mt-4 text-sm font-medium text-primary">
            {error}
          </p>
        ) : (
          <p role="status" className="mt-4 text-sm text-muted">
            {t("tamaraRedirecting")}
          </p>
        )}
      </>
    );
  }

  return (
    <>
      {error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-primary">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={requestPlace}
        disabled={!shippingAvailable || !billingAddressId || !shippingAddressId || isLoading || totalsUpdating}
        className={
          buttonClassName ??
          "mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
        }
      >
        {isLoading ? t("tamaraRedirecting") : t("placeOrder")}
      </button>
    </>
  );
}
