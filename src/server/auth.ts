"use server";

import { ApiError, api } from "@/server/api";

export type VerifyType = "account" | "login" | "forgot";

type AuthSuccess<T> = { ok: true; data: T; message?: string };
type AuthFailure = { ok: false; message: string };

async function post<T>(path: string, body: unknown, headers?: Record<string, string>): Promise<AuthSuccess<T> | AuthFailure> {
  try {
    const { data } = await api.post(path, body, headers ? { headers } : undefined);
    return { ok: true, data: data?.data as T, message: data?.message };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, message: error.message };
    throw error;
  }
}

export async function registerAccount(input: {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  password: string;
  country: string;
  countryCode: string;
  state: string;
  stateCode: string;
}) {
  const form = new FormData();
  form.append("name", input.name);
  form.append("last_name", input.lastName);
  form.append("email", input.email);
  form.append("phone", input.phone);
  form.append("phone_country_code", input.phoneCountryCode);
  form.append("password", input.password);
  form.append("country", input.country);
  form.append("country_code", input.countryCode);
  form.append("state", input.state);
  form.append("state_code", input.stateCode);

  return post("/user/register", form);
}

export async function verifyCode(email: string, code: string, type: VerifyType) {
  return post<{ token?: string; user?: { _id?: string; id?: string | number; name?: string; email?: string; phone_number?: string; phone?: string; profile_pic?: string | null } }>("/user/verify", { email, code, type });
}

export async function resendCode(email: string) {
  return post("/user/resend-code", { email });
}

export async function forgotPassword(email: string) {
  return post("/user/forgot-password", { user_id: email });
}

export async function setNewPassword(token: string, password: string, confirmPassword: string) {
  return post("/user/new-password", { password, confirm_password: confirmPassword }, { Authorization: `Bearer ${token}` });
}
