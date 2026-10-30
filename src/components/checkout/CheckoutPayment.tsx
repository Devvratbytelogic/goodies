"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import CodCheckout from "@/components/checkout/CodCheckout";
import PaymentMethods, { type PaymentMethod } from "@/components/checkout/PaymentMethods";
import TabbyCheckout from "@/components/checkout/TabbyCheckout";
import TamaraCheckout from "@/components/checkout/TamaraCheckout";
import ZiinaCheckout from "@/components/checkout/ZiinaCheckout";
import { PlacedOrder } from "@/server/types/order";
import { useGetAddressesQuery } from "@/store/endpoints/addressApi";
import { useGetCartQuery } from "@/store/endpoints/cartApi";

type CheckoutPaymentProps = {
  header?: ReactNode;
  paymentMethod: PaymentMethod | null;
  defaultPaymentMethod?: string | null;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPlaced?: (order: PlacedOrder) => void;
};

const placeButtonClassName =
  "inline-flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70";

const footerClassName =
  "grid shrink-0 gap-2 border-t border-border bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]";

export default function CheckoutPayment({
  header,
  paymentMethod,
  defaultPaymentMethod = null,
  onPaymentMethodChange,
  onPlaced,
}: CheckoutPaymentProps) {
  const t = useTranslations("CheckoutPayment");
  const fields = useTranslations("CheckoutClassicPage");
  const { data: addresses = [] } = useGetAddressesQuery();
  const cartMethod = paymentMethod && paymentMethod !== defaultPaymentMethod ? paymentMethod : undefined;
  const { data: cart } = useGetCartQuery(cartMethod);
  const shippingAvailable = cart?.summary?.shipping_rate_available !== false;

  const selectedId =
    addresses.find((address) => address.is_selected)?._id ??
    addresses.find((address) => address.is_default)?._id ??
    addresses[0]?._id ??
    null;
  const selectedAddress = addresses.find((address) => address._id === selectedId) ?? null;
  const country = selectedAddress?.country_code ?? "AE";
  const showCodFooter = paymentMethod === "cod";

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

            <PaymentMethods
              variant="sheet"
              value={paymentMethod}
              primaryMethod={defaultPaymentMethod}
              onChange={onPaymentMethodChange}
            />

            {selectedId && !shippingAvailable ? (
              <p role="alert" className="text-sm font-medium text-primary">
                {fields("shippingUnavailable")}
              </p>
            ) : null}

            {paymentMethod === "tabby" ? (
              <TabbyCheckout
                autoStart
                totalsMethod={cartMethod ?? null}
                billingAddressId={selectedId}
                shippingAddressId={selectedId}
                country={country}
                shippingAvailable={shippingAvailable}
              />
            ) : null}

            {paymentMethod === "ziina" ? (
              <ZiinaCheckout
                autoStart
                totalsMethod={cartMethod ?? null}
                billingAddressId={selectedId}
                shippingAddressId={selectedId}
                shippingAvailable={shippingAvailable}
              />
            ) : null}

            {paymentMethod === "tamara" ? (
              <TamaraCheckout
                autoStart
                totalsMethod={cartMethod ?? null}
                billingAddressId={selectedId}
                shippingAddressId={selectedId}
                shippingAvailable={shippingAvailable}
              />
            ) : null}
          </div>
        </div>
      </div>

      {showCodFooter ? (
        <div className={footerClassName}>
          <CodCheckout
            totalsMethod={cartMethod ?? null}
            billingAddressId={selectedId}
            shippingAddressId={selectedId}
            country={country}
            shippingAvailable={shippingAvailable}
            onPlaced={(order) => onPlaced?.(order)}
            buttonClassName={placeButtonClassName}
          />
        </div>
      ) : null}
    </div>
  );
}
