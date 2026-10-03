import { api } from "../api";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type Cart = {
  items: unknown[];
  // match the real response
};

export const cartApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<Cart, void>({
      query: () => "/user/cart",
      transformResponse: (res: ApiEnvelope<Cart>) => res.data,
      providesTags: ["Cart"],
    }),
    addToCart: build.mutation({
      query: (body) => ({
        url: "/user/add-cart",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiEnvelope<Cart>) => res.data,
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const { useGetCartQuery, useAddToCartMutation } = cartApi;