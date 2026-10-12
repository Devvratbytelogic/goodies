import { UserProfile, UserProfileApiResponse } from "@/server/types/user";
import { api } from "../api";

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUserProfile: build.query<UserProfile | null, void>({
      query: () => "/user/get-user-profile",
      transformResponse: (res: UserProfileApiResponse) => res.data ?? null,
      providesTags: ["User"],
    }),
    updateUserProfile: build.mutation({
      query: (body) => ({
        url: "/user/update-profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUserAccount: build.mutation<void, void>({
      query: () => ({
        url: "/user/delete-account",
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: build.mutation({
      query: (body) => ({
        url: "/user/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useDeleteUserAccountMutation,
  useChangePasswordMutation,
} = userApi;
