"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCheckoutTotalsUpdating } from "@/components/checkout/useCheckoutTotalsUpdating";
import { usePlaceWhenSignedIn } from "@/components/checkout/usePlaceWhenSignedIn";
import { useCreateTabbySessionMutation } from "@/store/endpoints/paymentApi";

type TabbyCheckoutProps = {
  billingAddressId: string | null;
  shippingAddressId: string | null;
  country: string;
  shippingAvailable: boolean;
};

export default function TabbyCheckout({ billingAddressId, shippingAddressId, country, shippingAvailable }: TabbyCheckoutProps) {
  const t = useTranslations("CheckoutClassicPage");
  const totalsUpdating = useCheckoutTotalsUpdating("tabby");
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
        origin: "web",
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

  const requestPlace = usePlaceWhenSignedIn(payWithTabby);

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
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? t("tabbyRedirecting") : t("placeOrder")}
      </button>
    </>
  );
}
