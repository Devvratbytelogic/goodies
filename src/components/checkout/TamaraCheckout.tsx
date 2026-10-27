"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCheckoutTotalsUpdating } from "@/components/checkout/useCheckoutTotalsUpdating";
import { usePlaceWhenSignedIn } from "@/components/checkout/usePlaceWhenSignedIn";
import { useCreateTamaraCheckoutMutation } from "@/store/endpoints/paymentApi";
import { readOrigin } from "@/utils/origin";

type TamaraCheckoutProps = {
  billingAddressId: string | null;
  shippingAddressId: string | null;
  shippingAvailable: boolean;
};

export default function TamaraCheckout({ billingAddressId, shippingAddressId, shippingAvailable }: TamaraCheckoutProps) {
  const t = useTranslations("CheckoutClassicPage");
  const totalsUpdating = useCheckoutTotalsUpdating("tamara");
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
        window.location.assign(paymentUrl);
        return;
      }
      setError(t("tamaraError"));
    } catch (error) {
      console.error("Error creating Tamara checkout", error);
      setError(t("tamaraError"));
    }
  }

  const requestPlace = usePlaceWhenSignedIn(payWithTamara);

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
        {isLoading ? t("tamaraRedirecting") : t("placeOrder")}
      </button>
    </>
  );
}
