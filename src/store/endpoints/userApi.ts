import type { MyReviewsArgs, MyReviewsData, MyReviewsResponse } from "@/server/types/review";
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
    subscribe: build.mutation<{ success?: boolean; message?: string }, { email: string; country: string }>({
      query: ({ email, country }) => ({
        url: "/user/post-subscribers",
        method: "POST",
        body: { email },
        params: { country },
      }),
    }),
    getMyReviews: build.query<MyReviewsData, MyReviewsArgs | void>({
      query: (args) => {
        const { page = 1, limit = 10 } = args ?? {};
        return { url: "/user/my-reviews", params: { page, limit } };
      },
      transformResponse: (res: MyReviewsResponse) => res.data ?? {},
      providesTags: ["Review"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useDeleteUserAccountMutation,
  useChangePasswordMutation,
  useGetMyReviewsQuery,
  useSubscribeMutation,
} = userApi;
