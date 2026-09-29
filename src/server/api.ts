import axios from "axios";
import { notFound } from "next/navigation";

export class ApiError extends Error {
  status: number;
  errors: { field?: string; message?: string }[];

  constructor(
    status: number,
    message: string,
    errors: { field?: string; message?: string }[] = [],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    ...(process.env.API_CLIENT_ID && { clientid: process.env.API_CLIENT_ID }),
    ...(process.env.API_CLIENT_SECRET && { clientsecret: process.env.API_CLIENT_SECRET, }),
  },
});

api.interceptors.response.use(
  (response) => {
    const body = response.data;

    if (body?.success === false) {
      const status = body.http_status_code ?? response.status;
      if (status === 404) notFound();
      throw new ApiError(status, body.message || "Request failed", body.data?.errors);
    }

    return response;
  },
  (error) => {
    if (!axios.isAxiosError(error)) throw error;
    if (!error.response) {
      throw new ApiError(0, "The API server could not be reached.");
    }

    const { status, data } = error.response;
    if (status === 404) notFound();

    const message =
      typeof data === "object" && data
        ? data.message || data.http_status_msg || "Request failed"
        : "Request failed";

    throw new ApiError(status, message, data?.data?.errors);
  },
);
