"use client";

import { useEffect, useState } from "react";
// import { useAuth } from "@/components/auth/AuthProvider";
// import CheckoutAuth from "@/components/auth/CheckoutAuth";
import CartSummary from "@/components/cart/CartSummary";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import PaymentReturn from "@/components/checkout/PaymentReturn";
import { type EnabledGateways, type PaymentMethod } from "@/components/checkout/PaymentMethods";
import { rememberSwitchedMethod } from "@/components/checkout/usePlaceWhenSignedIn";
import { PlacedOrder } from "@/server/types/order";
import { useGetCartQuery } from "@/store/endpoints/cartApi";
import { getCheckoutClassicRoutePath } from "@/utils/routes";

function startingMethod(value: string | undefined, enabled: EnabledGateways): PaymentMethod {
  if ((value === "tabby" || value === "ziina" || value === "tamara") && enabled[value]) return value;
  if (enabled.ziina) return "ziina";
  if (enabled.tabby) return "tabby";
  if (enabled.tamara) return "tamara";
  return "cod";
}

export default function CheckoutView({ shopHref, defaultPaymentMethod, enabled }: { shopHref: string; defaultPaymentMethod?: string; enabled: EnabledGateways }) {
  // const { token, ready } = useAuth();
  // const [showAuth, setShowAuth] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const defaultMethod = startingMethod(defaultPaymentMethod, enabled);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(defaultMethod);
  const { data: cart } = useGetCartQuery(paymentMethod);
  const shippingAvailable = cart?.summary?.shipping_rate_available !== false;

  // useEffect(() => {
  //   if (ready && !token) setShowAuth(true);
  // }, [ready, token]);

  function onPaymentMethodChange(method: PaymentMethod) {
    rememberSwitchedMethod(method, defaultMethod);
    setPaymentMethod(method);
  }

  if (placedOrder) {
    return (
      <div className="mx-auto mt-6 max-w-3xl">
        <PaymentReturn
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
    <>
      {/* {!showAuth ? ( */}
        {/* <CheckoutAuth
          onClose={() => setShowAuth(false)}
          paymentMethod={paymentMethod}
          shippingAvailable={shippingAvailable}
          onPaymentMethodChange={onPaymentMethodChange}
          onPlaced={setPlacedOrder}
        /> */}
      {/* ) : null} */}
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
        <CheckoutForm paymentMethod={paymentMethod} enabled={enabled} shippingAvailable={shippingAvailable} onPaymentMethodChange={onPaymentMethodChange} onPlaced={setPlacedOrder} />
        <CartSummary showItems paymentMethod={paymentMethod} />
      </div>
    </>
  );
}
