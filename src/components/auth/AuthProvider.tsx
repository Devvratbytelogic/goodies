"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Cookies from "js-cookie";

const cookieName = "token";
const userKey = "goodies-auth";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string | null;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readUser(): AuthUser | null {
  try {
    const saved = JSON.parse(localStorage.getItem(userKey) ?? "");
    const user = saved?.email ? saved : saved?.user;
    if (!user?.email) return null;

    return {
      id: user.id ?? "",
      name: user.name ?? "",
      email: user.email,
      phone: user.phone ?? "",
      photo: user.photo ?? null,
    };
  } catch {
    return null;
  }
}

const cookieOptions = {
  expires: 2,
  path: "/",
  sameSite: "Lax" as const,
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToken(Cookies.get(cookieName) ?? null);
    setUser(readUser());
    setReady(true);
  }, []);

  async function login(email: string, password: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = await response.json().catch(() => null);
    const apiUser = body?.data?.user;

    if (!response.ok || body?.success === false || !body?.data?.token || !apiUser) {
      throw new Error(body?.message || "Login failed");
    }

    const next: AuthUser = {
      id: apiUser._id ?? "",
      name: apiUser.name ?? "",
      email: apiUser.email ?? email,
      phone: apiUser.phone_number ?? "",
      photo: apiUser.profile_pic ?? null,
    };

    Cookies.set(cookieName, body.data.token, cookieOptions);
    localStorage.setItem(userKey, JSON.stringify(next));
    setToken(body.data.token);
    setUser(next);
  }

  function logout() {
    Cookies.remove(cookieName, { path: "/" });
    localStorage.removeItem(userKey);
    setToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ token, user, ready, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return auth;
}
