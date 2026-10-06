import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { getDeviceId } from "@/utils/deviceId";
import { showToast } from "@/utils/toast";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders(headers) {
    headers.set("Accept", "application/json");

    const token = Cookies.get("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const deviceId = getDeviceId();
    if (deviceId) headers.set("device-id", deviceId);

    return headers;
  },
});

type ApiBody = {
  success?: boolean;
  message?: string;
};

const baseQuery = async (args: any, api: any, extraOptions: any) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const method = typeof args === "string" ? "GET" : args.method || "GET";

  if (method !== "POST" && method !== "DELETE") return result;

  const body = (result.error?.data ?? result.data) as ApiBody | undefined;
  const message = body?.message || (result.error ? "Request failed" : "Done");

  showToast(result.error || body?.success === false ? "error" : "success", message);

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Cart", "Wishlist", "Address"],
  endpoints: () => ({}),
});
