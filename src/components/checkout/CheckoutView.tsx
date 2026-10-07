"use client";

import { useState } from "react";
import CartSummary from "@/components/cart/CartSummary";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderReceived from "@/components/checkout/OrderReceived";
import { PlacedOrder } from "@/server/types/order";

export default function CheckoutView({ shopHref }: { shopHref: string }) {
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  if (placedOrder) {
    return (
      <div className="mx-auto mt-6 max-w-3xl">
        <OrderReceived order={placedOrder} shopHref={shopHref} />
      </div>
    );
  }

  return (
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
      <CheckoutForm onPlaced={setPlacedOrder} />
      <CartSummary showItems />
    </div>
  );
}
