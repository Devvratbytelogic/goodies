"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useCheckoutTotalsUpdating } from "@/components/checkout/useCheckoutTotalsUpdating";
import { usePlaceWhenSignedIn } from "@/components/checkout/usePlaceWhenSignedIn";
import { useCreateTabbySessionMutation } from "@/store/endpoints/paymentApi";
import { readOrigin } from "@/utils/origin";

type TabbyCheckoutProps = {
  billingAddressId: string | null;
  shippingAddressId: string | null;
  country: string;
  shippingAvailable: boolean;
  buttonClassName?: string;
  autoStart?: boolean;
};

export default function TabbyCheckout({ billingAddressId, shippingAddressId, country, shippingAvailable, buttonClassName, autoStart = false }: TabbyCheckoutProps) {
  const t = useTranslations("CheckoutClassicPage");
  const totalsUpdating = useCheckoutTotalsUpdating("tabby");
  const startedRef = useRef(false);
  const [error, setError] = useState("");
  const [createTabbySession, { isLoading }] = useCreateTabbySessionMutation();

  async function payWithTabby() {
    if (!billingAddressId || !shippingAddressId) return;
    setError("");

    try {
      const session = await createTabbySession({
        shipping_address_id: shippingAddressId,
        billing_address_id: billingAddressId,
        customer_note: "",
        country,
        origin: readOrigin(),
      }).unwrap();

      if (session?.payment_url) {
        window.location.assign(session.payment_url);
        return;
      }
      setError(t("tabbyRejected"));
    } catch (error) {
      console.error("Error creating Tabby session", error);
      setError(t("tabbyError"));
    }
  }

  const ready = Boolean(shippingAvailable && billingAddressId && shippingAddressId && !totalsUpdating);
  const requestPlace = usePlaceWhenSignedIn(payWithTabby, "tabby", ready);

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
            {t("tabbyRedirecting")}
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
        {isLoading ? t("tabbyRedirecting") : t("placeOrder")}
      </button>
    </>
  );
}
