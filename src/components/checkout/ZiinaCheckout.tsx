"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useCheckoutTotalsUpdating } from "@/components/checkout/useCheckoutTotalsUpdating";
import { usePlaceWhenSignedIn } from "@/components/checkout/usePlaceWhenSignedIn";
import { useCreateZiinaCheckoutMutation } from "@/store/endpoints/paymentApi";
import { readOrigin } from "@/utils/origin";

type ZiinaCheckoutProps = {
  billingAddressId: string | null;
  shippingAddressId: string | null;
  shippingAvailable: boolean;
  buttonClassName?: string;
  /** Start gateway as soon as ready (no Place order click). */
  autoStart?: boolean;
};

export default function ZiinaCheckout({ billingAddressId, shippingAddressId, shippingAvailable, buttonClassName, autoStart = false }: ZiinaCheckoutProps) {
  const t = useTranslations("CheckoutClassicPage");
  const totalsUpdating = useCheckoutTotalsUpdating("ziina");
  const startedRef = useRef(false);
  const [error, setError] = useState("");
  const [createZiinaCheckout, { isLoading }] = useCreateZiinaCheckoutMutation();

  async function payWithZiina() {
    if (!billingAddressId || !shippingAddressId) return;
    setError("");

    try {
      const session = await createZiinaCheckout({
        shipping_address_id: shippingAddressId,
        billing_address_id: billingAddressId,
        customer_note: "",
        origin: readOrigin(),
      }).unwrap();

      const paymentUrl = session?.payment_url || session?.redirect_url;
      if (paymentUrl) {
        window.location.assign(paymentUrl);
        return;
      }
      setError(t("ziinaError"));
    } catch (error) {
      console.error("Error creating Ziina checkout", error);
      setError(t("ziinaError"));
    }
  }

  const ready = Boolean(shippingAvailable && billingAddressId && shippingAddressId && !totalsUpdating);
  const requestPlace = usePlaceWhenSignedIn(payWithZiina, "ziina", ready);

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
            {t("ziinaRedirecting")}
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
        {isLoading ? t("ziinaRedirecting") : t("placeOrder")}
      </button>
    </>
  );
}
