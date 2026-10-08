import { TabbyPayment, TabbyPaymentResponse, TabbySession, TabbySessionPayload, TabbySessionResponse } from "@/server/types/tabby";
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
    // dummy endpoint: backend checks the payment with Tabby, captures it when AUTHORIZED and creates the order
    verifyTabbyPayment: build.query<TabbyPayment, string>({
      query: (paymentId) => `/user/tabby/payments/${paymentId}`,
      transformResponse: (res: TabbyPaymentResponse) => res.data,
      async onQueryStarted(_paymentId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status === "AUTHORIZED" || data.status === "CLOSED") {
            dispatch(api.util.invalidateTags(["Cart"]));
          }
        } catch {}
      },
    }),
  }),
});

export const { useCreateTabbySessionMutation, useCreateZiinaCheckoutMutation, useVerifyTabbyPaymentQuery } = paymentApi;
