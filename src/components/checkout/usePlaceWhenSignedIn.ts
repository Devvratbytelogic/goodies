"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useOpenLogin } from "@/components/auth/Login";

// Sign-in reloads checkout and unmounts the button, so this stays outside the component.
let waiting = false;

// Remember the click, open sign-in, then place the order once a session exists.
export function usePlaceWhenSignedIn(place: () => void) {
  const { token } = useAuth();
  const openLogin = useOpenLogin();
  const placeOrder = useRef(place);
  placeOrder.current = place;

  useEffect(() => {
    if (!token || !waiting) return;
    waiting = false;
    placeOrder.current();
  }, [token]);

  return function requestPlace() {
    if (!token) {
      waiting = true;
      openLogin();
      return;
    }
    placeOrder.current();
  };
}
