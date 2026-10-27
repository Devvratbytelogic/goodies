import { CartApiResponse, CartApiResponseData } from "@/server/types/cart";
import { HomeProduct } from "@/server/types/Home";
import { api } from "../api";
import { CouponApiResponse, CouponApiResponseDataEntity, UsedCouponsArgs, UsedCouponsData, UsedCouponsResponse } from "@/server/types/coupon";

export const cartApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Checkout passes cod, tabby, ziina, or tamara. Other pages omit it.
    getCart: build.query<CartApiResponseData, "cod" | "tabby" | "ziina" | "tamara" | void>({
      query: (paymentMethod) => ({
        url: "/user/cart",
        params: paymentMethod ? { payment_method: paymentMethod } : undefined,
      }),
      transformResponse: (res: CartApiResponse) => res.data,
      providesTags: ["Cart"],
    }),
    getCartProducts: build.query<HomeProduct[], void>({
      query: () => "/user/cart-products?limit=8",
      transformResponse: (res: { data?: HomeProduct[] | null }) => res.data ?? [],
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
    moveCartItemToWishlist: build.mutation({
      query: (itemId: string) => ({
        url: `/user/cart/${itemId}/move-to-wishlist`,
        method: "POST",
      }),
      invalidatesTags: ["Cart", "Wishlist"],
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
    getUsedCoupons: build.query<UsedCouponsData, UsedCouponsArgs | void>({
      query: (args) => {
        const { page = 1, limit = 10 } = args ?? {};
        return {
          url: "/user/used-coupons",
          params: { page, limit },
        };
      },
      transformResponse: (res: UsedCouponsResponse) => res.data ?? {},
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
  useGetCartProductsQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useMoveCartItemToWishlistMutation,
  useUpdateCartItemQuantityMutation,
  useGetCouponsQuery,
  useGetUsedCouponsQuery,
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