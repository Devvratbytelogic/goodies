"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useOpenLogin } from "@/components/auth/Login";

// Remember the click, open sign-in, then place the order once a session exists.
export function usePlaceWhenSignedIn(place: () => void) {
  const { token } = useAuth();
  const openLogin = useOpenLogin();
  const waiting = useRef(false);
  const placeOrder = useRef(place);
  placeOrder.current = place;

  useEffect(() => {
    if (!token || !waiting.current) return;
    waiting.current = false;
    placeOrder.current();
  }, [token]);

  return function requestPlace() {
    if (!token) {
      waiting.current = true;
      openLogin();
      return;
    }
    placeOrder.current();
  };
}
