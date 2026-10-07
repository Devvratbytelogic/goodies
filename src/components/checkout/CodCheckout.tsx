"use client";

import { useTranslations } from "next-intl";
import { PlacedOrder } from "@/server/types/order";
import { usePlaceOrderMutation } from "@/store/endpoints/orderApi";

type CodCheckoutProps = {
  billingAddressId: string | null;
  shippingAddressId: string | null;
  country: string;
  onPlaced: (order: PlacedOrder) => void;
};

export default function CodCheckout({ billingAddressId, shippingAddressId, country, onPlaced }: CodCheckoutProps) {
  const t = useTranslations("CheckoutClassicPage");
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
      }).unwrap();
      onPlaced(order);
    } catch (error) {
      console.error("Error placing order", error);
    }
  }

  return (
    <button
      type="button"
      onClick={placeCodOrder}
      disabled={!billingAddressId || !shippingAddressId || isLoading}
      className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70"
    >
      {isLoading ? t("placingOrder") : t("placeOrder")}
    </button>
  );
}
