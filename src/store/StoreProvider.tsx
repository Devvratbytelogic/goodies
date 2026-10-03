"use client";

import { useRef, type ReactNode } from "react";
import { Provider } from "react-redux";
import { ToastHost } from "@/components/layout/common/ToastHost";
import { makeStore, type AppStore } from "@/store";

export function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | undefined>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      {children}
      <ToastHost />
    </Provider>
  );
}
