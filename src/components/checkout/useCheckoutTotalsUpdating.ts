"use client";

import { type PaymentMethod } from "@/components/checkout/PaymentMethods";
import { useUpdateAddressMutation } from "@/store/endpoints/addressApi";
import { useGetCartQuery } from "@/store/endpoints/cartApi";

// True while a selected address is saving, or the cart totals are refreshing after that.
export function useCheckoutTotalsUpdating(paymentMethod?: PaymentMethod) {
  const { isLoading, isFetching } = useGetCartQuery(paymentMethod);
  const [, { isLoading: isSavingAddress }] = useUpdateAddressMutation({ fixedCacheKey: "selected-address" });
  return isSavingAddress || (isFetching && !isLoading);
}
