import { TabbySession, TabbySessionPayload, TabbySessionResponse } from "@/server/types/tabby";
import { ZiinaCheckout, ZiinaCheckoutPayload, ZiinaCheckoutResponse } from "@/server/types/ziina";
import { api } from "../api";

export const paymentApi = api.injectEndpoints({
  endpoints: (build) => ({
    // backend creates the order and the Tabby checkout session, and returns Tabby's payment_url
    createTabbySession: build.mutation<TabbySession, TabbySessionPayload>({
      query: (body) => ({
        url: "/user/tabby/checkout",
        method: "POST",
        body,
      }),
      transformResponse: (res: TabbySessionResponse) => res.data,
    }),
    // backend creates the Ziina payment and returns the hosted checkout URL
    createZiinaCheckout: build.mutation<ZiinaCheckout, ZiinaCheckoutPayload>({
      query: (body) => ({
        url: "/user/ziina/checkout",
        method: "POST",
        body,
      }),
      transformResponse: (res: ZiinaCheckoutResponse) => res.data,
    }),
  }),
});

export const { useCreateTabbySessionMutation, useCreateZiinaCheckoutMutation } = paymentApi;
