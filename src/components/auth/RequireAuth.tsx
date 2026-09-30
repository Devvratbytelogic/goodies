"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { getHomeRoutePath } from "@/utils/routes";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { token, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !token) {
      router.replace(getHomeRoutePath());
    }
  }, [ready, token, router]);

  if (!ready || !token) {
    return null;
  }

  return children;
}
