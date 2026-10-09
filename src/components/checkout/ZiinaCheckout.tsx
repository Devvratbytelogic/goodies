"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePlaceWhenSignedIn } from "@/components/checkout/usePlaceWhenSignedIn";
import { useCreateZiinaCheckoutMutation } from "@/store/endpoints/paymentApi";

type ZiinaCheckoutProps = {
  billingAddressId: string | null;
  shippingAddressId: string | null;
};

export default function ZiinaCheckout({ billingAddressId, shippingAddressId }: ZiinaCheckoutProps) {
  const t = useTranslations("CheckoutClassicPage");
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

  const requestPlace = usePlaceWhenSignedIn(payWithZiina);

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
        disabled={!billingAddressId || !shippingAddressId || isLoading}
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70"
      >
        {isLoading ? t("ziinaRedirecting") : t("placeOrder")}
      </button>
    </>
  );
}
