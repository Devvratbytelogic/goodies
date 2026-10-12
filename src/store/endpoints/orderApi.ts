import { OrderDetails, OrderDetailsResponse, PlacedOrder, PlaceOrderPayload, PlaceOrderResponse, UserOrdersData, UserOrdersResponse } from "@/server/types/order";
import { api } from "../api";

export type UserOrdersArgs = {
  status?: string;
  page?: number;
  limit?: number;
};

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
    getUserOrders: build.query<UserOrdersData, UserOrdersArgs | void>({
      query: (args) => {
        const { status = "all", page = 1, limit = 10 } = args ?? {};
        const params = new URLSearchParams({
          status,
          page: String(page),
          limit: String(limit),
        });
        return `/user/all-order?${params}`;
      },
      transformResponse: (res: UserOrdersResponse) => res.data,
    }),
    getOrderDetails: build.query<OrderDetails, string>({
      query: (orderId) => `/user/order-details/${encodeURIComponent(orderId)}`,
      transformResponse: (res: OrderDetailsResponse) => res.data,
    }),
    downloadOrderInvoice: build.mutation<Blob, string>({
      query: (orderId) => ({
        url: `/user/order-invoice/${encodeURIComponent(orderId)}`,
        headers: { Accept: "application/pdf" },
        responseHandler: (response: Response) => response.blob(),
      }),
    }),
  }),
});

export const { useGetUserOrdersQuery, useGetOrderDetailsQuery, usePlaceOrderMutation, useDownloadOrderInvoiceMutation } = orderApi;
