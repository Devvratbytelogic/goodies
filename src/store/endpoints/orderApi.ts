import { PlacedOrder, PlaceOrderPayload, PlaceOrderResponse } from "@/server/types/order";
import { api } from "../api";

export const orderApi = api.injectEndpoints({
  endpoints: (build) => ({
    placeOrder: build.mutation<PlacedOrder, PlaceOrderPayload>({
      query: (body) => ({
        url: "/user/place-order",
        method: "POST",
        body,
      }),
      transformResponse: (res: PlaceOrderResponse) => res.data,
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const { usePlaceOrderMutation } = orderApi;
