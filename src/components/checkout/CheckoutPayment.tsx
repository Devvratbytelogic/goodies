"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import CodCheckout from "@/components/checkout/CodCheckout";
import PaymentMethods, { type PaymentMethod } from "@/components/checkout/PaymentMethods";
import TabbyCheckout from "@/components/checkout/TabbyCheckout";
import TamaraCheckout from "@/components/checkout/TamaraCheckout";
import ZiinaCheckout from "@/components/checkout/ZiinaCheckout";
import { rememberSwitchedMethod } from "@/components/checkout/usePlaceWhenSignedIn";
import { PlacedOrder } from "@/server/types/order";
import { useGetAddressesQuery } from "@/store/endpoints/addressApi";
import { useGetCartQuery } from "@/store/endpoints/cartApi";
import { useGetGlobalSettingsQuery } from "@/store/endpoints/settingsApi";

type CheckoutPaymentProps = {
  header?: ReactNode;
  onPlaced?: (order: PlacedOrder) => void;
  onPaymentMethodChange?: (method: PaymentMethod) => void;
};

const placeButtonClassName =
  "mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70";

function startingMethod(value?: string | null): PaymentMethod {
  const method = value?.trim().toLowerCase();
  if (method === "tabby" || method === "ziina" || method === "tamara" || method === "cod") return method;
  return "ziina";
}

export default function CheckoutPayment({ header, onPlaced, onPaymentMethodChange }: CheckoutPaymentProps) {
  const t = useTranslations("CheckoutPayment");
  const fields = useTranslations("CheckoutClassicPage");
  const { data: settings } = useGetGlobalSettingsQuery();
  const { data: addresses = [] } = useGetAddressesQuery();
  const defaultMethod = startingMethod(settings?.default_payment_method);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const selectedMethod = paymentMethod ?? defaultMethod;
  const { data: cart } = useGetCartQuery(selectedMethod);
  const shippingAvailable = cart?.summary?.shipping_rate_available !== false;

  const selectedId =
    addresses.find((address) => address.is_selected)?._id ??
    addresses.find((address) => address.is_default)?._id ??
    addresses[0]?._id ??
    null;
  const selectedAddress = addresses.find((address) => address._id === selectedId) ?? null;
  const country = selectedAddress?.country_code ?? "AE";

  useEffect(() => {
    onPaymentMethodChange?.(selectedMethod);
  }, [selectedMethod, onPaymentMethodChange]);

  function changeMethod(method: PaymentMethod) {
    rememberSwitchedMethod(method, defaultMethod);
    setPaymentMethod(method);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="checkout-auth-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-4">
        <div className="grid gap-3 pb-4">
          {header}
          <div className="grid gap-4 rounded-xl bg-white px-3.5 py-4 text-start">
            <div>
              <h2 className="text-sm font-bold text-heading">{t("title")}</h2>
              <p className="mt-1 text-xs text-muted">{t("subtitle")}</p>
            </div>

            <PaymentMethods variant="sheet" value={selectedMethod} onChange={changeMethod} />

            {selectedId && !shippingAvailable ? (
              <p role="alert" className="text-sm font-medium text-primary">
                {fields("shippingUnavailable")}
              </p>
            ) : null}

            {selectedMethod === "tabby" ? (
              <TabbyCheckout
                billingAddressId={selectedId}
                shippingAddressId={selectedId}
                country={country}
                shippingAvailable={shippingAvailable}
                buttonClassName={placeButtonClassName}
              />
            ) : selectedMethod === "ziina" ? (
              <ZiinaCheckout
                billingAddressId={selectedId}
                shippingAddressId={selectedId}
                shippingAvailable={shippingAvailable}
                buttonClassName={placeButtonClassName}
              />
            ) : selectedMethod === "tamara" ? (
              <TamaraCheckout
                billingAddressId={selectedId}
                shippingAddressId={selectedId}
                shippingAvailable={shippingAvailable}
                buttonClassName={placeButtonClassName}
              />
            ) : (
              <CodCheckout
                billingAddressId={selectedId}
                shippingAddressId={selectedId}
                country={country}
                shippingAvailable={shippingAvailable}
                onPlaced={(order) => onPlaced?.(order)}
                buttonClassName={placeButtonClassName}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { startingMethod };
