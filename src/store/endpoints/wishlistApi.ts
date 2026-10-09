import { WishlistApiResponse, WishlistApiResponseData } from "@/server/types/wishlist";
import { api } from "../api";

export const wishlistApi = api.injectEndpoints({
  endpoints: (build) => ({
    getWishlist: build.query<WishlistApiResponseData[], void>({
      query: () => "/user/wishlist",
      transformResponse: (res: WishlistApiResponse) => res.data ?? [],
      providesTags: ["Wishlist"],
    }),
    addToWishlist: build.mutation({
      query: (body) => ({
        url: "/user/wishlist",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeFromWishlist: build.mutation({
      query: (body) => ({
        url: "/user/wishlist",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;

export function useWishlistCount() {
  const { count } = useGetWishlistQuery(undefined, {
    selectFromResult: ({ data }) => ({
      count: data?.length ?? 0,
    }),
  });

  return count;
}
