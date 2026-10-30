import { GlobalData, GlobalDataApiResponse } from "@/server/types/global";
import { api } from "../api";

export const settingsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGlobalSettings: build.query<GlobalData | null, void>({
      query: () => "/user/get-global",
      transformResponse: (res: GlobalDataApiResponse) => res.data ?? null,
    }),
  }),
});

export const { useGetGlobalSettingsQuery } = settingsApi;
