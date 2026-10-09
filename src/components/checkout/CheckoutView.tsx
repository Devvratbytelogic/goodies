"use client";

import { useState } from "react";
import CartSummary from "@/components/cart/CartSummary";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import ZiinaReturn from "@/components/checkout/ZiinaReturn";
import { PlacedOrder } from "@/server/types/order";
import { getCheckoutClassicRoutePath } from "@/utils/routes";

export default function CheckoutView({ shopHref }: { shopHref: string }) {
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  if (placedOrder) {
    return (
      <div className="mx-auto mt-6 max-w-3xl">
        <ZiinaReturn
          status="success"
          orderId={placedOrder.order_id}
          orderNumber={String(placedOrder.order_number)}
          message=""
          shopHref={shopHref}
          checkoutHref={getCheckoutClassicRoutePath()}
        />
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
