import { AddressApiResponse, AddressEntity } from "@/server/types/address";
import { api } from "../api";

export const addressApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAddresses: build.query<AddressEntity[], void>({
      query: () => "/user/all-addresses",
      transformResponse: (res: AddressApiResponse) => res.data ?? [],
      providesTags: ["Address", "Cart"],
    }),
    addAddress: build.mutation({
      query: (body) => ({
        url: "/user/add-address",
        method: "POST",
        body,
      }),
      transformResponse: (res: { data?: AddressEntity | null }) => res.data ?? null,
      invalidatesTags: ["Address", "Cart"],
    }),
    updateAddress: build.mutation({
      query: ({ addressId, ...body }) => ({
        url: `/user/update-address/${addressId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Address", "Cart"],
    }),
    deleteAddress: build.mutation({
      query: (addressId: string) => ({
        url: `/user/delete-address/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address", "Cart"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
