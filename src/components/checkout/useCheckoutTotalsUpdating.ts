"use client";

import { useUpdateAddressMutation } from "@/store/endpoints/addressApi";
import { useGetCartQuery } from "@/store/endpoints/cartApi";

// True while a selected address is saving, or the cart totals are refreshing after that.
export function useCheckoutTotalsUpdating() {
  const { isLoading, isFetching } = useGetCartQuery();
  const [, { isLoading: isSavingAddress }] = useUpdateAddressMutation({ fixedCacheKey: "selected-address" });
  return isSavingAddress || (isFetching && !isLoading);
}
