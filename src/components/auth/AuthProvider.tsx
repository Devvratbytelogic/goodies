"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Cookies from "js-cookie";
import { api } from "@/store/api";
import { useAppDispatch } from "@/store/hooks";
import { getDeviceId } from "@/utils/deviceId";

const cookieName = "token";

type AuthContextValue = {
  token: string | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  startSession: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const cookieOptions = {
  expires: 2,
  path: "/",
  sameSite: "Lax" as const,
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToken(Cookies.get(cookieName) ?? null);
    setReady(true);
  }, []);

  function refreshAccount() {
    dispatch(api.util.resetApiState());
  }

  function startSession(nextToken: string) {
    Cookies.set(cookieName, nextToken, cookieOptions);
    setToken(nextToken);
    refreshAccount();
  }

  async function login(email: string, password: string) {
    const deviceId = getDeviceId();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(deviceId ? { "device-id": deviceId } : {}),
      },
      body: JSON.stringify({ email, password }),
    });
    const body = await response.json().catch(() => null);

    if (!response.ok || body?.success === false || !body?.data?.token) {
      throw new Error(body?.message || "Login failed");
    }

    startSession(body.data.token);
  }

  function logout() {
    Cookies.remove(cookieName, { path: "/" });
    setToken(null);
    refreshAccount();
  }

  return <AuthContext.Provider value={{ token, ready, login, startSession, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return auth;
}
