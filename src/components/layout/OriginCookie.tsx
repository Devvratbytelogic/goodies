"use client";

import { useEffect } from "react";
import { rememberOrigin } from "@/utils/origin";

export function OriginCookie() {
  useEffect(() => {
    rememberOrigin();
  }, []);

  return null;
}
