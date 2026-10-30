"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { type PaymentMethod } from "@/components/checkout/PaymentMethods";

// One user switch away from the default. Consumed on the next payment button, then dropped.
let switchedTo: PaymentMethod | null = null;

export function rememberSwitchedMethod(method: PaymentMethod, defaultMethod: PaymentMethod) {
  switchedTo = method !== defaultMethod && method !== "cod" ? method : null;
  // switchedTo = method !== defaultMethod ? method : null;
}

export function usePlaceWhenSignedIn(place: () => void, method: PaymentMethod, ready: boolean) {
  const { token } = useAuth();
  const placeOrder = useRef(place);
  placeOrder.current = place;
  const canPlace = useRef(Boolean(token) && ready);
  canPlace.current = Boolean(token) && ready;

  useEffect(() => {
    if (switchedTo !== method) return;
    switchedTo = null;
    if (!canPlace.current) return;
    placeOrder.current();
  }, [method]);

  return function requestPlace() {
    if (!canPlace.current) return;
    placeOrder.current();
  };
}
