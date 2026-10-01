"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Cookies from "js-cookie";

const cookieName = "token";
const userKey = "goodies-auth";

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
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    localStorage.removeItem(userKey);
    setToken(Cookies.get(cookieName) ?? null);
    setReady(true);
  }, []);

  function startSession(nextToken: string) {
    localStorage.removeItem(userKey);
    Cookies.set(cookieName, nextToken, cookieOptions);
    setToken(nextToken);
  }

  async function login(email: string, password: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
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
    localStorage.removeItem(userKey);
    setToken(null);
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
