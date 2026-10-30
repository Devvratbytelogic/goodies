"use client";

import { useTranslations } from "next-intl";
import { useCheckoutTotalsUpdating } from "@/components/checkout/useCheckoutTotalsUpdating";
import { usePlaceWhenSignedIn } from "@/components/checkout/usePlaceWhenSignedIn";
import { PlacedOrder } from "@/server/types/order";
import { usePlaceOrderMutation } from "@/store/endpoints/orderApi";
import { readOrigin } from "@/utils/origin";

type CodCheckoutProps = {
  billingAddressId: string | null;
  shippingAddressId: string | null;
  country: string;
  shippingAvailable: boolean;
  onPlaced: (order: PlacedOrder) => void;
  buttonClassName?: string;
};

export default function CodCheckout({ billingAddressId, shippingAddressId, country, shippingAvailable, onPlaced, buttonClassName }: CodCheckoutProps) {
  const t = useTranslations("CheckoutClassicPage");
  const totalsUpdating = useCheckoutTotalsUpdating("cod");
  const [placeOrder, { isLoading }] = usePlaceOrderMutation();

  async function placeCodOrder() {
    if (!billingAddressId || !shippingAddressId) return;

    try {
      const order = await placeOrder({
        payment_method: "cod",
        payment_method_title: "Cash on delivery",
        shipping_address_id: shippingAddressId,
        billing_address_id: billingAddressId,
        customer_note: "",
        country,
        payment_status: "pending",
        origin: readOrigin(),
      }).unwrap();
      onPlaced(order);
    } catch (error) {
      console.error("Error placing order", error);
    }
  }

  const ready = Boolean(shippingAvailable && billingAddressId && shippingAddressId && !totalsUpdating);
  const requestPlace = usePlaceWhenSignedIn(placeCodOrder, "cod", ready);

  return (
    <button
      type="button"
      onClick={requestPlace}
      disabled={!shippingAvailable || !billingAddressId || !shippingAddressId || isLoading || totalsUpdating}
      className={
        buttonClassName ??
        "mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
      }
    >
      {isLoading ? t("placingOrder") : t("placeOrder")}
    </button>
  );
}
