import { CartApiResponse, CartApiResponseData } from "@/server/types/cart";
import { api } from "../api";
import { CouponApiResponse, CouponApiResponseDataEntity } from "@/server/types/coupon";

export const cartApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<CartApiResponseData, void>({
      query: () => "/user/cart",
      transformResponse: (res: CartApiResponse) => res.data,
      providesTags: ["Cart"],
    }),
    addToCart: build.mutation({
      query: (body) => ({
        url: "/user/add-cart",
        method: "POST",
        body,
      }),
      transformResponse: (res: CartApiResponse) => res.data,
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: build.mutation({
      query: (itemId: string) => ({
        url: `/user/cart/${itemId}`,
        method: "DELETE",
      }),
      transformResponse: (res: CartApiResponse) => res.data,
      invalidatesTags: ["Cart"],
    }),
    updateCartItemQuantity: build.mutation({
      query: ({ itemId, quantity }) => ({
        url: `/user/cart/${itemId}`,
        method: "PUT",
        body: { quantity },
      }),
      transformResponse: (res: CartApiResponse) => res.data,
      invalidatesTags: ["Cart"],
    }),
    getCoupons: build.query<CouponApiResponseDataEntity[], void>({
      query: () => "/user/all-coupons",
      transformResponse: (res: CouponApiResponse) => res.data ?? [],
    }),
    applyCoupon: build.mutation<CartApiResponseData, string>({
      query: (couponCode) => ({
        url: "/user/cart/coupon",
        method: "POST",
        body: { coupon_code: couponCode },
      }),
      transformResponse: (res: CartApiResponse) => res.data,
      invalidatesTags: ["Cart"],
    }),
    removeCoupon: build.mutation<CartApiResponseData, void>({
      query: () => ({
        url: "/user/coupon-remove",
        method: "DELETE",
      }),
      transformResponse: (res: CartApiResponse) => res.data,
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemQuantityMutation,
  useGetCouponsQuery,
  useApplyCouponMutation,
  useRemoveCouponMutation,
} = cartApi;

// One cart request, shared by the header and the bottom nav.
// The badge is the total pieces, so changing a quantity updates it too.
export function useCartCount() {
  const { count } = useGetCartQuery(undefined, {
    selectFromResult: ({ data }) => ({
      count: (data?.items ?? []).reduce((total, item) => total + (item?.quantity ?? 0), 0),
    }),
  });

  return count;
}